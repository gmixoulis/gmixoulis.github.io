const fs = require('fs');
const axios = require('axios');

const API_KEY = process.env.SERPAPI_KEY; // Replace with your key
const SCHOLAR_ID = 'nk0lq8YAAAAJ';

const fetchPublications = async () => {
  try {
    const url = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_ID}&api_key=${API_KEY}&no_cache=true`;
    const response = await axios.get(url);
    const articles = response.data.articles || [];
    fs.writeFileSync(
      'public/publications.json',
      JSON.stringify(articles, null, 2)
    );
    console.log('✅ Publications saved via SerpAPI');
  } catch (err) {
    console.error('❌ Failed to fetch via SerpAPI', err.message);
  }
};

fetchPublications();
