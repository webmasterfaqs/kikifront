echo "Checking Heroku configuration for app 'minimi'..."
echo "================================================"

# Check all environment variables
echo "Current environment variables:"
heroku config -a minimi

echo ""
echo "Checking required variables:"
echo "----------------------------"

# Check STRAPI_URL
STRAPI_URL=$(heroku config:get STRAPI_URL -a minimi)
if [ -n "$STRAPI_URL" ]; then
    echo "✅ STRAPI_URL: $STRAPI_URL"
else
    echo "❌ STRAPI_URL: Not set"
fi

# Check STRAPI_API_TOKEN
STRAPI_TOKEN=$(heroku config:get STRAPI_API_TOKEN -a minimi)
if [ -n "$STRAPI_TOKEN" ]; then
    echo "✅ STRAPI_API_TOKEN: Set (${#STRAPI_TOKEN} characters)"
else
    echo "❌ STRAPI_API_TOKEN: Not set"
fi

# Check GNEWS_API_KEY
GNEWS_KEY=$(heroku config:get GNEWS_API_KEY -a minimi)
if [ -n "$GNEWS_KEY" ]; then
    echo "✅ GNEWS_API_KEY: Set (${#GNEWS_KEY} characters)"
else
    echo "❌ GNEWS_API_KEY: Not set"
    echo "To set it, run: heroku config:set GNEWS_API_KEY=your_gnews_api_key -a minimi"
fi

echo ""
echo "Testing Strapi connection..."
echo "----------------------------"

if [ -n "$STRAPI_URL" ] && [ -n "$STRAPI_TOKEN" ]; then
    echo "Testing GET request to $STRAPI_URL/api/articles..."
    curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
        -H "Authorization: Bearer $STRAPI_TOKEN" \
        -H "Content-Type: application/json" \
        "$STRAPI_URL/api/articles?pagination[limit]=1"
else
    echo "Cannot test connection - missing STRAPI_URL or STRAPI_API_TOKEN"
fi

echo ""
echo "Next steps:"
echo "-----------"
echo "1. If GNEWS_API_KEY is missing, set it with your GNews API key"
echo "2. Deploy your app: git push heroku main"
echo "3. Test the setup using the app's setup verification tools"
