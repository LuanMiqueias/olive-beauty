import { ProductRepository } from '../repositories/ProductRepository';
import { ProductVariantRepository } from '../repositories/ProductVariantRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';
import { UpdateProductDTO } from '../dtos/UpdateProductDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productVariantRepository: ProductVariantRepository,
    private productImageRepository: ProductImageRepository
  ) {}

  async execute(id: string, data: UpdateProductDTO) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Update product basic fields
    await this.productRepository.update(id, {
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      brand: data.brand,
      categoryId: data.categoryId,
    });

    // Update variants if provided
    if (data.variants !== undefined) {
      // Delete all existing variants (cascade will delete variant images)
      await this.productVariantRepository.deleteByProductId(id);

      // Create new variants
      if (data.variants.length > 0) {
        for (const variant of data.variants) {
          const createdVariant = await this.productVariantRepository.create({
            productId: id,
            attributes: JSON.stringify(variant.attributes),
            price: variant.price,
            stock: variant.stock,
          });

          // Create variant-specific images if provided
          if (variant.images && variant.images.length > 0) {
            for (let i = 0; i < variant.images.length; i++) {
              await this.productImageRepository.create({
                productId: id,
                productVariantId: createdVariant.id, // Associate with variant
                url: variant.images[i].url,
                isCover: variant.images[i].isCover ?? (i === 0), // First image is cover if not specified
              });
            }
          }
        }
      }
    }

    // Update general product images if provided (not associated with any variant)
    if (data.images !== undefined) {
      // Delete only general product images (not variant-specific ones)
      const generalImages = await this.productImageRepository.findByProductIdAndVariantId(id, null);
      for (const image of generalImages) {
        await this.productImageRepository.delete(image.id);
      }

      // Create new general images
      if (data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          await this.productImageRepository.create({
            productId: id,
            productVariantId: undefined, // General product image
            url: data.images[i],
            isCover: i === 0, // First image is cover
          });
        }
      }
    }

    // Return product with relations
    return this.productRepository.findById(id);
  }
}

