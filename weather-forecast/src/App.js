import './App.css';
import { Search, MapPin, Wind } from 'react-feather';
import getWeather from './api/api';
import { useState } from 'react';
import dateFormat from 'dateformat';
import { FaLocationDot } from "react-icons/fa6";
// import { IoLocationOutline } from "react-icons/io5";


function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const getWeatherbyCity = async () => {
    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  }



  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  }

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log(latitude, longitude);
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            setCity(data.address.city || data.address.town || data.address.village);
            await getWeatherbyCity();
          } catch (err) {
            setError("Failed to fetch location");
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError("User denied the request for Geolocation.");
          } else {
            setError(err.message);
          }
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }

  return (
    <>
      <div className="app">
        <label>
          <h1>
            Weather App 
            <FaLocationDot className='Location-icon' onClick={handleClick} />
          </h1>
          
        </label>
        <div className="input-wrapper">
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder='Enter City Name' 
          />
          <button onClick={getWeatherbyCity}>
            <Search />
          </button>
        </div>

        {weather && weather.weather ? (
          <div className="content">
            <div className="location d-flex">
              <MapPin />
              <h2>{weather.name} <span>({weather.sys.country})</span></h2>
            </div>
            <p className="datetext">{renderDate()}</p>

            <div className="weatherdesc d-flex flex-c">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt="Weather icon" 
              />
              <h3>{weather.weather[0].description}</h3>
            </div>

            <div className="tempstats d-flex flex-c">
              <h1>{weather.main.temp} <span>&deg;C</span></h1>
              <h3>Feels Like {weather.main.feels_like} <span>&deg;C</span></h3>
            </div>

            <div className="windstats d-flex">
              <Wind />
              <h3>Wind is {weather.wind.speed} Knots in {weather.wind.deg}&deg;</h3>
            </div>
          </div>
        ) : (
          <div className="content">
            <h4>No Data found!</h4>
          </div>
        )}
        {error && <h2>Error: {error}</h2>}
      </div>
    </>
  );
}

export default App;