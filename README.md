# Async Weather & News 

A Node.js + TypeScript project that demonstrates three styles of asynchronous programming by fetching live weather data and news headlines from public APIs.

## What This Project Demonstrates

| Style | File | Error Handling |
|---|---|---|
| Callbacks | `callbackVersion.ts` | `if (error)` checks in every callback |
| Promises | `promiseVersion.ts` | `.catch()` at the end of the chain |
| Async/Await | `asyncAwaitVersion.ts` | `try...catch` blocks |

All three versions do the same thing — fetch weather and news — but written differently to show how async programming evolved in JavaScript/TypeScript.

## APIs Used

- **Weather** — [Open-Meteo](https://open-meteo.com/) (free, no API key required)
  - Endpoint: `https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true`
  - Location: Durban, KwaZulu-Natal, South Africa
- **News** — [DummyJSON Posts](https://dummyjson.com/) (free, no API key required)
  - Endpoint: `https://dummyjson.com/posts?limit=5`

## Requirements

- Node.js 18+
- npm

## Project Structure

```
async_weather_news_api/
├─ src/
│  ├─ callbackVersion.ts      # Callbacks with nested "callback hell"
│  ├─ promiseVersion.ts       # Promises with .then() chaining
│  ├─ asyncAwaitVersion.ts    # Async/Await with try...catch
│  └─ types.ts                # Shared TypeScript types
├─ tsconfig.json
├─ package.json
└─ README.md
```

## Quick Start

```bash
# Install dependencies
npm install

# Run callback version
npm run callBack

# Run promise version
npm run promise

# Run async/await version
npm run asyncAwait
```

## Key Concepts

### Callbacks
A callback is a function you pass into another function. The outer function calls it when it is done. Each step must finish before the next one starts, which leads to nested code known as "callback hell".

```typescript
fetchWeather((error, weather) => {
  // weather is done — now fetch news inside this callback
  fetchNews((error, news) => {
    // news is done — display inside this callback
    displayNews(news!)
  })
})
```

### Promises
A Promise represents a value that will be available in the future. Instead of nesting, you chain `.then()` calls — keeping the code flat and readable. One `.catch()` handles errors for the whole chain.

```typescript
fetchWeather()
  .then((weather) => {
    displayWeather(weather)
    return fetchNews()
  })
  .then((news) => {
    displayNews(news)
  })
  .catch((error) => {
    console.error('Something went wrong:', error.message)
  })
```

### Async/Await
`async/await` is built on top of Promises — it is cleaner syntax that makes async code look synchronous. `await` pauses the function until the Promise resolves. Errors are caught with `try...catch`.

```typescript
async function main() {
  try {
    const weather = await fetchWeather()
    displayWeather(weather)

    const news = await fetchNews()
    displayNews(news)
  } catch (error) {
    console.error('Error:', (error as Error).message)
  }
}
```

### Promise.all()
Fires both requests at the same time and waits for both to finish. Faster than running them one after the other.

```typescript
const [weather, news] = await Promise.all([fetchWeather(), fetchNews()])
```

### Promise.race()
Fires both requests at the same time. Returns only the result of whichever finishes first — the other is ignored.

```typescript
const result = await Promise.race([fetchWeather(), fetchNews()])
```

## Sample Outputs

### Callback Version (`npm run callBack`)

```
=== CALLBACK VERSION ===
Starting...

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true

--- WEATHER ---
Temperature : 20.1°C
Wind Speed  : 19 km/h
Weather Code: 1
Fetching: https://dummyjson.com/posts?limit=5

--- LATEST NEWS HEADLINES ---
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

All done! (Callback version)
```

### Promise Version (`npm run promise`)

```
=== PROMISE VERSION ===

-- Part A: Chained (weather first, then news) --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true

--- WEATHER (Durban) ---
Temperature : 25.8°C
Wind Speed  : 10.6 km/h
Weather Code: 1
Fetching: https://dummyjson.com/posts?limit=5

--- LATEST NEWS HEADLINES ---
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

-- Part B: Promise.all() — both at the same time --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true
Fetching: https://dummyjson.com/posts?limit=5

--- WEATHER (Durban) ---
Temperature : 25.8°C
Wind Speed  : 10.6 km/h
Weather Code: 1

--- LATEST NEWS HEADLINES ---
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

Both loaded simultaneously with Promise.all()

-- Part C: Promise.race() — fastest response wins --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true
Fetching: https://dummyjson.com/posts?limit=5
Promise.race() winner:
{
  "latitude": -29.841827,
  "longitude": 30.976744,
  ...
}

All done! (Promise version)
```

### Async/Await Version (`npm run asyncAwait`)

```
=== ASYNC/AWAIT VERSION ===

-- Part A: One after the other --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true

--- WEATHER (Durban) ---
Temperature : 25.8°C
Wind Speed  : 10.6 km/h
Weather Code: 1
Fetching: https://dummyjson.com/posts?limit=5

--- LATEST NEWS HEADLINES ---
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

-- Part B: Promise.all() — both at the same time --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true
Fetching: https://dummyjson.com/posts?limit=5

--- WEATHER (Durban) ---
Temperature : 25.9°C
Wind Speed  : 11.9 km/h
Weather Code: 1

Both loaded simultaneously with Promise.all()

-- Part C: Promise.race() — fastest response wins --

Fetching: https://api.open-meteo.com/v1/forecast?latitude=-29.86&longitude=31.02&current_weather=true
Fetching: https://dummyjson.com/posts?limit=5
Promise.race() winner:
{
  "posts": [
    {
      "id": 1,
      "title": "His mother had always taught him",
      ...
    }
  ]
}

All done! (Async/Await version)
```

## Learning Outcomes

- Understood how callbacks work and why deeply nested callbacks become hard to read
- Learned how Promises solve callback hell by chaining `.then()` calls
- Learned how `async/await` makes async code cleaner and easier to read
- Understood `Promise.all()` for parallel requests and `Promise.race()` for fastest response
- Practised TypeScript types, the Node.js `https` module, and error handling across all three styles
