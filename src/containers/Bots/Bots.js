import React, {Component, PropTypes} from 'react';
import {
  Modal
} from 'react-bootstrap';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import {BotsForm} from 'components';
import config from '../../config';
import axios from 'axios';
import { ADMINISTRATOR } from 'react-native-dotenv';

let botid = null;

@connect(
  state => ({
    user: state.auth.user
  }),
  {initialize})
export default class Bots extends Component {

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

    if (botid !== 'create') {
      axios.get(`${config.botAdminAPI}/bots/${botid}`).then((res)=>{
        const jsonData = res.data;
        this.props.initialize('bots', {
          id: jsonData.id,
          name: jsonData.name,
          errorMessage: jsonData.errorMessage !== 'null' ? jsonData.errorMessage : '',
          messagingHost: jsonData.messagingHost !== 'null' ? jsonData.messagingHost : '',
          openIdAppId: jsonData.openIdAppId !== 'null' ? jsonData.openIdAppId : '',
          openIdSecret: jsonData.openIdSecret !== 'null' ? jsonData.openIdSecret : '',
          watsonUsername: jsonData.watsonUsername !== 'null' ? jsonData.watsonUsername : '',
          watsonPassword: jsonData.watsonPassword !== 'null' ? jsonData.watsonPassword : '',
          watsonWorkspaceId: jsonData.watsonWorkspaceId !== 'null' ? jsonData.watsonWorkspaceId : ''
        });
      }).catch((res) =>{
        console.log(res);
      });
    }
  }

  handleSubmit = (data) => {
    if (botid === 'create') {
      axios.post(`${config.botAdminAPI}/bots`,
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
      axios.put(`${config.botAdminAPI}/bots/${botid}`,
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
    this.props.initialize('bots', {});
    window.location.href = '/widgets';
  }

  render() {
    return (
      <div className="container">
        <Modal bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static" show={this.state.showModal}>
          <Modal.Body>
            <h4><center>Security Checking...</center></h4>
          </Modal.Body>
        </Modal>
        <h1>Bots</h1>
        <Helmet title="Bots"/>
        <BotsForm onSubmit={this.handleSubmit}/>
      </div>
    );
  }
}
