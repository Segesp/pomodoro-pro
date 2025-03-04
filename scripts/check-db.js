require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const prisma = new PrismaClient();
    console.log('Intentando conectar a la base de datos...');
    
    await prisma.$connect();
    console.log('Conexión exitosa a la base de datos!');
    
    const users = await prisma.user.findMany({
      take: 1
    });
    console.log('Consulta de prueba exitosa:', users.length > 0 ? 'Hay usuarios en la base de datos' : 'No hay usuarios en la base de datos');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 