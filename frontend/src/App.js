import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import cookie, { useCookies } from 'react-cookie';

import CircularProgress from '@mui/material/CircularProgress';

const HOST = "http://localhost:8000";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

function App() {
  const [tokenIsLoading, setTokenIsLoading] = useState(false);
  const [countIsLoading, setCountIsLoading] = useState(true);
  const [count, setCount] = useState(undefined);
  const [errorLog, setErrorLog] = useState("");
  const [token, setToken] = useState(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  async function get_count() {
    try {
      const result = await axios.get(`${HOST}/count/`);
      return result.data.count;
    } catch (error) {
      console.log(error);
    }
  }

  async function post_count() {
    try {
      const result = await axios.patch(`${HOST}/count/`);
      // const response = await fetch(`${HOST}/count/`, {
      //   method: 'PATCH',
      //   headers: {
      //     'X-CSRFToken': token
      //   },
      //   // credentials: 'include'
      // });
      // const result = await response.json()
      return result.data.count;
    } catch (error) {
      setErrorLog(error.message);
    }
  }

  async function get_token() {
    try {
      const result = await axios.get(`${HOST}/csrf/`);
      return result.data.token;
    } catch (error) {
      console.log(error);
    }
  }

  async function request_for_token() {
    setTokenIsLoading(true);
    get_token().then(result => {
      if (result) {
        setCookie('csrftoken', result);
        setToken(result);
        setTokenIsLoading(false);
      }
    })
  }

  useEffect(() => {
    removeCookie('csrftoken');
  }, []);

  useEffect(() => {
    get_count().then(result => {
      if (result) {
        setCount(result);
        setCountIsLoading(false);
      }
    })
  }, [])

  return (
    <div className="App">
      <h1>Welcome to the web clicker!</h1>
      {countIsLoading && <CircularProgress />}
      <p>{count}</p>
      <p>{errorLog}</p>
      <button onClick={post_count}>Clicker</button>
      <button onClick={request_for_token}>Get a token!</button>
      <p>{token}</p>
    </div>
  );
}

export default App;
