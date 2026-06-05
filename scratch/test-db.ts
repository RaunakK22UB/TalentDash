import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Connecting to database via adapter...');
  const companies = await prisma.company.findMany();
  console.log('Success! Found companies:', companies);
}

main()
  .catch((e) => {
    console.error('Error during test:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
