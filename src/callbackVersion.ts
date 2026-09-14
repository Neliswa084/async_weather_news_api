import https from 'https'

// ============================================================
// CALLBACK VERSION
// A callback is a function you pass into another function.
// The outer function calls it when it's done.
// Each step must finish before the next one starts.
// This creates "callback hell" — nested functions inside functions.
// ============================================================

// --- STEP 1: Define the shape of our data ---

type WeatherData = {
  current_weather: {
    temperature: number
    windspeed: number
    weathercode: number
  }
}

type NewsPost = {
  id: number
  title: string
  body: string
}

type NewsData = {
  posts: NewsPost[]
}

// --- STEP 2: A helper function that makes an HTTPS GET request ---
// It takes a URL and a callback.
// When the request is done, it calls the callback with the data.
// If something goes wrong, it calls the callback with an error.

function fetchData(url: string, callback: (error: Error | null, data?: string) => void): void {
  console.log(`Fetching: ${url}`)

  https.get(url, (response) => {
    let rawData = ''

    // Data comes in chunks — collect them
    response.on('data', (chunk) => {
      rawData += chunk
    })

    // When all chunks are received, call the callback with the full data
    response.on('end', () => {
      callback(null, rawData)
    })

    // If the request itself fails
    response.on('error', (error) => {
      callback(new Error(`Response error: ${error.message}`))
    })

  }).on('error', (error) => {
    callback(new Error(`Request failed: ${error.message}`))
  })
}

// --- STEP 3: Fetch weather using a callback ---

function fetchWeather(callback: (error: Error | null, weather?: WeatherData) => void): void {
  // Durban coordinates: latitude -29.86, longitude 31.02
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true'

  fetchData(url, (error, data) => { 
    if (error) {
      callback(new Error(`Weather fetch failed: ${error.message}`))
      return
    }

    const weather: WeatherData = JSON.parse(data!)
    callback(null, weather)
  })
}

// --- STEP 4: Fetch news using a callback ---

function fetchNews(callback: (error: Error | null, news?: NewsData) => void): void {
  const url = 'https://dummyjson.com/posts?limit=5'

  fetchData(url, (error, data) => {
    if (error) {
      callback(new Error(`News fetch failed: ${error.message}`))
      return
    }

    const news: NewsData = JSON.parse(data!)
    callback(null, news)
  })
}

// --- STEP 5: Display weather results ---

function displayWeather(weather: WeatherData): void {
  const w = weather.current_weather
  console.log('\n--- WEATHER (Durban) ---')
  console.log(`Temperature : ${w.temperature}°C`)
  console.log(`Wind Speed  : ${w.windspeed} km/h`)
  console.log(`Weather Code: ${w.weathercode}`)
}

// --- STEP 6: Display news results ---

function displayNews(news: NewsData): void {
  console.log('\n--- LATEST NEWS HEADLINES ---')
  news.posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`)
  })
}

// --- STEP 7: Run everything with callbacks (callback hell) ---
// Notice how each step is nested inside the previous one.
// This is callback hell — the code keeps moving to the right.

console.log('=== CALLBACK VERSION ===')
console.log('Starting...\n')

fetchWeather((weatherError, weather) => {
  if (weatherError) {
    console.error('Error fetching weather:', weatherError.message)
    return
  }

  // Weather is done — now fetch news inside this callback
  displayWeather(weather!)

  fetchNews((newsError, news) => {
    if (newsError) {
      console.error('Error fetching news:', newsError.message)
      return
    }

    // News is done — display it inside this callback
    displayNews(news!)

    console.log('\nAll done! (Callback version)')
  })
})
