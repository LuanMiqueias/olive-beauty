import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetRevenueOverTimeUseCase {
  async execute(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar receita por dia
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Agrupar por dia
    const revenueByDay: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = 0;
      }
      revenueByDay[date] += order.total;
      totalRevenue += order.total;
    });

    // Buscar receita total acumulada (antes do período)
    const totalBeforePeriod = await prisma.order.aggregate({
      where: {
        createdAt: {
          lt: startDate,
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalBefore = totalBeforePeriod._sum.total || 0;

    // Criar array de dados para o gráfico
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        revenue: revenueByDay[dateStr] || 0,
      });
    }

    return {
      data,
      total: totalRevenue,
      totalBefore,
      totalAccumulated: totalBefore + totalRevenue,
    };
  }
}

