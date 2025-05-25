const BASE_IP = process.env.NEXT_PUBLIC_RASBERRY_PI_IP;
const ARM_PORT = process.env.NEXT_PUBLIC_ARM_PORT ;
const BASE_URL = `http://${BASE_IP}:${ARM_PORT}`;

export const arm = {
  async shoulderUp() {
    await fetch(`${BASE_URL}/shoulder/increase`, { method: "POST" });
  },

  async shoulderDown() {
    await fetch(`${BASE_URL}/shoulder/decrease`, { method: "POST" });
  },

  async elbowUp() {
    await fetch(`${BASE_URL}/elbow/increase`, { method: "POST" });
  },

  async elbowDown() {
    await fetch(`${BASE_URL}/elbow/decrease`, { method: "POST" });
  },

  async gripperOpen() {
    await fetch(`${BASE_URL}/gripper/open`, { method: "POST" });
  },

  async gripperClose() {
    await fetch(`${BASE_URL}/gripper/close`, { method: "POST" });
  },
};
