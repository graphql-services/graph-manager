import {
  Args,
  Query,
  Resolver,
  Mutation,
  ID,
  Subscription,
} from '@nestjs/graphql';

import { PromMethodCounter } from '@digikare/nestjs-prom';
import { GatewaysService } from './gateways.service';
import { Gateway } from './gateways.entities';
import { GatewayInput } from './gateways.inputs';
import { PubSub } from 'graphql-subscriptions';
import { GatewayVersion } from './gateways-version.entities';

export const pubSub = new PubSub();

@Resolver(() => Gateway)
export class GatewaysResolver {
  constructor(private service: GatewaysService) {}

  @Query(() => Gateway, { name: 'gateway', nullable: true })
  @PromMethodCounter()
  async getGatewayById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Gateway> {
    return this.service.findOne(id);
  }

  @Mutation(() => Gateway)
  async createGateway(@Args('input') input: GatewayInput): Promise<Gateway> {
    return this.service.create(input);
  }

  @Mutation(() => Boolean)
  async deleteGateway(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id);
  }

  @Subscription(() => GatewayVersion, {
    filter: async (payload, variables) => {
      const gateway = await payload.gatewayVersionUpdated.gateway;
      return gateway.id === variables.gatewayId;
    },
  })
  gatewayVersionUpdated(@Args('gatewayId', { type: () => ID }) _: string) {
    return pubSub.asyncIterator('gatewayVersionUpdated');
  }
}
