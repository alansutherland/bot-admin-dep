import React, {Component, PropTypes} from 'react';
import {
  Modal
} from 'react-bootstrap';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import {OwnersForm} from 'components';
import config from '../../config';
import axios from 'axios';
import { ADMINISTRATOR } from 'react-native-dotenv';

let botid = null;

@connect(
  state => ({
    user: state.auth.user
  }),
  {initialize})
export default class Owners extends Component {

  static propTypes = {
    initialize: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: true
    };
  }

  componentDidMount() {
    const parser = document.createElement('a');
    parser.href = window.location.href;
    const uarr = parser.pathname.split('/');
    botid = uarr[2];

    const admin = ADMINISTRATOR.split(',');

    axios.get(`${config.botAdminAPI}/bots/${botid}/owners`).then((res)=>{
      if (res.data.users.includes(this.props.user.email) === false && admin.includes(this.props.user.email) === false) {
        window.location.href = '/widgets';
      } else {
        this.setState({
          showModal: false
        });
      }
    }) .catch((res) =>{
      console.log(res);
    });

    this.props.initialize('owners', {
      id: botid
    });
  }

  handleSubmit = (data) => {
    const parser = document.createElement('a');
    parser.href = window.location.href;
    const uarr = parser.pathname.split('/');
    botid = uarr[2];

    axios.get(`${config.botAdminAPI}/bots/${botid}/owners`).then((res)=>{
      const users = res.data.users;
      users.push(data.emailadd);
      axios.post(`${config.botAdminAPI}/bots/${botid}/owners`,
        { users: users },
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }).then((resPost)=>{
          console.log(resPost);
        }).catch((resPost) => {
          console.log(resPost);
        });
    }).catch((res) =>{
      console.log(res);
    });
    window.location.href = `/bots/${botid}/owners`;
    this.props.initialize('owners', {});
  }

  render() {
    return (
      <div className="container">
        <Modal bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static" show={this.state.showModal}>
          <Modal.Body>
            <h4><center>Security Checking...</center></h4>
          </Modal.Body>
        </Modal>
        <h1>Owners</h1>
        <Helmet title="Owners"/>
        <OwnersForm onSubmit={this.handleSubmit}/>
      </div>
    );
  }
}
