const prisma = require('../../lib/prisma')

const vendorDashboardService = async (vendorId) => {
    const [ordersCount, revenue, lowStockProducts] = await Promise.all([
        prisma.order.count({where: {
            items: {
                some: {
                    product: {
                        vendorId
                    }
                }
            }
        }
    }),

        prisma.order.aggregate({
            where: {
                status: "PAID",
                    items: {
                        some: {
                            product: {
                                    vendorId
                                }
                            }
                        }
        },
        _sum: {
            totalAmount: true
        }
    }),

        prisma.product.findMany({
            where: {
                vendorId,
                stock: { lt: 5 }
            }
        })
    ]);

    return {
    totalOrders: ordersCount,
    totalRevenue: revenue._sum.totalAmount || 0,
    lowStockProducts};
};


module.exports = vendorDashboardService