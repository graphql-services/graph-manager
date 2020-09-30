import { Gateway, GatewayVersion } from './gateways.entities';
import { Service, ServiceSchema } from './services.entities';

import { GatewaysResolver } from './gateways.resolvers';
import { GatewaysService } from './gateways.service';
import { Module } from '@nestjs/common';
import { SchemaValidationService } from './schema-validation.service';
import { ServicesResolver } from './services.resolvers';
import { ServicesSchemaService } from './services-schema.service';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';

export const ormEntities = [Gateway, GatewayVersion, Service, ServiceSchema];

@Module({
  imports: [TypeOrmModule.forFeature(ormEntities)],
  controllers: [],
  providers: [
    GatewaysService,
    GatewaysResolver,
    ServicesService,
    ServicesResolver,
    ServicesSchemaService,
    SchemaValidationService,
  ],
})
export class GraphManagerModule {}
