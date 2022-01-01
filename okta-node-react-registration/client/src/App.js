import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Switch, Link } from "react-router-dom";

import Navigation from './components/shared/Navigation';
import RegistrationForm from './components/auth/RegistrationForm';
import config from './app.config';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/auth/ProfilePage';
import './App.css';

export default class App extends Component {
  render() {
    return (
     <div className="App">
     <Navigation />
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route path="/" exact render={() => <LoginPage baseUrl={config.url} />} />
            <Route path="/login" exact render={() => <LoginPage baseUrl={config.url} />} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <Route path="/register" exact component={RegistrationForm} />
            <SecureRoute path="/profile" exact component={ProfilePage} />
          </Switch>
        </div>
      </div>

      </div>
    );
  }
}