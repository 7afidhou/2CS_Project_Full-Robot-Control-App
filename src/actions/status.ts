export interface RobotState {
  temperature: number;
  connectionBars: number;
}

const BASE_IP = process.env.NEXT_PUBLIC_RASBERRY_PI_IP ;
const STATUS_PORT = process.env.NEXT_PUBLIC_STATUS_PORT ;
const STATUS_URL = `http://${BASE_IP}:${STATUS_PORT}/status`;

export async function fetchRobotStatus(): Promise<RobotState | null> {
  try {
    const res = await fetch(STATUS_URL, {
      next: { revalidate: 0 }, // disable caching in Next.js 13/14
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch robot status: HTTP ${res.status}`);
    }

    const data = await res.json();

    return {
      temperature: data.temperature,
      connectionBars: data.connectionBars,
    };
  } catch (err) {
    console.error("Error fetching robot status:", err);
    return null;
  }
}
