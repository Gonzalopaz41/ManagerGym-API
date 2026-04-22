import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async createClient(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto);
      
      await this.clientRepository.save(client);  

      return client;
    } catch (error) {
      this.handleDBError(error);
    }
  };

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, page = 1} = paginationDto;

    const [clients, total] = await this.clientRepository.findAndCount({
      order: {  createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit
    });

    return {
      clients,
      total,
      page,
      last_page: Math.ceil(total / limit)
    }
  };

  async findByTerm(term: string) {
    //Buscar por id
    if (isUUID(term)) {
      const client = await this.clientRepository.findOneBy({id: term});
      
      if(!client) throw new NotFoundException(`Client with id ${term} not found`);
      
      return client;
    };

    //Buscar por fullname
    const clients = await this.clientRepository.find({where: {
      fullname: ILike(`${term}%`)
    }})

    if(clients.length === 0) throw new NotFoundException(`Client with fullname ${term} not found`);

    return clients;
  };

  async update(id: string, updateClientDto: UpdateClientDto) {
    
    const clientToUpdate = await this.clientRepository.preload({
      id,
      updatedAt: new Date(),
      ...updateClientDto
    });

    if(!clientToUpdate) throw new NotFoundException(`Client with id ${id} not found`);

    return this.clientRepository.save(clientToUpdate);
  };

  remove(id: number) {
    return `This action removes a #${id} client`;
  }

  handleDBError(error: any){
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Unexpected error, check server logs');
  };
}
