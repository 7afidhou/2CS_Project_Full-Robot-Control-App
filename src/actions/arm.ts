export const arm = {
  async shoulderUp() {
    await fetch("http://192.168.50.191:7000/shoulder/increase", {
      method: "POST",
    });
  },

  async shoulderDown() {
    await fetch("http://192.168.50.191:7000/shoulder/decrease", {
      method: "POST",
    });
  },

  async elbowUp() {
    await fetch("http://192.168.50.191:7000/elbow/increase", {
      method: "POST",
    });
  },

  async elbowDown() {
    await fetch("http://192.168.50.191:7000/elbow/decrease", {
      method: "POST",
    });
  },

  async gripperOpen() {
    await fetch("http://192.168.50.191:7000/gripper/open", {
      method: "POST",
    });
  },

  async gripperClose() {
    await fetch("http://192.168.50.191:7000/gripper/close", {
      method: "POST",
    });
  },
};
