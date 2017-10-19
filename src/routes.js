import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Home,
    Widgets,
    Login,
    Bots,
    Channels,
    Owners,
    OwnerList,
    Chat,
    NotFound,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="widgets" component={Widgets}/>
        <Route path="/bots" component={Bots}/>
        <Route path="/bots/create" component={Bots}/>
        <Route path="/bots/:id" component={Bots}/>
        <Route path="/bots/:botId/channels/create" component={Channels}/>
        <Route path="/bots/:botId/channels/:id" component={Channels}/>
        <Route path="/bots/:botId/owners" component={OwnerList}/>
        <Route path="/bots/:botId/owners/create" component={Owners}/>
        <Route path="/bots/:botId/owners/:id" component={Owners}/>
        <Route path="/bots/:botId/chat" component={Chat}/>
      </Route>

      { /* Routes */ }
      <Route path="login" component={Login}/>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
