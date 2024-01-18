import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class productImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.images, // Así se relaciona con la otra tabla
    { onDelete: 'CASCADE' },
  )
  product: Product;
}
