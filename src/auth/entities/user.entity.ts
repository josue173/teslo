import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { text } from 'stream/consumers';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Column({
    unique: true,
    type: 'text',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'text',
  })
  fullName: string;

  @IsBoolean()
  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @IsArray()
  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  rols: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;
  @BeforeInsert()
  checkData() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkBeforeUpdate() {
    this.checkData();
  }
}
