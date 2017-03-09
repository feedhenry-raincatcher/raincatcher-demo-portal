'use strict';

var angular = require('angular');
require('fh-js-sdk/dist/feedhenry-forms.js');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material'),
  require('ng-sortable'),
  require('./feedhenry')
, require('fh-wfm-mediator'),
  require('fh-wfm-sync')
, require('fh-wfm-workorder-angular')({
  mode: "admin",
  listColumnViewId: "column2",
  mainColumnViewId: "content@app"
})
, require('fh-wfm-result')
, require('fh-wfm-message')
, require('fh-wfm-file')
, require('fh-wfm-workflow-angular')({
  mode: "admin",
  listColumnViewId: "column2",
  mainColumnViewId: "content@app"
})
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-map')
, require('fh-wfm-schedule')
, require('fh-wfm-analytics')
, require('fh-wfm-camera')
, require('./auth/auth')
, require('./home/home')
, require('./appform/appform')
, require('./worker/worker')
, require('./group/group')
, require('./message/message')
, require('./file/file')
, require('./schedule/schedule')
, require('./map/map')
, require('./analytics/analytics')
, require('./settings')
]);

//Initialising the application with required service, config and initialising script.
require('./initialisation');