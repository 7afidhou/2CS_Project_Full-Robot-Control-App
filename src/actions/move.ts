

const BASE_IP = process.env.NEXT_PUBLIC_RASBERRY_PI_IP ;
const PORT = process.env.NEXT_PUBLIC_CAR_PORT ;
const BASE_URL = `http://${BASE_IP}:${PORT}`; 

async function sendMoveCommand(action: string, speed: number) {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("speed", speed.toString());

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to send ${action} command`);
    }
    console.log(`Successfully sent ${action}`);
  } catch (error) {
    console.error(`Error sending ${action} command:`, error);
  }
}

export const move = (speed: number) => ({
  forward: () => sendMoveCommand("forward", speed),
  backward: () => sendMoveCommand("backward", speed),
  left: () => sendMoveCommand("left", speed),
  right: () => sendMoveCommand("right", speed),
  stop: () => sendMoveCommand("stop", speed),
});
