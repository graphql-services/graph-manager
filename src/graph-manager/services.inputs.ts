import { Field, ID, InputType } from '@nestjs/graphql';

import { InputBase } from './graph-manager.inputs';

@InputType()
export class ServiceInput extends InputBase {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;
}

@InputType()
export class ServiceSchemaInput {
  @Field(() => ID)
  serviceId: string;

  @Field(() => String)
  version: string;

  @Field(() => String)
  typeDefs: string;
}
