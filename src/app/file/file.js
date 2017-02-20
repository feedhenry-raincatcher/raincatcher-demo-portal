'use strict';

module.exports = 'app.file';

angular.module('app.file', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.file', {
      url: '/files',
      resolve: {
        files: function(fileClient) {
          return fileClient.list();
        },
        workerMap: function(userClient) {
          return userClient.list().then(function(workers) {
            return workers.reduce(function(map, worker) {
              map[worker.id] = worker;
              return map;
            }, {});
          });
        }
      },
      views: {
        column2: {
          templateUrl: 'app/file/file-list.tpl.html',
          controller: 'FileListController as ctrl'
        },
        'content': {
          templateUrl: 'app/file/empty.tpl.html'
        }
      }
    })
    .state('app.file.detail', {
      url: '/detail/:fileUid',
      resolve: {
        file: function($stateParams, files) {
          return files.filter(function(file) {
            return file.uid === $stateParams.fileUid;
          })[0];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/file/file-detail.tpl.html',
          controller: 'FileDetailController as ctrl'
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:file:selected', function(file) {
    $state.go('app.file.detail', {
      fileUid: file.uid},
      { reload: true }
    );
  });
})

.controller('FileListController', function($scope, files, workerMap) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.files = files;
  self.workerMap = workerMap;
})

.controller('FileDetailController', function($scope, $state, file, workerMap, mediator) {
  mediator.subscribeForScope('wfm:file:close:', $scope, function() {
    $state.go('app.file');
  });
  var self = this;
  $scope.$parent.selected = {id: file.id};
  self.file = file;
  // set display options specifying which parameters of the file to display
  // should be an array object e.g. all fields {id: true, name: true, uid: true, owner: true, preview:true};
  self.displayOptions = {id: true, name: true, uid: true, owner: true, preview: true};

  self.workerMap = workerMap;
})
;
