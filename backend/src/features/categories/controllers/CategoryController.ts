import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { CreateCategoryUseCase } from '../use-cases/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '../use-cases/ListCategoriesUseCase';
import { GetCategoryByIdUseCase } from '../use-cases/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../use-cases/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../use-cases/DeleteCategoryUseCase';
import { createCategorySchema } from '../dtos/CreateCategoryDTO';
import { updateCategorySchema } from '../dtos/UpdateCategoryDTO';
import { AppError } from '../../../shared/errors/AppError';

const categoryRepository = new CategoryRepository();
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await createCategoryUseCase.execute(validatedData);

      return res.status(201).json({
        status: 'success',
        data: category,
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
      const categories = await listCategoriesUseCase.execute();

      return res.json({
        status: 'success',
        data: categories,
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await getCategoryByIdUseCase.execute(id);

      return res.json({
        status: 'success',
        data: category,
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
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await updateCategoryUseCase.execute(id, validatedData);

      return res.json({
        status: 'success',
        data: category,
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
      await deleteCategoryUseCase.execute(id);

      return res.json({
        status: 'success',
        message: 'Categoria deletada com sucesso',
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

