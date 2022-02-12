import React from 'react';
import { withAuth } from '@okta/okta-react';
import { toast } from 'react-toastify';
import ToastNotification from '../common/ToastNotification';
import 'react-toastify/dist/ReactToastify.css';

export default withAuth(class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null , buttonDisabled: false,};
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.handleEmailConsentChange = this.handleEmailConsentChange.bind(this);
    this.handlePostalMailConsentCheck = this.handlePostalMailConsentCheck.bind(this);
    this.handlePostalMailConsentaddress = this.handlePostalMailConsentaddress.bind(this);
    this.handleDataSharingConsentCheck = this.handleDataSharingConsentCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
  }

  async getCurrentUser() {
    this.props.auth.getUser()
      .then(user => {
        console.log("user: ",user);
        fetch('/api/users/get', { 
          method: 'GET', 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'username': user.preferred_username,
          },
        }).then(userDetail => {
         userDetail.json().then(userDetails =>{
          console.log("userDetail 2: ",userDetails);
          this.setState({user : userDetails});
        })
        })
        .catch(err => console.log);
        
      }
        );
  }

  


  handleEmailConsentChange(e) {
    let user = {...this.state.user};
    user.profile.EmailConsent = e.target.checked;
    this.setState({user});
  }

  handlePostalMailConsentCheck(e) {
    let user = {...this.state.user};
    user.profile.PostalMailConsent = e.target.checked;
    this.setState({user});
  }

  handlePostalMailConsentaddress(e) {
    let user = {...this.state.user};
    user.profile.PostalMailConsentaddress = e.target.value;
    this.setState({user});
  }
  handleDataSharingConsentCheck(e){
    let user = {...this.state.user};
    user.profile.DataSharingConsent = e.target.checked;
    this.setState({user});
  }
  

  handleSubmit(e) {
    this.setState({buttonDisabled: true});
    e.preventDefault();
    console.log("handleSubmit: ",JSON.stringify(this.state));
    fetch('/api/users/update', { 
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then(user => {
     toast.success('Update Successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
      this.setState({buttonDisabled: false});
    })
    .catch(err => this.setState({buttonDisabled: false}));
    
  }

  handleDeactivate(e) {
    this.setState({buttonDisabled: true});
    e.preventDefault();
    this.props.auth.logout();
    fetch('/api/users/deactivate', { 
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then(user => {
        this.setState({buttonDisabled: false});
    })
    .catch(err => this.setState({buttonDisabled: false}));
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  render() {
    if (!this.state.user) return null;
    return (
        <form onSubmit={this.handleSubmit}>
        <h4>Welcome {this.state.user.profile.firstName}!</h4>
        <div className='space'></div>
        <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="emailConsentCheck" 
                          checked={this.state.user.profile.EmailConsent}
                          onChange = {this.handleEmailConsentChange}/>
                        <label className="custom-control-label custom-control-label-checkbox" htmlFor="emailConsentCheck">I would like to receive email updates about DemoCorp products and services</label>
                    </div>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="postalMailConsentCheck" 
                          checked={this.state.user.profile.PostalMailConsent}
                          onChange = {this.handlePostalMailConsentCheck}/>
                        <label className="custom-control-label custom-control-label-checkbox" htmlFor="postalMailConsentCheck">I would like to receive postal mail from DemoCorp</label>
                    </div>
                </div>

                <div className="form-group">
                    <label className='inline-block-label'>Address</label>
                    <input type="text" 
                        id="postalMailConsentaddress" 
                        value={this.state.user.profile.PostalMailConsentaddress} 
                        className="inline-block-form-control" 
                        onChange={this.handlePostalMailConsentaddress} 
                        placeholder="Address" 
                        disabled = {(this.state.user.profile.PostalMailConsent)? "" : "disabled"}/>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="dataSharingConsentCheck" 
                          checked={this.state.user.profile.DataSharingConsent}
                          onChange = {this.handleDataSharingConsentCheck}/>
                        <label className="custom-control-label custom-control-label-checkbox" htmlFor="dataSharingConsentCheck">DemoCorp can share my usage information with partners to tailor my user experience</label>
                    </div>
                </div>
                <div className="btn-in-row">
                  <button onClick = {this.handleSubmit} disabled={this.state.buttonDisabled} className="btn btn-update">Update</button>
                  <button onClick = {this.handleDeactivate} disabled={this.state.buttonDisabled} className="btn btn-deactivate">Deactivate my account</button>
                </div>
                <ToastNotification/>
                
        </form>

      
    )
  }
});