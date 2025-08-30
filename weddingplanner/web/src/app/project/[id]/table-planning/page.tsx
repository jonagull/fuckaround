import { Card } from "@/components/ui/card";
import { TableProperties, Users, Layout } from "lucide-react";

export default function ProjectTablePlanningPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Table Planning</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Create the perfect seating arrangements for your special day
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TableProperties className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Visual Designer
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Drag and drop interface for easy table arrangement
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Smart Seating
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            AI suggestions based on guest relationships and preferences
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Multiple Layouts
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Support for different venue layouts and table shapes
          </p>
        </Card>
      </div>
    </div>
  );
}
