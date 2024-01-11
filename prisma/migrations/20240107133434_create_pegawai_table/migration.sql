-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_company_id_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `company_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Pegawai` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `rek` VARCHAR(191) NULL,
    `date_of_birth` DATETIME(3) NOT NULL,
    `place_of_birth` VARCHAR(191) NOT NULL,
    `religion` ENUM('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU', 'LAIN') NOT NULL,
    `married_status` ENUM('Single', 'Married', 'Widowed') NOT NULL,
    `blood_type` VARCHAR(191) NOT NULL,
    `father_name` VARCHAR(191) NOT NULL,
    `mother_name` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `sub_district` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(191) NOT NULL,
    `rw` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NOT NULL,
    `bank_rekening` VARCHAR(191) NOT NULL,
    `bank_account` VARCHAR(191) NOT NULL,
    `job_status` VARCHAR(191) NOT NULL,
    `job_pic` VARCHAR(191) NULL,
    `job_start_date` DATETIME(3) NOT NULL,
    `job_end_date` DATETIME(3) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
