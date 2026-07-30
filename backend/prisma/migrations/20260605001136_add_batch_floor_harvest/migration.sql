/*
  Warnings:

  - You are about to drop the `Ayam` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "batchId" INTEGER,
ADD COLUMN     "floorId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "floorId" INTEGER,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "Ayam";

-- CreateTable
CREATE TABLE "Floor" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kandang" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "nomorBatch" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "jumlahDoc" INTEGER NOT NULL,
    "supplier" TEXT,
    "hargaDoc" DOUBLE PRECISION,
    "targetFcr" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harvest" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "tanggalPanen" TIMESTAMP(3) NOT NULL,
    "panenKe" INTEGER NOT NULL,
    "jumlahAyam" INTEGER NOT NULL,
    "beratPerEkor" DOUBLE PRECISION NOT NULL,
    "totalBerat" DOUBLE PRECISION NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Harvest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_nomorBatch_key" ON "Batch"("nomorBatch");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
