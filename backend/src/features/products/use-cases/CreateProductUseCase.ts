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
        const createdVariant = await this.productVariantRepository.create({
          productId: product.id,
          attributes: JSON.stringify(variant.attributes),
          price: variant.price,
          stock: variant.stock,
        });

        // Create variant-specific images if provided
        if (variant.images && variant.images.length > 0) {
          for (let i = 0; i < variant.images.length; i++) {
            await this.productImageRepository.create({
              productId: product.id,
              productVariantId: createdVariant.id, // Associate with variant
              url: variant.images[i].url,
              isCover: variant.images[i].isCover ?? (i === 0), // First image is cover if not specified
            });
          }
        }
      }
    }

    // Create general product images if provided (not associated with any variant)
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        await this.productImageRepository.create({
          productId: product.id,
          productVariantId: undefined, // General product image
          url: data.images[i],
          isCover: i === 0, // First image is cover
        });
      }
    }

    // Return product with relations
    return this.productRepository.findById(product.id);
  }
}

