import { Args, Query, Resolver, Mutation, ID } from '@nestjs/graphql';

import { PromMethodCounter } from '@digikare/nestjs-prom';
import { ServiceInput, ServiceSchemaInput } from './services.inputs';
import { ServicesService } from './services.service';
import { Service } from './services.entities';
import { ServicesSchemaService } from './services-schema.service';
import { ServiceSchema } from './services-schema.entities';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(
    private servicesService: ServicesService,
    private servicesSchemaService: ServicesSchemaService,
  ) {}

  @Query(() => Service, { name: 'service', nullable: true })
  @PromMethodCounter()
  async getServiceById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => Service)
  async createService(@Args('input') input: ServiceInput): Promise<Service> {
    return this.servicesService.create(input);
  }

  @Mutation(() => Boolean)
  async deleteService(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.servicesService.delete(id);
  }

  @Mutation(() => Boolean)
  async addServiceToGateway(
    @Args('serviceId', { type: () => ID }) serviceId: string,
    @Args('gatewayId', { type: () => ID }) gatewayId: string,
  ): Promise<boolean> {
    return this.servicesService.addServiceToGateway(serviceId, gatewayId);
  }

  @Mutation(() => Boolean)
  async removeServiceFromGateway(
    @Args('serviceId', { type: () => ID }) serviceId: string,
    @Args('gatewayId', { type: () => ID }) gatewayId: string,
  ): Promise<boolean> {
    return this.servicesService.removeServiceFromGateway(serviceId, gatewayId);
  }

  @Mutation(() => ServiceSchema)
  async publishServiceSchema(
    @Args('input') input: ServiceSchemaInput,
  ): Promise<ServiceSchema> {
    return this.servicesSchemaService.create(input);
  }

  // @ResolveField(() => [ServiceSchema], { name: 'schemas' })
  // async getProductAttachments(@Parent() service: Service) {

  //   return products;
  // }
}
