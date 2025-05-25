"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
interface CameraSectionProps {
  className?: string;
  isActive: boolean;
}

interface DetectedObject {
  label: string;
  confidence: number;
  distance?: number;
}

const IP = process.env.NEXT_PUBLIC_RASBERRY_PI_IP;
const CAMERA_PORT = process.env.NEXT_PUBLIC_CAMERA_PORT;

export default function CameraSection({
  className,
  isActive,
}: CameraSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [confidence, setConfidence] = useState(0.5);
  const [frameSkip, setFrameSkip] = useState(3);

  useEffect(() => {
    console.log(IP, CAMERA_PORT);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!IP || !CAMERA_PORT) {
      console.error("IP or CAMERA_PORT environment variables are missing");
      return;
    }
    const url = `http://${IP}:${CAMERA_PORT}/detection_data`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectedObjects(data);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleDetection = async () => {
    if (!IP || !CAMERA_PORT) {
      toast("Server info missing");
      return;
    }
    try {
      const res = await fetch(`http://${IP}:${CAMERA_PORT}/toggle_detection`);
      const data = await res.json();
      toast("Detection toggled");
    } catch (err) {
      console.error("Failed to toggle detection:", err);
      toast("Failed to toggle detection");
    }
  };

  const recalibrate = async () => {
    if (!IP || !CAMERA_PORT) {
      toast("Server info missing");
      return;
    }
    try {
      await fetch(`http://${IP}:${CAMERA_PORT}/recalibrate`);
      toast("Focal length reset. Will auto-recalibrate on next detection.");
    } catch (err) {
      console.error("Failed to recalibrate:", err);
      toast("Failed to recalibrate. Please try again later.");
    }
  };

  const updateSettings = async () => {
    if (!IP || !CAMERA_PORT) {
      toast("Server info missing");
      return;
    }
    const formData = new FormData();
    formData.append("confidence", confidence.toString());
    formData.append("frame_skip", frameSkip.toString());

    try {
      await fetch(`http://${IP}:${CAMERA_PORT}/update_settings`, {
        method: "POST",
        body: formData,
      });
      toast("Settings updated successfully");
    } catch (err) {
      console.error("Failed to update settings:", err);
      toast("Failded to update settings");
    }
  };

  return (
    <Card
      ref={containerRef}
      className={`bg-white border-gray-200 shadow-sm ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium text-gray-800">
          <Camera className="h-5 w-5 inline mr-2" />
          <Toaster/>
          Live Camera Feed
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleFullscreen}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={`relative bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 ${
            isFullscreen ? "w-full h-full" : "w-[640px] h-[480px]"
          }`}
        >
          <div className="absolute top-0 left-0 m-2 z-10">
            <Badge variant="secondary" className="bg-white/80">
              720p
            </Badge>
          </div>
          {isActive ? (
            <img
              src={`http://${IP}:${CAMERA_PORT}/video_feed`}
              alt="Live Camera Feed"
              className={`rounded-md object-cover ${
                isFullscreen ? "w-full h-screen" : "w-[640px] h-[480px]"
              }`}
            />
          ) : (
            <div className="text-center">
              <div className="animate-pulse mb-2">
                <div className="h-2 w-24 bg-gray-300 rounded mx-auto"></div>
              </div>
              <p className="text-gray-500 text-sm">Camera offline</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={toggleDetection}>Toggle Detection</Button>
          <Button onClick={recalibrate}>Recalibrate</Button>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="border rounded px-2 py-1"
            placeholder="Confidence"
          />
          <input
            type="number"
            min="1"
            value={frameSkip}
            onChange={(e) => setFrameSkip(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
            placeholder="Frame Skip"
          />
          <Button onClick={updateSettings}>Update Settings</Button>
        </div>

        {/* Detected Objects */}
        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="font-semibold text-lg mb-2">Detected Objects</h2>
          {detectedObjects.length === 0 ? (
            <p className="text-sm text-gray-500">No objects detected.</p>
          ) : (
            <ul className="space-y-1">
              {detectedObjects.map((obj, idx) => (
                <li key={idx} className="text-sm text-gray-800">
                  {obj.label} —{" "}
                  {obj.distance !== undefined
                    ? `${obj.distance.toFixed(1)} cm`
                    : "N/A"}{" "}
                  — Confidence: {(obj.confidence * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
