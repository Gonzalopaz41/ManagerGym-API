import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination.dto';

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

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

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
