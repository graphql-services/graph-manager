import { Args, Query, Resolver, Mutation, ID } from '@nestjs/graphql';

import { PromMethodCounter } from '@digikare/nestjs-prom';
import { Gateway } from './graph-manager.entities';
import { GatewayInput } from './graph-manager.inputs';
import { GatewayService } from './gateway.service';

@Resolver(() => Gateway)
export class GatewayResolver {
  constructor(private service: GatewayService) {}

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

  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: string }) {
  //   return this.productService.findById(reference.id);
  // }

  // @ResolveField(() => [Product], { name: 'attachments' })
  // @PromMethodCounter()
  // async getProductAttachments(@Parent() product: Product) {
  //   const attachmentIDs = await this.attachmentService.getAttachmentForProductID(
  //     product.id,
  //   );
  //   const products = Promise.all(
  //     attachmentIDs.map(attId => this.productService.findById(attId)),
  //   );
  //   return products;
  // }
}
