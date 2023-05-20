#! /usr/bin/env node

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const itemData: Prisma.ItemCreateInput[] = [
  {
    name: "JS For Dummies",
    description: "A short JS Course",
    categories: {
      create: [
        {
          name: "Programming",
          description: "Courses on programming/computer science",
        },
        {
          name: "Short courses",
          description: "Short courses, hours to days",
        },
      ],
    },
    price: 69,
  },
  {
    name: "HTML For Dummies",
    description: "A short HTML Course",
    categories: {
      connect: [
        {
          name: "Programming",
        },
      ],
    },
    price: 69,
  },
  {
    name: "CSS For Dummies",
    description: "A short CSS Course",
    categories: {
      connect: [
        {
          name: "Programming",
        },
      ],
    },
    price: 69,
    stockItems: {
      create: [
        {
          name: "CSS For Dummies",
        },
      ],
    },
  },
];

async function main() {
  console.log("Cleaning DB");
  await prisma.stockItem.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Starting seed now");

  for (const item of itemData) {
    const itemEntry = await prisma.item.create({ data: item });
    console.log(`Created item ${item.name} with id: ${itemEntry.id}`);
  }

  console.log(`Seeding finished`);
}

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
