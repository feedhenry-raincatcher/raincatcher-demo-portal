'use strict';

module.exports = 'app.map';

angular.module('app.map', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.map', {
      url: '/map',
      data: {
        columns: 2
      },
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        //Getting a list of workers
        //This will allow adding worker locations to the map if available.
        //Using the userClient from the raincatcher-user module to list the users.
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/map/map.tpl.html',
          controller: 'mapController as ctrl'
        }
      }

    });
})

.controller('mapController', function($window, $document, $timeout, workorders, workers) {
  this.center = [49.27, -123.08];
  this.workorders = workorders;

  //Setting the worker list to the scope of the controller.
  this.workers = workers;
});
