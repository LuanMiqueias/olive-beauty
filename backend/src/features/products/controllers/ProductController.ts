import { Request, Response } from 'express';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductVariantRepository } from '../repositories/ProductVariantRepository';
import { ProductImageRepository } from '../repositories/ProductImageRepository';
import { CreateProductUseCase } from '../use-cases/CreateProductUseCase';
import { ListProductsUseCase } from '../use-cases/ListProductsUseCase';
import { GetProductByIdUseCase } from '../use-cases/GetProductByIdUseCase';
import { UpdateProductUseCase } from '../use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../use-cases/DeleteProductUseCase';
import { createProductSchema } from '../dtos/CreateProductDTO';
import { updateProductSchema } from '../dtos/UpdateProductDTO';
import { listProductsQuerySchema } from '../dtos/ListProductsQueryDTO';
import { AppError } from '../../../shared/errors/AppError';

const productRepository = new ProductRepository();
const productVariantRepository = new ProductVariantRepository();
const productImageRepository = new ProductImageRepository();
const createProductUseCase = new CreateProductUseCase(
  productRepository,
  productVariantRepository,
  productImageRepository
);
const listProductsUseCase = new ListProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const validatedData = createProductSchema.parse(req.body);
      const product = await createProductUseCase.execute(validatedData);

      return res.status(201).json({
        status: 'success',
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async list(req: Request, res: Response) {
    try {
      const validatedQuery = listProductsQuerySchema.parse(req.query);
      const products = await listProductsUseCase.execute(validatedQuery);

      return res.json({
        status: 'success',
        data: products,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Parâmetros de busca inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await getProductByIdUseCase.execute(id);

      return res.json({
        status: 'success',
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);
      const product = await updateProductUseCase.execute(id, validatedData);

      return res.json({
        status: 'success',
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteProductUseCase.execute(id);

      return res.json({
        status: 'success',
        message: 'Produto deletado com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }
}

