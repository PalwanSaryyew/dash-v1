// prisma/seed.ts

import bcrypt from "bcrypt";
import { prisma } from "./prismaConfig";

async function main() {
   const adminNick = "admin";
   const adminPassword = "123"; // Güçlü bir şifre seçin!

   const hashedPassword = await bcrypt.hash(adminPassword, 12);

   // Mevcut admini sil (isteğe bağlı, tekrar tekrar seed çalıştırıyorsanız kullanışlı)
   await prisma.admin.deleteMany({ where: { nick: adminNick } });

   const admin = await prisma.admin.create({
      data: {
         updatedAt: new Date(),
         tgId: "123456789",
         nick: adminNick,
         hashedPassword: hashedPassword,
      },
   });

   console.log({ admin });
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
