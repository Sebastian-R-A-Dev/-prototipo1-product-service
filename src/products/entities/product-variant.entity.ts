import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Ideal para dinero
  price: number;

  @Column('int')
  stock: number;

  // MAGIA: Aquí guardas {"talla": "M", "color": "Rojo"}
  @Column('jsonb', { default: {} })
  attributes: Record<string, any>;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;
}