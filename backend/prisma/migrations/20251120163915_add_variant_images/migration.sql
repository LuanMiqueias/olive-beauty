-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "productVariantId" TEXT;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
