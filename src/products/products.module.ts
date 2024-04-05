import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, productImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, productImage]), AuthModule],
  exports: [ProductsService, TypeOrmModule],
  // Se importa TypeOrm para usar los Repository 
})
export class ProductsModule {}
