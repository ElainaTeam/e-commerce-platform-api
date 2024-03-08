-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `email`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_states` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `create_at` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `platform` VARCHAR(255) NOT NULL,
    `next_step` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `login_states_id_key`(`id`),
    UNIQUE INDEX `login_states_user_id_key`(`user_id`),
    UNIQUE INDEX `login_states_create_at_key`(`create_at`),
    UNIQUE INDEX `login_states_state_key`(`state`),
    UNIQUE INDEX `login_states_platform_key`(`platform`),
    UNIQUE INDEX `login_states_next_step_key`(`next_step`),
    UNIQUE INDEX `login_states_status_key`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
