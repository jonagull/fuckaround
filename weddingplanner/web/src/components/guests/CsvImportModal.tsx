"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface CsvImportModalProps {
  projectId: string;
}

export function CsvImportModal({ projectId }: CsvImportModalProps) {
  const router = useRouter();

  const handleNavigateToImport = () => {
    router.push(`/event/${projectId}/guests/import`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleNavigateToImport}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
    >
      <Upload className="mr-2 h-4 w-4" />
      Import Guests
    </Button>
  );
}
