"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Settings, AlertTriangle } from "lucide-react"
import { testSetup } from "@/lib/test-setup"

export function SetupTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const runTest = async () => {
    setIsLoading(true)
    try {
      const result = await testSetup()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : "Test failed",
        allGood: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Setup Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Test your configuration before publishing news articles.</p>

        <Button onClick={runTest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Configuration...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Test Setup
            </>
          )}
        </Button>

        {testResult && (
          <div className="space-y-3">
            {testResult.error ? (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800">Test failed: {testResult.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert
                  className={testResult.allGood ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}
                >
                  <AlertDescription className={testResult.allGood ? "text-green-800" : "text-yellow-800"}>
                    {testResult.allGood ? "✅ All systems ready!" : "⚠️ Some issues found"}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Environment Variables:</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResult.checks.gnewsApiKey ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">GNews API Key</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {testResult.checks.strapiUrl ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Strapi URL</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {testResult.checks.strapiToken ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Strapi API Token</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">API Connections:</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResult.gnewsConnection ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">GNews API Connection</span>
                        {testResult.gnewsError && (
                          <span className="text-xs text-red-600">({testResult.gnewsError})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {testResult.strapiConnection ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Strapi Connection</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Strapi Information */}
                  {testResult.strapiDetails && (
                    <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
                      <h5 className="font-medium text-sm">Strapi Connection Details:</h5>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>URL:</strong> {testResult.strapiDetails.url}
                        </div>
                        <div>
                          <strong>Token Length:</strong> {testResult.strapiDetails.tokenLength} characters
                        </div>
                        <div>
                          <strong>Response Status:</strong> {testResult.strapiDetails.responseStatus}
                        </div>
                        {testResult.strapiError && (
                          <div className={testResult.strapiConnection ? "text-green-700" : "text-red-700"}>
                            <strong>Details:</strong> {testResult.strapiError}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Troubleshooting Tips */}
                  {!testResult.allGood && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-blue-800">
                        <div className="space-y-2">
                          <strong>Troubleshooting Tips:</strong>
                          <ul className="text-sm space-y-1 ml-4">
                            {!testResult.strapiConnection && (
                              <>
                                <li>• Check if your Strapi server is running</li>
                                <li>• Verify the Strapi URL is correct (include http:// or https://)</li>
                                <li>• Ensure the API token has proper permissions</li>
                                <li>• Check if the 'articles' content type exists in Strapi</li>
                                <li>• Verify CORS settings in Strapi allow your domain</li>
                              </>
                            )}
                            {!testResult.gnewsConnection && <li>• Verify your GNews API key is valid and active</li>}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
