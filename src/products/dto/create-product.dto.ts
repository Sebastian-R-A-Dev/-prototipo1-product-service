import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsOptional, IsPositive, ValidateNested, IsObject, IsInt } from 'class-validator';

// 1. Validamos cómo debe ser CADA variante
export class CreateProductVariantDto {
  @IsString()
  sku: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsObject()
  @IsOptional()
  attributes: Record<string, any>; // Ej: { color: "Rojo", talla: "M" }
}

// 2. Validamos cómo debe ser CADA imagen
export class CreateProductImageDto {
  @IsString()
  url: string;

  @IsInt()
  @IsOptional()
  position: number;
}

// 3. Validamos el Producto PADRE (Lo que envías en el POST)
export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Como aún no tenemos Login, enviaremos el ID del vendedor manualmente
  @IsString()
  seller_id: string;

  // Las Specs generales (Marca, Modelo...)
  @IsObject()
  @IsOptional()
  specs?: Record<string, any>;

  // --- AQUÍ OCURRE LA MAGIA DE LA ANIDACIÓN ---

  @IsArray() // Esperamos una lista []
  @ValidateNested({ each: true }) // Valida cada elemento dentro de la lista
  @Type(() => CreateProductVariantDto) // Convierte los datos a la clase Variante
  variants: CreateProductVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto) // Convierte los datos a la clase Imagen
  @IsOptional()
  images?: CreateProductImageDto[];
}
