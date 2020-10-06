import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError, parse } from 'graphql';
import { Repository } from 'typeorm';
import { GatewaysService } from './gateways.service';
import { ServiceSchema } from './services-schema.entities';
import { Service } from './services.entities';
import { ServiceSchemaInput } from './services.inputs';

@Injectable()
export class ServicesSchemaService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ServiceSchema)
    private serviceSchemaRepository: Repository<ServiceSchema>,
    private gatewayService: GatewaysService,
  ) {}

  async create(input: ServiceSchemaInput): Promise<ServiceSchema> {
    // validate standalone typeDefs
    try {
      parse(input.typeDefs);
    } catch (err) {
      throw new GraphQLError(`Invalid typeDefs, error: ${err.message}`);
    }

    const service = await this.serviceRepository.findOne(input.serviceId);
    if (!service) {
      throw new Error(`Service with id '${input.serviceId}' not found`);
    }
    const schema = this.serviceSchemaRepository.create({
      version: input.version,
      typeDefs: input.typeDefs,
    });
    schema.service = Promise.resolve(service);
    await this.serviceSchemaRepository.save(schema);

    service.latestSchema = Promise.resolve(schema);
    await this.serviceRepository.save(service);

    const gateways = await service.gateways;
    for (const gateway of gateways) {
      // const currentVersion = await gateway.currentVersion;
      // const serviceSchemas = [schema];
      await this.gatewayService.createVersionWithNewSchema(gateway, schema);
    }

    return schema;
  }
}
