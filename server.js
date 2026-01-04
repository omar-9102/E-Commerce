
require('dotenv').config(); // 👈 MUST be first line
const app = require('./app');
const prisma = require('./lib/prisma');

async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected');
        const PORT = process.env.PORT
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(new Date())
    });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
