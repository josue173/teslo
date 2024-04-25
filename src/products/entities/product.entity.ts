/* 
  Esto es lo que TypeOrm buscará y tomará com base para crear las entidades
*/

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { productImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' }) // Con esto ya podemos majerar este archivo como entity
export class Product {
  @ApiProperty({
    example: '325ea329-3558-4848-a901c-ecd2b17116a6',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;
  @ApiProperty({
    example: 0,
    description: 'Product price',
    uniqueItems: false,
  })
  @Column('float', {
    default: 0,
  })
  price: number;
  @ApiProperty({
    example: 'Description',
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product slug - for CEO routes',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string; // identificar URLs

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'L', 'S'],
    description: 'Product sizes',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column({
    type: 'text',
  })
  gender: string;
  
  @ApiProperty()
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(
    () => productImage, // Va a regresar un ProductImage
    (productImage) => productImage.product, // Como se relaciona con la otra entidad
    { cascade: true, eager: true },
    // Cascade: sto ayuda con la asociación de este archivo en caso de estar en otra
    // Eager (para cada método find de productos): esto cargará las imágenes
  )
  images?: productImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  // Eager carga la relación de usuario y producto (O:M)
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
