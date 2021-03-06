import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiAuthModule } from '../api/auth/api-auth.module';
import { ApiConfigModule,  } from '../api/configuration/configuration.module';
import { dbConfiguration } from '../api/configuration/db.configuration'
import { DbConfig } from '../api/types/index';
import { AutomapperModule } from 'nestjsx-automapper';
import { ApiModule } from './api.module';
import '../api/mapping';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [dbConfiguration.KEY],
      useFactory: (dbConfig: DbConfig) => dbConfig,
    }),
    AutomapperModule.withMapper({ useUndefined: true }),
    ApiConfigModule,
    ApiAuthModule,
    ApiModule,
  ],
})
export class AppModule {}
