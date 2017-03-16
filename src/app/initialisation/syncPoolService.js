var angular = require('angular');
var _ = require('lodash');
var config = require('../config.json');


/**
 *
 * Service to manage initialising and removing synchronisation processes for:
 *
 * - workorders
 * - workflows
 * - messages
 * - workflow results
 *
 * @param $q
 * @param mediator
 * @param workorderSync
 * @param workflowSync
 * @param resultSync
 * @param messageSync
 * @param syncService
 * @returns {{}}
 */
function SyncPoolService($q, mediator, workorderSync, workflowSync, messageSync, syncService) {
  var syncPool = {};

  //Initialising the sync service - This is the global initialisation
  syncService.init(window.$fh, config.syncOptions);

  syncPool.removeManagers = function() {
    var promises = [];
    promises.push(workorderSync.removeManager());
    promises.push(messageSync.removeManager());
    promises.push(workflowSync.removeManager());
    return $q.all(promises);
  };

  syncPool.syncManagerMap = function(profileData) {

    //If there is no user profile, don't initialise any of the sync managers.
    if (! profileData) {
      return $q.when({});
    }
    var promises = [];
    // add any additonal manager creates here
    promises.push(workorderSync.createManager());
    promises.push(workflowSync.createManager());
    promises.push(messageSync.createManager());
    //Initialising the sync managers for the required datasets.
    return syncService.manage(config.datasetIds.workorders, {}, {}, config.syncOptions)
      .then(syncService.manage(config.datasetIds.workflows, {}, {}, config.syncOptions))
      .then(syncService.manage(config.datasetIds.results, {}, {}, config.syncOptions))
      .then(syncService.manage(config.datasetIds.messages, {}, {}, config.syncOptions))
      .then(function() {
        return $q.all(promises).then(function(managers) {
          var map = {};
          managers.forEach(function(managerWrapper) {
            map[managerWrapper.manager.datasetId] = managerWrapper;
            managerWrapper.start();
          });
          map.workorders.manager.publishRecordDeltaReceived(mediator);
          return map;
        });
      });
  };

  syncPool.forceSync = function(managers) {
    var promises = [];
    _.forOwn(managers, function(manager) {
      promises.push(
        manager.forceSync()
          .then(manager.waitForSync)
          .then(function() {
            return manager;
          })
      );
    });
    return $q.all(promises);
  };

  return syncPool;
}

angular.module('app').service('syncPool', ["$q", "mediator", "workorderSync", "workflowSync", "messageSync", "syncService", SyncPoolService]);