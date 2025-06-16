"use server"

export async function testSetup() {
  // Check environment variables
  const checks = {
    gnewsApiKey: !!process.env.GNEWS_API_KEY,
    strapiUrl: !!process.env.STRAPI_URL,
    strapiToken: !!process.env.STRAPI_API_TOKEN,
  }

  // Debug environment variables (safely)
  const envDebug = {
    gnewsKeyLength: process.env.GNEWS_API_KEY ? process.env.GNEWS_API_KEY.length : 0,
    strapiUrlValue: process.env.STRAPI_URL || "Not set",
    strapiTokenLength: process.env.STRAPI_API_TOKEN ? process.env.STRAPI_API_TOKEN.length : 0,
    nodeEnv: process.env.NODE_ENV || "Not set",
  }

  let strapiConnection = false
  let strapiError = ""
  const strapiDetails = {
    url: process.env.STRAPI_URL || "Not set",
    tokenLength: process.env.STRAPI_API_TOKEN ? process.env.STRAPI_API_TOKEN.length : 0,
    responseStatus: 0,
    responseText: "",
  }

  // Test Strapi connection only if we have the required variables
  if (checks.strapiUrl && checks.strapiToken) {
    try {
      console.log(`Testing Strapi connection to: ${process.env.STRAPI_URL}/api/articles`)

      const response = await fetch(`${process.env.STRAPI_URL}/api/articles?pagination[limit]=1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      strapiDetails.responseStatus = response.status
      strapiConnection = response.ok

      if (!response.ok) {
        const responseText = await response.text()
        strapiDetails.responseText = responseText

        try {
          const errorData = JSON.parse(responseText)
          strapiError = `HTTP ${response.status}: ${errorData.error?.message || errorData.message || response.statusText}`
        } catch {
          strapiError = `HTTP ${response.status}: ${response.statusText} - ${responseText.substring(0, 200)}`
        }
      } else {
        const data = await response.json()
        strapiError = `Connection successful! Found ${data.data?.length || 0} articles.`
      }
    } catch (error) {
      strapiError = `Network error: ${error instanceof Error ? error.message : "Connection failed"}`
      console.error("Strapi connection error:", error)
    }
  } else {
    strapiError = "Missing Strapi URL or API token"
  }

  // Test GNews API
  let gnewsConnection = false
  let gnewsError = ""

  if (checks.gnewsApiKey) {
    try {
      const response = await fetch(`https://gnews.io/api/v4/search?q=test&max=1&apikey=${process.env.GNEWS_API_KEY}`)
      gnewsConnection = response.ok

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        gnewsError = `HTTP ${response.status}: ${errorData.error || response.statusText}`
      } else {
        gnewsError = "Connection successful!"
      }
    } catch (error) {
      gnewsError = `Network error: ${error instanceof Error ? error.message : "Connection failed"}`
    }
  } else {
    gnewsError = "GNews API key not configured"
  }

  return {
    checks,
    envDebug,
    strapiConnection,
    strapiError,
    strapiDetails,
    gnewsConnection,
    gnewsError,
    allGood: checks.gnewsApiKey && checks.strapiUrl && checks.strapiToken && strapiConnection && gnewsConnection,
  }
}
