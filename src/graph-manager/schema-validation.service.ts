import { ApolloGateway } from '@apollo/gateway';
import { GatewayVersion } from './gateways-version.entities';
import { Injectable } from '@nestjs/common';
import { ServiceSchema } from './services.entities';
import { parse } from 'graphql';

@Injectable()
export class SchemaValidationService {
  async validateServiceSchema(serviceSchema: ServiceSchema) {
    parse(serviceSchema.typeDefs);
  }

  async validateGatewayVersion(gatewayVersion: GatewayVersion) {
    const serviceSchemas = await gatewayVersion.serviceSchemas;

    new ApolloGateway({
      localServiceList: serviceSchemas.map((schema, i) => ({
        name: `service_${i}`,
        typeDefs: parse(schema.typeDefs),
      })),
    });
  }
}
