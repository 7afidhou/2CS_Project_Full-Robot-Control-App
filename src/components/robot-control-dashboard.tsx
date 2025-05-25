"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import CameraSection from "@/components/camera-section";
import RobotStatusSection from "@/components/robot-status-section";
import RobotControlSection from "@/components/robot-control-section";
import ObjectDetectionSection from "@/components/object-detection-section";
import { useRobotState } from "@/hooks/use-robot-state";

import { db } from "../../lib/firebase";
import { getDocs, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RobotControlDashboard() {
  const { isActive, setIsActive, robotState, detectedObjects } = useRobotState();

  // On mount: fetch docs and add a new one
  useEffect(() => {
    // const fetchAndLogDetectedObjects = async () => {
    //   try {

    //     // Fetch and log all detected_objects
    //     const querySnapshot = await getDocs(collection(db, "detected_objects"));
    //     const data = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     console.log("📦 Detected Objects:", data);
    //   } catch (error) {
    //     console.error("🔥 Firestore error:", error);
    //   }
    // };

    // fetchAndLogDetectedObjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Robot Control Dashboard</h1>
        <div className="flex items-center gap-2">
          {/* <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Online" : "Offline"}
          </Badge>
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsActive(!isActive)}
          >
            <Power className="h-4 w-4 mr-2" />
            {isActive ? "Shutdown" : "Power On"}
          </Button> */}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CameraSection className="lg:col-span-2" isActive={isActive} />
        <RobotControlSection isActive={isActive} />
        <RobotStatusSection />
        <ObjectDetectionSection
          className="lg:col-span-2"
          detectedObjects={detectedObjects}
        />
      </div>
    </div>
  );
}
