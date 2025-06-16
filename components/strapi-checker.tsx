"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, AlertTriangle } from "lucide-react"
import { checkStrapiContentType } from "@/components/strapi-checker"

export function StrapiChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [checkResult, setCheckResult] = useState<any>(null)

  const runCheck = async () => {
    setIsLoading(true)
    try {
      const result = await checkStrapiContentType()
      setCheckResult(result)
    } catch (error) {
      setCheckResult({
        success: false,
        error: error instanceof Error ? error.message : "Check failed",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Strapi Content Type Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Verify that your Strapi 'articles' content type is properly configured and accessible.
        </p>

        <Button onClick={runCheck} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking Strapi Configuration...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Check Articles Content Type
            </>
          )}
        </Button>

        {checkResult && (
          <div className="space-y-3">
            <Alert className={checkResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {checkResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <AlertDescription className={checkResult.success ? "text-green-800" : "text-red-800"}>
                {checkResult.success ? checkResult.message : checkResult.error}
              </AlertDescription>
            </Alert>

            {!checkResult.success && checkResult.suggestion && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-blue-800">
                  <strong>Suggestion:</strong> {checkResult.suggestion}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
