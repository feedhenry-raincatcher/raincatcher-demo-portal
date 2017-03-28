'use strict';

var _ = require('lodash');

module.exports = 'app.group';

angular.module('app.group', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.group.edit', {
      url: '/group/:groupId/edit',
      resolve: {
        group: function($stateParams, groups) {
          return groups.filter(function(group) {
            return String(group.id) === String($stateParams.groupId);
          })[0];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl'
        }
      }
    })
    .state('app.group.new', {
      url: '/new',
      resolve: {
        group: function() {
          return {};
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl'
        }
      }
    });
})

//TODO: Move to module.
.run(function($state, mediator) {
  mediator.subscribe('wfm:group:selected', function(group) {
    $state.go('app.group.detail', {
      groupId: group.id
    });
  });
  //mediator.subscribe('wfm:group:list', function() {
  //  $state.go('app.group', null, {reload: true});
  //});
})

.controller('groupFormController', function($state, $scope, mediator, group, groupClient) {
  var self = this;
  self.group = group;
  mediator.subscribeForScope('wfm:group:updated', $scope, function(group) {
    return groupClient.update(group)
        .then(function() {
          $state.go('app.group.detail', {groupId: self.group.id}, {reload: true});
        });
  });
  mediator.subscribeForScope('wfm:group:created', $scope, function(group) {
    return groupClient.create(group)
        .then(function(createdgroup) {
          $state.go('app.group.detail', {groupId: createdgroup.id}, {reload: true});
        });
  });
})

;
