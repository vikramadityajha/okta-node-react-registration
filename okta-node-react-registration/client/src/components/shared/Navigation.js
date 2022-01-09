import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

export default withAuth(class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render() {

    const authNav = this.state.authenticated ?
        <div className="container">
        <Link className="navbar-brand" to={"/profile"}>Okta-COI</Link>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to={"/profile"}>Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="javascript:void(0)" onClick={() => this.props.auth.logout()}>Logout</a>
            </li>
          </ul>
        </div>
      </div> : 
        <div className="container">
        <a className="navbar-brand" href="javascript:void(0)" onClick={() => this.props.auth.login()}>Okta-COI</a>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="javascript:void(0)" onClick={() => this.props.auth.login()}>Login</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/register"}>Sign up</Link>
            </li>
          </ul>
        </div>
        </div>

    return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        {authNav}
      </nav>
    )
  }
});