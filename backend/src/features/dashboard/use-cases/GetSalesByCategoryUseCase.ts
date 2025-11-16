import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetSalesByCategoryUseCase {
  async execute(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar pedidos do período
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Agrupar por categoria e por dia
    const categoryByDay: Record<string, Record<string, number>> = {};
    const categoryTotals: Record<string, number> = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      
      order.items.forEach((item) => {
        const categoryName = item.product.category.name;
        const value = item.price * item.quantity;

        if (!categoryByDay[date]) {
          categoryByDay[date] = {};
        }
        if (!categoryByDay[date][categoryName]) {
          categoryByDay[date][categoryName] = 0;
        }
        categoryByDay[date][categoryName] += value;

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0;
        }
        categoryTotals[categoryName] += value;
      });
    });

    // Buscar totais antes do período
    const ordersBefore = await prisma.order.findMany({
      where: {
        createdAt: {
          lt: startDate,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const totalBefore: Record<string, number> = {};
    ordersBefore.forEach((order) => {
      order.items.forEach((item) => {
        const categoryName = item.product.category.name;
        const value = item.price * item.quantity;
        if (!totalBefore[categoryName]) {
          totalBefore[categoryName] = 0;
        }
        totalBefore[categoryName] += value;
      });
    });

    // Obter todas as categorias
    const allCategories = Object.keys({ ...categoryTotals, ...totalBefore });

    // Criar array de dados para o gráfico
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData: any = { date: dateStr };
      allCategories.forEach((category) => {
        dayData[category] = categoryByDay[dateStr]?.[category] || 0;
      });
      data.push(dayData);
    }

    return {
      data,
      totals: categoryTotals,
      totalsBefore: totalBefore,
    };
  }
}

