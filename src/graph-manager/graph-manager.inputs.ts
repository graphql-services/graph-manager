import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class InputBase {
  @Field(() => ID, { nullable: true })
  id?: string;
}

@InputType()
export class GatewayInput extends InputBase {
  @Field(() => String)
  name: string;
}
