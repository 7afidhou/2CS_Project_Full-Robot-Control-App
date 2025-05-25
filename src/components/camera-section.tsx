"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Maximize2, Minimize2, ZoomIn, ZoomOut, Activity, AlertCircle, CheckCircle } from "lucide-react";
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
  bbox?: [number, number, number, number];
}

interface DetectionData {
  objects: DetectedObject[];
  timestamp: number;
  detection_enabled: boolean;
  focal_length?: number;
}

interface SystemStatus {
  model_loaded: boolean;
  camera_active: boolean;
  detection_enabled: boolean;
  focal_length?: number;
  queue_size: number;
  last_objects_count: number;
}

const IP = process.env.NEXT_PUBLIC_RASBERRY_PI_IP || "localhost";
const CAMERA_PORT = process.env.NEXT_PUBLIC_CAMERA_PORT || "5050";

export default function CameraSection({ className, isActive }: CameraSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [confidence, setConfidence] = useState(0.4);
  const [frameSkip, setFrameSkip] = useState(3);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [detectionEnabled, setDetectionEnabled] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Load system status
  const loadSystemStatus = async () => {
    try {
      const response = await fetch(`http://${IP}:${CAMERA_PORT}/status`);
      if (response.ok) {
        const status: SystemStatus = await response.json();
        setSystemStatus(status);
        setDetectionEnabled(status.detection_enabled);
      }
    } catch (error) {
      console.error("Failed to load system status:", error);
    }
  };

  // Connect to detection data stream
  const connectEventSource = () => {
    if (eventSource) {
      eventSource.close();
    }

    const url = `http://${IP}:${CAMERA_PORT}/detection_data`;
    const newEventSource = new EventSource(url);

    newEventSource.onopen = () => {
      setConnectionStatus('connected');
      console.log('Connected to detection data stream');
    };

    newEventSource.onmessage = (event) => {
      try {
        const data: DetectionData = JSON.parse(event.data);
        
        // if (data.error) {
        //   console.error('Detection data error:', data.error);
        //   return;
        // }

        setDetectedObjects(data.objects || []);
        setLastUpdated(new Date().toLocaleTimeString());
        
        if (data.detection_enabled !== undefined) {
          setDetectionEnabled(data.detection_enabled);
        }
      } catch (error) {
        console.error('Error parsing detection data:', error);
      }
    };

    newEventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        setConnectionStatus('connecting');
        connectEventSource();
      }, 3000);
    };

    setEventSource(newEventSource);
  };

  useEffect(() => {
    loadSystemStatus();
    connectEventSource();
    
    // Refresh status every 10 seconds
    const statusInterval = setInterval(loadSystemStatus, 10000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(statusInterval);
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
    try {
      const response = await fetch(`http://${IP}:${CAMERA_PORT}/toggle_detection`);
      if (response.ok) {
        const data = await response.json();
        setDetectionEnabled(data.status);
        toast(`Detection ${data.status ? 'enabled' : 'disabled'}`);
      } else {
        throw new Error('Failed to toggle detection');
      }
    } catch (error) {
      console.error("Failed to toggle detection:", error);
      toast("Failed to toggle detection");
    }
  };

  const recalibrate = async () => {
    try {
      const response = await fetch(`http://${IP}:${CAMERA_PORT}/recalibrate`);
      if (response.ok) {
        toast("Focal length recalibrated successfully");
        loadSystemStatus(); // Refresh status
      } else {
        throw new Error('Failed to recalibrate');
      }
    } catch (error) {
      console.error("Failed to recalibrate:", error);
      toast("Failed to recalibrate");
    }
  };

  const updateSettings = async () => {
    const formData = new FormData();
    formData.append("confidence", confidence.toString());
    formData.append("frame_skip", frameSkip.toString());

    try {
      const response = await fetch(`http://${IP}:${CAMERA_PORT}/update_settings`, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast("Settings updated successfully");
        } else {
          toast(`Error: ${data.error || 'Unknown error'}`);
        }
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast("Failed to update settings");
    }
  };

  // Group objects by label
  const groupedObjects = detectedObjects.reduce<Record<string, DetectedObject & { count: number; totalConfidence: number }>>(
    (acc, obj) => {
      if (acc[obj.label]) {
        acc[obj.label].count += 1;
        acc[obj.label].totalConfidence += obj.confidence;
        acc[obj.label].confidence = acc[obj.label].totalConfidence / acc[obj.label].count;
      } else {
        acc[obj.label] = {
          ...obj,
          count: 1,
          totalConfidence: obj.confidence,
        };
      }
      return acc;
    },
    {}
  );

  const groupedObjectsArray = Object.values(groupedObjects);
  const totalObjects = detectedObjects.length;

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'connecting': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4" />;
      case 'connecting': return <Activity className="h-4 w-4 animate-pulse" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card ref={containerRef} className={`bg-white border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium text-gray-800">
          <Camera className="h-5 w-5 inline mr-2" />
          <Toaster />
          Live Camera Feed
        </CardTitle>
        <div className="flex gap-2 items-center">
          <div className={`flex items-center gap-1 text-sm ${getConnectionStatusColor()}`}>
            {getConnectionStatusIcon()}
            <span className="capitalize">{connectionStatus}</span>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleFullscreen} variant="outline" size="icon" className="h-8 w-8">
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
        {/* System Status */}
        {systemStatus && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${systemStatus.model_loaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Model: {systemStatus.model_loaded ? 'Loaded' : 'Not loaded'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${systemStatus.camera_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Camera: {systemStatus.camera_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${detectionEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Detection: {detectionEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Queue: {systemStatus.queue_size} frames</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Feed */}
        <div
          className={`relative bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 ${
            isFullscreen ? "w-full h-full" : "w-[640px] h-[480px]"
          }`}
        >
          <div className="absolute top-0 left-0 m-2 z-10">
            <Badge variant="secondary" className="bg-white/80">
              {systemStatus?.camera_active ? '640x480' : 'Offline'}
            </Badge>
          </div>
          {lastUpdated && (
            <div className="absolute top-0 right-0 m-2 z-10">
              <Badge variant="secondary" className="bg-white/80 text-xs">
                {lastUpdated}
              </Badge>
            </div>
          )}
          {isActive && systemStatus?.camera_active ? (
            <img
              src={`http://${IP}:${CAMERA_PORT}/video_feed`}
              alt="Live Camera Feed"
              className={`rounded-md object-cover ${
                isFullscreen ? "w-full h-screen" : "w-[640px] h-[480px]"
              }`}
              onError={(e) => {
                console.log('Video stream error - attempting to reload');
                setTimeout(() => {
                  e.currentTarget.src = `http://${IP}:${CAMERA_PORT}/video_feed?${Date.now()}`;
                }, 2000);
              }}
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
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            onClick={toggleDetection}
            variant={detectionEnabled ? "destructive" : "default"}
          >
            {detectionEnabled ? 'Disable Detection' : 'Enable Detection'}
          </Button>
          <Button onClick={recalibrate} variant="outline">
            Recalibrate
          </Button>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Confidence:</label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="1.0"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Frame Skip:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={frameSkip}
              onChange={(e) => setFrameSkip(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <Button onClick={updateSettings} variant="outline">
            Update Settings
          </Button>
        </div>

        {/* Detected Objects */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800 flex items-center justify-between">
              <span>Detected Objects</span>
              <Badge variant="outline">
                {totalObjects} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedObjectsArray.length > 0 ? (
              <div className="space-y-3">
                {groupedObjectsArray.map((object, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <div>
                        <span className="font-medium">{object.label}</span>
                        {object.distance && (
                          <span className="text-sm text-gray-500 ml-2">
                            {object.distance.toFixed(1)} cm
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {object.count}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={object.confidence * 100} className="h-2 w-24" />
                      <span className="text-sm font-medium min-w-[3rem] text-right">
                        {Math.round(object.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No objects detected</p>
                <p className="text-sm">
                  {detectionEnabled ? 'Waiting for detections...' : 'Enable detection to start'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Focal Length Info */}
        {systemStatus?.focal_length && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4" />
                <span>Focal length calibrated: {systemStatus.focal_length.toFixed(2)} px</span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}