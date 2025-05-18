import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

//   // --- Seed Users ---
//   const adminUserEmail = 'admin@example.com';
//   const existingAdmin = await prisma.user.findUnique({
//     where: { email: adminUserEmail },
//   });

//   if (!existingAdmin) {
//     const hashedPassword = await hashPassword('password123'); // Hash a default password
//     const adminUser = await prisma.user.create({
//       data: {
//         email: adminUserEmail,
//         password: hashedPassword,
//         // Add other fields if necessary
//       },
//     });
//     console.log(`Created admin user with id: ${adminUser.id}`);
//   } else {
//     console.log(`Admin user with email ${adminUserEmail} already exists.`);
//   }

  // --- Add other seeding logic here ---
  // Example: Create a default product, category, etc.
  // const defaultCategory = await prisma.category.upsert({
  //   where: { name: 'Default Category' },
  //   update: {}, // Do nothing if it exists
  //   create: {
  //     name: 'Default Category',
  //     description: 'This is a default category.',
  //   },
  // });
  // console.log(`Upserted category with id: ${defaultCategory.id}`);


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
