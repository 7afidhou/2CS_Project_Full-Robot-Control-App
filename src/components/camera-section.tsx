import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

interface CameraSectionProps {
  className?: string;
  isActive: boolean;
}

export default function CameraSection({
  className,
  isActive,
}: CameraSectionProps) {
  return (
    <Card className={`bg-white border-gray-200 shadow-sm ${className} `}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium text-gray-800">
          <Camera className="h-5 w-5 inline mr-2" />
          Live Camera Feed
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mx-auto">
        <div
          className="relative bg-gray-100 rounded-md flex items-center justify-center border border-gray-200"
          style={{ width: "640px", height: "480px" }}
        >
          <div className="absolute top-0 left-0 m-2">
            <Badge variant="secondary" className="bg-white/80">
              720p
            </Badge>
          </div>

          {isActive ? (
            <img
              src="http://192.168.50.191:8080/video_feed"
              width="640"
              height="480"
              alt="Live Camera Feed"
              className="rounded-md object-cover"
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
      </CardContent>
    </Card>
  );
}
