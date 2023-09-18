/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaWheatAwnCircleExclamation } from 'react-icons/fa6'

import withResults from './mooks/withResults.json'
/*
*/
const query = 'paris'
const API_KEY = '215124bb3752471baff144311231509'
const WEATHER_API = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`

function useWeatherInf () {
  const [weatherInfo, setWeatherInfo] = useState({})
  useEffect(() => {
    fetch(WEATHER_API)
      .then(res => res.json())
      .then(data => {
        setWeatherInfo({
          icon: data.current.condition.icon,
          condition: data.current.condition.text,
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          wind_kph: data.current.wind_kph,
          city: data.location.name,
          country: data.location.country
        })
      })
  }, [])
  return weatherInfo
}

function App () {
  const info = useWeatherInf()
  const [typeTem, setTypeTem] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const filds = new window.FormData(e.target)
    const query = filds.get('search')
    console.log(query)
  }

  return (
    <>
      <div className='background'>
        <div className='half-one'></div>
        <div className='half-two'></div>
      </div>

      <form onSubmit={handleSubmit} className='search'>
        <input type="text" name="search" placeholder='Search city, zip, state, IP' className="search__inp" autoComplete='off' />
        <button type="submit" className='search__btn'>Search </button>
      </form>

      <main>
        <header className='header'>
          <div className='header__city'>
            <FaLocationDot />
            <h3>{info.city}</h3>
          </div>
          <h3>{info.country}</h3>
        </header>

        <section className='weather'>
          <h2>{info.condition}</h2>
          <img
            className='weather__icon'
            src={info.icon}
            alt='current weather'
          />
          <article>
            <h2 className='weather__temp'>{`${
              typeTem
                ? info.temp_c
                : info.temp_f
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
            <span>{`${info.wind_kph}kph`}</span>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
