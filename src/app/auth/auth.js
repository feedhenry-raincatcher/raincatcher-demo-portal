'use strict';

module.exports = 'app.auth';

angular.module('app.auth', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login',
      data: {
        columns: 2
      },
      views: {
        'content@app': {
          templateUrl: 'app/auth/login.tpl.html',
          controller: 'LoginCtrl as ctrl',
          resolve: {
            hasSession: function(userClient) {
              return userClient.hasSession();
            }
          }
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'content@app': {
          templateUrl: 'app/auth/profile.tpl.html',
          controller: 'ProfileCtrl as ctrl'
        }
      }
    });
})

//The `userClient` service is obtained from the `raincatcher-user` module. (https://github.com/feedhenry-raincatcher/raincatcher-user). This service is used to authenticate a user.
.controller('LoginCtrl', function($state, $rootScope, userClient, hasSession) {
  var self = this;

  self.hasSession = hasSession;

  self.loginMessages = {success: false, error: false};

  //Function used in the login form template (login.tpl.html) to accept
  //login details from the input boxes and attempt to authenticate the user.
  self.login = function(valid) {
    //If the form is not valid (e.g. there was no password entered, don't try to log in)
    if (!valid) {
      return;
    }

    //Requesting the raincatcher-user module to attempt to authenticate
    //the `username` and `password` entered.
    userClient.auth(self.username, self.password)
    .then(function() {
      self.loginMessages.success = true;
      return userClient.hasSession();
    })
    .then(function(hasSession) {
      self.hasSession = hasSession;
      if ($rootScope.toState) {
        $state.go($rootScope.toState, $rootScope.toParams);
        delete $rootScope.toState;
        delete $rootScope.toParams;
      } else {
        $state.go('app.workorder');
      }
    }, function(err) {
      self.loginMessages.error = true;
      console.error(err);
    });
  };

  self.logout = function() {
    userClient.clearSession()
    .then(userClient.hasSession)
    .then(function(hasSession) {
      self.hasSession = hasSession;
    }, function(err) {
      console.err(err);
    });
  };
})

.controller('ProfileCtrl', function() {
})
;
