'use strict';

var angular = require('angular');
require('fh-js-sdk/dist/feedhenry-forms.js');

var mapModule = require('fh-wfm-map');

angular.module('app', [
  require('angular-ui-router'),
  require('angular-material'),
  require('ng-sortable'),
  require('./feedhenry')
, require('fh-wfm-mediator'),
  require('fh-wfm-sync')
, require('fh-wfm-workorder-angular')({
  mode: "admin",
  listColumnViewId: "column2",
  mainColumnViewId: "content@app"
})
, require('fh-wfm-message')
, require('fh-wfm-workflow-angular')({
  mode: "admin",
  listColumnViewId: "column2",
  mainColumnViewId: "content@app"
})
, require('fh-wfm-appform')
, require('fh-wfm-user-angular')({})
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, mapModule({
  viewId: 'content',
  data: { columns: 2 }
})
, require('fh-wfm-schedule')
, require('fh-wfm-analytics')
, require('fh-wfm-camera')
, require('./home/home')
, require('./appform/appform')
, require('./message/message')
, require('fh-wfm-file-angular')({
  uploadEnabled: false,
  listColumnViewId: "column2",
  mainColumnViewId: "content@app",
  detailStateMount: "app.file.detail"
})
, require('./schedule/schedule')
, require('./analytics/analytics')
, require('./settings')
]);

//Initialising the application with required service, config and initialising script.
require('./initialisation');
