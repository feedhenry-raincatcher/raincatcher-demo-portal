var angular = require('angular');
var _ = require('lodash');


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
 * @returns {{}}
 */
function SyncPoolService($q, mediator, workorderSync, workflowSync, resultSync, messageSync) {
  var syncPool = {};

  syncPool.removeManagers = function() {
    var promises = [];
    promises.push(workorderSync.removeManager());
    promises.push(messageSync.removeManager());
    promises.push(workflowSync.removeManager());
    promises.push(resultSync.removeManager());
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
    promises.push(resultSync.createManager());
    return $q.all(promises).then(function(managers) {
      var map = {};
      managers.forEach(function(managerWrapper) {
        map[managerWrapper.manager.datasetId] = managerWrapper;
      });
      map.workorders.manager.publishRecordDeltaReceived(mediator);
      return map;
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

angular.module('app').service('syncPool', ["$q", "mediator", "workorderSync", "workflowSync", "resultSync", "messageSync", SyncPoolService]);