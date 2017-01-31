'use strict';

require('angular-messages');

angular.module('app.workflow', [
  'ui.router'
, 'wfm.core.mediator'
, 'ngMessages'
, require('ng-sortable')
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workflow', {
      url: '/workflows/list',
      views: {
        column2: {
          templateUrl: 'app/workflow/workflow-list.tpl.html',
          controller: 'WorkflowListController as ctrl',
          resolve: {
            workflows: function(workflowManager) {
              return workflowManager.list();
            }
          }
        },
        'content': {
          templateUrl: 'app/workflow/empty.tpl.html'
        }
      }
    })
    .state('app.workflow.detail', {
      url: '/workflow/:workflowId',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-detail.tpl.html',
          controller: 'WorkflowDetailController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            },
            forms: function(appformClient) {
              return appformClient.list();
            }
          }
        }
      }
    })
    .state('app.workflow.add', {
      url: '/workflows/',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-add.tpl.html',
          controller: 'WorkflowAddController as ctrl',
          resolve: {
            workflow: function(workflowManager) {
              return workflowManager.new();
            }
          }
        }
      }
    })
    .state('app.workflow.edit', {
      url: '/workflow/:workflowId/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-edit.tpl.html',
          controller: 'WorkflowFormController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            }
          }
        }
      }
    })
    .state('app.workflow.step', {
      url: '/workflow/:workflowId/steps/:code/edit',
      views: {
        'content@app': {
          templateUrl: 'app/workflow/workflow-step-edit.tpl.html',
          controller: 'WorkflowStepFormController as ctrl',
          resolve: {
            workflow: function($stateParams, workflowManager) {
              return workflowManager.read($stateParams.workflowId);
            },
            forms: function(appformClient) {
              return appformClient.list();
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:workflow:selected', function(workflow) {
    $state.go('app.workflow.detail', {
      workflowId: workflow.id || workflow._localuid },
      { reload: true }
    );
  });
  mediator.subscribe('wfm:workflow:list', function() {
    $state.go('app.workflow', null, {reload: true});
  });
})

.controller('WorkflowListController', function($scope, mediator, workflows, $stateParams) {
  var self = this;
  self.workflows = workflows;
  self.selectedWorkflowId = $stateParams.workflowId;
  $scope.$parent.selected = {id: null};
  self.selectWorkflow = function(event, workflow) {
    self.selectedWorkflowId = workflow.id;
    mediator.publish('wfm:workflow:selected', workflow);
  };

  self.applyFilter = function(term) {
    term = term.toLowerCase();
    self.workflows = workflows.filter(function(workflow) {
      return String(workflow.title).toLowerCase().indexOf(term) !== -1
        || String(workflow.id).indexOf(term) !== -1;
    });
  };
})

.controller('WorkflowDetailController', function($scope, $state, $mdDialog, mediator, workflowManager, workorderManager, workflow, forms) {
  var self = this;
  $scope.selected.id = workflow.id;
  $scope.dragControlListeners = {
    containment: '#stepList',
    orderChanged :  function() {
      workflow = JSON.parse(angular.toJson(workflow)); //remove generated angular variables
      workflowManager.update(workflow).then(function(_workflow) {
        $state.go('app.workflow.detail',
         {workflowId: _workflow.id},
         { reload: true }
       );
      }, function(error) {
        console.log(error);
      });
    }
  };
  self.workflow = workflow;
  self.forms = forms;
  self.delete = function(event, workflow) {
    event.preventDefault();
    workorderManager.list()
      .then(function(workorders) {
        var workorder = workorders.filter(function(workorder) {
          return String(workorder.workflowId) === String(workflow.id);
        });
        var title = (workorder.length)
          ? "Workflow is used at least by at least 1 workorder, are you sure you want to delete workflow #'"+workflow.id+"?"
          : "Would you like to delete workflow #"+workflow.id+"?";
        var confirm = $mdDialog.confirm()
          .title(title)
          .textContent(workflow.title)
          .ariaLabel('Delete workflow')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
        return confirm;
      })
      .then(function(confirm) {
        return $mdDialog.show(confirm);
      })
      .then(function() {
        return workflowManager.delete(workflow);
      })
      .then(function() {
        $state.go('app.workflow', null, {reload: true});
      }, function(err) {
        throw err;
      });
  };

  self.deleteStep = function(event, step, workflow) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete step : '+ step.name +' ?')
          .textContent(step.name)
          .ariaLabel('Delete step')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      workflow.steps = workflow.steps.filter(function(item) {
        return item.code !== step.code;
      });
      workflowManager.update(workflow).then(function(_workflow) {
        $state.go('app.workflow.detail',
         {workflowId: _workflow.id},
         { reload: true }
       );
      }, function(error) {
        console.log(error);
      });
    });
  };

  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
        {workflowId: _workflow.id},
        { reload: true }
       );
    }, function(error) {
      console.log(error);
    });
  });
})

.controller('WorkflowAddController', function($scope, mediator, workflowManager, workflow ) {
  var self = this;
  self.workflow = workflow;

  mediator.subscribeForScope('wfm:workflow:created', $scope, function(workflow) {
    workflowManager.create(workflow).then(function(_workflow) {
      mediator.publish('wfm:workflow:selected', _workflow);
    });
  });

})

.controller('WorkflowFormController', function($scope, $state, mediator, workflow, workflowManager) {
  var self = this;

  self.workflow = workflow;

  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
      {workflowId: _workflow.id},
      { reload: true }
    );
    }, function(error) {
      console.log(error);
    });
  });
})

.controller('WorkflowStepFormController', function($scope, $state, $stateParams, mediator, workflow, workflowManager, forms) {
  var self = this;

  self.workflow = workflow;
  self.forms = forms;
  self.step = workflow.steps.filter(function(item) {
    return item.code === $stateParams.code;
  })[0];
  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
      {workflowId: _workflow.id},
      { reload: true }
    );
    }, function(error) {
      console.log(error);
    });
  });
})

;

module.exports = 'app.workflow';
