'use strict';

require('angular-messages');

module.exports = 'app.message';

angular.module('app.message', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
     .state('app.message', {
       url: '/messages',
       views: {
         column2: {
           templateUrl: 'app/message/message-list.tpl.html',
           controller: 'MessageListController as messageListController',
           resolve: {
             messages: function(messageManager) {
               return messageManager.list();
             }
           }
         },
         'content': {
           templateUrl: 'app/message/empty.tpl.html'
         }
       }
     })
    .state('app.message.detail', {
      url: '/message/:messageId',
      views: {
        'content@app': {
          templateUrl: 'app/message/message-detail.tpl.html',
          controller: 'messageDetailController as ctrl',
          resolve: {
            message: function($stateParams, messageManager) {
              return messageManager.read($stateParams.messageId);
            }
          }
        }
      }
    })
    .state('app.message.new', {
      url: '/new',
      views: {
        'content@app': {
          templateUrl: 'app/message/message-new.tpl.html',
          controller: 'messageNewController as ctrl',
          resolve: {
            message: function(messageManager) {
              return messageManager.new();
            },
            workers: function(userClient) {
              return userClient.list();
            }
          }
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:message:selected', function(message) {
    $state.go('app.message.detail', {
      messageId: message.id || message._localuid },
      { reload: true }
    );
  });
})

.controller('MessageListController', function($scope, messages) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.messages = messages;
})

.controller('messageDetailController', function($scope, message) {
  var self = this;
  self.message = message;
  message.status = "read";
  $scope.selected.id = message.id;
})

.controller('messageFormController', function() {
})

.controller('messageNewController', function($scope, $state, mediator, messageManager, workers, profileData) {
  var self = this;
  self.workers = workers;
  mediator.subscribeForScope('wfm:message:created', $scope, function(message) {
    message.sender = profileData;
    return messageManager.create(message).then(function() {
      $state.go('app.message', {workers: workers}, {reload: true});
    });
  });
})
;
module.exports = 'app.message';
