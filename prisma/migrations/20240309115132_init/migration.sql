/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `login_states` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `login_states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flags` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `login_states` ADD COLUMN `type` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `create_at` VARCHAR(191) NOT NULL,
    ADD COLUMN `flags` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(255) NOT NULL,
    `expire_at` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `agent` VARCHAR(255) NOT NULL,
    `platform` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_sessions_id_key`(`id`),
    UNIQUE INDEX `user_sessions_created_at_key`(`created_at`),
    UNIQUE INDEX `user_sessions_created_by_key`(`created_by`),
    UNIQUE INDEX `user_sessions_expire_at_key`(`expire_at`),
    UNIQUE INDEX `user_sessions_user_id_key`(`user_id`),
    UNIQUE INDEX `user_sessions_state_key`(`state`),
    UNIQUE INDEX `user_sessions_access_token_key`(`access_token`),
    UNIQUE INDEX `user_sessions_refresh_token_key`(`refresh_token`),
    UNIQUE INDEX `user_sessions_agent_key`(`agent`),
    UNIQUE INDEX `user_sessions_platform_key`(`platform`),
    UNIQUE INDEX `user_sessions_ip_key`(`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_permissions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `shop_id` VARCHAR(255) NOT NULL,
    `flags` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `shop_permissions_id_key`(`id`),
    UNIQUE INDEX `shop_permissions_user_id_key`(`user_id`),
    UNIQUE INDEX `shop_permissions_shop_id_key`(`shop_id`),
    UNIQUE INDEX `shop_permissions_flags_key`(`flags`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `login_states_type_key` ON `login_states`(`type`);
