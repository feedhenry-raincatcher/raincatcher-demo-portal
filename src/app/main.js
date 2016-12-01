'use strict';

var angular = require('angular');
require('feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')

//  These are the Raincatcher Modules that this Portal app requires.
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-result')
, require('fh-wfm-message')
, require('fh-wfm-file')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-map')
, require('fh-wfm-schedule')
, require('fh-wfm-analytics')
, require('fh-wfm-camera')

//  Custom functionality for the Portal App.
, require('./auth/auth')
, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./home/home')
, require('./appform/appform')
, require('./worker/worker')
, require('./group/group')
, require('./message/message')
, require('./file/file')
, require('./schedule/schedule')
, require('./map/map')
, require('./analytics/analytics')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      data: {
        columns: 3
      },
      resolve: {
        workorderManager: function(workorderSync) {
          return workorderSync.createManager();
        },
        workflowManager: function(workflowSync) {
          return workflowSync.createManager();
        },
        messageManager: function(messageSync) {
          return messageSync.createManager();
        },
        resultManager: function(resultSync) {
          return resultSync.createManager();
        },
        profileData: function(userClient) {
          return userClient.getProfile();
        }
      },
      controller: function($scope, $state, $mdSidenav, mediator, profileData) {
        console.log('profileData', profileData);
        $scope.profileData = profileData;

        //Whenever a new user logs into the portal, update the new details of that user.
        //This is published by the `raincatcher-user` module after authentication.
        mediator.subscribe('wfm:auth:profile:change', function(_profileData) {
          $scope.profileData = _profileData;
        });
        $scope.$state = $state;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            if ($mdSidenav('left').isOpen()) {
              $mdSidenav('left').close();
            }
            $state.go(state, params);
          }
        };
      }
    });
})

.run(function($rootScope, $state, $q, mediator, userClient) {
  var initPromises = [];
  var initListener = mediator.subscribe('promise:init', function(promise) {
    initPromises.push(promise);
  });
  mediator.publish('init');
  console.log(initPromises.length, 'init promises to resolve.');
  var all = (initPromises.length > 0) ? $q.all(initPromises) : $q.when(null);
  all.then(function() {
    $rootScope.ready = true;
    console.log(initPromises.length, 'init promises resolved.');
    mediator.remove('promise:init', initListener.id);
    return null;
  });

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
    if (toState.name !== "app.login") {
      userClient.hasSession().then(function(hasSession) {
        if (!hasSession) {
          e.preventDefault();
          $rootScope.toState = toState;
          $rootScope.toParams = toParams;
          $state.go('app.login');
        }
      });
    }
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});
