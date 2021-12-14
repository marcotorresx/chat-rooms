import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import {BrowserRouter as Router} from 'react-router-dom'
import AuthProvider from './Auth/AuthProvider'
import RoomsProvider from './RoomsData/RoomsProvider'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <RoomsProvider>
          <App/>
        </RoomsProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
