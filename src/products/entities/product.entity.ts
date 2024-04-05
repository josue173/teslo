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

@Entity({ name: 'products' }) // Con esto ya podemos majerar este archivo como entity
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  title: string;
  @Column('float', {
    default: 0,
  })
  price: number;
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string; // identificar URLs
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];
  @Column({
    type: 'text',
  })
  gender: string;
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

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
