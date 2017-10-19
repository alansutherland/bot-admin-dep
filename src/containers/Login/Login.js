import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    login: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const parser = document.createElement('a');
    parser.href = window.location.href;
    const name = parser.search.replace('?name=', '');
    if (name) {
      this.props.login(decodeURIComponent(name));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const input = this.refs.username;
    this.props.login(input.value);
    input.value = '';
  }

  render() {
    const styles = require('./Login.scss');
    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <h1>Login</h1>
      </div>
    );
  }
}
