
export type WeatherData = {
  current_weather: {
    temperature: number
    windspeed: number
    weathercode: number
  }
}

export type NewsPost = {
  id: number
  title: string
  body: string
}

export type NewsData = {
  posts: NewsPost[]
}