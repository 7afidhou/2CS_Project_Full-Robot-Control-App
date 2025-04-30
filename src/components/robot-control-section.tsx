"use client"
import { move } from "@/actions/move"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gauge } from "lucide-react"

interface RobotControlSectionProps {
  isActive: boolean
}

export default function RobotControlSection({ isActive }: RobotControlSectionProps) {
  const [speed, setSpeed] = useState(100)

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
          {/* Direction Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            <div className="col-start-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move.forward()}
                disabled={!isActive}
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-1 col-end-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move.right()}
                disabled={!isActive}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-3 col-end-4">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move.left()}
                disabled={!isActive}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move.backward()}
                disabled={!isActive}
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Stop Button */}
          <div className="flex justify-center mt-4">
            <Button
              variant="destructive"
              className="w-32 h-12 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => move.stop()}
              disabled={!isActive}
            >
              STOP
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Speed</span>
              <span>{speed}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <Select
                disabled={!isActive}
                value={speed.toString()}
                
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => 50 + i * 10).map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs for Basic and Advanced Actions */}
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
