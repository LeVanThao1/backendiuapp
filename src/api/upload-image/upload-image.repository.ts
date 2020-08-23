import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../common/base.repository';
import { ModelType } from '../types';
import { ImgProduct } from '../../shared/imgProduct/imgProduct.model';
import { CreateImageProductDto } from '../dtos/request-params/create-img-product.dto';
import { CreateProductDto } from '../dtos/request-params/create-product.dto';

@Injectable()
export class UploadRepository extends BaseRepository<ImgProduct> {
    constructor(@InjectModel(ImgProduct.modelName) private readonly imgProductModel: ModelType<ImgProduct>) {
        super(imgProductModel);
      }
    
      async createImgDb({imgBig}: CreateImageProductDto): Promise<ImgProduct> {
        const newImgProduct = this.createModel({imgBig});
        try {
          const result = await this.create(newImgProduct);
          return result.toJSON() as ImgProduct;
      } catch (e) {
          throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      }
}
