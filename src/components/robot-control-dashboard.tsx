"use client";

import CameraSection from "@/components/camera-section";
import RobotStatusSection from "@/components/robot-status-section";
import RobotControlSection from "@/components/robot-control-section";
import { useRobotState } from "@/hooks/use-robot-state";

export default function RobotControlDashboard() {
  const { isActive } = useRobotState();

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Robot Control Dashboard
        </h1>
        <div className="flex items-center gap-2"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CameraSection className="lg:col-span-2" isActive={isActive} />
        <div className="flex flex-col justify-between gap-6">
          <RobotControlSection isActive={true} />
          <RobotStatusSection />
        </div>
      </div>
    </div>
  );
}
