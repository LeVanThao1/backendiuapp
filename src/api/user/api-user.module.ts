import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authConfiguration } from '../configuration/auth.configuration';
import { AuthConfig } from '../types';
import { User } from '../../shared/user/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { genSalt, hash } from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name:User.modelName,
        useFactory: (authConfig: AuthConfig) => {
          const schema = User.schema;
          schema.pre<DocumentType<User>>('save', async function () {
            if (this.isModified('password')) {
              const salt = await genSalt(authConfig.salt);
              this.password = await hash(this.password, salt);
            }
          });
          return schema;
        },
        inject: [authConfiguration.KEY],
      },
    ]),
  ],
  controllers:[UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class ApiUserModule {}