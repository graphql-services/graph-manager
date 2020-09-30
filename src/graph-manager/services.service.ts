import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gateway } from './gateways.entities';
import { GatewaysService } from './gateways.service';
import { Service } from './services.entities';
import { ServiceInput } from './services.inputs';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Gateway)
    private gatewayRepository: Repository<Gateway>,
    private gatewayService: GatewaysService,
  ) {}

  async findOne(id: string): Promise<Service> {
    return this.serviceRepository.findOne(id);
  }

  async create(input: ServiceInput): Promise<Service> {
    const service = this.serviceRepository.create(input);
    await this.serviceRepository.insert(service);
    return service;
  }

  async delete(id: string): Promise<boolean> {
    await this.serviceRepository.delete(id);
    return true;
  }

  async addServiceToGateway(
    serviceId: string,
    gatewayId: string,
  ): Promise<boolean> {
    const service = await this.serviceRepository.findOne(serviceId);
    if (!service) {
      throw new Error(`Service with id '${serviceId}' not found`);
    }
    const gateway = await this.gatewayRepository.findOne(gatewayId);
    if (!gateway) {
      throw new Error(`Gateway with id '${gatewayId}' not found`);
    }
    await this.gatewayRepository
      .createQueryBuilder()
      .relation('services')
      .of(gateway)
      .add(service);

    await this.gatewayService.createVersionFromLatestSchemas(gateway);

    return true;
  }
  async removeServiceFromGateway(
    serviceId: string,
    gatewayId: string,
  ): Promise<boolean> {
    const service = await this.serviceRepository.findOne(serviceId);
    if (!service) {
      throw new Error(`Service with id '${serviceId}' not found`);
    }
    const gateway = await this.gatewayRepository.findOne(gatewayId);
    if (!gateway) {
      throw new Error(`Gateway with id '${gatewayId}' not found`);
    }
    await this.gatewayRepository
      .createQueryBuilder()
      .relation('services')
      .of(gateway)
      .remove(service);

    await this.gatewayService.createVersionFromLatestSchemas(gateway);

    return true;
  }
}
