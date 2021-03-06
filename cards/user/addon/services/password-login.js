import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';

export default Service.extend({
  session: service(),
  cardstackSession: service(),

  source: 'portfolio-user',
  authenticationHandler: null,
  partialAuthenticationHandler: null,
  authenticationFailedHandler: null,

  login: task(function * (email, password) {
    if (!email || !password) { return; }

    let message;

    try {
      yield this.get('session').authenticate('authenticator:cardstack', this.get('source'), { email, password });
    } catch (err) {
      message = err.message;
    }

    let session = get(this, 'cardstackSession');
    let onAuthenticationHandler = get(this, 'authenticationHandler');
    let onPartialAuthenticationHandler = get(this, 'partialAuthenticationHandler');
    let onAuthenticationFailedHandler = get(this, 'authenticationFailedHandler');

    if (get(session, 'isAuthenticated') &&
      typeof onAuthenticationHandler === 'function') {
      onAuthenticationHandler(session);
    } else if (get(session, 'isPartiallyAuthenticated') && typeof
      onPartialAuthenticationHandler === 'function') {
      onPartialAuthenticationHandler(session);
    } else if (!get(session, 'isAuthenticated') &&
      !get(session, 'isPartiallyAuthenticated') && typeof
      onAuthenticationFailedHandler === 'function') {
      onAuthenticationFailedHandler(message);
    }
  }).drop()
});

