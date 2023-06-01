import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();

async function getImageFiles() {
  const files = await fs.readdir("public/images");

  return files;
}

async function getUnusedImageFiles() {
  const items = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  const files = await getImageFiles();
  const itemIds = items.map((item) => item.id);

  const unusedFiles = files.filter((file) => {
    const filename = file.substring(0, file.indexOf("."));

    return !itemIds.includes(filename);
  });

  return unusedFiles;
}

async function cleanImageFolder() {
  const unusedFiles = await getUnusedImageFiles();

  for (const unusedFile of unusedFiles) {
    console.log("Deleting", unusedFile);
    await fs.rm(`public/images/${unusedFile}`);
  }

  console.log("Done!");
}

cleanImageFolder();
