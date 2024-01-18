import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, productImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, productImage])],
  exports: [ProductsService, TypeOrmModule],
  // Se importa TypeOrm para usar los Repository 
})
export class ProductsModule {}
