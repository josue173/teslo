/* 
  Esto es lo que TypeOrm buscará y tomará com base para crear las entidades
*/

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Con esto ya podemos majerar este archivo como entity
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  title: string;
  @Column('numeric', {
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
    type: 'numeric',
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
}
