import { Injectable, InternalServerErrorException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto, CreateProductVariantDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  // Usamos un Logger para ver errores bonitos en la consola
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      // 1. Crear la instancia del producto (No se guarda todavía)
      // TypeORM es listo: Al pasarle el DTO con 'variants' e 'images',
      // él sabe que debe crear esas instancias también gracias al Cascade.
      const product = this.productRepository.create(createProductDto);

      // 2. Guardar en Base de Datos (Aquí se inserta en las 3 tablas)
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async addVariant(productId: string, createVariantDto: CreateProductVariantDto) {
    // 1. Buscamos al Papá para asegurar que existe
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new BadRequestException('El producto no existe');
    }

    try {
      // 2. Creamos la variante hija y le asignamos el papá
      const newVariant = this.variantRepository.create({
        ...createVariantDto,
        product: product,
      });

      // 3. Guardamos solo la variante (es más eficiente)
      await this.variantRepository.save(newVariant);

      return newVariant;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // --- Helpers para manejo de errores ---
  private handleDBExceptions(error: any) {
    // Código 23505 es "Unique Violation" en Postgres (ej: SKU repetido)
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }

  // Métodos placeholder (los llenaremos después)

  //Obtener TODOS los productos con sus fotos y variantes
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;


    return this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
        variants: true
      }
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        images: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    // 1. Preload busca el producto por ID y le carga los datos nuevos encima
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto, // Esparce los datos nuevos
    });

    // 2. Si no encontró el ID, preload devuelve undefined
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    try {
      // 3. Guardamos los cambios
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id); // Reutilizamos findOne para asegurar que existe

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    await this.productRepository.remove(product);
    return { message: `Producto con ID ${id} eliminado correctamente` };
  }
}