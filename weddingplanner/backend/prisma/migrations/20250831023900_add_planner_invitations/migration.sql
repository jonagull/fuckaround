-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."PlannerInvitation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlannerInvitation_receiverId_status_idx" ON "public"."PlannerInvitation"("receiverId", "status");

-- CreateIndex
CREATE INDEX "PlannerInvitation_eventId_status_idx" ON "public"."PlannerInvitation"("eventId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PlannerInvitation_eventId_receiverId_key" ON "public"."PlannerInvitation"("eventId", "receiverId");

-- AddForeignKey
ALTER TABLE "public"."PlannerInvitation" ADD CONSTRAINT "PlannerInvitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlannerInvitation" ADD CONSTRAINT "PlannerInvitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlannerInvitation" ADD CONSTRAINT "PlannerInvitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
