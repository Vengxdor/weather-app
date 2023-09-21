/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'

// http://api.weatherapi.com/v1/current.json?key=215124bb3752471baff144311231509&q=paris

const API_KEY = '215124bb3752471baff144311231509'

function useWeatherInf (searchQuery) {
  const WEATHER_API = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchQuery}`
  const [weatherInfo, setWeatherInfo] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function fetchData () {
      try {
        const res = await fetch(WEATHER_API)
        const data = await res.json()
        setError(false)
        setLoading(true)
        console.log(loading)

        if (!searchQuery || searchQuery === '') return
        if (data.error) setError(true)
        setWeatherInfo({
          icon: data.current.condition.icon,
          condition: data.current.condition.text,
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          wind_kph: data.current.wind_kph,
          city: data.location.name,
          country: data.location.country
        })
      } catch (error) {
        setError(true)
        console.error('Ocurrió un error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery])
  return { weatherInfo, error, loading }
}

function App () {
  const [typeTem, setTypeTem] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // if there's no search from the user get the location
  useEffect(() => {
    // Verificar si el navegador admite la API Geolocation
    if ('geolocation' in navigator) {
      // Obtener la ubicación del usuario
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          if (!searchQuery) setSearchQuery(`${latitude} ${longitude}`)
        },
        function (error) {
          console.error('Error al obtener la ubicación:', error)
        }
      )
    } else {
      console.error('El navegador no admite la API Geolocation.')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const filds = new window.FormData(e.target)
    const newSearchQuery = filds.get('search')
    setSearchQuery(newSearchQuery)
  }
  const weather = useWeatherInf(searchQuery)
  const info = weather.weatherInfo

  return (
    <>
      <div className='background'>
        <div className='half-one'></div>
        <div className='half-two'></div>
      </div>

      <form onSubmit={handleSubmit} className='search'>
        <input
          type='text'
          name='search'
          placeholder='Search city, zip, state, IP'
          className='search__inp'
          autoComplete='off'
          style={weather.error ? { boxShadow: 'inset 0 0 0 2px red' } : {}}
        />
        <button type='submit' className='search__btn' >
          Search
        </button>
      </form>

      <main>
        {weather.loading
          ? (
          <p>loading...</p>
            )
          : (
          <>
            <header className='header'>
              <div className='header__city'>
                <FaLocationDot />
                <h3>{info.city || 'unknow'}</h3>
              </div>
              <h3>{info.country || 'unknow'}</h3>
            </header>

            <section className='weather'>
              <h2>{info.condition || 'unknow'}</h2>
              <img
                className='weather__icon'
                src={info.icon}
                alt='current weather in this area'
              />
              <article>
                <h2 className='weather__temp'>{`${
                  typeTem ? info.temp_c : info.temp_f || 'N/A'
                }°${typeTem ? 'C' : 'F'}`}</h2>
                <div className='switch'>
                  <input
                    className='weather__switch'
                    id='switch'
                    type='checkbox'
                    checked={typeTem}
                    onChange={() => setTypeTem(!typeTem)}
                  />
                  <label htmlFor='switch' className='switch__label'></label>
                </div>
              </article>

              <div className='wind'>
                <h3>Wind Velocity</h3>
                <span>{info.wind_kph + 'kph' || 'unknow'}</span>
              </div>
            </section>
          </>
            )}
      </main>
    </>
  )
}

export default App
