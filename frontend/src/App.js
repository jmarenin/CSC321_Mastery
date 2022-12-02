import './App.css';
import React from 'react';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

import CircularProgress from '@mui/material/CircularProgress';
import {
  Grid,
  Paper,
  IconButton,
  Button,
  Modal,
  Box,
  ButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const HOST = "http://localhost:8000";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



function App() {
  const [countIsLoading, setCountIsLoading] = useState(true);
  const [count, setCount] = useState(undefined);
  const [errorLog, setErrorLog] = useState("");
  const [token, setToken] = useState('None');
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  const [modalOpen, setModalOpen] = useState(false);

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
      setCount(result.data.count);
      setErrorLog("");
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
    get_token().then(result => {
      if (result) {
        setCookie('csrftoken', result);
        setToken(result);
        setErrorLog("");
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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>Warning!</h1>
          <h3>You currently have a token. Would you like to send the request with or without it?</h3>
          <ButtonGroup variant="contained">
            <Button onClick={() => {
              axios.defaults.withCredentials = true;
              post_count();
              setModalOpen(false);
            }}>
              With
            </Button>
            <Button onClick={() => {
              axios.defaults.withCredentials = false;
              post_count();
              setModalOpen(false);
            }}>Without</Button>
          </ButtonGroup>
        </Box>

      </Modal>
      <div style={{'width':'75%', 'marginTop': '15px', 'marginLeft': 'auto', 'marginRight': 'auto'}}>
        <Grid container 
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Item>
              <h1>Welcome to the web clicker!</h1>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
              <div style={{'textAlign': 'left'}}>
                <h2>Total clicks:</h2>
              </div>
              {countIsLoading && <CircularProgress />}
              {!countIsLoading && <p style={{fontSize: '80px', margin: 0}}>{count}</p>}
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <div>
                <h2>Want to Contribute?</h2>
              </div>
              <div style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}>
                <IconButton sx={{display: 'flex', alignItems: 'center'}} onClick={() => {
                  if (token === 'None')
                    post_count()
                  else
                    setModalOpen(true);
                }}>
                    <AddCircleRoundedIcon color='primary' sx={{fontSize: '80px'}}/>
                </IconButton>
              </div>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <div>
                <h2>Can't click? Maybe get a token.</h2>
              </div>
              <div style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}>
                <Button onClick={request_for_token} size='large' variant='contained'>Give me a token!</Button>
              </div>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
              <h2>Current Token:</h2>
              <p>{token}</p>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <p style={{'color': 'red'}}>Error Log: {errorLog}</p>
            </Item>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
