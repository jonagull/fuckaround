-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_venueAddressId_fkey";

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "eventDescription" DROP NOT NULL,
ALTER COLUMN "eventDate" DROP NOT NULL,
ALTER COLUMN "venueAddressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_venueAddressId_fkey" FOREIGN KEY ("venueAddressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
