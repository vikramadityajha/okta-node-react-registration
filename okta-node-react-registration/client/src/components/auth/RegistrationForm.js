import React from 'react'; 
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';

import config from '../../app.config';

export default withAuth(class RegistrationForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
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

  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/users', { 
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then(user => {
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
     // this.props.auth.redirect({ sessionToken: this.state.sessionToken });
      return null;
    }

    return(
      // <form onSubmit={this.handleSubmit}>
      //   <div className="form-element">
      //     <label>Email:</label>
      //     <input type="email" id="email" value={this.state.email} 
      //     onChange={this.handleEmailChange}/>
      //   </div>
      //   <div className="form-element">
      //     <label>First Name:</label>
      //     <input type="text" id="firstName" value={this.state.firstName} 
      //     onChange={this.handleFirstNameChange} />
      //   </div>
      //   <div className="form-element">
      //     <label>Last Name:</label>
      //     <input type="text" id="lastName" value={this.state.lastName} 
      //     onChange={this.handleLastNameChange} />
      //   </div>
      //   <div className="form-element">
      //     <label>Password:</label>
      //     <input type="password" id="password" value={this.state.password} 
      //     onChange={this.handlePasswordChange} />
      //   </div>
      //   <input type="submit" id="submit" value="Register"/>
      // </form>


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

                <button type="submit" className="btn btn-primary btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="/login">Login?</a>
                </p>
            </form>
    );
  }

});
