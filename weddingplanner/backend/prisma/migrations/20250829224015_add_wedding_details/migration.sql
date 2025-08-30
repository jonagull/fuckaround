-- CreateTable
CREATE TABLE "public"."WeddingDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partnerOneName" TEXT NOT NULL,
    "partnerTwoName" TEXT NOT NULL,
    "weddingDate" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "guestEstimate" INTEGER NOT NULL,
    "theme" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeddingDetails_userId_key" ON "public"."WeddingDetails"("userId");

-- AddForeignKey
ALTER TABLE "public"."WeddingDetails" ADD CONSTRAINT "WeddingDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
