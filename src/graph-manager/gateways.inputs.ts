import { Field, InputType } from '@nestjs/graphql';

import { InputBase } from './graph-manager.inputs';

@InputType()
export class GatewayInput extends InputBase {
  @Field(() => String)
  name: string;
}
