'use strict';

angular.module('app.appform', ['ui.router'])

.config(function($stateProvider) {
  $stateProvider
    .state('app.appform.detail', {
      url: '/appform/:formId',
      views: {
        'content@app': {
          templateUrl: 'app/appform/appform.tpl.html',
          controller: 'AppformController',
          controllerAs: 'ctrl',
          resolve: {
            form: function($stateParams, appformClient) {
              return appformClient.getForm($stateParams.formId);
            }
          }
        }
      }
    })
    .state('app.appform', {
      url: '/appforms',
      views: {
        column2: {
          templateUrl: 'app/appform/appform-list.tpl.html',
          controller: 'AppformListController',
          controllerAs: 'ctrl',
          resolve: {
            forms: function(appformClient) {
              return appformClient.list();
            }
          }
        },
        'content': {
          templateUrl: 'app/appform/empty.tpl.html'
        }
      }
    });
})

.controller('AppformController', function($q, form) {
  var self = this;
  self.form = form;
})

.controller('AppformListController', function($q, $state, forms) {
  var self = this;
  self.forms = forms;
  self.selectForm = function(event, form) {
    self.selectedFormId = form._id;
    $state.go('app.appform.detail', {formId: form._id});
  };

  self.applyFilter = function(term) {
    term = term.toLowerCase();
    self.forms = forms.filter(function(form) {
      return String(form.name).toLowerCase().indexOf(term) !== -1
        || String(form.description).toLowerCase().indexOf(term) !== -1
        || String(form._id).indexOf(term) !== -1;
    });
  };


})

;

module.exports = 'app.appform';
