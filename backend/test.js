import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.ayam.create({
    data: {
      jumlah: 100,
      mati: 2,
      pakan: 5.5,
    },
  });

  console.log(data);
}

main();
