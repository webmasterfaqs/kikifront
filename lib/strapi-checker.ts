"use server"

export async function checkStrapiContentType() {
  if (!process.env.STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return {
      success: false,
      error: "Missing Strapi URL or API token",
    }
  }

  try {
    // First, try to get the content type schema
    const schemaResponse = await fetch(`${process.env.STRAPI_URL}/api/content-type-builder/content-types`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    })

    console.log(`Schema check status: ${schemaResponse.status}`)

    // Check if articles endpoint exists by trying a GET request
    const articlesResponse = await fetch(`${process.env.STRAPI_URL}/api/articles?pagination[limit]=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    console.log(`Articles endpoint status: ${articlesResponse.status}`)

    if (articlesResponse.status === 404) {
      return {
        success: false,
        error: "Articles content type does not exist",
        suggestion: "Create an 'articles' content type in your Strapi Content-Type Builder",
      }
    }

    if (articlesResponse.status === 403) {
      return {
        success: false,
        error: "API token doesn't have permission to access articles",
        suggestion: "Check your API token permissions in Strapi Settings → API Tokens",
      }
    }

    if (articlesResponse.status === 401) {
      return {
        success: false,
        error: "Invalid API token",
        suggestion: "Verify your STRAPI_API_TOKEN is correct",
      }
    }

    if (!articlesResponse.ok) {
      const errorText = await articlesResponse.text()
      return {
        success: false,
        error: `HTTP ${articlesResponse.status}: ${errorText}`,
      }
    }

    // Test if we can create articles by checking permissions
    const testArticle = {
      data: {
        title: "Test Article - Please Delete",
        description: "This is a test article created by the News Publisher setup checker",
        content: "This article can be safely deleted.",
        status: "draft",
      },
    }

    const createTestResponse = await fetch(`${process.env.STRAPI_URL}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(testArticle),
    })

    console.log(`Create test status: ${createTestResponse.status}`)

    if (createTestResponse.status === 405) {
      return {
        success: false,
        error: "Method Not Allowed - Cannot create articles",
        suggestion: "Enable 'create' permission for articles in Settings → Roles → Public or your API token role",
      }
    }

    if (createTestResponse.status === 400) {
      const errorData = await createTestResponse.json()
      return {
        success: false,
        error: `Validation error: ${JSON.stringify(errorData.error)}`,
        suggestion: "Check if all required fields are present in your articles content type",
      }
    }

    if (createTestResponse.ok) {
      // Clean up the test article
      const testData = await createTestResponse.json()
      if (testData.data?.id) {
        await fetch(`${process.env.STRAPI_URL}/api/articles/${testData.data.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          },
        })
      }

      return {
        success: true,
        message: "Articles content type is properly configured and accessible",
      }
    }

    const errorText = await createTestResponse.text()
    return {
      success: false,
      error: `Failed to create test article: HTTP ${createTestResponse.status} - ${errorText}`,
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
