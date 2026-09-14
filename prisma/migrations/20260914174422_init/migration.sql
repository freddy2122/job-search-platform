-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "remoteType" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "stack" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT,
    "postedAt" DATETIME,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'a_postuler',
    "notes" TEXT,
    "cvGeneratedAt" DATETIME,
    "letterGeneratedAt" DATETIME,
    "appliedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_url_key" ON "Job"("url");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_postedAt_idx" ON "Job"("postedAt");
