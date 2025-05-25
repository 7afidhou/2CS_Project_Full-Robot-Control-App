

const BASE_URL = "http://192.168.50.191:5000"  

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
