import React, {Component, PropTypes} from 'react';
import {
  Button,
  Modal
} from 'react-bootstrap';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import {ChannelsForm} from 'components';
import config from '../../config';
import axios from 'axios';
import confirm from 'react-confirm2';
import { ADMINISTRATOR } from 'react-native-dotenv';

let botid = null;
let channelid = null;

@connect(
  state => ({
    user: state.auth.user
  }),
  {initialize})
export default class Channels extends Component {

  static propTypes = {
    initialize: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      channelExist: false,
      showModal: true
    };
  }

  componentDidMount() {
    const parser = document.createElement('a');
    parser.href = window.location.href;
    const uarr = parser.pathname.split('/');
    botid = uarr[2];
    channelid = uarr[4];

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

    this.props.initialize('channels', {
      channelId: channelid
    });

    axios.get(`${config.botAdminAPI}/bots/${botid}/channels/${channelid}`).then((res)=>{
      this.state.channelExist = true;
      this.props.initialize('channels', {
        channelId: channelid,
        token: res.data.token !== 'null' ? res.data.token : ''
      });
    }).catch((res) =>{
      console.log(res);
    });
  }

  handleSubmit = (data) => {
    const parser = document.createElement('a');
    parser.href = window.location.href;
    const uarr = parser.pathname.split('/');
    botid = uarr[2];
    channelid = uarr[4];
    data.id = botid;

    if (this.state.channelExist === false) {
      axios.post(`${config.botAdminAPI}/bots/${botid}/channels`,
        data,
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }).then((res)=>{
          console.log(res);
        }).catch((res) => {
          console.log(res);
        });
    } else {
      axios.put(`${config.botAdminAPI}/bots/${botid}/channels/${channelid}`,
        data,
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }).then((res)=>{
          console.log(res);
        }).catch((res) => {
          console.log(res);
        });
    }
    this.props.initialize('channels', {});
    window.location.href = '/widgets';
  }

  handleDelete() {
    confirm('Are you sure?', () => {
      axios.delete(`${config.botAdminAPI}/bots/${botid}/channels/${channelid}`).then((res)=>{
        console.log(res);
        window.location.href = '/widgets';
      }).catch((res) =>{
        console.log(res);
      });
    });
  }

  render() {
    return (
      <div className="container">
        <Modal bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static" show={this.state.showModal}>
          <Modal.Body>
            <h4><center>Security Checking...</center></h4>
          </Modal.Body>
        </Modal>
        <h1>Channels</h1>
        <Helmet title="Channels"/>
        <ChannelsForm onSubmit={this.handleSubmit}/>
        <Button className="btn btn-danger" onClick={() => this.handleDelete()} style={{marginLeft: 195}}> <i className="fa fa-trash-o"/> Delete</Button>
      </div>
    );
  }
}
