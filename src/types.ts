export interface RobotState {
    batteryLevel: number
    connectionStatus: string
    temperature: number
  }
  
  export interface DetectedObject {
    id: number
    name: string
    confidence: number
    count: number
  }
  