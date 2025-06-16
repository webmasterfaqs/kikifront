"use server"

interface GNewsArticle {
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

interface GNewsResponse {
  totalArticles: number
  articles: GNewsArticle[]
}

export async function publishNewsToStrapi(prevState: any, formData: FormData) {
  try {
    // Validate formData
    if (!formData) {
      return {
        success: false,
        message: "No form data received",
      }
    }

    const query = (formData.get("query") as string) || "technology"
    const maxArticles = Number.parseInt(formData.get("maxArticles") as string) || 10
    const processImages = formData.get("processImages") === "on"

    // Validate required environment variables
    if (!process.env.GNEWS_API_KEY) {
      return {
        success: false,
        message: "GNEWS_API_KEY environment variable is not configured",
      }
    }

    if (!process.env.STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
      return {
        success: false,
        message: "STRAPI_URL or STRAPI_API_TOKEN environment variables are not configured",
      }
    }

    console.log(`Fetching news for query: "${query}", max articles: ${maxArticles}, process images: ${processImages}`)

    // Fetch news from GNews API
    const gnewsResponse = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${maxArticles}&apikey=${process.env.GNEWS_API_KEY}`,
    )

    if (!gnewsResponse.ok) {
      throw new Error(`GNews API error: ${gnewsResponse.status}`)
    }

    const newsData: GNewsResponse = await gnewsResponse.json()

    // Transform and publish each article to Strapi
    let publishedCount = 0
    let processedImages = 0
    const errors: string[] = []

    for (const article of newsData.articles) {
      try {
        let imageId = null

        // Process and upload image if enabled and image URL exists
        if (processImages && article.image) {
          try {
            const uploadedImage = await downloadAndUploadImage(article.image, article.title)
            if (uploadedImage) {
              imageId = uploadedImage.id
              processedImages++
            }
          } catch (imageError) {
            errors.push(
              `Image processing failed for "${article.title}": ${imageError instanceof Error ? imageError.message : "Unknown error"}`,
            )
          }
        }

        const strapiArticle = {
          data: {
            title: article.title,
            description: article.description,
            content: article.content,
            sourceUrl: article.url,
            imageUrl: !processImages ? article.image : undefined, // Keep original URL if not processing
            image: imageId ? imageId : undefined, // Reference to uploaded image
            publishedAt: article.publishedAt,
            sourceName: article.source.name,
            sourceWebsite: article.source.url,
            category: query,
            status: "published",
          },
        }

        const strapiResponse = await fetch(`${process.env.STRAPI_URL}/api/articles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify(strapiArticle),
        })

        console.log(`Strapi response status: ${strapiResponse.status}`)
        console.log(`Strapi response headers:`, Object.fromEntries(strapiResponse.headers.entries()))

        if (strapiResponse.ok) {
          publishedCount++
          console.log(`Successfully published: ${article.title}`)
        } else {
          const responseText = await strapiResponse.text()
          console.log(`Strapi error response:`, responseText)

          let errorMessage = `HTTP ${strapiResponse.status}: ${strapiResponse.statusText}`

          // Handle different error types
          if (strapiResponse.status === 405) {
            errorMessage = `Method Not Allowed - Check if 'articles' content type exists and API permissions are enabled`
          } else if (strapiResponse.status === 401) {
            errorMessage = `Unauthorized - Check your API token permissions`
          } else if (strapiResponse.status === 403) {
            errorMessage = `Forbidden - API token doesn't have create permissions for articles`
          } else if (strapiResponse.status === 404) {
            errorMessage = `Not Found - 'articles' content type doesn't exist`
          } else {
            try {
              const errorData = JSON.parse(responseText)
              errorMessage = `HTTP ${strapiResponse.status}: ${errorData.error?.message || errorData.message || strapiResponse.statusText}`
            } catch {
              errorMessage = `HTTP ${strapiResponse.status}: ${strapiResponse.statusText} - ${responseText.substring(0, 200)}`
            }
          }

          errors.push(`Failed to publish "${article.title}": ${errorMessage}`)
        }
      } catch (error) {
        errors.push(`Error processing "${article.title}": ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return {
      success: true,
      message: `Successfully published ${publishedCount} out of ${newsData.articles.length} articles${processImages ? ` with ${processedImages} images processed` : ""}`,
      totalFetched: newsData.articles.length,
      published: publishedCount,
      processedImages: processImages ? processedImages : undefined,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error("Error in publishNewsToStrapi:", error)
    return {
      success: false,
      message: `Failed to fetch or publish news: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: error instanceof Error ? error.stack : String(error),
    }
  }
}

async function downloadAndUploadImage(imageUrl: string, articleTitle: string): Promise<{ id: number } | null> {
  try {
    // Download the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }

    // Get the image as a blob
    const imageBlob = await imageResponse.blob()

    // Generate filename
    const filename = `${articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 50)}-${Date.now()}.jpg`

    // Create form data for Strapi upload
    const formData = new FormData()
    formData.append("files", imageBlob, filename)

    // Upload to Strapi
    const uploadResponse = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      throw new Error(`Upload failed: ${errorData.error?.message || "Unknown error"}`)
    }

    const uploadData = await uploadResponse.json()
    return uploadData[0] // Strapi returns an array, we want the first item
  } catch (error) {
    console.error("Image processing error:", error)
    throw error
  }
}
