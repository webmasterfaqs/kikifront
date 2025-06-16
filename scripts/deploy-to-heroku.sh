echo "Deploying News Publisher to Heroku..."
echo "====================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - News Publisher app"
fi

# Check if heroku remote exists
if ! git remote | grep -q heroku; then
    echo "Adding Heroku remote..."
    heroku git:remote -a minimi
fi

# Set required environment variables if not already set
echo "Checking environment variables..."

# STRAPI_URL (already set)
STRAPI_URL=$(heroku config:get STRAPI_URL -a minimi)
echo "STRAPI_URL: $STRAPI_URL"

# STRAPI_API_TOKEN (already set)
STRAPI_TOKEN=$(heroku config:get STRAPI_API_TOKEN -a minimi)
if [ -n "$STRAPI_TOKEN" ]; then
    echo "STRAPI_API_TOKEN: Set (${#STRAPI_TOKEN} characters)"
fi

# Check GNEWS_API_KEY
GNEWS_KEY=$(heroku config:get GNEWS_API_KEY -a minimi)
if [ -z "$GNEWS_KEY" ]; then
    echo "⚠️  GNEWS_API_KEY not set!"
    echo "Please set it with: heroku config:set GNEWS_API_KEY=your_api_key -a minimi"
    read -p "Do you want to set it now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GNews API key: " gnews_key
        heroku config:set GNEWS_API_KEY=$gnews_key -a minimi
    fi
fi

echo ""
echo "Deploying to Heroku..."
git add .
git commit -m "Deploy News Publisher with environment configuration" || echo "No changes to commit"
git push heroku main

echo ""
echo "Deployment complete!"
echo "Your app should be available at: https://minimi-b031d5829d1e.herokuapp.com"
echo ""
echo "Next steps:"
echo "1. Visit your app and run the setup verification"
echo "2. Make sure your Strapi server is running and accessible"
echo "3. Test the news publishing functionality"
