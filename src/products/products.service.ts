import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProducsService'); // Mejora la visualizacion de errores

  constructor(
    @InjectRepository(Product) // El tipo de dato del repositorio
    private readonly _productRepository: Repository<Product>, // Tipo de dato Product (entidad)
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // if (!createProductDto.slug) {
      //   createProductDto.slug = createProductDto.title
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '');
      // } else {
      //   createProductDto.slug = createProductDto.title
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '');
      // } // Esta lógica se trasladó y mejoró en la entidad
      const product = this._productRepository.create(createProductDto);
      await this._productRepository.save(product); // Aquí se graba la información en la DB
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    try {
      const product = this._productRepository.find();
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this._productRepository.findBy({ id });
      if (!product) {
        throw new NotFoundException(`Product ${id} not founded`);
      }
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this._productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
