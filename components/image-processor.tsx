"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ImageIcon, Download } from "lucide-react"

interface ProcessedImage {
  original: string
  processed: Blob
  filename: string
}

export function ImageProcessor() {
  const [imageUrl, setImageUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = async () => {
    if (!imageUrl) return

    setIsProcessing(true)
    setError(null)
    setProcessedImage(null)

    try {
      // Create a new image element
      const img = new Image()
      img.crossOrigin = "anonymous" // Enable CORS

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

      // Create canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Calculate new dimensions (max 800x600)
      const maxWidth = 800
      const maxHeight = 600
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob!),
          "image/jpeg",
          0.85, // 85% quality
        )
      })

      const filename = `processed-image-${Date.now()}.jpg`

      setProcessedImage({
        original: imageUrl,
        processed: blob,
        filename,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadProcessedImage = () => {
    if (!processedImage) return

    const url = URL.createObjectURL(processedImage.processed)
    const a = document.createElement("a")
    a.href = url
    a.download = processedImage.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Processor Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isProcessing}
          />
        </div>

        <Button onClick={processImage} disabled={!imageUrl || isProcessing} className="w-full">
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Image...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Process Image
            </>
          )}
        </Button>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {processedImage && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Image processed successfully! Size: {(processedImage.processed.size / 1024).toFixed(1)} KB
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Original</h4>
                <img
                  src={processedImage.original || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Processed</h4>
                <img
                  src={URL.createObjectURL(processedImage.processed) || "/placeholder.svg"}
                  alt="Processed"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            </div>

            <Button onClick={downloadProcessedImage} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Processed Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
