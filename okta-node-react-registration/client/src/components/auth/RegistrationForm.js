import React from 'react'; 
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';


import config from '../../app.config';

export default withAuth(class RegistrationForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      EmailConsent: true,
      sessionToken: null
    };
    this.oktaAuth = new OktaAuth({ url: config.url });
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);   
    this.handleEmailConsentChange = this.handleEmailConsentChange.bind(this); 
  }

  async checkAuthentication() {
    const sessionToken = await this.props.auth.getIdToken();
    if (sessionToken) {
      this.setState({ sessionToken });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  handleFirstNameChange(e) {
    this.setState({firstName:e.target.value});
  }

  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }
  handleEmailConsentChange(e) {
    console.log("inside handleEmailConsentChange: e.target: ",e.target);
    console.log("inside handleEmailConsentChange: this.state.EmailConsent: ",this.state.EmailConsent);
    this.setState({ EmailConsent: e.target.checked });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit: ",JSON.stringify(this.state));
    fetch('/api/users', { 
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then(user => {
      console.log("user 1: ",user);
      this.oktaAuth.signIn({
        username: this.state.email,
        password: this.state.password
      })
      .then(res => this.setState({
        sessionToken: res.sessionToken
      }));
    })
    .catch(err => console.log);
  }

  render(){
    if (this.state.sessionToken) {
      return <Redirect to={{ pathname: '/profile' }} />;
    }

    return(

      <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" 
                        id="firstName" 
                        value={this.state.firstName} 
                        className="form-control" 
                        onChange={this.handleFirstNameChange} 
                        placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" 
                        id="lastName" 
                        value={this.state.lastName} 
                        className="form-control" 
                        onChange={this.handleLastNameChange} 
                        placeholder="Last name" />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input id="email" 
                        value={this.state.email}  
                        type="email" 
                        className="form-control" 
                        onChange={this.handleEmailChange} 
                        placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" 
                        id="password" 
                        value={this.state.password} 
                        className="form-control" 
                        onChange={this.handlePasswordChange} 
                        placeholder="Enter password" />
                </div>
                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="emailConsentCheck" 
                          checked={this.state.EmailConsent}
                          onChange = {this.handleEmailConsentChange}/>
                        <label className="custom-control-label custom-control-label-checkbox" htmlFor="emailConsentCheck">I would like to receive email updates about DemoCorp products and services</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already have an account? <a href="/login">Login here</a>
                </p>
                
            </form>
    );
  }

});
