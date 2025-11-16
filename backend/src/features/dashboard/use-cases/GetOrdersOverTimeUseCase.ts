import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetOrdersOverTimeUseCase {
  async execute(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar pedidos por dia
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Agrupar por dia
    const ordersByDay: Record<string, number> = {};
    let totalOrders = 0;

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!ordersByDay[date]) {
        ordersByDay[date] = 0;
      }
      ordersByDay[date] += 1;
      totalOrders += 1;
    });

    // Buscar total de pedidos antes do período
    const totalBeforePeriod = await prisma.order.count({
      where: {
        createdAt: {
          lt: startDate,
        },
      },
    });

    // Criar array de dados para o gráfico
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        orders: ordersByDay[dateStr] || 0,
      });
    }

    return {
      data,
      total: totalOrders,
      totalBefore: totalBeforePeriod,
      totalAccumulated: totalBeforePeriod + totalOrders,
    };
  }
}

