import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products') // Nombre de la tabla en plural
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text', { nullable: true })
    description: string;

    // El famoso JSONB para guardar "Marca", "Modelo", "Año" sin crear tablas extra
    // 'default: {}' evita errores si el producto no tiene specs
    @Column('jsonb', { default: {} })
    specs: Record<string, any>;

    // Fundamental para el futuro Marketplace
    @Column('text')
    seller_id: string;

    // Estado del producto: ACTIVE, PAUSED, DELETED
    @Column('text', { default: 'ACTIVE' })
    status: string;

    // --- RELACIONES ---
    @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
    variants: ProductVariant[];

    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];

    // --- TIMESTAMPS AUTOMÁTICOS ---

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
