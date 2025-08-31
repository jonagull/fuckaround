-- AlterTable
ALTER TABLE "public"."PlannerInvitation" ADD COLUMN     "role" "public"."EventRole" NOT NULL DEFAULT 'PLANNER',
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';
