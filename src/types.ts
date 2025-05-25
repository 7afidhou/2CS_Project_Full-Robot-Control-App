export interface RobotState {
    connectionBars: number
    temperature: number
  }
  
  export interface DetectedObject {
    id: number
    name: string
    confidence: number
    count: number
  }
  