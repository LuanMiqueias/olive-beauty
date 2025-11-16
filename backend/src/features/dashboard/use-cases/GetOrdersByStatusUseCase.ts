import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetOrdersByStatusUseCase {
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
      select: {
        status: true,
        createdAt: true,
      },
    });

    // Agrupar por status e por dia
    const statusByDay: Record<string, Record<string, number>> = {};
    const statusTotals: Record<string, number> = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const status = order.status;

      if (!statusByDay[date]) {
        statusByDay[date] = {};
      }
      if (!statusByDay[date][status]) {
        statusByDay[date][status] = 0;
      }
      statusByDay[date][status] += 1;

      if (!statusTotals[status]) {
        statusTotals[status] = 0;
      }
      statusTotals[status] += 1;
    });

    // Buscar totais antes do período
    const totalBeforePeriod = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          lt: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const totalBefore: Record<string, number> = {};
    totalBeforePeriod.forEach((item) => {
      totalBefore[item.status] = item._count.id;
    });

    // Criar array de dados para o gráfico
    const allStatuses = ['PENDING', 'PROCESSING', 'SENT', 'DELIVERED', 'CANCELLED'];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData: any = { date: dateStr };
      allStatuses.forEach((status) => {
        dayData[status] = statusByDay[dateStr]?.[status] || 0;
      });
      data.push(dayData);
    }

    return {
      data,
      totals: statusTotals,
      totalsBefore: totalBefore,
    };
  }
}

