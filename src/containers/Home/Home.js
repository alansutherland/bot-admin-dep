import React, { Component } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
          </div>
        </div>
        <div className="container">
          <LinkContainer to="/bots" bsClass="pull-right btn">
            <Button bsStyle="primary">Create a Bot</Button>
          </LinkContainer>
        </div>
        <div className="container bot-list">
          <ListGroup>
            <ListGroupItem href="/bots/ichiba/chat">Ichiba CS Bot</ListGroupItem>
            <ListGroupItem href="/bots/mobile/chat">Mobile CS Bot</ListGroupItem>
          </ListGroup>
        </div>

      </div>
    );
  }
}
