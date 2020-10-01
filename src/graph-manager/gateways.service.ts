import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GatewayVersion,
  GatewayVersionStatus,
} from './gateways-version.entities';
import { Gateway } from './gateways.entities';
import { GatewayInput } from './gateways.inputs';
import { pubSub } from './gateways.resolvers';
import { SchemaValidationService } from './schema-validation.service';
import { ServiceSchema } from './services-schema.entities';

@Injectable()
export class GatewaysService {
  constructor(
    @InjectRepository(Gateway)
    private gatewayRepository: Repository<Gateway>,
    @InjectRepository(GatewayVersion)
    private gatewayVersionRepository: Repository<GatewayVersion>,
    private schemaValidationService: SchemaValidationService,
  ) {}

  async findOne(id: string): Promise<Gateway> {
    return this.gatewayRepository.findOne(id);
  }

  async create(input: GatewayInput): Promise<Gateway> {
    const gateway = this.gatewayRepository.create(input);
    await this.gatewayRepository.insert(gateway);
    return gateway;
  }

  async delete(id: string): Promise<boolean> {
    await this.gatewayRepository.delete(id);
    return true;
  }

  async createVersion(
    gateway: Gateway,
    serviceSchemas: ServiceSchema[],
  ): Promise<GatewayVersion> {
    const version = this.gatewayVersionRepository.create();
    version.serviceSchemas = Promise.resolve(serviceSchemas);
    version.gateway = Promise.resolve(gateway);
    await this.gatewayVersionRepository.save(version);

    // this should be run asynchronous
    this.validateAndPublishGatewayVersion(version);

    return version;
  }

  async createVersionWithNewSchema(
    gateway: Gateway,
    serviceSchema: ServiceSchema,
  ): Promise<GatewayVersion> {
    const services = await gateway.services;
    const service = await serviceSchema.service;
    const latestSchemas = await Promise.all(
      services.filter(s => s.id !== service.id).map(s => s.latestSchema),
    );
    latestSchemas.push(serviceSchema);
    return this.createVersion(gateway, latestSchemas);
  }

  async createVersionFromLatestSchemas(
    gateway: Gateway,
  ): Promise<GatewayVersion | null> {
    const services = await gateway.services;
    const latestSchemas = (
      await Promise.all(services.map(s => s.latestSchema))
    ).filter(s => s);
    console.log('???', latestSchemas);
    if (latestSchemas.length === 0) {
      gateway.currentVersion = null;
      await this.gatewayRepository.save(gateway);
      return null;
    }
    return this.createVersion(gateway, latestSchemas);
  }

  async validateAndPublishGatewayVersion(gatewayVersion: GatewayVersion) {
    const gateway = await gatewayVersion.gateway;
    try {
      await this.schemaValidationService.validateGatewayVersion(gatewayVersion);

      gatewayVersion.status = GatewayVersionStatus.VALID;
      gateway.currentVersion = Promise.resolve(gatewayVersion);
    } catch (err) {
      gatewayVersion.status = GatewayVersionStatus.INVALID;
      gatewayVersion.validationError = err.message;
    }
    await this.gatewayRepository.save(gateway);
    await this.gatewayVersionRepository.save(gatewayVersion);

    if (gatewayVersion.status === GatewayVersionStatus.VALID) {
      pubSub.publish('gatewayVersionUpdated', {
        gatewayVersionUpdated: gatewayVersion,
      });
    }
  }
}
