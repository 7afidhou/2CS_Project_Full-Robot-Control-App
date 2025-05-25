"use client";
import { move } from "@/actions/move";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gauge } from "lucide-react";
//import { Value } from "@radix-ui/react-select";
import { arm } from "@/actions/arm";
interface RobotControlSectionProps {
  isActive: boolean;
}

export default function RobotControlSection({
  isActive,
}: RobotControlSectionProps) {
  const [speed, setSpeed] = useState(100);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">
          Robot Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Direction Controls */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            <div className="col-start-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move(speed).forward()}
                disabled={!isActive}
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-1 col-end-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move(speed).right()}
                disabled={!isActive}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-3 col-end-4">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move(speed).left()}
                disabled={!isActive}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="col-start-2">
              <Button
                variant="secondary"
                className="w-full aspect-square active:bg-fuchsia-100"
                onClick={() => move(speed).backward()}
                disabled={!isActive}
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Stop Button */}
          <div className="flex justify-center mt-4">
            <Button
              variant="destructive"
              className="w-32 h-12 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => move(speed).stop()}
              disabled={!isActive}
            >
              STOP
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Speed</span>
              <span>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  <Select
                    disabled={!isActive}
                    value={speed.toString()}
                    onValueChange={(newValue) => {
                      setSpeed(Number(newValue));
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => 50 + i * 10).map(
                        (value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}%
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </span>
            </div>
          </div>

          {/* Tabs for Basic and Advanced Actions */}
          <CardTitle className="text-xl font-medium text-gray-800">
            Arm Control
          </CardTitle>

          <Tabs defaultValue="advanced">
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.shoulderUp()}
                  className="active:bg-fuchsia-100"
                >
                  Arm Up
                </Button>
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.shoulderDown()}
                  className="active:bg-fuchsia-100"
                >
                  Arm Down
                </Button>
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.elbowUp()}
                  className="active:bg-fuchsia-100"
                >
                  Arm Extend
                </Button>
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.elbowDown()}
                  className="active:bg-fuchsia-100"
                >
                  Arm Shrink
                </Button>
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.gripperOpen()}
                  className="active:bg-fuchsia-100"
                >
                  Gripper Open
                </Button>
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => arm.gripperClose()}
                  className="active:bg-fuchsia-100"
                >
                  Gripper Close
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
