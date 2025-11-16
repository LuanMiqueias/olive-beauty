import { ProductRepository } from '../repositories/ProductRepository';
import { ProductVariantRepository } from '../repositories/ProductVariantRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';
import { CreateProductDTO } from '../dtos/CreateProductDTO';
import { AppError } from '../../../shared/errors/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productVariantRepository: ProductVariantRepository,
    private productImageRepository: ProductImageRepository
  ) {}

  async execute(data: CreateProductDTO) {
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    // Create product
    const product = await this.productRepository.create({
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      brand: data.brand,
      categoryId: data.categoryId,
    });

    // Create variants if provided
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        await this.productVariantRepository.create({
          productId: product.id,
          attributes: JSON.stringify(variant.attributes),
          price: variant.price,
          stock: variant.stock,
        });
      }
    }

    // Create images if provided
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        await this.productImageRepository.create({
          productId: product.id,
          url: data.images[i],
          isCover: i === 0, // First image is cover
        });
      }
    }

    // Return product with relations
    return this.productRepository.findById(product.id);
  }
}

