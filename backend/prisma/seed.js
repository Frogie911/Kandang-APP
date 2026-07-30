import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Floors
  const floors = [
    { nama: "Lantai 1", kandang: "Kandang A" },
    { nama: "Lantai 2", kandang: "Kandang B" },
    { nama: "Lantai 3", kandang: "Kandang C" },
  ];

  for (const floor of floors) {
    await prisma.floor.upsert({
      where: { id: floors.indexOf(floor) + 1 },
      update: {},
      create: floor,
    });
  }

  console.log("✅ Floor seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
