'use client'

import { useEffect, useState , useRef} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Thermometer, Wifi } from "lucide-react"
import { getStatusColor } from "@/utils/status-utils"
import type { RobotState } from "@/types"
import { fetchRobotStatus } from "@/actions/status"
import { Button } from "@/components/ui/button";

import { Maximize2, Minimize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface RobotStatusSectionProps {
  robotState: RobotState
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


function RobotStatusSection({ robotState }: RobotStatusSectionProps) {
  const { temperature, connectionBars } = robotState
  const temperatureStatusColor = getStatusColor(temperature, 55, 45, true)
  const [isFullscreen,setIsFullscreen]=useState(false)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
  
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }, []);

const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Card ref={containerRef} className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-xl font-medium text-gray-800">Robot Status</CardTitle>
         <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleFullscreen} variant="outline" size="icon" className="h-8 w-8">
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
