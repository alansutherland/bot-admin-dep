import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { InfoBar } from 'components';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
let Chat;
let webchat;

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push}
)

export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { showChat: false };
  }

  componentDidMount() {
    webchat = require('webchat-style');
    Chat = webchat.Chat;
    this.setState({ showChat: true });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/widgets');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogin = (event) => {
    event.preventDefault();
    window.location.href = '/loginAZ';
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
    window.location.href = config.destroySessionUrl;
  };

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '$humility'}}>
                <div className={styles.brand}/>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse eventKey={0}>
            <Nav navbar pullRight>
              {!user &&
              <LinkContainer to="/loginAZ">
                <NavItem eventKey={6} onClick={this.handleLogin}><Button bsStyle="primary">Login</Button></NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to="/widgets">
                <NavItem eventKey={7}><Button bsStyle="primary">Bots</Button></NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to="/logout">
                <NavItem eventKey={8} className="logout-link" onClick={this.handleLogout}>
                  <Button bsStyle="primary">Logout</Button>
                </NavItem>
              </LinkContainer>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          <Navbar>
            <Nav navbar pullRight>
              <Navbar.Text>
                <Navbar.Link href="https://confluence.rakuten-it.com/confluence/display/AIPP/AI+Platform+Document" target="_blank">Documentation</Navbar.Link>
              </Navbar.Text>
              <Navbar.Text>
                <Navbar.Link href="https://confluence.rakuten-it.com/confluence/pages/viewrecentblogposts.action?key=AIPP" target="_blank">Release Notes</Navbar.Link>
              </Navbar.Text>
              <Navbar.Text>
                {user &&
                  <strong>{user.name}</strong>}
              </Navbar.Text>
            </Nav>
          </Navbar>
          {this.props.children}
          {user && <div>{this.state.showChat ? <Chat directLine={{ secret: 'ILBJiGI4CYo.cwA.50M.tEVln_RmSrUwLg7EgmXEe585FsoJ24xz1NButhcVDwc' }} user={{ id: user.id, name: user.name }}/> : 'Loading Chat'}</div>}
        </div>
        <InfoBar/>
      </div>
    );
  }
}
