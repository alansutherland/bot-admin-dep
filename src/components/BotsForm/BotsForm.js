import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import botsValidation from './botsValidation';
import * as botsActions from 'redux/modules/bots';

function asyncValidate(data, dispatch, {isValidEmail}) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect(() => ({}),
  dispatch => bindActionCreators(botsActions, dispatch)
)
@reduxForm({
  form: 'bots',
  fields: ['id', 'name', 'errorMessage', 'messagingHost', 'openIdAppId', 'openIdSecret', 'watsonUsername', 'watsonPassword', 'watsonWorkspaceId'],
  validate: botsValidation,
  asyncValidate
})
export default
class BotsForm extends Component {
  static propTypes = {
    active: PropTypes.string,
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired
  }

  render() {
    const {
      asyncValidating,
      fields: {id, name, errorMessage, messagingHost, openIdAppId, openIdSecret, watsonUsername, watsonPassword, watsonWorkspaceId},
      handleSubmit,
      resetForm
      } = this.props;
    const styles = require('./BotsForm.scss');
    const renderInput = (field, label, showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type="text" className="form-control" id={field.name} {...field}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(id, 'Id')}
          {renderInput(name, 'Name')}
          {renderInput(errorMessage, 'Error Message')}
          {renderInput(messagingHost, 'Messaging Host')}
          {renderInput(openIdAppId, 'Open ID App ID')}
          {renderInput(openIdSecret, 'Open ID Secret')}
          {renderInput(watsonUsername, 'Watson Username')}
          {renderInput(watsonPassword, 'Watson Password')}
          {renderInput(watsonWorkspaceId, 'Watson Workspace ID')}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success" onClick={handleSubmit}>
                <i className="fa fa-paper-plane"/> Submit
              </button>
              <button className="btn btn-warning" onClick={resetForm} style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
