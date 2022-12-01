import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import CircularProgress from '@mui/material/CircularProgress';


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(undefined)

  async function get_count() {
    try {
      const result = await axios.get("http://localhost:8000/count/");
      return result.data.count;
    } catch (error) {
      console.log(error);
    }
  }

  async function post_count() {
    
  }

  useEffect(() => {
    get_count().then(result => {
      if (result) {
        setCount(result);
        setIsLoading(false);
      }
    })
  })

  return (
    <div className="App">
      <h1>Welcome to the web clicker!</h1>
      {isLoading && <CircularProgress />}
      <p>{count}</p>
    </div>
  );
}

export default App;
