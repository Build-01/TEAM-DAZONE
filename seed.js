const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SabiPass123!', salt);

  // Create a Demo Trader
  const trader = await prisma.user.upsert({
    where: { email: 'mama_market@example.com' },
    update: {},
    create: {
      email: 'mama_market@example.com',
      phone: '08030000001',
      passwordHash,
      firstName: 'Mama',
      lastName: 'Market',
      userType: 'TRADER',
      location: 'Oshodi Market, Lagos',
      economicIdentityScore: 75,
    },
  });

  // Create Demo Gigs
  const gigs = [
    {
      title: 'Delivery for Market Goods',
      description: 'Need someone with a bicycle to deliver groceries to customers within 5km.',
      category: 'Logistics',
      paymentAmount: 5000,
      location: 'Oshodi, Lagos',
      requiredSkills: ['Cycling', 'Punctuality'],
    },
    {
      title: 'Shop Cleaning & Organization',
      description: 'Clean the main stall and organize inventory every morning for a week.',
      category: 'Maintenance',
      paymentAmount: 12000,
      location: 'Mushin, Lagos',
      requiredSkills: ['Cleaning'],
    }
  ];

  for (const gig of gigs) {
    await prisma.gig.create({
      data: {
        ...gig,
        creatorId: trader.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });
  }

  console.log('✅ Database Seeded Successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
