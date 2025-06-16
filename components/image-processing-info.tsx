import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Download, Upload, CheckCircle } from "lucide-react"

export function ImageProcessingInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Image Processing Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Direct Download</h4>
              <p className="text-xs text-gray-600">Downloads images directly from news sources with proper headers</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Format Preservation</h4>
              <p className="text-xs text-gray-600">Maintains original image format and quality during transfer</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Upload className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Strapi Integration</h4>
              <p className="text-xs text-gray-600">Upload images directly to your Strapi media library</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <ImageIcon className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Fallback Support</h4>
              <p className="text-xs text-gray-600">Falls back to original image URL if download fails</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Browser-Compatible:</strong> This version downloads and uploads images without server-side
            processing, making it compatible with all deployment environments.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Make sure your Strapi content type has both an <code>imageUrl</code> field (Text) and
            an <code>image</code> field (Media) to support both processed and original images.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
