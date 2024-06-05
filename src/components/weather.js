import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiFog, WiStrongWind, WiHumidity } from 'react-icons/wi';
import { FiSearch } from 'react-icons/fi';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

const neonAnimation = keyframes`
  0% {
    filter: brightness(1) blur(0) contrast(1);
    box-shadow: none;
  }
  100% {
    filter: brightness(1) blur(0.1px) contrast(1.0);
    box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ffcc, 0 0 20px #00ffcc, 0 0 25px #00ffcc, 0 0 30px #00ffcc, 0 0 35px #00ffcc, 0 0 40px #00ffcc, 0 0 45px #00ffcc;
  }
`;

const neonHoverAnimation = keyframes`
  0% {
    filter: brightness(1) blur(0) contrast(1);
    box-shadow: none;
  }
  100% {
    filter: brightness(1.2) blur(0.1px) contrast(1.5);
    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ffcc, 0 0 40px #00ffcc, 0 0 50px #00ffcc, 0 0 60px #00ffcc, 0 0 70px #00ffcc, 0 0 80px #00ffcc, 0 0 90px #00ffcc;
  }
`;

const dotAnimation = keyframes`
  0%, 20% {
    color: rgba(255, 255, 255, 0.2);
    text-shadow: 0.25em 0 0 rgba(255, 255, 255, 0.2), 0.5em 0 0 rgba(255, 255, 255, 0.2);
  }
  40% {
    color: white;
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(255, 255, 255, 0.2);
  }
  60% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
  }
  80%, 100% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
  }
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  font-family: 'Arial', sans-serif;
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
`;

const BlurCard = styled.div`
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid #00ffcc;
  animation: ${neonAnimation} 1s alternate infinite ease-in-out;

  &:hover {
    animation: ${neonHoverAnimation} 1s alternate infinite ease-in-out;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  margin-bottom: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #ff7e5f;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #feb47b;
  }
`;

const WeatherInfo = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const WeatherIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ff4e42;
  margin-top: 1rem;
`;

const LoadingDots = styled.div`
  font-size: 2rem;
  &::after {
    content: '...';
    animation: ${dotAnimation} 1s steps(5, end) infinite;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: center;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 2rem;
  margin: 0 10px;
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1.5) blur(0.2px) contrast(2);
  }
`;

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '5bae7d5db0a82f823ca12abd3cacc0f8'; // Replace with your OpenWeatherMap API key
  const UNSPLASH_ACCESS_KEY = '-UfJacCLluSwbFNYmcvn7L-hIrSHluq_DOVF7anZXpQ'; // Replace with your Unsplash API key

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });
      setWeatherData(response.data);
      setError('');
      fetchBackgroundImage(city);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid API key');
        } else if (error.response.status === 404) {
          setError('City not found');
        } else {
          setError('Error: ' + error.response.status);
        }
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);
      } else if (error.request) {
        setError('No response from the server');
        console.log('Error request:', error.request);
      } else {
        setError('Error: ' + error.message);
        console.log('Error message:', error.message);
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackgroundImage = async (city) => {
    setLoading(true); // Set loading to true before making the request
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/random`, {
        params: {
          query: city,
          client_id: UNSPLASH_ACCESS_KEY,
        },
      });
      setBackgroundImage(response.data.urls.full);
    } catch (error) {
      console.log('Error fetching background image:', error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchWeather();
    } else {
      setError('Please enter a city name');
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WiDaySunny />;
      case 'Clouds':
        return <WiCloud />;
      case 'Rain':
        return <WiRain />;
      case 'Snow':
        return <WiSnow />;
      case 'Fog':
      case 'Mist':
        return <WiFog />;
      default:
        return <WiDaySunny />;
    }
  };

  useEffect(() => {
    fetchBackgroundImage('weather');
  }, []);

  return (
    <WeatherContainer style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Title>Weather App</Title>
      <BlurCard>
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <SearchButton onClick={handleSearch}>
          <FiSearch />
        </SearchButton>

        {loading && <LoadingDots>Loading</LoadingDots>}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {weatherData && (
          <WeatherInfo>
            <WeatherIcon>{getWeatherIcon(weatherData.weather[0].main)}</WeatherIcon>
            <h2 style={{ color: 'black' }}>{weatherData.name}</h2>
<p style={{ color: 'black' }}>{weatherData.weather[0].description}</p>
<h2 style={{ color: 'black' }}>Temperature: {weatherData.main.temp} °C</h2>
<p style={{ color: 'black' }}>Humidity: {weatherData.main.humidity} % <WiHumidity style={{ fontSize: '1.5rem' }} /></p>
<p style={{ color: 'black' }}>Wind Speed: {weatherData.wind.speed} m/s <WiStrongWind style={{ fontSize: '1.5rem' }} /></p>

          </WeatherInfo>
        )}

        <SocialIcons>
          <SocialIcon href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </SocialIcon>
          <SocialIcon href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </SocialIcon>
        </SocialIcons>
      </BlurCard>
    </WeatherContainer>
  );
};

export default Weather;
