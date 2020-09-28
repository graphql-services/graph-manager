import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ObjectBase {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
@Entity()
export class Gateway extends ObjectBase {
  @Column()
  @Field(() => String)
  name: string;
}

export enum GatewayVersionStatus {
  PENDING,
  VALID,
  INVALID,
}
registerEnumType(GatewayVersionStatus, {
  name: 'GatewayVersionStatus',
});

@ObjectType()
export class GatewayVersion {
  @Field(() => GatewayVersionStatus)
  status: GatewayVersionStatus;

  @Field(() => String)
  validationError: string;
}

@ObjectType()
export class Service {
  @Field(() => String)
  url: string;

  @Field(() => String)
  urlSizeMedium: string;
}

// @ObjectType()
// @Directive('@key(fields:"id")')
// export class Product {
//   @Field(() => ID)
//   id: string;

//   @Field(() => String)
//   sku: string;

//   @Field(() => String)
//   label: string;

//   @Field(() => String)
//   link: string;

//   @Field(() => String)
//   fullDescription: string;

//   @Field(() => ProductBrand)
//   brand: ProductBrand;

//   // TODO: Update to enum
//   @Field(() => String)
//   boxType: string;

//   @Field(() => Boolean)
//   isOnline: boolean;

//   @Field(() => [Product], { nullable: true })
//   subProducts?: Product[];

//   @Field(() => String, { nullable: true })
//   videoUrl?: string;

//   @Field(() => [ProductImage], { nullable: true })
//   images?: ProductImage[];
// }
