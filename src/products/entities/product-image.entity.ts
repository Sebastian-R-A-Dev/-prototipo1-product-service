import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string;

  // Para saber cuál foto va primero (la portada)
  @Column('int', { default: 0 })
  position: number;

  //Agregamos onDelete: 'CASCADE' para que si borras un producto, se borren sus fotos automáticamente.
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;
}