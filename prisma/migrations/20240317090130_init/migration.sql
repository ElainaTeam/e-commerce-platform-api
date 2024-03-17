-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" TEXT NOT NULL,
    "icon_name" TEXT,
    "banner_name" TEXT,
    "hashed_password" TEXT NOT NULL,
    "create_at" TEXT NOT NULL,
    "flags" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Shops" (
    "id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "create_by" VARCHAR(255) NOT NULL,
    "icon_name" VARCHAR(255) NOT NULL,
    "banner_name" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(255) NOT NULL,
    "long_description" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Products" (
    "id" VARCHAR(255) NOT NULL,
    "shop_id" VARCHAR(255) NOT NULL,
    "category_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(255) NOT NULL,
    "flags" VARCHAR(255) NOT NULL,
    "images" VARCHAR(255) NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "create_by" VARCHAR(255) NOT NULL,
    "icon_name" VARCHAR(255) NOT NULL,
    "banner_name" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(255) NOT NULL,
    "long_description" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Product_category" (
    "id" VARCHAR(255) NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "create_by" VARCHAR(255) NOT NULL,
    "icon_name" VARCHAR(255) NOT NULL,
    "banner_name" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(255) NOT NULL,
    "long_description" VARCHAR(255) NOT NULL,
    "flags" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Login_states" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "auth_type" VARCHAR(255) NOT NULL DEFAULT '',
    "platform" VARCHAR(255) NOT NULL,
    "next_step" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "User_sessions" (
    "id" VARCHAR(255) NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "create_by" VARCHAR(255) NOT NULL,
    "expire_at" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "agent" VARCHAR(255) NOT NULL,
    "platform" VARCHAR(255) NOT NULL,
    "ip" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Shop_permissions" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "shop_id" VARCHAR(255) NOT NULL,
    "flags" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Forum_post_comment" (
    "id" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    "updated_at" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Forum_post_reactions" (
    "id" VARCHAR(255) NOT NULL,
    "reaction" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    "updated_at" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Forum_topic" (
    "id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Forum_topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forum_post" (
    "id" VARCHAR(255) NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "content" TEXT NOT NULL,
    "create_at" VARCHAR(255) NOT NULL,
    "update_at" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "flag" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Forum_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_posts_seen" (
    "user_id" VARCHAR(255) NOT NULL,
    "post_id" VARCHAR(255) NOT NULL,
    "see_at" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "_Forum_postToForum_topic" (
    "A" VARCHAR(255) NOT NULL,
    "B" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_id_key" ON "Shops"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_username_key" ON "Shops"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_name_key" ON "Shops"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_create_at_key" ON "Shops"("create_at");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_create_by_key" ON "Shops"("create_by");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_icon_name_key" ON "Shops"("icon_name");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_banner_name_key" ON "Shops"("banner_name");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_short_description_key" ON "Shops"("short_description");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_long_description_key" ON "Shops"("long_description");

-- CreateIndex
CREATE UNIQUE INDEX "Products_id_key" ON "Products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Products_shop_id_key" ON "Products"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "Products_category_id_key" ON "Products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_price_key" ON "Products"("price");

-- CreateIndex
CREATE UNIQUE INDEX "Products_flags_key" ON "Products"("flags");

-- CreateIndex
CREATE UNIQUE INDEX "Products_images_key" ON "Products"("images");

-- CreateIndex
CREATE UNIQUE INDEX "Products_create_at_key" ON "Products"("create_at");

-- CreateIndex
CREATE UNIQUE INDEX "Products_create_by_key" ON "Products"("create_by");

-- CreateIndex
CREATE UNIQUE INDEX "Products_icon_name_key" ON "Products"("icon_name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_banner_name_key" ON "Products"("banner_name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_short_description_key" ON "Products"("short_description");

-- CreateIndex
CREATE UNIQUE INDEX "Products_long_description_key" ON "Products"("long_description");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_id_key" ON "Product_category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_create_at_key" ON "Product_category"("create_at");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_create_by_key" ON "Product_category"("create_by");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_icon_name_key" ON "Product_category"("icon_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_banner_name_key" ON "Product_category"("banner_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_short_description_key" ON "Product_category"("short_description");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_long_description_key" ON "Product_category"("long_description");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_flags_key" ON "Product_category"("flags");

-- CreateIndex
CREATE UNIQUE INDEX "Login_states_id_key" ON "Login_states"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_sessions_id_key" ON "User_sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_permissions_id_key" ON "Shop_permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_permissions_user_id_key" ON "Shop_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_permissions_shop_id_key" ON "Shop_permissions"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_permissions_flags_key" ON "Shop_permissions"("flags");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_post_comment_id_key" ON "Forum_post_comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_post_reactions_id_key" ON "Forum_post_reactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_topic_id_key" ON "Forum_topic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_topic_title_key" ON "Forum_topic"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_post_id_key" ON "Forum_post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_posts_seen_user_id_key" ON "User_posts_seen"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_posts_seen_post_id_key" ON "User_posts_seen"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Forum_postToForum_topic_AB_unique" ON "_Forum_postToForum_topic"("A", "B");

-- CreateIndex
CREATE INDEX "_Forum_postToForum_topic_B_index" ON "_Forum_postToForum_topic"("B");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum_post_comment" ADD CONSTRAINT "Forum_post_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum_post_comment" ADD CONSTRAINT "Forum_post_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Forum_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum_post_reactions" ADD CONSTRAINT "Forum_post_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum_post_reactions" ADD CONSTRAINT "Forum_post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Forum_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forum_post" ADD CONSTRAINT "Forum_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Forum_postToForum_topic" ADD CONSTRAINT "_Forum_postToForum_topic_A_fkey" FOREIGN KEY ("A") REFERENCES "Forum_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Forum_postToForum_topic" ADD CONSTRAINT "_Forum_postToForum_topic_B_fkey" FOREIGN KEY ("B") REFERENCES "Forum_topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
