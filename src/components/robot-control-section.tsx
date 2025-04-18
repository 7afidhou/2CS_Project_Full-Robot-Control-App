"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gauge } from "lucide-react"

interface RobotControlSectionProps {
  isActive: boolean
}

export default function RobotControlSection({ isActive }: RobotControlSectionProps) {
  const [speed, setSpeed] = useState(0)

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0])
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">Robot Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            <div className="col-start-2">
              <Button variant="secondary" className="w-full aspect-square" disabled={!isActive}>
                <ArrowUp className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-1 col-end-2">
              <Button variant="secondary" className="w-full aspect-square" disabled={!isActive}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-3 col-end-4">
              <Button variant="secondary" className="w-full aspect-square" disabled={!isActive}>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-2">
              <Button variant="secondary" className="w-full aspect-square" disabled={!isActive}>
                <ArrowDown className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Speed</span>
              <span>{speed}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <Slider defaultValue={[0]} max={100} step={1} disabled={!isActive} onValueChange={handleSpeedChange} />
            </div>
          </div>

          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">
                Basic
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">
                Advanced
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={!isActive}>
                  Rotate Left
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Rotate Right
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Stop
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Return Home
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={!isActive}>
                  Arm Up
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Arm Down
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Gripper Open
                </Button>
                <Button variant="outline" disabled={!isActive}>
                  Gripper Close
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
