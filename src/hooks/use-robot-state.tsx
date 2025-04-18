"use client"

import { useState, useEffect } from "react"
import type { RobotState, DetectedObject } from "@/types"

export function useRobotState() {
  const [isActive, setIsActive] = useState(true)

  const [robotState, setRobotState] = useState<RobotState>({
    batteryLevel: 78,
    connectionStatus: "Connected",
    temperature: 42,
  })

  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([
    { id: 1, name: "Person", confidence: 0.92, count: 2 },
    { id: 2, name: "Chair", confidence: 0.87, count: 3 },
    { id: 3, name: "Laptop", confidence: 0.95, count: 1 },
  ])

  // Simulate changing robot status
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setRobotState((prev) => ({
        ...prev,
        batteryLevel: Math.max(0, Math.min(100, prev.batteryLevel + (Math.random() > 0.7 ? -1 : 0))),
        temperature: Math.max(35, Math.min(60, prev.temperature + (Math.random() > 0.5 ? 1 : -1))),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isActive])

  return {
    isActive,
    setIsActive,
    robotState,
    setRobotState,
    detectedObjects,
    setDetectedObjects,
  }
}
