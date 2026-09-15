-- CreateEnum
CREATE TYPE "ProfileFileKind" AS ENUM ('AVATAR', 'RESUME');

-- CreateTable
CREATE TABLE "profile_files" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "ProfileFileKind" NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_files_path_key" ON "profile_files"("path");

-- CreateIndex
CREATE UNIQUE INDEX "profile_files_user_id_kind_key" ON "profile_files"("user_id", "kind");

-- AddForeignKey
ALTER TABLE "profile_files" ADD CONSTRAINT "profile_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
