import { Gateway } from './graph-manager/graph-manager.entities';
import { GraphManagerModule } from './graph-manager/graph-manager.module';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { Module } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    GraphManagerModule,
    HealthcheckModule,
    PromModule.forRoot({
      withDefaultsMetrics: true, // set to true for getting default metrics (list can be found here https://github.com/siimon/prom-client/blob/v11.5.2/lib/defaultMetrics.js#L17)
      defaultLabels: {
        app: 'graph-manager',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './mydb.sql',
      entities: [Gateway],
      synchronize: true,
      logging: 'all',
      logger: 'advanced-console',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
