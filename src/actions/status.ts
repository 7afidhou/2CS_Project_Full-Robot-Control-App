export interface RobotState {
  temperature: number
  connectionBars: number
}

export async function fetchRobotStatus(): Promise<RobotState | null> {
  try {
    const res = await fetch("http://192.168.50.191:9000/status", {
      next: { revalidate: 0 }, // disable caching in Next.js 13/14
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }

    const data = await res.json()

    return {
      temperature: data.temperature,
      connectionBars: data.connectionBars,
    }
  } catch (err) {
    console.error("Error fetching robot status:", err)
    return null
  }
}
