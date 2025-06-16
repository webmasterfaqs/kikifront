"use client"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Newspaper, CheckCircle, AlertCircle } from "lucide-react"
import { publishNewsToStrapi } from "@/lib/actions"
import { ImageProcessingInfo } from "@/components/image-processing-info"
import { ImageProcessor } from "@/components/image-processor"
import { SetupTest } from "@/components/setup-test"
import { EnvSetupGuide } from "@/components/env-setup-guide"
import { StrapiChecker } from "@/components/strapi-checker"

export default function NewsPublisher() {
  const [state, action, isPending] = useActionState(publishNewsToStrapi, {
    success: false,
    message: "",
    totalFetched: 0,
    published: 0,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-full">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">News Publisher</h1>
          <p className="text-lg text-gray-600">Fetch the latest news from GNews API and publish to your Strapi CMS</p>
        </div>

        {/* Environment Setup Guide - Show first if not configured */}
        <EnvSetupGuide />

        {/* Setup Test */}
        <SetupTest />

        {/* Strapi Checker */}
        <StrapiChecker />

        {/* Publishing Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Publish News Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="query">Search Query</Label>
                <Input
                  id="query"
                  name="query"
                  placeholder="e.g., technology, business, sports"
                  defaultValue="technology"
                  disabled={isPending}
                />
                <p className="text-sm text-gray-500">Enter keywords to search for relevant news articles</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxArticles">Maximum Articles</Label>
                <Input
                  id="maxArticles"
                  name="maxArticles"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue="10"
                  disabled={isPending}
                />
                <p className="text-sm text-gray-500">Number of articles to fetch and publish (1-100)</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="processImages"
                    name="processImages"
                    type="checkbox"
                    className="rounded border-gray-300"
                    disabled={isPending}
                  />
                  <Label htmlFor="processImages" className="text-sm font-medium">
                    Process and optimize images
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Download, resize (max 800x600), compress, and upload images to Strapi media library
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing News...
                  </>
                ) : (
                  <>
                    <Newspaper className="w-4 h-4 mr-2" />
                    Fetch & Publish News
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {state && state.message && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {state.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Publication Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
              {!state.success && state.error && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">Show technical details</summary>
                  <pre className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2 overflow-auto">{state.error}</pre>
                </details>
              )}

              {state.success && state.totalFetched && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{state.totalFetched}</div>
                    <div className="text-sm text-gray-600">Articles Fetched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{state.published}</div>
                    <div className="text-sm text-gray-600">Successfully Published</div>
                  </div>
                  {state.processedImages !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{state.processedImages}</div>
                      <div className="text-sm text-gray-600">Images Processed</div>
                    </div>
                  )}
                </div>
              )}

              {state.errors && state.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-800">Errors encountered:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {state.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Required Strapi Content Type Setup:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-blue-800 font-medium">
                  Create a new Content Type called "Article" in your Strapi admin panel:
                </p>
                <ol className="text-sm text-blue-700 space-y-2 ml-4 list-decimal">
                  <li>Go to Content-Type Builder in your Strapi admin</li>
                  <li>Click "Create new collection type"</li>
                  <li>Name it "Article" (API ID: articles)</li>
                  <li>Add the following fields:</li>
                </ol>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h5 className="font-medium text-sm mb-3">Field Configuration:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border">
                      <strong>title</strong> - Text
                      <div className="text-gray-600">Required, Short text</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>description</strong> - Text
                      <div className="text-gray-600">Long text</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>content</strong> - Rich Text
                      <div className="text-gray-600">Rich text editor</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>sourceUrl</strong> - Text
                      <div className="text-gray-600">Short text, URL format</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>imageUrl</strong> - Text
                      <div className="text-gray-600">Long text, for original URLs</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border">
                      <strong>image</strong> - Media
                      <div className="text-gray-600">Single media, Images only</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>publishedAt</strong> - Date
                      <div className="text-gray-600">DateTime with time</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>sourceName</strong> - Text
                      <div className="text-gray-600">Short text</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>sourceWebsite</strong> - Text
                      <div className="text-gray-600">Short text, URL format</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>category</strong> - Text
                      <div className="text-gray-600">Short text</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <strong>status</strong> - Enumeration
                      <div className="text-gray-600">Values: draft, published</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> After creating the content type, make sure to:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 ml-4 space-y-1">
                  <li>• Go to Settings → Roles → Public → Articles</li>
                  <li>• Enable "create" permission for the API to work</li>
                  <li>• Or use an authenticated API token with proper permissions</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>API Endpoint:</strong> Once created, your articles will be available at:
                  <br />
                  <code className="bg-green-100 px-2 py-1 rounded text-xs">YOUR_STRAPI_URL/api/articles</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ImageProcessingInfo />
        <ImageProcessor />
      </div>
    </div>
  )
}
