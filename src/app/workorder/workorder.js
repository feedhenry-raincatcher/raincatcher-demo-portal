'use strict';

require('angular-messages');

angular.module('app.workorder', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorder', {
      url: '/workorders/list',
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workflows: function(workflowManager) {
          return workflowManager.list();
        },
        resultMap: function(resultManager) {
          return resultManager.list()
          .then(function(results) {
            var map = {};
            results.forEach(function(result) {
              map[result.workorderId] = result;
            });
            return map;
          });
        }
      },
      views: {
        column2: {
          templateUrl: 'app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController'
        },
        'content': {
          templateUrl: 'app/workorder/empty.tpl.html'
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-new.tpl.html',
          controller: 'WorkorderNewController as ctrl',
          resolve: {
            workorder: function(workorderManager) {
              return workorderManager.new();
            },
            workers: function(userClient) {
              return userClient.list();
            }
          }
        }
      }
    })
    .state('app.workorder.detail', {
      url: '/workorder/:workorderId',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-detail.tpl.html',
          controller: 'WorkorderDetailController as ctrl',
          resolve: {
            workorder: function($stateParams, appformClient, workorderManager) {
              return workorderManager.read($stateParams.workorderId);
            },
            workers: function(userClient) {
              return userClient.list();
            },
            result: function(workorder, resultMap) {
              return resultMap[workorder.id];
            }
          }
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workorder/workorder-edit.tpl.html',
          controller: 'WorkorderFormController as ctrl',
          resolve: {
            workorder: function($stateParams, workorderManager) {
              return workorderManager.read($stateParams.workorderId);
            },
            workers: function(userClient) {
              return userClient.list();
            },
            result: function(workorder, resultMap) {
              return resultMap[workorder.id];
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:workorder:selected', function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: true }
    );
  });
  mediator.subscribe('wfm:workorder:list', function() {
    $state.go('app.workorder', null, {reload: true});
  });
})

.controller('WorkorderListController', function($scope, workorders, resultMap) {
  var self = this;
  self.workorders = workorders;
  self.resultMap = resultMap;
  $scope.$parent.selected = {id: null};
})

.controller('WorkorderDetailController', function($scope, $state, $mdDialog, mediator, workorderManager, workflowManager, workflows, workorder, result, workers) {
  var self = this;
  $scope.selected.id = workorder.id;

  self.workorder = workorder;
  var workflow = workflows.filter(function(workflow) {
    return String(workflow.id) === String(workorder.workflowId);
  });
  if (workflow.length) {
    self.workflow = workflow[0];
  }
  self.result = result;
  var assignee = workers.filter(function(worker) {
    return String(worker.id) === String(workorder.assignee);
  });
  if (assignee.length) {
    self.assignee = assignee[0];
  }

  var nextStepIndex = workflowManager.nextStepIndex(self.workflow.steps, self.result);
  var numSteps = self.workflow.steps.length;
  self.progress = (100 * (nextStepIndex + 1) / numSteps).toPrecision(3);
  console.log(nextStepIndex, numSteps, self.progress);

  self.beginWorkflow = function(event, workorder) {
    mediator.publish('wfm:workflow:begin', workorder.id);
    event.preventDefault();
  };

  self.delete = function(event, workorder) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete workorder #'+workorder.id+'?')
          .textContent(workorder.title)
          .ariaLabel('Delete Workorder')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      return workorderManager.delete(workorder)
      .then(function() {
        $state.go('app.workorder', null, {reload: true});
      }, function(err) {
        throw err;
      });
    });
  };
})

.controller('WorkorderNewController', function($scope, workorder, workflows, mediator, workorderManager, workers) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;

  mediator.subscribeForScope('wfm:workorder:created', $scope, function(workorder) {
    workorderManager.create(workorder).then(function(_workorder) {
      mediator.publish('wfm:workorder:selected', _workorder);
    });
  });
})

.controller('WorkorderFormController', function($scope, $state, mediator, workorderManager, workorder, workflows, workers, result) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;
  self.result = result;

  mediator.subscribeForScope('wfm:workorder:updated', $scope, function(workorder) {
    return workorderManager.update(workorder).then(function(_workorder) {
      mediator.publish('wfm:workorder:selected', _workorder);
    });
  });
})

;

module.exports = 'app.workorder';
