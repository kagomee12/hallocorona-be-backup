import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

const categories = [
  "Kesehatan",
  "Penyakit Kronis",
  "Penyakit Menular & Pencegahan",
  "Kesehatan Mental & Kebugaran",
  "Gaya Hidup Sehat",
  "Spesialisasi Kesehatan",
  "Pengobatan Alternatif",
  "Layanan Medis",
  "Asuransi Kesehatan",
  "Gizi",
  "Kesehatan Keluarga"
];

async function main() {
  console.log('Seeding categories...');
  await prisma.category.deleteMany();

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
