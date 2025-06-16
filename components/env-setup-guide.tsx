"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EnvSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Environment Variables Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-orange-800">
            <strong>Environment variables not detected!</strong> You need to configure your Strapi connection details.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Step 1: Get Your Strapi Details</h4>
            <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
              <div>
                <strong className="text-sm">Strapi URL:</strong>
                <p className="text-xs text-gray-600 mt-1">This is your Strapi server URL. Examples:</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>
                    • Local development: <code>http://localhost:1337</code>
                  </li>
                  <li>
                    • Production: <code>https://your-strapi-app.herokuapp.com</code>
                  </li>
                  <li>
                    • Custom domain: <code>https://api.yoursite.com</code>
                  </li>
                </ul>
              </div>

              <div>
                <strong className="text-sm">API Token:</strong>
                <p className="text-xs text-gray-600 mt-1">Create an API token in Strapi:</p>
                <ol className="text-xs text-gray-600 ml-4 space-y-1 list-decimal">
                  <li>Go to Settings → API Tokens in your Strapi admin</li>
                  <li>Click "Create new API Token"</li>
                  <li>Name it "News Publisher"</li>
                  <li>Set Token type to "Full access" or "Custom"</li>
                  <li>If Custom, enable "Create" permission for Articles</li>
                  <li>Copy the generated token</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Step 2: Set Environment Variables</h4>
            <div className="bg-gray-50 border rounded-lg p-3 space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">For v0/Vercel deployment:</p>
                <div className="bg-white border rounded p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs">STRAPI_URL=your_strapi_url_here</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("STRAPI_URL=")}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs">STRAPI_API_TOKEN=your_api_token_here</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("STRAPI_API_TOKEN=")}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">For local development (.env.local):</p>
                <div className="bg-white border rounded p-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs">
                      STRAPI_URL=http://localhost:1337
                      <br />
                      STRAPI_API_TOKEN=your_api_token_here
                      <br />
                      GNEWS_API_KEY=your_gnews_key_here
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          "STRAPI_URL=http://localhost:1337\nSTRAPI_API_TOKEN=your_api_token_here\nGNEWS_API_KEY=your_gnews_key_here",
                        )
                      }
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Step 3: Verify Your Strapi Setup</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 mb-2">Make sure your Strapi has:</p>
              <ul className="text-sm text-blue-700 space-y-1 ml-4">
                <li>• An "articles" content type with the required fields</li>
                <li>• API permissions enabled for the articles content type</li>
                <li>• CORS configured to allow requests from your domain</li>
                <li>• The server is running and accessible</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Step 4: Test Your Configuration</h4>
            <p className="text-xs text-gray-600 mb-2">
              After setting up your environment variables, refresh this page and run the setup test again.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            <strong>Need help with Strapi setup?</strong>
            <div className="mt-2 space-y-1">
              <a
                href="https://docs.strapi.io/dev-docs/api/rest/guides/understanding-populate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
              >
                <ExternalLink className="w-3 h-3" />
                Strapi API Documentation
              </a>
              <a
                href="https://docs.strapi.io/user-docs/settings/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
              >
                <ExternalLink className="w-3 h-3" />
                API Tokens Guide
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
