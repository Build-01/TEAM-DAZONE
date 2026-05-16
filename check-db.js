const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  console.log('User count:', userCount);
  const user = await prisma.user.findUnique({
    where: { email: 'mama_market@example.com' }
  });
  console.log('Mama Market User:', user ? 'Found' : 'Not Found');
  if (user) {
    console.log('User ID:', user.id);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
