import { PrismaClient } from "@prisma/client";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      email_verified: new Date(),
      phone_number: "08123456789",
      password: bycrypt.hashSync("admin123", 10),
      role: {
        create: {
          name: "admin",
        },
      },
      created_at: new Date(),
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
