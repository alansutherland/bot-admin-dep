import React, {Component, PropTypes} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as ownerActions from 'redux/modules/widgets';
import {isLoaded, load as loadOwners} from 'redux/modules/widgets';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import config from '../../config';
import axios from 'axios';
import { ADMINISTRATOR } from 'react-native-dotenv';

let botid = null;

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadOwners());
    }
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    widgets: state.widgets.data,
    editing: state.widgets.editing,
    error: state.widgets.error,
    loading: state.widgets.loading
  }),
  {...ownerActions, initializeWithKey })
export default class OwnerList extends Component {
  static propTypes = {
    widgets: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
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
      this.setState({
        dataSource: res.data.users
      });
    }) .catch((res) =>{
      console.log(res);
    });
  }

  render() {
    const styles = require('./OwnerList.scss');
    return (
      <div className={styles.widgets + ' container'}>
        <Modal bsSize="large" aria-labelledby="contained-modal-title-lg" backdrop="static" show={this.state.hideModal}>
          <Modal.Body>
            <h4><center>Security Checking...</center></h4>
          </Modal.Body>
        </Modal>
        <h1>
          Owners
          <Link to={`/widgets`} className="btn btn-primary pull-right"><i className="fa fa-arrow-left"/> Back</Link>
          <Link to={`/bots/${botid}/owners/create`} className="btn btn-success pull-right" style={{'margin-right': '5px'}}><i className="fa fa-plus"/> Create</Link>
        </h1>
        <Helmet title="Owner List"/>
        {this.state.dataSource && this.state.dataSource.length > 0 &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.colorCol}>Email</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.dataSource.map((widget, pos) =>
              <tr key={pos}>
                <td className={styles.colorCol}>{widget}</td>
              </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }
}

