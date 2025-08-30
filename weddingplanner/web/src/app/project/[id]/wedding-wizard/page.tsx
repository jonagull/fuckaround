import { Card } from "@/components/ui/card";
import { Heart, Wand2 } from "lucide-react";

export default function ProjectWeddingWizardPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wedding Wizard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Let our wizard guide you through creating the perfect wedding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-6 w-6 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quick Setup</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get your wedding project set up in minutes with our guided wizard
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personalized</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Tailored recommendations based on your preferences and style
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Smart Planning
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered suggestions for venues, vendors, and timelines
          </p>
        </Card>
      </div>
    </div>
  );
}
