import https from 'https'
import type {WeatherData , NewsData} from './types'

// ASYNC/AWAIT VERSION
// async/await is built on top of Promises — it's just cleaner syntax.
// Instead of chaining .then(), you write code that LOOKS synchronous
// but is still asynchronous under the hood.
// "await" pauses the function until the Promise resolves.
// Errors are caught with try...catch instead of .catch()




//   Helper — returns a Promise (await needs a Promise) 

function fetchData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`)

    https.get(url, (response) => {
      let rawData = ''

      response.on('data', (chunk) => {
        rawData += chunk
      })

      response.on('end', () => {
        resolve(rawData)
      })

      response.on('error', (error) => {
        reject(new Error(`Response error: ${error.message}`))
      })

    }).on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })
  })
}

//  Fetch weather — async function 
// "async" means this function always returns a Promise
// "await" waits for fetchData to finish before moving to the next line

async function fetchWeather(): Promise<WeatherData> {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true'
  const data = await fetchData(url)
  return JSON.parse(data) as WeatherData
}

//  Fetch news — async function 

async function fetchNews(): Promise<NewsData> {
  const url = 'https://dummyjson.com/posts?limit=5'
  const data = await fetchData(url)
  return JSON.parse(data) as NewsData
}

//  Display functions 

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

//  Main function — runs everything 
// async/await must live inside an async function

async function main() {
  console.log('=== ASYNC/AWAIT VERSION ===')

  
  // PART A: One after the other — weather first, then news
  // Clean and readable — looks like normal synchronous code
  

  console.log('\n-- Part A: One after the other --\n')

  try {
    const weather = await fetchWeather()
    displayWeather(weather)

    const news = await fetchNews()
    displayNews(news)

  } catch (error) {
    // One try...catch handles errors from both fetches
    console.error('Error:', (error as Error).message)
  }

  
  // PART B: Promise.all() with async/await
  // Both requests fire at the same time faster than Part A
  // We await both together
  

  console.log('\n-- Part B: Promise.all() — both at the same time --\n')

  try {
    const [weather, news] = await Promise.all([fetchWeather(), fetchNews()])
    displayWeather(weather)
    displayNews(news)
    console.log('\nBoth loaded simultaneously with Promise.all()')

  } catch (error) {
    console.error('Promise.all() error:', (error as Error).message)
  }

  
  // PART C: Promise.race() with async/await
  // Both requests fire only the fastest result is used
  

  console.log('\n-- Part C: Promise.race() — fastest response wins --\n')

  try {
    const result = await Promise.race([fetchWeather(), fetchNews()])
    console.log('Promise.race() winner:')
    console.log(JSON.stringify(result, null, 2).slice(0, 300))

  } catch (error) {
    console.error('Promise.race() error:', (error as Error).message)
  }

  console.log('\nAll done! (Async/Await version)')
}

//  Call the main function
main()
