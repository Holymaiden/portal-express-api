-- DropForeignKey
ALTER TABLE `pegawai` DROP FOREIGN KEY `Pegawai_user_id_fkey`;

-- AlterTable
ALTER TABLE `pegawai` MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
