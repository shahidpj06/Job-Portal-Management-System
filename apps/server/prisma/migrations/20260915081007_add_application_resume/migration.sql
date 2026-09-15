-- CreateTable
CREATE TABLE "application_resumes" (
    "application_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_resumes_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_resumes_path_key" ON "application_resumes"("path");

-- AddForeignKey
ALTER TABLE "application_resumes" ADD CONSTRAINT "application_resumes_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
