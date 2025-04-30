// move.ts
"use server"

const BASE_URL = "http://192.168.244.191:5000"  // example: http://192.168.1.100:5000

async function sendMoveCommand(action: string) {
  const formData = new FormData();
  formData.append("action", action);
    formData.append("speed", "100");

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

export const move = {
  forward: () => sendMoveCommand("forward"),
  backward: () => sendMoveCommand("backward"),
  left: () => sendMoveCommand("left"),
  right: () => sendMoveCommand("right"),
  stop: () => sendMoveCommand("stop"),

};
