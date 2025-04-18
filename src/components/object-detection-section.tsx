import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { DetectedObject } from "@/types"

interface ObjectDetectionSectionProps {
  className?: string
  detectedObjects: DetectedObject[]
}

export default function ObjectDetectionSection({ className, detectedObjects }: ObjectDetectionSectionProps) {
  const totalObjects = detectedObjects.reduce((acc, obj) => acc + obj.count, 0)

  return (
    <Card className={`bg-white border-gray-200 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">Detected Objects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 pb-2 border-b border-gray-200">
              <span>Object</span>
              <span>Confidence</span>
            </div>
            {detectedObjects.map((object) => (
              <div key={object.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span>{object.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {object.count}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={object.confidence * 100} className="h-2 w-24" />
                  <span className="text-sm">{Math.round(object.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-center border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Detection Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Objects</span>
                <span>{totalObjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Object Types</span>
                <span>{detectedObjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
