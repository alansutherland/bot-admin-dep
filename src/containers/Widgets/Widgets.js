import React, { Component, PropTypes } from 'react';
import {
  Button,
  DropdownButton,
  MenuItem
} from 'react-bootstrap';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as widgetActions from 'redux/modules/widgets';
import {isLoaded, load as loadWidgets} from 'redux/modules/widgets';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import config from '../../config';
import axios from 'axios';
import confirm from 'react-confirm2';
import * as authActions from 'redux/modules/auth';
import { ADMINISTRATOR } from 'react-native-dotenv';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadWidgets());
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
  {...widgetActions, authActions, initializeWithKey })
export default class Widgets extends Component {
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
      dataSource: []
    };
  }

  componentDidMount() {
    axios.get(`${config.botAdminAPI}/bots`).then((res)=>{
      this.setState({
        dataSource: res.data
      });
    }).catch((res) =>{
      console.log(res);
    });
  }

  handleDelete(id) {
    confirm('Are you sure?', () => {
      axios.delete(`${config.botAdminAPI}/bots/${id}`).then((res)=>{
        console.log(res);
        window.location.href = '/widgets';
      }).catch((res) =>{
        console.log(res);
      });
    });
  }

  render() {
    const styles = require('./Widgets.scss');
    const {user} = this.props;
    const admin = ADMINISTRATOR.split(',');
    return (
      <div className={styles.widgets + ' container'}>
        <h1>
          Bots
          {admin.indexOf(user.email) > -1 &&
          <Link to={`/bots/create`} className="btn btn-primary pull-right"> <i className="fa fa-plus"/> Create</Link>}

        </h1>
         <Helmet title="Widgets"/>
        {this.state.dataSource && this.state.dataSource.length > 0 &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.colorCol}>Name</th>
            <th className={styles.buttonCol}>Edit</th>
            <th className={styles.buttonCol}>Channels</th>
            <th className={styles.buttonCol}>Owners</th>
            <th className={styles.colorCol}>Chat</th>
            <th className={styles.buttonCol}>Delete</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.dataSource.map((widget) =>
              <tr key={widget.id}>
                <td className={styles.idCol}>{widget.id}</td>
                <td className={styles.colorCol}>{widget.name}</td>
                <td className={styles.buttonCol}>
                  <Link to={`/bots/${widget.id}`} className="btn btn-primary"> <i className="fa fa-pencil-square-o"/> Edit</Link>
                </td>
                <td>
                  <DropdownButton bsStyle={'info'} title={
                    <span><i className="fa fa-list fa-fw"></i> Channels</span>
                  } id="bg-nested-dropdown">
                    <MenuItem eventKey="1">
                      <Link to={`/bots/${widget.id}/channels/viber`} > Viber</Link>
                    </MenuItem>
                    <MenuItem eventKey="2">
                      <Link to={`/bots/${widget.id}/channels/line`} > Line</Link>
                    </MenuItem>
                    <MenuItem eventKey="3">
                      <Link to={`/bots/${widget.id}/channels/web`} > Web</Link>
                    </MenuItem>
                  </DropdownButton>
                </td>
                <td className={styles.buttonCol}>
                  <Link to={`/bots/${widget.id}/owners`} className="btn btn-success"> <i className="fa fa-user-secret"/> Owners</Link>
                </td>
                <td className={styles.colorCol}>
                  <Link to={`/bots/${widget.id}/chat`} className="btn btn-warning"> <i className="fa fa-comments"/> Chat</Link>
                </td>
                <td className={styles.buttonCol}>
                  {admin.indexOf(user.email) > -1 &&
                  <Button className="btn btn-danger" onClick={() => this.handleDelete(widget.id)}> <i className="fa fa-trash-o"/> Delete</Button>}
                </td>
              </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }
}

