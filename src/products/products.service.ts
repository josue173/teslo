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
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { productImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProducsService'); // Mejora la visualizacion de errores

  constructor(
    @InjectRepository(Product) // El tipo de dato del repositorio
    private readonly _productRepository: Repository<Product>, // Tipo de dato Product (entidad) // La variable _productRepository proporciona la información necesaria para conectar a la base de datos}}
    @InjectRepository(productImage)
    private readonly _productImageRepository: Repository<productImage>,
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

      const { images = [], ...productDetails } = createProductDto;

      const product = this._productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this._productImageRepository.create({ url: image }),
        ),
      });
      await this._productRepository.save(product); // Aquí se graba la información en la DB
      return { ...product, images: images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const products = await this._productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return products.map(({ images, ...rest }) => ({
        ...rest,
        images: images.map((img) => img.url),
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this._productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this._productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

      // :title y :slug es para indicar que son argumentos, estos a su vez son definidos como segundo parámetro}
      // Tanto title como slug pueden estar en diferentes posiciones en la DB y puede regresar dos resultados, getOne() solo regresa uno
      // las funciones UPPER(), .toUpperCase y .toLowerCase, son para quitar el case sensitive
    }

    if (!product) {
      throw new NotFoundException(`Product ${term} not founded`);
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
    // Esta funcion solo hace que el retorno se vea como quiero
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this._productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    }); // Buscar producto por ID y cargar las propiedades del DTO
    if (!product)
      throw new NotFoundException(`Producto with ID: ${id} not found`);

    try {
      await this._productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
