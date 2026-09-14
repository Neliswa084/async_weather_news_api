import https from 'https'

// ============================================================
// PROMISE VERSION
// A Promise represents a value that will be available in the future.
// Instead of nesting callbacks, you chain .then() calls.
// This keeps the code flat and easier to read.
// .catch() handles errors for the whole chain.
// ============================================================

// --- STEP 1: Same data types ---

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

// --- STEP 2: A helper that returns a Promise instead of using a callback ---
// The Promise either resolves (success) or rejects (failure).

function fetchData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`)

    https.get(url, (response) => {
      let rawData = ''

      response.on('data', (chunk) => {
        rawData += chunk
      })

      response.on('end', () => {
        resolve(rawData) // Success — pass the data forward
      })

      response.on('error', (error) => {
        reject(new Error(`Response error: ${error.message}`))
      })

    }).on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })
  })
}

// --- STEP 3: Fetch weather — returns a Promise ---

function fetchWeather(): Promise<WeatherData> {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true'

  return fetchData(url).then((data) => {
    return JSON.parse(data) as WeatherData
  })
}

// --- STEP 4: Fetch news — returns a Promise ---

function fetchNews(): Promise<NewsData> {
  const url = 'https://dummyjson.com/posts?limit=5'

  return fetchData(url).then((data) => {
    return JSON.parse(data) as NewsData
  })
}

// --- STEP 5: Display functions (same as before) ---

function displayWeather(weather: WeatherData): void {
  const w = weather.current_weather
  console.log('\n--- WEATHER (Durban) ---')
  console.log(`Temperature : ${w.temperature}°C`)
  console.log(`Wind Speed  : ${w.windspeed} km/h`)
  console.log(`Weather Code: ${w.weathercode}`)
}

function displayNews(news: NewsData): void {
  console.log('\n--- LATEST NEWS HEADLINES ---')
  news.posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`)
  })
}

// ============================================================
// PART A: Chained Promises — one after the other
// Notice: no nesting. Each .then() flows into the next.
// ============================================================

console.log('=== PROMISE VERSION ===')
console.log('\n-- Part A: Chained (weather first, then news) --\n')

fetchWeather()
  .then((weather) => {
    displayWeather(weather)
    return fetchNews() // Return next promise — passes it to the next .then()
  })
  .then((news) => {
    displayNews(news)
  })
  .catch((error) => {
    // One .catch() handles errors from any step in the chain
    console.error('Something went wrong:', error.message)
  })
  .then(() => {

    // ============================================================
    // PART B: Promise.all() — run BOTH at the same time
    // Weather and news are fetched simultaneously.
    // We wait for BOTH to finish before displaying anything.
    // Faster than doing them one after the other.
    // ============================================================

    console.log('\n-- Part B: Promise.all() — both at the same time --\n')

    return Promise.all([fetchWeather(), fetchNews()])
      .then(([weather, news]) => {
        displayWeather(weather)
        displayNews(news)
        console.log('\nBoth loaded simultaneously with Promise.all()')
      })
      .catch((error) => {
        console.error('Promise.all() failed:', error.message)
      })
  })
  .then(() => {

    // ============================================================
    // PART C: Promise.race() — get the FASTEST response
    // Whichever request finishes first wins.
    // The result is only from the winner — the other is ignored.
    // ============================================================

    console.log('\n-- Part C: Promise.race() — fastest response wins --\n')

    return Promise.race([fetchWeather(), fetchNews()])
      .then((result) => {
        console.log('Promise.race() winner:')
        console.log(JSON.stringify(result, null, 2).slice(0, 300)) // Show first part of the result
        console.log('\nAll done! (Promise version)')
      })
      .catch((error) => {
        console.error('Promise.race() failed:', error.message)
      })
  })
