"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Camera, Shield, Zap, Play, Pause, Upload, Download, Settings, BarChart3 } from "lucide-react"

export default function ObjectDetectionApp() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState([
    { id: 1, name: "Person", confidence: 0.95, x: 120, y: 80, width: 60, height: 120 },
    { id: 2, name: "Car", confidence: 0.87, x: 300, y: 200, width: 100, height: 60 },
    { id: 3, name: "Bicycle", confidence: 0.73, x: 50, y: 180, width: 40, height: 80 },
  ])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startDetection = async () => {
    setIsDetecting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsDetecting(false)
    }
  }

  const stopDetection = () => {
    setIsDetecting(false)
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  useEffect(() => {
    const drawDetections = () => {
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          detectedObjects.forEach((obj) => {
            ctx.strokeStyle = "#f59e0b"
            ctx.lineWidth = 2
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)

            ctx.fillStyle = "#164e63"
            ctx.fillRect(obj.x, obj.y - 25, obj.name.length * 8 + 20, 25)

            ctx.fillStyle = "#ffffff"
            ctx.font = "14px sans-serif"
            ctx.fillText(`${obj.name} ${(obj.confidence * 100).toFixed(0)}%`, obj.x + 5, obj.y - 8)
          })
        }
      }
    }

    if (isDetecting) {
      const interval = setInterval(drawDetections, 100)
      return () => clearInterval(interval)
    }
  }, [isDetecting, detectedObjects])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-foreground">VisionAI</h1>
                <p className="text-sm text-muted-foreground">Real-Time Object Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                OpenCV Powered
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Detection Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Live Detection Feed</CardTitle>
                <CardDescription>Real-time object detection using advanced OpenCV algorithms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: isDetecting ? "block" : "none" }}
                  />
                  <canvas ref={canvasRef} width={640} height={360} className="absolute inset-0 w-full h-full" />
                  {!isDetecting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Click Start Detection to begin</p>
                        <Button onClick={startDetection} className="bg-primary text-primary-foreground">
                          <Play className="w-4 h-4 mr-2" />
                          Start Detection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {isDetecting && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <Button onClick={stopDetection} variant="destructive">
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Detection
                      </Button>
                      <Badge variant="outline" className="bg-accent text-accent-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Live
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detection Results */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Detection Results</CardTitle>
                <CardDescription>Objects detected in the current frame</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detectedObjects.map((obj) => (
                    <div key={obj.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-semibold">{obj.id}</span>
                        </div>
                        <div>
                          <p className="font-medium">{obj.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Position: ({obj.x}, {obj.y})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Progress value={obj.confidence * 100} className="w-20" />
                          <span className="text-sm font-medium">{(obj.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Detection Engine</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frame Rate</span>
                  <span className="text-sm font-medium">30 FPS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing Time</span>
                  <span className="text-sm font-medium">33ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Objects Detected</span>
                  <span className="text-sm font-medium">{detectedObjects.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Advanced Security</p>
                    <p className="text-xs text-muted-foreground">Enterprise-grade surveillance capabilities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Real-Time Processing</p>
                    <p className="text-xs text-muted-foreground">Instant object detection and tracking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Analytics Dashboard</p>
                    <p className="text-xs text-muted-foreground">Comprehensive reporting and insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                System is operating normally. All detection algorithms are functioning optimally.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
