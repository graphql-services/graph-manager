import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gateway } from './graph-manager.entities';
import { GatewayInput } from './graph-manager.inputs';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Gateway)
    private gatewayRepository: Repository<Gateway>,
  ) {}

  async findOne(id: string): Promise<Gateway> {
    return this.gatewayRepository.findOne(id);
  }

  async create(input: GatewayInput): Promise<Gateway> {
    const gateway = this.gatewayRepository.create();
    gateway.id = input.id;
    gateway.name = input.name;
    await this.gatewayRepository.insert(gateway);
    return gateway;
  }

  async remove(id: string): Promise<void> {
    await this.gatewayRepository.delete(id);
  }
}
