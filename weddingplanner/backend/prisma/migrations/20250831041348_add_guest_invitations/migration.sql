-- AlterTable
ALTER TABLE "public"."PlannerInvitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "guestFirstName" TEXT NOT NULL,
    "guestLastName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhoneNumber" TEXT NOT NULL,
    "guestPhoneCountryCode" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "additionalGuestsCount" INTEGER NOT NULL DEFAULT 0,
    "additionalGuests" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invitation_eventId_idx" ON "public"."Invitation"("eventId");

-- CreateIndex
CREATE INDEX "Invitation_guestEmail_idx" ON "public"."Invitation"("guestEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_eventId_guestEmail_key" ON "public"."Invitation"("eventId", "guestEmail");

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
