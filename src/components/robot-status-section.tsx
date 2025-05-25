'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Thermometer, Wifi } from "lucide-react"
import { getStatusColor } from "@/utils/status-utils"
import type { RobotState } from "@/types"
import { fetchRobotStatus } from "@/actions/status"
interface RobotStatusSectionProps {
  robotState: RobotState
}

function RobotStatusSection({ robotState }: RobotStatusSectionProps) {
  const { temperature, connectionBars } = robotState

  const temperatureStatusColor = getStatusColor(temperature, 55, 45, true)

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">Robot Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Temperature</span>
            <span className={temperatureStatusColor}>{temperature}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className={`h-5 w-5 ${temperatureStatusColor}`} />
            <Progress value={(temperature - 35) * (100 / 35)} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Connection</span>
            <span className="text-green-600">{connectionBars}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-600" />
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < connectionBars ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">System Alerts</span>
          </div>
          {temperature > 50 ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm p-2 bg-amber-50 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <span>High temperature warning</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 text-sm p-2 bg-green-50 rounded-md">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              <span>All systems normal</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function RobotStatusFetcher() {
  const [robotState, setRobotState] = useState<RobotState>({
    temperature: 0,
    connectionBars: 0,
  })

  async function updateStatus() {
    const status = await fetchRobotStatus()
    if (status) setRobotState(status)
  }

  useEffect(() => {
    updateStatus() // fetch immediately
    const interval = setInterval(updateStatus, 5000) // fetch every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return <RobotStatusSection robotState={robotState} />
}
