import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../common/base.repository';
import { ModelType } from '../types';
import { User } from '../../shared/user/user.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(@InjectModel(User.modelName) private readonly userModel: ModelType<User>) {
        super(userModel);
      }
    
      async findByEmail(email: string): Promise<User> {
        try {
          return await this.findOne().where('email').equals(email).exec();
        } catch (e) {
          UserRepository.throwMongoError(e);
        }
      }
    
      async updateRefreshTokenId(id: string) {
        try {
          await this.updateById(id, { $set: { refreshTokenId: uuid() } }, {}, { lean: false, autopopulate: false }).exec();
        } catch (e) {
          UserRepository.throwMongoError(e);
        }
      }
}
