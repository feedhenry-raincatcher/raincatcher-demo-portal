require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/area.tpl.html',
    '<div flex hide-sm>\n' +
    '    <md-card>\n' +
    '      <div id="area-chart"></div>\n' +
    '      <md-card-content>\n' +
    '        <h2 class="md-title">Area Chart</h2>\n' +
    '        <p>\n' +
    '          This area chart compares the estimated workorder time <br>completion time with\n' +
    '          the real completion time.\n' +
    '        </p>\n' +
    '      </md-card-content>\n' +
    '    </md-card>\n' +
    '  </div>\n' +
    '');
}]);

},{}],2:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/chart.tpl.html',
    '<div flex>\n' +
    '  <md-card>\n' +
    '    <div id="bar-chart"></div>\n' +
    '    <md-card-content>\n' +
    '      <h2 class="md-title">Completion time / Estimated time</h2>\n' +
    '      <p>\n' +
    '        This bar chart compares the estimated workorder time <br>completion time with\n' +
    '        the real completion time.\n' +
    '      </p>\n' +
    '    </md-card-content>\n' +
    '  </md-card>\n' +
    '</div>\n' +
    '');
}]);

},{}],3:[function(require,module,exports){
require('./area.tpl.html.js');
require('./chart.tpl.html.js');
require('./pie.tpl.html.js');

},{"./area.tpl.html.js":1,"./chart.tpl.html.js":2,"./pie.tpl.html.js":4}],4:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.analytics.directives');
} catch (e) {
  ngModule = angular.module('wfm.analytics.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/pie.tpl.html',
    '<div flex>\n' +
    '  <md-card>\n' +
    '    <div id="pie-chart"></div>\n' +
    '    <md-card-content>\n' +
    '      <h2 class="md-title">Workorders by assignee</h2>\n' +
    '      <p>\n' +
    '        This pie chart represents the number of workorders assigned to each worker.\n' +
    '      </p>\n' +
    '    </md-card-content>\n' +
    '  </md-card>\n' +
    '</div>\n' +
    '');
}]);

},{}],5:[function(require,module,exports){
'use strict';

module.exports = require('./directive');

},{"./directive":6}],6:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.analytics.directives', ['wfm.core.mediator']);
module.exports = 'wfm.analytics.directives';

require('../../dist');
var c3 = require('c3')

ngModule.directive('analyticsPiechart', function($templateCache, mediator, $window, $timeout) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/pie.tpl.html'),
    scope: {
      workers: '=',
      workorders: '='
    },
    link: function (scope, element, attrs, ctrl) {
    },
    controller: function($scope, $element) {
      var workerMap = {};
      $scope.workers.forEach(function(worker) {
        workerMap[worker.id] = worker;
      });

      var workorderCounts = {};
      $scope.workorders.forEach(function(workorder) {
        workorderCounts[workorder.assignee] = workorderCounts[workorder.assignee] || 0;
        workorderCounts[workorder.assignee]++;
      });

      var columns = [];
      _.forIn(workorderCounts, function(count, workerid) {
        var worker = workerMap[workerid];
        var name = worker ? worker.name : 'Unassigned';
        var column = [name, count];
        columns.push(column);
      });


      var pieChart = c3.generate({
        bindto: '#pie-chart',
        size: {
          width: 450
        },
        data: {
            columns: columns,
            type : 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
      });
    },
    controllerAs: 'ctrl'
  }})
  .directive('analyticsBarchart', function($templateCache, mediator, $window, $timeout) {
    return {
      restrict: 'E',
      template: $templateCache.get('wfm-template/chart.tpl.html'),
      scope: {
        workorders: '='
      },
      link: function (scope, element, attrs, ctrl) {
      },
      controller: function($scope, $element) {
        //add fake data for bar charts
        var columnEstimated = ["estimated"];
        var columnReal = ["real"];
        var xAxis = [];
        $scope.workorders.forEach(function(workorder) {
          var estimated  = Math.floor((Math.random() * 10) + 15);
          var real = Math.floor((Math.random() * 10) + 15);
          xAxis.push("#" + workorder.id + ":" + workorder.title);
          columnEstimated.push(estimated);
          columnReal.push(real);
        });

        var barChart = c3.generate({
          bindto: '#bar-chart',
          size: {
            width: 450
          },
          data: {
            columns: [
              columnEstimated,
              columnReal
            ],
            type: 'bar'
          },
          axis: {
             x: {
                 show: false,
                 type: 'category',
                 categories: xAxis
             }
         },
          bar: {
            width: {
              ratio: .8
            }
          }
      });


      },
      controllerAs: 'ctrl'
  }})
  .directive('analyticsAreachart', function($templateCache, mediator, $window, $timeout) {
    return {
      restrict: 'E',
      template: $templateCache.get('wfm-template/area.tpl.html'),
      scope: {
        workorders: '='
      },
      link: function (scope, element, attrs, ctrl) {
      },
      controller: function($scope, $element) {
        //add fake data for bar charts
        var columnEstimated = ["estimated"];
        var columnReal = ["real"];
        var xAxis = [];
        $scope.workorders.forEach(function(workorder) {
          var estimated  = Math.floor((Math.random() * 10) + 15);
          var real = Math.floor((Math.random() * 10) + 15);
          xAxis.push("#" + workorder.id + ":" + workorder.title);
          columnEstimated.push(estimated);
          columnReal.push(real);
        });

        var areaChart = c3.generate({
            bindto: '#area-chart',
            size: {
              width: 450
            },
            data: {
              columns: [
                columnEstimated,
                columnReal
              ],
            types: {
              estimated: 'area',
              real: 'area-spline'
            }
          }
        });


      },
      controllerAs: 'ctrl'
  }});

},{"../../dist":3,"c3":"c3"}],7:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-date.tpl.html',
    '\n' +
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputDate" class="">{{field.props.name}}</label>\n' +
    '  <input type="date"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputDate"\n' +
    '    ng-model="ctrl.model.date"\n' +
    '    ng-change="ctrl.updateModel()"\n' +
    '    min="{{field.props.fieldOptions.validation.min}}"\n' +
    '    max="{{field.props.fieldOptions.validation.max}}"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid datae</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],8:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-datetime.tpl.html',
    '\n' +
    '<p class="md-caption">{{field.props.name}}</p>\n' +
    '<div layout="row">\n' +
    '  <md-input-container flex class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '    <label for="inputDate" class="">Date</label>\n' +
    '    <input type="date"\n' +
    '      placeholder="{{ctrl.field.props.helpText}}"\n' +
    '      name="inputDate"\n' +
    '      ng-model="ctrl.model.date"\n' +
    '      ng-change="ctrl.updateModel()"\n' +
    '      min="{{field.props.fieldOptions.validation.min}}"\n' +
    '      max="{{field.props.fieldOptions.validation.max}}"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '      <div ng-message="number">You did not enter a valid date</div>\n' +
    '      <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '      <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container flex class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '    <label for="inputTime" class="">Time</label>\n' +
    '    <input type="time"\n' +
    '      placeholder="{{ctrl.field.props.helpText}}"\n' +
    '      name="inputTime"\n' +
    '      ng-model="ctrl.model.time"\n' +
    '      ng-change="ctrl.updateModel()"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '      <div ng-message="number">You did not enter a valid time</div>\n' +
    '      <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '      <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '');
}]);

},{}],9:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-location.tpl.html',
    '<p class="md-caption">{{field.props.name}}</p>\n' +
    '<p>{{field.props.helpText}}</p>\n' +
    '\n' +
    '<md-button type="button" ng-click="ctrl.setLocation($event)" class="md-raised md-primary">\n' +
    '  <md-icon md-font-set="material-icons">location_searching</md-icon>\n' +
    '  Get Location\n' +
    '</md-button>\n' +
    '\n' +
    '<div layout="row">\n' +
    '  <md-input-container class="{{field.props.fieldCode}} appform-field-location md-block" flex>\n' +
    '    <input type="number"\n' +
    '      placeholder="Latitude"\n' +
    '      name="inputNameX"\n' +
    '      ng-model="ctrl.model.value.lat"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '\n' +
    '    <div ng-messages="$parent.fieldForm.inputNameX.$error" ng-show="$parent.fieldForm.inputNameX.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} latitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="{{field.props.fieldCode}} appform-field-location md-block" flex>\n' +
    '    <input type="number"\n' +
    '      placeholder="Longitude"\n' +
    '      name="inputNameY"\n' +
    '      ng-model="ctrl.model.value.long"\n' +
    '      ng-required="ctrl.field.props.required"\n' +
    '    ></input>\n' +
    '    <div ng-messages="$parent.fieldForm.inputNameY.$error" ng-show="$parent.fieldForm.inputNameY.$dirty || $parent.fieldForm.$submitted">\n' +
    '      <div ng-message="required">A {{field.props.name}} longitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '');
}]);

},{}],10:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-number.tpl.html',
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputName" class="">{{field.props.name}}</label>\n' +
    '  <input type="number"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputName"\n' +
    '    ng-model="ctrl.model.value"\n' +
    '    min="{{field.props.fieldOptions.validation.min}}"\n' +
    '    max="{{field.props.fieldOptions.validation.max}}"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid number</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],11:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-photo.tpl.html',
    '<div>\n' +
    '  <md-button type="button" ng-click="ctrl.capture($event)" class="md-raised md-primary">{{ctrl.model.value ? \'Replace\' : \'Take a\'}} photo</md-button>\n' +
    '  <br>\n' +
    '  <img class=\'appform-photo\' ng-if="field.value.localURI" ng-src="{{field.value.localURI}}" alt="photo"></img>\n' +
    '  <img class=\'appform-photo\' ng-if="ctrl.model.value" ng-src="{{ctrl.model.value}}" alt="photo"></img>\n' +
    '</div>\n' +
    '');
}]);

},{}],12:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field-time.tpl.html',
    '\n' +
    '<md-input-container class="md-block" class="{{field.props.fieldCode}} appform-field-number">\n' +
    '  <label for="inputTime" class="">{{field.props.name}}</label>\n' +
    '  <input type="time"\n' +
    '    placeholder="{{ctrl.field.props.helpText}}"\n' +
    '    name="inputTime"\n' +
    '    ng-model="ctrl.model.time"\n' +
    '    ng-change="ctrl.updateModel()"\n' +
    '    ng-required="ctrl.field.props.required"\n' +
    '  ></input>\n' +
    '  <div ng-messages="$parent.fieldForm.inputName.$error" ng-show="$parent.fieldForm.inputName.$dirty || $parent.fieldForm.$submitted">\n' +
    '    <div ng-message="required">A {{field.props.name}} is required.</div>\n' +
    '    <div ng-message="number">You did not enter a valid time</div>\n' +
    '    <div ng-message="max" class="help-block">Value must be less than {{field.props.fieldOptions.validation.max}}.</div>\n' +
    '    <div ng-message="min" class="help-block">Value must be larger than {{field.props.fieldOptions.validation.min}}.</div>\n' +
    '  </div>\n' +
    '</md-input-container>\n' +
    '');
}]);

},{}],13:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-field.tpl.html',
    '<ng-form name="fieldForm" ng-submit="ctrl.submit()">\n' +
    '  <div ng-switch="ctrl.field.props.type">\n' +
    '\n' +
    '    <div ng-switch-when="number">\n' +
    '      <appform-field-number model="ctrl.model" field="ctrl.field"></appform-field-number>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="dateTime" ng-switch="ctrl.field.props.fieldOptions.definition.datetimeUnit">\n' +
    '      <div ng-switch-when="date">\n' +
    '        <appform-field-date model="ctrl.model" field="ctrl.field"></appform-field-date>\n' +
    '      </div>\n' +
    '       <div ng-switch-when="datetime">\n' +
    '         <appform-field-datetime model="ctrl.model" field="ctrl.field"></appform-field-datetime>\n' +
    '       </div>\n' +
    '       <div ng-switch-when="time">\n' +
    '         <appform-field-time model="ctrl.model" field="ctrl.field"></appform-field-time>\n' +
    '       </div>\n' +
    '       <div ng-switch-default>\n' +
    '         {{ctrl.field.props.fieldOptions.definition.datetimeUnit}}\n' +
    '       </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="location">\n' +
    '      <appform-field-location model="ctrl.model" field="ctrl.field"></appform-field-location>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="signature" flex class="appform-signature">\n' +
    '      <md-input-container class="md-block">\n' +
    '        <p class="md-caption">{{ctrl.field.props.name}}</p>\n' +
    '        <signature-form value="ctrl.model.value"></signature-form>\n' +
    '      </md-input-container>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-when="photo" flex class="appform-photo">\n' +
    '      <appform-field-photo model="ctrl.model" field="ctrl.field"></appform-field-photo>\n' +
    '    </div>\n' +
    '\n' +
    '    <div ng-switch-default flex>\n' +
    '      <md-input-container class="md-block">\n' +
    '        <label>{{ctrl.field.props.name}}</label>\n' +
    '        <input\n' +
    '          type="text"\n' +
    '          name="inputName"\n' +
    '          ng-model="ctrl.model.value"\n' +
    '          ng-required="ctrl.field.props.required"\n' +
    '          ng-class="ctrl.field.props.type"\n' +
    '        ></input>\n' +
    '        <div ng-messages="fieldForm.inputName.$error" ng-show="fieldForm.inputName.$dirty || fieldForm.$submitted">\n' +
    '          <div ng-message="required" ng-show="ctrl.field.props.helpText">{{ctrl.field.props.helpText}}</div>\n' +
    '          <div ng-message="required" ng-hide="ctrl.field.props.helpText">A {{ctrl.field.props.name}} is required.</div>\n' +
    '        </div>\n' +
    '      </md-input-container>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</ng-form>\n' +
    '');
}]);

},{}],14:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform-submission.tpl.html',
    '\n' +
    '<md-subheader>{{ctrl.form.props.name}}</md-subheader>\n' +
    '\n' +
    '<md-list class="appform-view">\n' +
    '\n' +
    '  <md-list-item ng-if="! ctrl.fields" class="loading">\n' +
    '    Loading appForm submission...\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <div ng-repeat="field in ctrl.fields">\n' +
    '    <ng-switch on="field.props.type">\n' +
    '      <div ng-switch-when="signature">\n' +
    '        <md-list-item class="md-2-line with-image">\n' +
    '          <md-icon md-font-set="material-icons">gesture</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>\n' +
    '              <signature ng-if="field.value.localURI" value="field.value.localURI" alt="Signature"></signature>\n' +
    '              <signature ng-if="!field.value.localURI" value="field.value.imgHeader + field.value.data" alt="Signature"></signature>\n' +
    '            </h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="location">\n' +
    '        <md-list-item class="md-3-line">\n' +
    '          <md-icon md-font-set="material-icons">place</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value.lat}}N, {{field.value.long}}W</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="number">\n' +
    '        <md-list-item class="md-2-line">\n' +
    '          <md-icon md-font-set="material-icons">filter_4</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value}}</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-when="photo">\n' +
    '        <md-list-item class="md-2-line with-image">\n' +
    '          <md-icon md-font-set="material-icons">camera</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>\n' +
    '              <img ng-if="field.value.localURI" ng-src="{{field.value.localURI}}" alt="photo"></img>\n' +
    '              <img ng-if="!field.value.localURI" ng-src="{{field.value.imgHeader + field.value.data}}" alt="photo"></img>\n' +
    '            </h3>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '\n' +
    '      <div ng-switch-default>\n' +
    '        <md-list-item class="md-2-line">\n' +
    '          <md-icon md-font-set="material-icons">text_format</md-icon>\n' +
    '          <div class="md-list-item-text">\n' +
    '            <h3>{{field.value}}</h3>\n' +
    '            <p>{{field.props.name}}</p>\n' +
    '          </div>\n' +
    '          <md-divider></md-divider>\n' +
    '        </md-list-item>\n' +
    '      </div>\n' +
    '    </ng-switch>\n' +
    '  </div>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],15:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.appform.directives');
} catch (e) {
  ngModule = angular.module('wfm.appform.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/appform.tpl.html',
    '<div class="app-form" layout-padding >\n' +
    '\n' +
    '<form name="workorderForm" novalidate>\n' +
    '  <div ng-repeat="field in ctrl.fields">\n' +
    '    <appform-field field="field" model="ctrl.model[field.props.fieldCode || field.props._id]"></appform-field>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '    <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '    <md-button type="button" ng-click="ctrl.done($event, workorderForm.$valid)" class="md-primary">Continue</md-button>\n' +
    '  </div><!-- workflow-actions-->\n' +
    '\n' +
    '</form>\n' +
    '\n' +
    '</div><!-- app-form -->\n' +
    '');
}]);

},{}],16:[function(require,module,exports){
require('./appform-field-date.tpl.html.js');
require('./appform-field-datetime.tpl.html.js');
require('./appform-field-location.tpl.html.js');
require('./appform-field-number.tpl.html.js');
require('./appform-field-photo.tpl.html.js');
require('./appform-field-time.tpl.html.js');
require('./appform-field.tpl.html.js');
require('./appform-submission.tpl.html.js');
require('./appform.tpl.html.js');

},{"./appform-field-date.tpl.html.js":7,"./appform-field-datetime.tpl.html.js":8,"./appform-field-location.tpl.html.js":9,"./appform-field-number.tpl.html.js":10,"./appform-field-photo.tpl.html.js":11,"./appform-field-time.tpl.html.js":12,"./appform-field.tpl.html.js":13,"./appform-submission.tpl.html.js":14,"./appform.tpl.html.js":15}],17:[function(require,module,exports){
'use strict';

module.exports = 'wfm.appform';

angular.module('wfm.appform', [
  'wfm.core.mediator'
, require('./directive')
])

.run(function(mediator) {
  require('../appform-mediator')(mediator);
});

},{"../appform-mediator":20,"./directive":18}],18:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.appform.directives', [
  'wfm.core.mediator',
  require('./service'),
  require('fh-wfm-signature')
]);
module.exports = 'wfm.appform.directives';

var _ = require('lodash');
require('../../dist');

ngModule.run(function(appformClient) {
  appformClient.init();
})

ngModule.directive('appformSubmission', function($templateCache, $q, appformClient) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-submission.tpl.html')
  , scope: {
      submissionLocalId: '=submissionLocalId'
    , submissionId: '=submissionId'
    , submission: '=submission'
    }
  , controller: function($scope) {
      var self = this;
      var submissionPromise;
      if ($scope.submission) {
        submissionPromise = $q.when($scope.submission);
      } else if ($scope.submissionId) {
        submissionPromise = appformClient.getSubmission($scope.submissionId);
      } else if ($scope.submissionLocalId) {
        submissionPromise = appformClient.getSubmissionLocal($scope.submissionLocalId);
      } else {
        console.error('appformSubmission called with no submission');
      }
      submissionPromise.then(function(submission) {
        var formPromise = submission.form ? $q.when(submission.form) : appformClient.getForm(submission.props.formId);
        return formPromise.then(function(form) {
          self.form = form;
        })
        .then(function() {
          return appformClient.getFields(submission);
        })
      })
      .then(function(fields) {
        self.fields = fields;
      }, function(error) {
        console.error(error);
      });
    }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appform', function($templateCache, $q, mediator, appformClient) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform.tpl.html')
  , scope: {
      form: '=',
      formId: '='
    }
  , controller: function($scope, $element) {
    var self = this;
    var form;
    var formPromise = $scope.form ? $q.when($scope.form) : appformClient.getForm($scope.formId);
    formPromise.then(function(_form) {
      form = _form;
      self.fields = form.fields;
      self.model = {};
      _.forEach(self.fields, function(field) {
        self.model[field.props.fieldCode || field.props._id] = {};
      });
    })
    self.back = function(event) {
      event.preventDefault();
      event.stopPropagation();
      mediator.publish('wfm:workflow:step:back');
    }
    self.done = function(event, isValid) {
      event.stopPropagation();
      event.stopPropagation();
      $scope.$broadcast('parentFormSubmitted');
      if (!isValid) {
        console.log('invalid', event)
        var firstInvalid = $element[0].querySelector('input.ng-invalid');
        // if we find one, set focus
        if (firstInvalid) {
          firstInvalid.focus();
        }
      } else {
        var submissionFields = [];
        _.forEach(self.fields, function(field) {
          var value = self.model[field.props.fieldCode || field.props._id].value;
          submissionFields.push({
            fieldId: field.props._id,
            value: value
          });
        })
        appformClient.createSubmission(form, submissionFields)
        .then(appformClient.submitSubmission)
        .then(appformClient.composeSubmissionResult)
        .then(function(submissionResult) {
          mediator.publish('wfm:workflow:step:done', submissionResult);
        }, function(error) {
          console.error('submissionFields', submissionFields);
          throw new Error(error);
        });
      };
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformField', function($templateCache, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field.tpl.html')
  , scope: {
      field: '=',
      model: '='
    }
  , link: function (scope, element, attrs, ctrl) {
      var parentForm = element.parent();
      while (parentForm && parentForm.prop('tagName') !== 'FORM') {
        parentForm = parentForm.parent();
      };
      if (parentForm) {
        var formController = element.find('ng-form').controller('form');
        scope.$on('parentFormSubmitted',function(event) {
          ctrl.submit(element);
          formController.$setSubmitted();
        });
      };
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = {};
    if ($scope.model && $scope.model.value) {
      self.model = angular.copy($scope.model);
    } else if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
      self.model.value = self.field.props.fieldOptions.definition.defaultValue;
    };
    self.submit = function(element) {

      if (self.field.props.type === 'location') {
        var inputs = element[0].getElementsByTagName('input');
        self.model.value = {
          lat: inputs[0].value,
          long: inputs[1].value
        }
      }
      $scope.model.value = self.model.value;
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldLocation', function($templateCache, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field-location.tpl.html')
  , scope: {
      field: '='
    , model: '='
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = $scope.model ? angular.copy($scope.model) : {};
    self.model.value = self.model.value || {};
    self.isValid = function(form, element) {
      console.log('form', form);
      console.log('element', element);
    }
    self.setLocation = function(event) {
      event.stopPropagation();
      event.stopPropagation();
      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.$apply(function() {
          self.model.value.lat = parseFloat(pos.coords.latitude);
          self.model.value.long = parseFloat(pos.coords.longitude);
          console.log('position set', self.model.value)
        });
      }, function(err) {
        alert('Unable to get current position');
        self.model.value.lat = -1;
        self.model.value.long = -1;
      });
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldPhoto', function($templateCache, $window, mediator, mobileCamera, desktopCamera) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/appform-field-photo.tpl.html')
  , scope: {
      field: '='
    , model: '='
    }
  , controller: function($scope) {
    var self = this;
    self.field = $scope.field;
    self.model = $scope.model; // ? angular.copy($scope.model) : {};
    self.isValid = function(form, element) {
      console.log('form', form);
      console.log('element', element);
    }
    self.capture = function(event) {
      event.stopPropagation();
      event.stopPropagation();
      if ($window.cordova) {
        mobileCamera.capture()
        .then(function(capture) {
          self.model.value = capture;
        })
      } else {
        desktopCamera.capture()
        .then(function(dataUrl) {
          self.model.value = dataUrl;
        });
      }
    }
  }
  , controllerAs: 'ctrl'
  };
});

ngModule.directive('appformFieldNumber', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-number.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = parseFloat(self.field.props.fieldOptions.definition.defaultValue);
   };
 }
 , controllerAs: 'ctrl'
 };
});

function getDate(d){
  return 'YYYY-MM-DD'.replace('YYYY', d.getFullYear()).replace('MM', twoDigi(d.getMonth()+1)).replace('DD', twoDigi(d.getDate()));
};

function getTime(d){
  return 'HH:mm'.replace('HH', twoDigi(d.getHours())).replace('mm', twoDigi(d.getMinutes()));
};

function twoDigi(num){
  if (num < 10){
    return '0' + num.toString();
  } else {
    return num.toString();
  }
}

ngModule.directive('appformFieldDatetime', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-datetime.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var date = new Date(self.model.date);
     var time = new Date(self.model.time);
     $scope.model.value = getDate(date) + ' ' + getTime(time);
   }
 }
 , controllerAs: 'ctrl'
 };
});

ngModule.directive('appformFieldDate', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-date.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var date = new Date(self.model.date);
     $scope.model.value = getDate(date);
   }
 }
 , controllerAs: 'ctrl'
 };
});

ngModule.directive('appformFieldTime', function($templateCache, $window, $document, $timeout, mediator) {
 return {
   restrict: 'E'
 , template: $templateCache.get('wfm-template/appform-field-time.tpl.html')
 , scope: {
   field: '=',
   model: '=',
 }
 , controller: function($scope) {
   var self = this;
   self.field = $scope.field;
   self.model = $scope.model;
   if (self.field.props.fieldOptions.definition && self.field.props.fieldOptions.definition.defaultValue) {
     self.model.value = new Date(self.field.props.fieldOptions.definition.defaultValue);
   };
   self.updateModel = function() {
     var time = new Date(self.model.time);
     $scope.model.value = getTime(time);
   }
 }
 , controllerAs: 'ctrl'
 };
});

},{"../../dist":16,"./service":19,"fh-wfm-signature":62,"lodash":"lodash"}],19:[function(require,module,exports){
'use strict';

var client = require('../appform')

module.exports = 'wfm.appform.service';

angular.module('wfm.appform.service', [])

.service('appformClient', function($q) {
  var service = {};

  var methods = [
    'init',
    'list',
    'getForm',
    'getSubmissionLocal',
    'getSubmission',
    'getSubmissions',
    'getFields',
    'createSubmission',
    'submitSubmission',
    'uploadSubmission',
    'composeSubmissionResult',
    'syncStepResult',
    'watchSubmissionModel'
  ];

  methods.forEach(function(method) {
    service[method] = function() {
      return $q.when(client[method].apply(client, arguments));
    };
  });

  return service;
});

},{"../appform":21}],20:[function(require,module,exports){
'use strict';

var client = require('./appform')

function wrapper(mediator) {
  var initPromise = client.init();
  mediator.subscribe('wfm:appform:init', function() {
    initPromise
    .then(function() {
      mediator.publish('done:wfm:appform:init');
    }, function(error) {
      mediator.publish('error:appform:init', error);
    });
  });

  mediator.subscribe('init', function() {
    mediator.publish('promise:init', initPromise);
  });

  mediator.subscribe('wfm:appform:form:list', function() {
    client.list()
    .then(function(forms) {
      mediator.publish('done:wfm:appform:form:list', forms);
    }, function(error) {
      mediator.publish('error:appform:form:list', error);
    });
  });

  mediator.subscribe('wfm:appform:form:read', function(formId) {
    client.getForm(formId)
    .then(function(form) {
      mediator.publish('done:wfm:appform:form:read:' + formId, form);
    }, function(error) {
      mediator.publish('error:appform:form:read:' + formId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:local:read', function(submissionLocalId) {
    client.getSubmissionLocal(submissionLocalId)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:local:read:'+submissionLocalId, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:local:read:'+submissionLocalId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:remote:read', function(submissionId) {
    client.getSubmission(submissionId)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:remote:read:'+submissionId, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:remote:read:'+submissionId, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:list:remote:read', function(submissionIds, id) {
    client.getSubmissions(submissionIds)
    .then(function(submissions) {
      mediator.publish('done:wfm:appform:submission:list:remote:read:'+id, submissions);
    }, function(error) {
      mediator.publish('error:appform:submission:list:remote:read:'+id, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:field:list', function(submission) {
    client.getFields(submission)
    .then(function(fields) {
      mediator.publish('done:wfm:appform:submission:field:list:'+submission.getLocalId(), fields);
    }, function(error) {
      mediator.publish('error:appform:submission:field:list:'+submission.getLocalId(), error);
    });
  });

  mediator.subscribe('wfm:appform:submission:create', function(form, submissionFields, ts) {
    client.createSubmission(form, submissionFields)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:create:' + ts, submission);
    }, function(error) {
      mediator.publish('error:appform:submission:create:' + ts, error);
    });
  });

  mediator.subscribe('wfm:appform:submission:submit', function(submission) {
    client.submitSubmission(submission)
    .then(function(submission) {
      mediator.publish('done:wfm:appform:submission:submit:' + submission.getLocalId(), submission);
    }, function(error) {
      mediator.publish('error:appform:submission:submit:' + submission.getLocalId(), error);
    });
  });

  mediator.subscribe('wfm:appform:submission:upload', function(submission) {
    client.uploadSubmission(submission)
    .then(function(submissionId) {
      mediator.publish('done:wfm:appform:submission:upload:' + submission.props._ludid, submissionId);
    }, function(error) {
      mediator.publish('error:appform:submission:upload:' + submission.props._ludid, error);
    });
  });

  client.addSubmissionCompleteListener(function(submissionResult, metaData) {
    if (metaData) {
      var event = {
        submissionResult: submissionResult,
        metaData: metaData
      }
      console.log('metaData', metaData);
      mediator.publish('wfm:appform:submission:complete', event)
    }
  })
};

module.exports = wrapper;

},{"./appform":21}],21:[function(require,module,exports){
'use strict';

var q = require('q');
var _ = require('lodash');

var client = {};
var initPromise;

client.init = function() {
  if (initPromise) {
    return initPromise;
  }
  var deferred = q.defer();
  var self = this;
  self.listeners = [];
  initPromise = deferred.promise;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    $fh.forms.init(function(error) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        console.log('Forms initialized.');
        deferred.resolve();
      }
    });
  });
  $fh.forms.on("submission:submitted", function(submissionId) {
    var submission = this;
    var metaData = submission.get('metaData');
    if (self.listeners.length) {
      self.composeSubmissionResult(submission).then(function(submissionResult) {
        self.listeners.forEach(function(listener) {
          listener(submissionResult, metaData);
        });
      });
    }
  });
  return initPromise;
};

client.addSubmissionCompleteListener = function(listener) {
  this.listeners.push(listener);
};

client.list = function() {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getForms(function(error, formsModel) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var forms = formsModel.props.forms;
      deferred.resolve(forms);
    });
  });
  return deferred.promise;
};

client.getForm = function(formId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getForm({formId: formId}, function (error, form) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      deferred.resolve(form);
    });
  });
  return deferred.promise;
}

client.getSubmissionLocal = function(submissionLocalId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.getSubmissions(function(error, submissions) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      submissions.getSubmissionByMeta({_ludid: submissionLocalId}, function(error, submission) {
        if (error) {
          deferred.reject(new Error(error));
          return;
        }
        deferred.resolve(submission);
      });
    });
  });
  return deferred.promise;
}

client.getSubmission = function(submissionId) {
  var deferred = q.defer();
  initPromise.then(function() {
    $fh.forms.downloadSubmission({submissionId: submissionId}, function(error, submission) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      deferred.resolve(submission);
    });
  });
  return deferred.promise;
}

client.getSubmissions = function(submissionIds) {
  var self = this;
  var promises = submissionIds.map(function(submissionId) {
    return initPromise.then(function() {
      self.getSubmission(submissionId);
    });
  });
  return q.allSettled(promises);
}

client.getFields = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.getForm(function(error, form) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var fields = form.fields;
      var qs = [];
      _.forOwn(fields, function(field, key) {
        var _deferred = q.defer();
        qs.push(_deferred.promise);
        submission.getInputValueByFieldId(field.getFieldId(), function(error, fieldValues) {
          if (error) {
            _deferred.reject(new Error(error));
            return;
          }
          field.value = fieldValues[0];
          _deferred.resolve(fieldValues);
        });
      });
      q.all(qs).then(function() {
        deferred.resolve(fields);
      }, function(error) {
        deferred.reject(new Error(error));
      });
    });
  });
  return deferred.promise;
}

/**
* The fields parameter is an array of {fieldId: <...>, value: <...>} objects
*/
client.createSubmission = function(form, submissionFields) {
  var deferred = q.defer();
  initPromise.then(function() {
    var submission = form.newSubmission();
    var ds = [];
    _.forEach(submissionFields, function(field) {
      var d = q.defer();
      ds.push(d.promise);
      submission.addInputValue(field, function(error, result) {
        if (error) {
          d.reject(error);
        } else {
          d.resolve(result);
        }
      });
    });
    q.all(ds)
    .then(function() {
      deferred.resolve(submission);
    }, function(error) {
      deferred.reject(new Error(error));
    });
  });
  return deferred.promise;
};

client.submitSubmission = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.submit(function(error, submitResponse) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      };
      deferred.resolve(submission);
    });
  });
  return deferred.promise;
};

client.uploadSubmission = function(submission) {
  var deferred = q.defer();
  initPromise.then(function() {
    submission.upload(function(error, uploadTask) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      };
      uploadTask.submissionModel(function(error, submissionModel) {
        if (error) {
          deferred.reject(new Error(error));
          return;
        };
        deferred.resolve(submissionModel);
      })
    });
  });
  return deferred.promise;
};

client.composeSubmissionResult = function(submission) {
  var submissionResult = {
      submissionLocalId: submission.props._ludid
    , formId: submission.props.formId
    , status: submission.props.status
  };
  if (submission.props._id) {
    submissionResult.submissionId = submission.props._id;
  }
  return q.when(submissionResult);
};

client.syncStepResult = function(workorder, stepResult) {
  // kick-off an appform upload, update the workorder when complete
  var self = this;

  return initPromise
    .then(function() {
      return self.getSubmissionLocal(stepResult.submission.submissionLocalId);
    })
    .then(function(submission) {
      submission.set('metaData', {
        wfm: {
          workorderId: workorder.id,
          step: stepResult.step,
          timestamp: stepResult.timestamp
        }
      });
      return submission;
    })
    .then(self.uploadSubmission)
    .then(function(submissionModel) {
      self.watchSubmissionModel(submissionModel); // need this to trigget the global event
      return submissionModel;
    });
};

client.watchSubmissionModel = function(submissionModel) {
  var deferred = q.defer();
  submissionModel.on('submitted', function(submissionId) {
    $fh.forms.downloadSubmission({submissionId: submissionId}, function(error, remoteSubmission) {
      if (error) {
        deferred.reject(error);
        return;
      };
      deferred.resolve(remoteSubmission);
    });
  });
  //  TODO: Do we need a timeout here to cleanup submissionModel listeners?
  return deferred.promise;
};

module.exports = client;

},{"lodash":"lodash","q":"q"}],22:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.camera.directives');
} catch (e) {
  ngModule = angular.module('wfm.camera.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/camera.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<div class="wfm-camera" flex>\n' +
    '  <md-button class="md-icon-button" aria-label="Back" ng-click="ctrl.cancel()" flex>\n' +
    '    <md-icon md-font-set="material-icons">arrow_back</md-icon>\n' +
    '  </md-button>\n' +
    '  <video  ng-show="ctrl.cameraOn" autoplay></video>\n' +
    '  <canvas ng-hide="ctrl.cameraOn"></canvas>\n' +
    '  <div class="wfm-camera-actions" style="z-index: 1000">\n' +
    '    <md-button ng-show="ctrl.cameraOn" class="wfm-camera-btn" ng-click="ctrl.snap()"></md-button>\n' +
    '    <md-button ng-hide="ctrl.cameraOn" class="wfm-camera-confirmation-btn md-warn" ng-click="ctrl.startCamera()">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '    <md-button ng-hide="ctrl.cameraOn" class="wfm-camera-confirmation-btn" ng-click="ctrl.done()">\n' +
    '      <md-icon md-font-set="material-icons">check</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],23:[function(require,module,exports){
require('./camera.tpl.html.js');

},{"./camera.tpl.html.js":22}],24:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = 'wfm.camera';

angular.module('wfm.camera', [
  require('./directive')
, require('./service')
]);

},{"./directive":25,"./service":26}],25:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ngModule = angular.module('wfm.camera.directives', ['wfm.core.mediator']);
module.exports = 'wfm.camera.directives';

require('../../dist');

ngModule.directive('camera', function($templateCache, mediator, $window, $timeout) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/camera.tpl.html'),
    scope: {
      model: '=',
      autostart: '='
    },
    compile: function (element) {
      element.attr('flex', true);
    },
    controller: function($scope, $element) {
      var self = this,
          element = $element[0],
          canvas = element.getElementsByTagName('canvas')[0],
          context = canvas.getContext('2d'),
          video = element.getElementsByTagName('video')[0],
          stream, width, height, zoom;

      $timeout(function() {
        height = element.offsetHeight;
        width = element.offsetWidth;
        video.height = height;
        canvas.height = height;
        canvas.width = width;

        self.cameraOn = false;
        if ($scope.autostart) {
          self.startCamera();
        }
      })

      context.scale(-1, 1);

      self.snap = function() {
        var sx = (video.clientWidth - width ) / 2;
        context.drawImage(video, sx/zoom, 0, width/zoom, height/zoom, 0, 0, width, height);
        self.stopCamera();
      };

      self.startCamera = function() {
        // TODO: https://www.npmjs.com/package/getusermedia-js
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        getUserMedia.call(navigator, { 'video': true }, function(_stream) {
          stream = _stream;
          video.src = $window.URL.createObjectURL(stream);
          video.play();
          $scope.$apply(function() {
            $scope.model = null;
            self.cameraOn = true;
            var videoWidth;
            video.onloadstart = function() {
              videoWidth = video.clientWidth;
            }
            video.oncanplay = function() {
              zoom = videoWidth / video.clientWidth;
              video.style.left = -(video.clientWidth - width ) / 2 + 'px';
            };
          });
        }, function(error) {
          console.error('Video capture error: ', error.code);
        });
      }

      self.stopCamera = function() {
        stream.getVideoTracks()[0].stop();
        self.cameraOn = false;
      }

      self.cancel = function() {
        self.stopCamera();
        mediator.publish('wfm:camera:cancel');
      }

      self.done = function() {
        $scope.model = canvas.toDataURL();
      }

      $scope.$on('$destroy', function() {
        self.stopCamera();
      });
    },
    controllerAs: 'ctrl'
  };
})

},{"../../dist":23}],26:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var camera = require('../camera');

module.exports = 'wfm.camera.service';

angular.module('wfm.camera.service', ['wfm.core.mediator'])

.factory('mobileCamera', function($q, $window, mediator) {
  return camera;
})

.factory('desktopCamera', function($mdDialog, mediator) {
  var camera = {};
  camera.capture = function(ev) {
    return $mdDialog.show({
      controller: function CameraCtrl($scope, mediator) {
        var self = this;
        $scope.data = null;

        $scope.$watch('data', function() {
          if (! _.isEmpty($scope.data) ) {
            $mdDialog.hide($scope.data);
          }
        })

        mediator.subscribeForScope('wfm:camera:cancel', $scope, function() {
          $mdDialog.cancel('Photo capture cancelled.');
        });
      },
      template: '<camera model="data" autostart="true"></camera>',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true
    });
  };

  return camera;
})
;

},{"../camera":27}],27:[function(require,module,exports){
/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');

function Camera() {
  this.init();
};

Camera.prototype.init = function() {
  var self = this;
  var deferred = q.defer();
  if (window.cordova) {
    document.addEventListener("deviceready", function cameraReady() {
      deferred.resolve();
    }, false);
  } else {
    deferred.resolve();
  };

  self.initPromise = deferred.promise;
  return self.initPromise;
};

Camera.prototype.clearCache = function() {
  window.navigator.camera.cleanup();
};

Camera.prototype.capture = function () {
  var self = this;
  var deferred = q.defer();
  self.initPromise.then(function() {
    window.navigator.camera.getPicture(function captureSuccess(fileURI) {
      var fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
      deferred.resolve({
        fileName: fileName,
        fileURI: fileURI
      });
    }, function captureFailure(error) {
      deferred.reject(error);
    }, {
      quality: 100,
      destinationType: window.navigator.camera.DestinationType.FILE_URI,
      encodingType: window.Camera.EncodingType.JPEG,
      correctOrientation: true
    });
  });
  return deferred.promise;
};

var camera = new Camera();
module.exports = camera;

},{"q":"q"}],28:[function(require,module,exports){
'use strict';

var config = require('../config');

module.exports = 'wfm.file.directives';

angular.module('wfm.file.directives', [])

.directive('wfmImg', function($q) {
  function init() {
    var self = this;
    var deferred = $q.defer();
    $fh.on('fhinit', function(error, host) {
      if (error) {
        deferred.reject(new Error(error));
        return;
      }
      var cloudUrl = $fh.getCloudURL();
      deferred.resolve(cloudUrl);
    });

    return deferred.promise;
  };

  var initPromise = init();

  return {
    restrict: 'A',
    scope: {
      uid: '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('uid', function(uid) {
        initPromise.then(function(cloudUrl) {
          element[0].src = cloudUrl + config.apiPath + '/get/' + uid;
          console.log(element[0].src);
        });
      });
    }
  }
})
;

},{"../config":30}],29:[function(require,module,exports){
'use strict';

var client = require('../file'),
    config = require('../config'),
    _ = require('lodash');

module.exports = 'wfm.file.service';

angular.module('wfm.file.service', [
  require('./directive')
])

.factory('fileClient', function($q) {
  var fileClient = {};

  _.forOwn(client, function(value, key) {
    if (typeof value  === 'function') {
      fileClient[key] = function() {
        return $q.when(client[key].apply(client, arguments));
      }
    } else {
      fileClient[key] = value;
    }
  });

  return fileClient;
})
;

},{"../config":30,"../file":31,"./directive":28,"lodash":"lodash"}],30:[function(require,module,exports){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080'
, apiPath: '/file/wfm'
}

},{}],31:[function(require,module,exports){
'use strict';

var config = require('./config'),
    q = require('q');

var client = {};

client.init = function() {
  var deferredFhinit = q.defer();
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferredFhinit.reject(new Error(error));
      return;
    }
    client.cloudUrl = $fh.getCloudURL();
    deferredFhinit.resolve();
  });

  var deferredReady = q.defer();
  if (window.cordova) {
    document.addEventListener("deviceready", function cameraReady() {
      deferredReady.resolve();
    }, false);
  } else {
    deferredReady.resolve();
  };

  client.initPromise = q.all([deferredFhinit.promise, deferredReady.promise])
  return client.initPromise;
};

client.uploadDataUrl = function(userId, dataUrl) {
  var deferred = q.defer();
  if (arguments.length < 2) {
    deferred.reject('Both userId and a dataUrl parameters are required.');
  } else {
    $fh.cloud({
      path: config.apiPath + '/owner/'+userId+'/upload/base64/photo.png',
      method: 'post',
      data: dataUrl
    },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    });
  }
  return deferred.promise;
}

client.list = function(userId) {
  var url = arguments.length === 0 ? config.apiPath + '/all'
    : config.apiPath + '/owner/' + userId;
  var deferred = q.defer();
  $fh.cloud({
      path: url,
      method: 'get'
    },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    }
  );
  return deferred.promise;
};

function fileUpload(fileURI, serverURI, fileUploadOptions) {
  var deferred = q.defer();
  var transfer = new FileTransfer();
  transfer.upload(fileURI, serverURI, function uploadSuccess(response) {
    deferred.resolve(response);
  }, function uploadFailure(error) {
    deferred.reject(error);
  }, fileUploadOptions);
  return deferred.promise;
};

function fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries) {
  return fileUpload(fileURI, serverURI, fileUploadOptions)
  .then(function (response) {
    return response;
  }, function (error) {
    if (retries == 0) {
      throw new Error("Can't upload to " + JSON.stringify(serverURI));
    };
    return q.delay(timeout)
    .then(function () {
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries - 1);
    });
  });
};

client.uploadFile = function(userId, fileURI, options) {
  if (arguments.length < 2) {
    return q.reject('userId and fileURI parameters are required.');
  } else {
    options = options || {};
    var fileUploadOptions = new FileUploadOptions();
    fileUploadOptions.fileKey = options.fileKey || 'binaryfile';
    fileUploadOptions.fileName = options.fileName;
    fileUploadOptions.mimeType = options.mimeType || 'image/jpeg';
    fileUploadOptions.params = {
      ownerId: userId,
      fileName: options.fileName
    };
    var timeout = options.timeout || 2000;
    var retries = options.retries || 1;
    return client.initPromise.then(function() {
      var serverURI = window.encodeURI(client.cloudUrl + config.apiPath + '/upload/binary');
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries);
    })
  };
};

client.init();

module.exports = client;

},{"./config":30,"q":"q"}],32:[function(require,module,exports){
require('./workorder-map.tpl.html.js');

},{"./workorder-map.tpl.html.js":33}],33:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.map.directives');
} catch (e) {
  ngModule = angular.module('wfm.map.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-map.tpl.html',
    '<div id=\'gmap_canvas\'></div>\n' +
    '');
}]);

},{}],34:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.map.directives', ['wfm.core.mediator']);
module.exports = 'wfm.map.directives';

require('../../dist');

ngModule.directive('workorderMap', function($templateCache, mediator, $window, $document, $timeout) {
  function initMap(element, center) {
    var myOptions = {
      zoom:14,
      center:new google.maps.LatLng(center[0], center[1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(element[0].querySelector('#gmap_canvas'), myOptions);
    return map;
  };

  function resizeMap(element, parent) {
    var mapElement = element[0].querySelector('#gmap_canvas')
    var height = parent.clientHeight;
    var width = parent.clientWidth;
    mapElement.style.height = height + 'px';
    mapElement.style.width = width + 'px';

    console.log('Map dimensions:', width, height);
    google.maps.event.trigger(mapElement, 'resize');
  };

  function addMarkers(map, element, workorders) {
    workorders.forEach(function(workorder) {
      if (workorder.location) {
        // var lat = center[0] + (Math.random() - 0.5) * 0.05;
        // var long = center[1] + (Math.random() - 0.5) * 0.2;
        var lat = workorder.location[0];
        var long = workorder.location[1];
        var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat, long)});
        var infowindow = new google.maps.InfoWindow({content:'<strong>Workorder #'+workorder.id+'</strong><br>'+workorder.address+'<br>'});
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(map,marker);
        });
      }
    });
  };

  function findParent(document, element, selector) {
    if (!selector) {
      return element.parentElement;
    }
    var matches = document.querySelectorAll(selector);
    var parent = element.parentElement;
    while(parent) {
      var isParentMatch = Array.prototype.some.call(matches, function(_match) {
        return parent === _match;
      });
      if (isParentMatch) {
        break;
      };
      var parent = parent.parentElement;
      console.log('parent', parent)
    }
    return parent || element.parentElement;
  }

  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/workorder-map.tpl.html'),
    scope: {
      list: '=',
      center: '=',
      workorders: '=',
      containerSelector: '@'
    },
    link: function (scope, element, attrs, ctrl) {
      var map = initMap(element, scope.center || [49.27, -123.08]);
      addMarkers(map, element, scope.workorders);
      var parent = findParent($document[0], element[0], scope.containerSelector);
      var resizeListener = function() {
        resizeMap(element, parent);
      }
      $timeout(resizeListener);
      angular.element($window).on('resize', resizeListener); // TODO: throttle this
      scope.$on('$destroy', function() {
        angular.element($window).off('resize', resizeListener);
      });
    },
    controller: function($scope, $window, $element) {

    },
    controllerAs: 'ctrl'
  };
})

},{"../../dist":32}],35:[function(require,module,exports){
'use strict';

module.exports = 'wfm.map';

angular.module('wfm.map', [
  require('./directive')
, require('./service')
])

},{"./directive":34,"./service":36}],36:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.map.services', ['wfm.core.mediator']);
module.exports = 'wfm.map.services';

ngModule.factory('mapClient', function() {
  var mapClient = {};
  mapClient.getCoords = function(address) {
    // invoke the google API to return the co-ordinates of the given location
    // https://developers.google.com/maps/documentation/geocoding/intro
  }
})

},{}],37:[function(require,module,exports){
'use strict';

var mediator = require('../mediator');

angular.module('wfm.core.mediator', ['ng'])

.factory('mediator', function mediatorService($q, $log) {
  var originalRequest = mediator.request;

  // monkey patch the request function, wrapping the returned promise as an angular promise
  mediator.request = function() {
    var promise = originalRequest.apply(mediator, arguments);
    return $q.when(promise);
  };

  mediator.subscribeForScope = function(topic,scope,fn) {
    var subscriber = mediator.subscribe(topic,fn);
    scope.$on("$destroy", function() {
      mediator.remove(topic, subscriber.id);
    });

  };

  return mediator;
});

module.exports = 'wfm.core.mediator';

},{"../mediator":38}],38:[function(require,module,exports){
'use strict';

var _ = require('lodash');
var Mediator = require('mediator-js').Mediator;
var q = require('q');

var mediator = new Mediator();

mediator.promise = function() {
  var deferred = q.defer();
  var cb = function(data) {
    deferred.resolve(data);
  };
  var args = [];
  Array.prototype.push.apply(args, arguments);
  args.splice(1, 0, cb);
  mediator.once.apply(mediator, args);
  return deferred.promise;
}

mediator.request = function(topic, parameters, options) {
  var topics = {}, subs = {}, complete = false, timeout;
  var deferred = q.defer();
  options = options || {};

  topics.request = topic;
  topics.done = options.doneTopic || 'done:' + topic;
  topics.error = options.errorTopic || 'error:' + topic;

  var uid = null;
  if (_.has(options, 'uid')) {
    uid = options.uid;
  } else if (typeof parameters !== "undefined" && parameters !== null) {
    uid = parameters instanceof Array ? parameters[0] : parameters;
  }

  if (uid !== null) {
     topics.done += ':' + uid;
     topics.error += ':' + uid;
  }

  if (!options.timeout) {
    options.timeout = 2000;
  };

  var cleanUp = function() {
    complete = true;
    clearTimeout(timeout);
    mediator.remove(topics.done, subs.done.id);
    mediator.remove(topics.error, subs.error.id);
  };

  subs.done = mediator.subscribe(topics.done, function(result) {
    cleanUp();
    deferred.resolve(result);
  });

  subs.error = mediator.subscribe(topics.error, function(error) {
    cleanUp();
    deferred.reject(error);
  });

  var args = [topics.request];
  if (parameters instanceof Array) {
    Array.prototype.push.apply(args, parameters);
  } else {
    args.push(parameters);
  }
  mediator.publish.apply(mediator, args);

  timeout = setTimeout(function() {
    if (!complete) {
      cleanUp();
      deferred.reject(new Error('Mediator request timeout for topic ' +  topic));
    }
  }, options.timeout);

  return deferred.promise;
};

module.exports = mediator;

},{"lodash":"lodash","mediator-js":"mediator-js","q":"q"}],39:[function(require,module,exports){
require('./message-detail.tpl.html.js');
require('./message-form.tpl.html.js');
require('./message-list.tpl.html.js');

},{"./message-detail.tpl.html.js":40,"./message-form.tpl.html.js":41,"./message-list.tpl.html.js":42}],40:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-detail.tpl.html',
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <md-button ng-click="ctrl.closeMessage($event, ctrl.message)" hide-gt-sm class="md-icon-button">\n' +
    '      <md-icon aria-label="Close" md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '    <h3>\n' +
    '     {{ctrl.message.subject}}\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '  <div class="message" layout-padding layout-margin>\n' +
    '\n' +
    '    <div class="message-header">\n' +
    '      <div class="md-body-1">\n' +
    '        <span>From:</span> {{ctrl.message.sender.name}}\n' +
    '      </div>\n' +
    '      <div class="md-body-1">\n' +
    '        <span>To:</span> {{ctrl.message.receiver.name}}\n' +
    '      </div>\n' +
    '      <div class="md-body-1">\n' +
    '        <span>Status:</span> {{ctrl.message.status}}\n' +
    '      </div>\n' +
    '      <!--<div class="md-body-1 time-stamp">11:38 AM (3 hours ago)</div>-->\n' +
    '    </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <p class="md-body-1">{{ctrl.message.content}}</p>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],41:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-form.tpl.html',
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>New message</h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '\n' +
    '<form name="messageForm" ng-submit="ctrl.done(messageForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '  <!--\n' +
    '  <md-input-container>\n' +
    '    <label for="messageState">Status</label>\n' +
    '    <input type="text" id="inputmessageType" name="messageStatus" ng-model="ctrl.model.status" disabled="true">\n' +
    '  </md-input-container>\n' +
    '  -->\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.receiver.$invalid && !messageForm.receiver.$pristine }">\n' +
    '    <label for="selectReceiver">To</label>\n' +
    '    <md-select ng-model="ctrl.model.receiver" name="receiver" id="selectReceiver" required>\n' +
    '       <md-option ng-repeat="worker in ctrl.workers" value="{{worker}}">{{worker.name}} ({{worker.position}})</md-option>\n' +
    '     </md-select>\n' +
    '     <div ng-messages="messageForm.receiver.$error" ng-if="ctrl.submitted || messageForm.receiver.$dirty">\n' +
    '       <div ng-message="required">The To: field is required.</div>\n' +
    '     </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.subject.$invalid && !messageForm.subject.$pristine }">\n' +
    '    <label for="inputSubject">Subject</label>\n' +
    '    <input type="text" id="inputSubject" name="subject" ng-model="ctrl.model.subject" required>\n' +
    '    <div ng-messages="messageForm.subject.$error" ng-if="ctrl.submitted || messageForm.subject.$dirty">\n' +
    '      <div ng-message="required">A subject is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : messageForm.content.$invalid && !messageForm.content.$pristine }">\n' +
    '    <label for="inputContent">Message</label>\n' +
    '    <textarea id="inputContent" name="content" ng-model="ctrl.model.content" required md-maxlength="350"></textarea>\n' +
    '\n' +
    '    <div ng-messages="messageForm.content.$error" ng-show="ctrl.submitted || messageForm.content.$dirty">\n' +
    '      <div ng-message="required">Message content is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">Send message</md-button>\n' +
    '</form>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

},{}],42:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.message.directives');
} catch (e) {
  ngModule = angular.module('wfm.message.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/message-list.tpl.html',
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Messages</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search"  hide-xs hide-sm>\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" id="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '\n' +
    '<div class="messages">\n' +
    '\n' +
    '  <md-list>\n' +
    '    <md-list-item class="md-3-line" ng-repeat="message in ctrl.list | reverse" ng-click="ctrl.selectMessage($event, message)" class="md-3-line workorder-item"\n' +
    '     ng-class="{active: ctrl.selected.id === message.id, new: message.status === \'unread\'}">\n' +
    '      <img ng-src="{{message.sender.avatar}}" class="md-avatar" alt="{{message.sender.name}}" />\n' +
    '      <div class="md-list-item-text" layout="column">\n' +
    '        <!--<span class="md-caption time-stamp">13 mins ago</span>-->\n' +
    '        <h3>{{message.sender.name}}</h3>\n' +
    '        <h4>{{message.subject}}</h4>\n' +
    '        <p>{{message.content}}</p>\n' +
    '      </div>\n' +
    '      <md-divider md-inset></md-divider>\n' +
    '    </md-list-item>\n' +
    '  </md-list>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

},{}],43:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.message.directives', ['wfm.core.mediator']);
module.exports = 'wfm.message.directives';

require('../../dist');

ngModule.directive('messageList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-list.tpl.html')
  , scope: {
      list : '=list',
      selectedModel: '='
    }
  , controller: function($scope) {
        var self = this;
        self.list = $scope.list;
        self.selected = $scope.selectedModel;
        self.selectMessage = function(event, message) {
        self.selectedMessageId = message.id;
        mediator.publish('wfm:message:selected', message);
        event.preventDefault();
        event.stopPropagation();
      }
      self.ismessageShown = function(message) {
        return self.shownmessage === message;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.list = $scope.list.filter(function(message) {
          return String(message.sender.name).toLowerCase().indexOf(term) !== -1
            || String(message.subject).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})

.directive('messageForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-form.tpl.html')
  , scope: {
    message : '=value'
  , workers: '='
    }
  , controller: function($scope) {
      var self = this;
      self.model = angular.copy($scope.message);
      self.workers = $scope.workers;
      self.submitted = false;
      self.done = function(isValid) {
        self.submitted = true;
        self.model.receiver = JSON.parse(self.model.receiver);
        self.model.receiverId = self.model.receiver.id;
        self.model.status = "unread";
        if (isValid) {
            mediator.publish('wfm:message:created', self.model);
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('messageDetail', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/message-detail.tpl.html')
  , scope: {
    message : '=message'
    }
  , controller: function($scope) {
      var self = this;
      self.message = $scope.message;
      self.showSelectButton = !! $scope.$parent.messages;
      self.selectmessage = function(event, message) {
        mediator.publish('wfm:message:selected', message);
        event.preventDefault();
        event.stopPropagation();
      }
      self.closeMessage = function(event, message) {
        mediator.publish('wfm:message:close:' + message.id);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})
;

},{"../../dist":39}],44:[function(require,module,exports){
'use strict';

module.exports = 'wfm.message';

angular.module('wfm.message', [
  require('./directive')
, require('./sync-service')
])

},{"./directive":43,"./sync-service":45}],45:[function(require,module,exports){
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.message.sync';

function removeLocalVars(object) {
  _.keys(object).filter(function(key) {
    return key.indexOf('_') === 0;
  }).forEach(function(localKey) {
    delete object[localKey];
  });
  if (object.results) {
    _.values(object.results).forEach(function(result) {
      _.keys(result.submission).filter(function(key) {
        return key.indexOf('_') === 0;
      }).forEach(function(localKey) {
        delete result.submission[localKey];
      });
    });
  };
};

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var message = {
        type: 'Message'
      , status: 'New'
      };
      deferred.resolve(message);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.message.sync', [require('fh-wfm-sync')])
.factory('messageSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var messageSync = {};
  messageSync.createManager = function(queryParams) {
    if (messageSync.manager) {
      return $q.when(messageSync.manager);
    } else {
      return messageSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        messageSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        return messageSync.manager;
      })
    }
  };
  messageSync.removeManager = function() {
    if (messageSync.manager) {
      return messageSync.manager.safeStop()
      .then(function() {
        delete messageSync.manager;
      })
    }
  }
  return messageSync;
})
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
;

},{"../config":46,"fh-wfm-sync":64,"lodash":"lodash"}],46:[function(require,module,exports){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/message',
  datasetId : 'messages',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],47:[function(require,module,exports){
'use strict';

module.exports = 'wfm.result';

angular.module('wfm.result', [
  require('./service')
])

},{"./service":48}],48:[function(require,module,exports){
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.result.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.getByWorkorderId = function(workorderId) {
    return wrappedManager.list()
    .then(function(results) {
      return wrappedManager.filterByWorkorder(results, workorderId);
    });
  };
  wrappedManager.filterByWorkorder = function(resultsArray, workorderId) {
    var deferred = $q.defer();
    var filtered = resultsArray.filter(function(result) {
      return String(result.workorderId) === String(workorderId);
    });
    var result =  filtered && filtered.length ? filtered[0] : {};
    deferred.resolve(result);
    return deferred.promise;
  };
  wrappedManager.extractAppformSubmissionIds = function(result) {
    var submissionIds = null;
    if ( result && result.stepResults && ! _.isEmpty(result.stepResults)) {
      var appformStepResults = _.filter(result.stepResults, function(stepResult) {
        return !! stepResult.step.formId;
      });
      if (! _.isEmpty(appformStepResults)) {
        submissionIds = _.map(appformStepResults, function(stepResult) {
          return stepResult.submission.submissionId;
        }).filter(function(id) {
          return !! id;
        });
      };
    };
    return submissionIds;
  }
  return wrappedManager;
}

angular.module('wfm.result.sync', [require('fh-wfm-sync')])
.factory('resultSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var resultSync = {};
  resultSync.managerPromise = syncService.manage(config.datasetId)
  .then(function(manager) {
    resultSync.manager = wrapManager($q, $timeout, manager);
    console.log('Sync is managing dataset:', config.datasetId);
    return resultSync.manager;
  });
  return resultSync;
})

.filter('isEmpty', function () {
  return function (object) {
    return (Object.keys(object).length === 0);
  };
})

.run(function(mediator, resultSync) {
  mediator.subscribe('wfm:appform:submission:complete', function(event) {
    var metaData = event.metaData.wfm;
    var submissionResult = event.submissionResult;
    resultSync.managerPromise
    .then(function(manager) {
      return manager.getByWorkorderId(metaData.workorderId)
      .then(function(result) {
        var stepResult = result.stepResults[metaData.step.code];
        stepResult.submission = submissionResult;
        return manager.update(result);
      })
    })
    .then(function(result) {
      mediator.publish('wfm:result:remote-update:' + result.workorderId, result);
    })
  })
})
;

},{"../config":49,"fh-wfm-sync":64,"lodash":"lodash"}],49:[function(require,module,exports){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/result',
  datasetId : 'result',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],50:[function(require,module,exports){
require('./risk-assessment-form.tpl.html.js');
require('./risk-assessment.tpl.html.js');

},{"./risk-assessment-form.tpl.html.js":51,"./risk-assessment.tpl.html.js":52}],51:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.risk-assessment');
} catch (e) {
  ngModule = angular.module('wfm.risk-assessment', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/risk-assessment-form.tpl.html',
    '  <div ng-show="riskAssessmentStep === 0" layout-padding class="risk-assesssment">\n' +
    '      <h2 class="md-title">Risk assessment complete?</h2>\n' +
    '      <p class="md-body-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n' +
    '\n' +
    '      <p class="md-body-1">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-warn" ng-click="ctrl.answerComplete($event, true)">No</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.answerComplete($event, true)">Yes</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '\n' +
    '  </div>\n' +
    '\n' +
    '  <div ng-if="riskAssessmentStep == 1" layout-padding>\n' +
    '\n' +
    '    <h3 class="md-title">Signature</h3>\n' +
    '    <p class="md-caption">Draw your signature inside the square</p>\n' +
    '    <signature-form value="ctrl.model.signature"></signature-form>\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.done($event)">Continue</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '  </div>\n' +
    '');
}]);

},{}],52:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.risk-assessment');
} catch (e) {
  ngModule = angular.module('wfm.risk-assessment', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/risk-assessment.tpl.html',
    '  <md-subheader>Risk Assessment</md-subheader>\n' +
    '\n' +
    '  <md-list class="risk-assessment">\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="riskAssessment.complete" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! riskAssessment.complete" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="riskAssessment.complete">Complete</h3>\n' +
    '        <h3 ng-if="! riskAssessment.complete">Uncompleted</h3>\n' +
    '        <p>Risk Assessment</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line with-image">\n' +
    '      <md-icon md-font-set="material-icons">gesture</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3><signature value="riskAssessment.signature"></signature></h3>\n' +
    '        <p>Risk Assessment signature</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '</md-list>\n' +
    '');
}]);

},{}],53:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.risk-assessment', ['wfm.core.mediator', require('fh-wfm-signature')])

require('../../dist');

ngModule.directive('riskAssessment', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/risk-assessment.tpl.html')
  , scope: {
      riskAssessment: "=value"
    }
  , controller: function($scope) {
      var self = this;
    }
  , controllerAs: 'ctrl'
  };
})

ngModule.directive('riskAssessmentForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/risk-assessment-form.tpl.html')
  , scope: {
    }
  , controller: function($scope) {
      var self = this;
      $scope.riskAssessmentStep = 0
      self.model = {};
      self.answerComplete = function(event, answer) {
        self.model.complete = answer;
        $scope.riskAssessmentStep++;
        event.preventDefault();
        event.stopPropagation();
      };
      self.back = function(event) {
        mediator.publish('wfm:workflow:step:back');
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(event) {
        mediator.publish('wfm:workflow:step:done', self.model);
        event.preventDefault();
        event.stopPropagation();
      };
    }
  , controllerAs: 'ctrl'
  };
})
;

module.exports = 'wfm.risk-assessment';

},{"../../dist":50,"fh-wfm-signature":62}],54:[function(require,module,exports){
require('./schedule-workorder-chip.tpl.html.js');
require('./schedule.tpl.html.js');

},{"./schedule-workorder-chip.tpl.html.js":55,"./schedule.tpl.html.js":56}],55:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.schedule.directives');
} catch (e) {
  ngModule = angular.module('wfm.schedule.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/schedule-workorder-chip.tpl.html',
    '<span class="wfm-chip wfm-chip-no-picture" style="width:300px;">\n' +
    '  <span class="wfm-chip-name" >{{ctrl.workorder.type}} - {{ctrl.workorder.title}}</span>\n' +
    '</span>\n' +
    '');
}]);

},{}],56:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.schedule.directives');
} catch (e) {
  ngModule = angular.module('wfm.schedule.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/schedule.tpl.html',
    '<md-toolbar class="wfm-scheduler-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Scheduler</span>\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-datepicker ng-model="ctrl.scheduleDate" md-placeholder="Enter date" ng-change="ctrl.dateChange()"></md-datepicker>\n' +
    '    <!--\n' +
    '    <md-button class="md-icon-button" aria-label="Favorite">\n' +
    '    <md-icon md-font-set="material-icons">date_range</md-icon>\n' +
    '  </md-button>\n' +
    '-->\n' +
    '</div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<div layout="row">\n' +
    '  <div flex="70">\n' +
    '\n' +
    '    <table class="wfm-scheduler">\n' +
    '      <col width="30">\n' +
    '      <col width="70">\n' +
    '      <tr>\n' +
    '        <td class="wfm-scheduler-worker">\n' +
    '          <div class="wfm-toolbar-sm">\n' +
    '            <h3 class="md-subhead">\n' +
    '              Workers\n' +
    '            </h3>\n' +
    '          </div>\n' +
    '          <md-list>\n' +
    '            <md-list-item ng-repeat="worker in ctrl.workers">\n' +
    '              <img alt="Name" ng-src="{{worker.avatar}}" class="md-avatar" />\n' +
    '              <p>{{worker.name}}</p>\n' +
    '            </md-list-item>\n' +
    '          </md-list>\n' +
    '        </td>\n' +
    '        <td class="wfm-scheduler-calendar">\n' +
    '          <table>\n' +
    '            <tr><th ng-repeat="hour in [\'7am\', \'8am\', \'9am\', \'10am\', \'11am\', \'12pm\', \'1pm\', \'2pm\', \'3pm\', \'4pm\', \'5pm\', \'6pm\', \'7pm\']">{{hour}}</th></tr>\n' +
    '            <tr ng-repeat="worker in ctrl.workers">\n' +
    '              <td ng-repeat="hour in [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]" droppable="true" data-hour="{{hour}}" data-workerId="{{worker.id}}"></td>\n' +
    '            </tr>\n' +
    '          </table>\n' +
    '          <div class="wfm-scheduler-scheduled"></div>\n' +
    '        </td>\n' +
    '      </tr>\n' +
    '    </table>\n' +
    '  </div>\n' +
    '\n' +
    '  <div flex="30" class="wfm-scheduler-unscheduled" id="workorders-list" droppable="true">\n' +
    '    <div class="wfm-toolbar-sm">\n' +
    '      <h3 class="md-subhead">\n' +
    '        Workorders\n' +
    '      </h3>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

},{}],57:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.schedule.directives', ['wfm.core.mediator']);
module.exports = 'wfm.schedule.directives';

var _ = require('lodash');

require('../../dist');

ngModule.directive('schedule', function($templateCache, $compile, $timeout, mediator) {
  function getWorkerRowElements(element, workerId) {
    return element.querySelectorAll('[data-workerId="'+workerId+'"]');
  }

  function getHourElement(rowElements, hour) {
    var hourElement = Array.prototype.filter.call(rowElements, function(_hourElement) {
      return _hourElement.dataset.hour === String(hour);
    });
    return (hourElement.length) ? hourElement[0] : null;
  }

  function renderWorkorder(scope, parentElement, workorder) {
    var element = angular.element(parentElement);
    var _workorder = scope.workorder;
    scope.workorder = workorder;
    var chip = angular.element('<schedule-workorder-chip workorder="workorder" draggable="true"></schedule-workorder-chip>');

    if (!parentElement.classList.contains('wfm-scheduler-unscheduled')) {
      var hourElement = parentElement;
      parentElement = document.querySelector('.wfm-scheduler-scheduled');
      angular.element(parentElement).append(chip);
      $compile(chip)(scope);
      $timeout(function() {
        chip[0].style.position = 'absolute'
        chip[0].style.left = hourElement.offsetLeft + 'px';
        chip[0].style.top = hourElement.offsetTop + 'px';
      })
    } else {
      element.append(chip);
      $compile(chip)(scope);
    }
    chip[0].id = workorder.id;
    chip[0].dataset.workorderId = workorder.id;
    scope.workorder = _workorder;
  }

  function renderWorkorders(scope, element, workorders) {
    var workordersByWorker = {};
    workorders.forEach(function(workorder) {
      workordersByWorker[workorder.assignee] = workordersByWorker[workorder.assignee] || [];
      workordersByWorker[workorder.assignee].push(workorder);
    });

    _.forIn(workordersByWorker, function(workorders, workerId) {
      var workerRowElements = getWorkerRowElements(element, workerId);
      workorders.forEach(function(workorder) {
        var hour = new Date(workorder.startTimestamp).getHours();
        var hourElement = getHourElement(workerRowElements, hour);
        if (hourElement) {
          renderWorkorder(scope, hourElement, workorder);
        }
      });
    });
  }

  function renderUnscheduledWorkorderList(scope, ctrl, element) {
    var unscheduled = scope.workorders.filter(function(workorder) {
      return workorder.assignee == null || workorder.startTimestamp == null;
    });
    var unscheduledWorkorderList = element.querySelector('.wfm-scheduler-unscheduled');
    unscheduled.forEach(function(workorder) {
      renderWorkorder(scope, unscheduledWorkorderList, workorder);
    })
  }

  function scheduleWorkorder(workorder, workerId, date, hour) {
    workorder.assignee = workerId;
    if (date != null && hour !== null) {
      date.setHours(hour);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      workorder.startTimestamp = date.getTime();
    } else {
      workorder.startTimestamp = null;
    }
  }

  function getWorkorder(workorders, id) {
    var filtered = workorders.filter(function(workorder) {
      return String(workorder.id) === String(id);
    })
    return filtered.length ? filtered[0] : null;
  }

  function getWorker(workers, id) {
    var filtered = workers.filter(function(worker) {
      return worker.id === id;
    })
    return filtered.length ? filtered[0] : null;
  }

  function removeWorkorders(element) {
    var scheduled = element.querySelector('.wfm-scheduler-scheduled');
    while(scheduled.hasChildNodes()) {
      scheduled.removeChild(scheduled.firstChild);
    }
  }

  function render(scope, ctrl, element) {
    var workordersOnDate = scope.workorders.filter(function(workorder) {
      return new Date(workorder.startTimestamp).toDateString() === ctrl.scheduleDate.toDateString();
    });
    renderWorkorders(scope, element, workordersOnDate);
  }

  function updateWorkorder(workorder) {
    return mediator.request('wfm:schedule:workorder', workorder, {uid: workorder.id})
  }

  function workorderUpdated(scope, schedulerElement, workorder) {
    var previousChipElement = document.getElementById(workorder.id);
    if (previousChipElement) {
      previousChipElement.parentNode.removeChild(previousChipElement);
    }
    var parentElement;
    if (workorder.assignee && workorder.startTimestamp) {
      var workerRowElements = getWorkerRowElements(schedulerElement[0], workorder.assignee);
      var hour = new Date(workorder.startTimestamp).getHours();
      parentElement = getHourElement(workerRowElements, hour);
    }
    parentElement = parentElement || schedulerElement[0].querySelector('.wfm-scheduler-unscheduled');
    renderWorkorder(scope, parentElement, workorder);
    var index = _.findIndex(scope.workorders, function(_workorder) {
      return _workorder.id === workorder.id;
    })
    if (index >= 0) {
      scope.workorders[index] = workorder;
    }
  }

  function dragover(e, scope) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  };

  function dragenter(e) {
    this.classList.add('dragover');
  };

  function dragleave(e) {
    this.classList.remove('dragover');
  };

  function drop(e, scope, schedulerElement, unscheduledWorkorderList) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    var workorder = getWorkorder(scope.workorders, e.dataTransfer.getData('workorderid'));
    var dropElement = e.currentTarget;
    dropElement.classList.remove('dragover');
    var scheduledWorkorder = angular.copy(workorder);
    if (dropElement.id === 'workorders-list') {
      scheduleWorkorder(scheduledWorkorder, null, null, null);
    } else {
      var workerId = dropElement.dataset.workerid;
      var hour = dropElement.dataset.hour;
      scheduleWorkorder(scheduledWorkorder, workerId, scope.ctrl.scheduleDate, hour);
    }
    updateWorkorder(scheduledWorkorder)
      .then(function(updated) {
        workorderUpdated(scope, schedulerElement, updated)
      })
      .catch(function(error) {
        console.error(error);
      })
    return false;
  }

  function sizeCalendar(element) {
    var calendar = element[0].querySelector('.wfm-scheduler-calendar');
    calendar.style.position = 'inherit';
    var width =  calendar.clientWidth;
    calendar.style.position = 'absolute';
    calendar.style.width = width + 'px';
  }

  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/schedule.tpl.html'),
    scope: {
      workorders : '=',
      workers: '='
    },
    link: function (scope, element, attrs) {
      // Get the three major events
      $timeout(function afterDigest() {
        sizeCalendar(element);
        element[0].addEventListener('dragstart', function(event) {
          if (!event.srcElement.getAttribute || event.srcElement.getAttribute('draggable') !== 'true') {
            event.preventDefault();
            return;
          }
          var chip = event.srcElement;
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('workorderid', chip.dataset.workorderId);
        });
        var droppables = element[0].querySelectorAll('[droppable=true]');
        var unscheduledWorkorderList = element[0].querySelector('.wfm-scheduler-unscheduled');

        Array.prototype.forEach.call(droppables, function(droppable) {
          droppable.addEventListener('dragover', dragover);
          droppable.addEventListener('dragenter', dragenter);
          droppable.addEventListener('dragleave', dragleave);
          droppable.addEventListener('drop', function(e) {
            return drop(e, scope, element);
          });
        });
      });
    },
    controller: function($scope, $timeout, $element, $window) {
      var self = this;
      self.scheduleDate = new Date();
      $window.addEventListener('resize', function() {
        sizeCalendar($element);
      })
      renderUnscheduledWorkorderList($scope, self, $element[0]);
      self.dateChange = function() {
        removeWorkorders($element[0]);
        render($scope, self, $element[0]);

      }
      $timeout(function() {
        render($scope, self, $element[0]);
      })
      self.workers = $scope.workers;
    },
    controllerAs: 'ctrl'
  };
});

ngModule.directive('scheduleWorkorderChip', function($templateCache) {
  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/schedule-workorder-chip.tpl.html'),
    scope: {
      workorder : '='
    },
    controller: function($scope) {
      this.workorder = $scope.workorder;
    },
    controllerAs: 'ctrl'
  };
});

},{"../../dist":54,"lodash":"lodash"}],58:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./directive":57,"dup":5}],59:[function(require,module,exports){
require('./signature-form.tpl.html.js');
require('./signature.tpl.html.js');

},{"./signature-form.tpl.html.js":60,"./signature.tpl.html.js":61}],60:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.signature');
} catch (e) {
  ngModule = angular.module('wfm.signature', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/signature-form.tpl.html',
    '<div class="signature-form">\n' +
    '  <canvas tabindex="0"></canvas>\n' +
    '</div>\n' +
    '');
}]);

},{}],61:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.signature');
} catch (e) {
  ngModule = angular.module('wfm.signature', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/signature.tpl.html',
    '<img ng-src="{{ctrl.signature}}"></img>\n' +
    '');
}]);

},{}],62:[function(require,module,exports){
'use strict';

var canvasDrawr = require('../canvas-drawr');

module.exports = 'wfm.signature';

var ngModule = angular.module('wfm.signature', ['wfm.core.mediator'])

require('../../dist');

ngModule.directive('signatureForm', function($templateCache, $document, $timeout, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/signature-form.tpl.html')
  , scope: {
      value: '=',
      options: '='
    }
  , link: function (scope, element, attrs, ctrl) {
      var options = scope.options || {};
      console.log('touch support', 'ontouchstart' in $document[0]);
      var drawr = 'ontouchstart' in $document[0]
        ? new canvasDrawr.CanvasDrawr(element, options, $document)
        : new canvasDrawr.CanvasDrawrMouse(element, options, $document);

      var $canvas = angular.element(element[0].getElementsByTagName('canvas')[0]);
      $timeout(function() {
        $canvas.on('blur', function() {
          scope.$apply(function() {
            ctrl.submit(element);
          })
        });
      })
    }
  , controller: function($scope) {
      var self = this;
      self.submit = function(element) {
        var canvas = element[0].getElementsByTagName('canvas')[0];
        $scope.value = canvas.toDataURL();
      }
    }
  , controllerAs: 'ctrl'
  };
})

ngModule.directive('signature', function($templateCache) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/signature.tpl.html')
  , scope: {
      value: '='
    }
  , controller: function($scope) {
      var self = this;
      self.signature = $scope.value;
    }
  , controllerAs: 'ctrl'
  };
})
;

},{"../../dist":59,"../canvas-drawr":63}],63:[function(require,module,exports){
'use strict';

var CanvasDrawrMouse = function (element, options) {
  var canvas = element[0].getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext("2d");
  canvas.style.width = '100%';
  canvas.width = (window.innerWidth);
  canvas.height = 200;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctx.lineWidth = options.size || 5;
  ctx.lineCap = options.lineCap || "round";
  options.color = options.color || 'blue';

  // last known position
  var pos = { x: 0, y: 0 };

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', setPosition);
  canvas.addEventListener('mouseup', stop);
  canvas.addEventListener('mouseout', stop);

  // new position from mouse event
  function setPosition(e) {
    e.preventDefault();
    e.stopPropagation();
    canvas.focus();
    var rect = canvas.getBoundingClientRect();
    var offset = {
      top: rect.top,
      left: rect.left
    };
    pos.x = e.clientX - offset.left;
    pos.y = e.clientY - offset.top;
  }

  function draw(e) {
    e.preventDefault();
    e.stopPropagation();
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.strokeStyle = options.color;

    ctx.moveTo(pos.x, pos.y); // from

    var rect = canvas.getBoundingClientRect();
    var offset = {
      top: rect.top,
      left: rect.left
    };
    pos.x = e.clientX - offset.left;
    pos.y = e.clientY - offset.top;
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!

  }

  function stop() {
    canvas.blur();
  }
};

var CanvasDrawr = function(element, options, $document) {
  var canvas = element[0].getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');
  canvas.style.width = '100%'
  canvas.width = canvas.offsetWidth;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctx.lineWidth = options.size || 5;
  ctx.lineCap = options.lineCap || 'round';
  options.color = options.color || 'blue';
  ctx.pX = undefined;
  ctx.pY = undefined;

  var lines = [,,];
  var rect = canvas.getBoundingClientRect();

  var offset = {
    top: rect.top + $document[0].body.scrollTop,
    left: rect.left + $document[0].body.scrollLeft
  };

  var self = {
    //bind click events
    init: function() {
      // use anguler.element#on for automatic listener cleanup
      var canvasNg = angular.element(canvas);
      //set pX and pY from first click
      canvasNg.on('touchstart', self.preDraw);
      canvasNg.on('touchmove', self.draw);
      canvasNg.on('touchend', self.stop);
      canvasNg.on('touchcancel', self.stop);
    },

    preDraw: function(event) {
      canvas.focus();
      rect = canvas.getBoundingClientRect();
      offset = {
        top: rect.top + $document[0].body.scrollTop,
        left: rect.left + $document[0].body.scrollLeft
      };

      for (var i = 0; i < event.touches.length; i++) {
        var touch = event.touches[i];
        var id      = touch.identifier;

        lines[id] = {
          x     : touch.pageX - offset.left,
          y     : touch.pageY - offset.top,
          color : options.color
        };
      };
      event.preventDefault();
      event.cancelBubble = true;
    },

    draw: function(event) {
      for (var i = 0; i < event.touches.length; i++) {
        var touch = event.touches[i];
        var id = touch.identifier,

        moveX = touch.pageX - offset.left - lines[id].x,
        moveY = touch.pageY - offset.top - lines[id].y;

        var ret = self.move(id, moveX, moveY);
        lines[id].x = ret.x;
        lines[id].y = ret.y;
      };

      event.preventDefault();
    },

    move: function(i, changeX, changeY) {
      ctx.strokeStyle = lines[i].color;
      ctx.beginPath();
      ctx.moveTo(lines[i].x, lines[i].y);

      ctx.lineTo(lines[i].x + changeX, lines[i].y + changeY);
      ctx.stroke();
      ctx.closePath();

      return { x: lines[i].x + changeX, y: lines[i].y + changeY };
    },

    stop: function() {
      canvas.blur();
    }
  };

  return self.init();
}

module.exports = {
  CanvasDrawr: CanvasDrawr,
  CanvasDrawrMouse: CanvasDrawrMouse
};

},{}],64:[function(require,module,exports){
'use strict';

var sync = require('../client')

module.exports = 'wfm.sync.service';

angular.module('wfm.sync.service', [])

.factory('syncService', function($q) {
  var syncService = {};
  var managerPromise;

  function ManagerWrapper(_manager) {
    this.manager = _manager;
    var self = this;

    var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'getQueueSize', 'forceSync', 'waitForSync'];
    methodNames.forEach(function(methodName) {
      self[methodName] = function() {
        return $q.when(self.manager[methodName].apply(self.manager, arguments));
      }
    });
  };

  syncService.init = function($fh, syncOptions) {
    sync.init($fh, syncOptions);
  }

  syncService.manage = function(datasetId, options, queryParams, metaData) {
    return $q.when(sync.manage(datasetId, options, queryParams, metaData))
    .then(function(_manager) {
      var manager = new ManagerWrapper(_manager);
      manager.stream = _manager.stream;
      return manager;
    });
  };

  return syncService;
})
;

},{"../client":65}],65:[function(require,module,exports){
'use strict';

var _ = require('lodash')
  , q = require('q')
  , defaultConfig = require('./config')
  , Rx = require('rx')
  ;

var $fh, initialized = false, notificationStream, listeners = [];

function transformDataSet(syncData) {
  var result = _.values(syncData).map(function(syncData) {
    return syncData.data;
  });
  return _.sortBy(result, function(o) { return o.id; });
}

function formatError(code, msg) {
  var error = 'Error';
  if (code && msg) {
    error += ' ' + code + ': ' + msg;
  } else if (code && !msg) {
    error += ': ' + code;
  } else if (!code && msg) {
    error += ': ' + msg;
  } else {
    error += ': no error details available'
  }
  return error;
}

function init(_$fh, _syncOptions) {
  if (initialized) {
    console.log('sync-client already initalized.');
  } else {
    console.log('sync-client initalizing.');
    $fh = _$fh;
    notificationStream = Rx.Observable.create(function (observer) {
      addListener(function(notification) {
        observer.onNext(notification);
      });
    })
    .share();
    var syncOptions = _.defaults(_syncOptions, defaultConfig.syncOptions);

    $fh.sync.init(syncOptions);
    initialized = true;
    $fh.sync.notify(function(notification) {
      listeners.forEach(function(listener) {
        listener.call(undefined, notification);
      });
    });
  }
};

function manage(datasetId, options, queryParams, metaData) {
  var deferred = q.defer();
  if (!initialized) {
    deferred.resolve('Sync not yet initialized.  Call sync-client.init() first.');
  } else {
    //manage the dataSet
    $fh.sync.manage(datasetId, options, queryParams, metaData, function() {
      var manager = new DataManager(datasetId);
      manager.stream = notificationStream.filter(function(notification) {
        return notification.dataset_id == datasetId;
      })
      deferred.resolve(manager);
    });
  }
  return deferred.promise;
}

function addListener(listener) {
  listeners.push(listener);
}

function DataManager(datasetId) {
  this.datasetId = datasetId;
}

DataManager.prototype.list = function() {
  var deferred = q.defer();
  $fh.sync.doList(this.datasetId, function(res) {
    var objects = transformDataSet(res);
    deferred.resolve(objects);
  }, function(code, msg) {
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.create = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doCreate(self.datasetId, object, function(msg) {
    // success
    self.stream.filter(function(notification) {
      return notification.code == 'local_update_applied'
        && notification.message == 'create'
        ; // && notification.uid == object._localuid;  TODO: get the sync framework to include the temporary uid in the notification
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      object._localuid = msg.uid;
      return self.update(object);
    })
    .then(function(result) {
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.read = function(id) {
  var deferred = q.defer();
  $fh.sync.doRead(this.datasetId, id, function(res) {
    // success
    deferred.resolve(res.data);
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.update = function(object) {
  var deferred = q.defer();
  var self = this;
  var uidPromise = _.has(object, 'id')
    ? q.when(String(object.id))
    : self.read(object._localuid).then(function(_object) {
      console.log('_object', _object)
      if (_.has(_object, 'id')) {
        object.id = _object.id;
        return String(_object.id);
      } else {
        return object._localuid;
      }
    });
  uidPromise.then(function(uid) {
    console.log('updating with id', uid)
  $fh.sync.doUpdate(self.datasetId, uid, object, function(msg) {
    // success
    self.stream.filter(function(notification) {
      return notification.code === 'local_update_applied'
        && notification.message === 'update'
        && notification.uid === uid;
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      return self.read(uid);
    })
    .then(function(result) {
      console.log('result', result)
      deferred.resolve(result);
    })
  }, function(code, msg) {
    // failure
    console.error('Error updating', object);
    deferred.reject(new Error(formatError(code, msg)));
  });
});
  return deferred.promise;
};

DataManager.prototype.delete = function(object) {
  var deferred = q.defer();
  var self = this;
  $fh.sync.doDelete(self.datasetId, object.id, function(res) {
    // success
    var uid = String(object.id);
    self.stream.filter(function(notification) {
      return notification.code === 'local_update_applied'
        && notification.message === 'delete'
        && String(notification.uid) === uid;
    }).take(1).toPromise(q.Promise)
    .then(function(notification) {
      deferred.resolve(notification.message);
    })
  }, function(code, msg) {
    // failure
    deferred.reject(new Error(formatError(code, msg)));
  });
  return deferred.promise;
};

DataManager.prototype.start = function() {
  var deferred = q.defer();
  $fh.sync.startSync(this.datasetId, function(){
    deferred.resolve('sync loop started');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.stop = function() {
  var deferred = q.defer();
  var self = this;
  $fh.sync.stopSync(this.datasetId, function(){
    if (self.recordDeltaReceivedSubscription) {
      self.recordDeltaReceivedSubscription.dispose();
    }
    deferred.resolve('sync loop stopped');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.forceSync = function() {
  var deferred = q.defer();
  $fh.sync.forceSync(this.datasetId, function(){
    deferred.resolve('sync loop will run');
  }, function(error){
    deferred.reject(error);
  });
  return deferred.promise;
};

DataManager.prototype.getQueueSize = function() {
  var deferred = q.defer();
  $fh.sync.getPending(this.datasetId, function(pending) {
    deferred.resolve(_.size(pending));
  });
  return deferred.promise;
}

DataManager.prototype.safeStop = function(userOptions) {
  var deferred = q.defer();
  var defaultOptions = {
    timeout: 2000
  }
  var self = this;
  var options = _.defaults(userOptions, defaultOptions);
  self.getQueueSize()
  .then(function(size) {
    if (size === 0) {
      self.stop().then(deferred.resolve);
    } else {
      deferred.notify('Calling forceSync sync before stop');
      return self.forceSync()
      .then(self.waitForSync.bind(self))
      .timeout(options.timeout)
      .then(self.getQueueSize.bind(self))
      .then(function(size) {
        if (size > 0) {
          deferred.reject(new Error('forceSync failed, outstanding results still present'));
        };
      })
      .then(self.stop.bind(self))
      .then(function() {
        deferred.resolve()
      }, function(error) {
        deferred.reject(new Error('forceSync timeout'));
      });
    }
  });
  return deferred.promise;
}

DataManager.prototype.waitForSync = function() {
  var deferred = q.defer();
  var self = this;
  self.stream.filter(function(notification) {
    return notification.code == 'sync_complete' || notification.code == 'sync_failed';
  }).take(1).toPromise(q.Promise)
  .then(function(notification) {
    if (notification.code === 'sync_complete') {
      deferred.resolve(notification);
    } else if (notification.code === 'sync_failed') {
      deferred.reject(new Error('Sync Failed', notification));
    }
  });
  return deferred.promise;
}

DataManager.prototype.publishRecordDeltaReceived = function(mediator) {
  var self = this;
  self.recordDeltaReceivedSubscription = self.stream.filter(function(notification) {
    return notification.code == 'record_delta_received'
  }).subscribe(function(notification) {
    mediator.publish('wfm:sync:record_delta_received:' + self.datasetId, notification);
  })
};

module.exports = {
  init: init
, manage: manage
, addListener: addListener
}

},{"./config":66,"lodash":"lodash","q":"q","rx":"rx"}],66:[function(require,module,exports){
'use strict';

module.exports = {
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],67:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group-form.tpl.html',
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Group # {{ctrl.model.id}}\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectGroup($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-button class="md-fab" aria-label="New group" ui-sref="app.group.new">\n' +
    '  <md-icon md-font-set="material-icons">add</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '<form name="groupForm" ng-submit="ctrl.done(groupForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="groupname">Group Name</label>\n' +
    '    <input type="text" id="groupname" name="groupname" ng-model="ctrl.model.name" required>\n' +
    '    <div ng-messages="workorderForm.groupname.$error" ng-if="ctrl.submitted || groupForm.groupname.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Role</label>\n' +
    '    <md-select ng-model="ctrl.model.role" name="assignee" id="assignee">\n' +
    '       <md-option value="admin">Admin</md-option>\n' +
    '       <md-option value="manager">Manager</md-option>\n' +
    '       <md-option value="worker">Worker</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id || ctrl.model.id === 0 ? \'Update\' : \'Create\'}} Group</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],68:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group-list.tpl.html',
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Groups</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search">\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" id="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectGroup($event, group)" ng-repeat="group in ctrl.groups" ng-class="{active: ctrl.selected.id === group.id}">\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{group.name}}</h3>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],69:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group.tpl.html',
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.id}}</h3>\n' +
    '      <p>Group id</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.name}}</h3>\n' +
    '      <p>Group name</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.role}}</h3>\n' +
    '      <p>Role</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Members\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectMember($event, member)" ng-repeat="member in ctrl.members">\n' +
    '    <img alt="user.name" ng-src="{{member.avatar}}" class="md-avatar" />\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{member.name}}</h3>\n' +
    '      <p>{{member.position}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],70:[function(require,module,exports){
require('./group-form.tpl.html.js');
require('./group-list.tpl.html.js');
require('./group.tpl.html.js');
require('./worker-form.tpl.html.js');
require('./worker-list.tpl.html.js');
require('./worker.tpl.html.js');

},{"./group-form.tpl.html.js":67,"./group-list.tpl.html.js":68,"./group.tpl.html.js":69,"./worker-form.tpl.html.js":71,"./worker-list.tpl.html.js":72,"./worker.tpl.html.js":73}],71:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker-form.tpl.html',
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Worker : {{ctrl.model.name}}\n' +
    '    </h3>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorker($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-button class="md-fab" aria-label="New Workorder" ui-sref="app.worker.new">\n' +
    '  <md-icon md-font-set="material-icons">add</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '\n' +
    '<form name="workerForm" ng-submit="ctrl.done(workerForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Worker Name</label>\n' +
    '    <input type="text" id="workername" name="workername" ng-model="ctrl.model.name" required>\n' +
    '    <div ng-messages="workerForm.workername.$error" ng-if="ctrl.submitted || workerForm.workername.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Username</label>\n' +
    '    <input type="text" id="username" name="username" ng-model="ctrl.model.username" required>\n' +
    '    <div ng-messages="workerForm.username.$error" ng-if="ctrl.submitted || workerForm.username.$dirty">\n' +
    '      <div ng-message="required">A username is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Banner URL</label>\n' +
    '    <input type="url" id="banner" name="banner" ng-model="ctrl.model.banner">\n' +
    '    <div ng-messages="workerForm.banner.$error" ng-if="ctrl.submitted || workerForm.banner.$dirty">\n' +
    '      <div ng-message="url">Invalid URL.</div>\n' +
    '    </div>\n' +
    '\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Avatar URL</label>\n' +
    '    <input type="url" id="avatar" name="avatar" ng-model="ctrl.model.avatar">\n' +
    '    <div ng-messages="workerForm.avatar.$error" ng-if="ctrl.submitted || workerForm.avatar.$dirty">\n' +
    '       <div ng-message="url">Invalid URL.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Phone number</label>\n' +
    '    <input type="number" id="phonenumber" name="phonenumber" ng-model="ctrl.model.phone" pattern="([0-9]{7,15})" required>\n' +
    '    <div ng-messages="workerForm.phonenumber.$error" ng-if="ctrl.submitted || workerForm.phonenumber.$dirty">\n' +
    '      <div ng-message="required">A phone number is required.</div>\n' +
    '      <div ng-message="pattern">A phone number can\'t be less than 7 or more than 15 digits.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Email</label>\n' +
    '    <input type="email" id="email" name="email" ng-model="ctrl.model.email" required>\n' +
    '    <div ng-messages="workerForm.email.$error" ng-if="ctrl.submitted || workerForm.email.$dirty">\n' +
    '      <div ng-message="required">An email is required.</div>\n' +
    '      <div ng-message="email">Invalid email.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="workername">Position</label>\n' +
    '    <input type="text" id="position" name="position" ng-model="ctrl.model.position" required>\n' +
    '    <div ng-messages="workerForm.position.$error" ng-if="ctrl.submitted || workerForm.position.$dirty">\n' +
    '      <div ng-message="required">An position is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Group</label>\n' +
    '    <md-select ng-model="ctrl.model.group" name="group" id="group" required>\n' +
    '       <md-option ng-repeat="group in ctrl.groups" value="{{group.id}}">{{group.name}}</md-option>\n' +
    '     </md-select>\n' +
    '     <div ng-messages="workerForm.group.$error" ng-if="ctrl.submitted || workerForm.group.$dirty">\n' +
    '       <div ng-message="required">An group is required.</div>\n' +
    '     </div>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id || ctrl.model.id === 0 ? \'Update\' : \'Create\'}} Worker</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],72:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker-list.tpl.html',
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Workers</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search">\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" name="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectWorker($event, user)"  ng-repeat="user in ctrl.workers" ng-class="{active: ctrl.selected.id === user.id}">\n' +
    '    <img alt="user.name" ng-src="{{user.avatar}}" class="md-avatar" />\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{user.name}}</h3>\n' +
    '      <p>{{user.position}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],73:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker.tpl.html',
    '<md-content class="wfm-maincol-scroll wfm-maincol-scroll_with-menu">\n' +
    '  <div class="user-info-header" ng-style="ctrl.style">\n' +
    '    <h1 class="md-display-1">{{ctrl.worker.name}}</h1>\n' +
    '  </div>\n' +
    '  <md-list>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">portrait</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.id}}</h3>\n' +
    '        <p>Worker id</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">person</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.username}}</h3>\n' +
    '        <p>Username</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">phone</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.phone}}</h3>\n' +
    '        <p>Phone Number</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">email</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.email}}</h3>\n' +
    '        <p>Email</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">portrait</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.position}}</h3>\n' +
    '        <p>Position</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.group.name}}</h3>\n' +
    '        <p>Group</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-subheader class="md-no-sticky">Notes</md-subheader>\n' +
    '    <p class="md-body-1" layout-padding layout-margin>{{ctrl.worker.notes}}</p>\n' +
    '  </md-content>\n' +
    '');
}]);

},{}],74:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.user.directives', ['wfm.core.mediator']);
module.exports = 'wfm.user.directives';

require('../../dist');

ngModule.directive('workerList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-list.tpl.html')
  , scope: {
      workers : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.workers = $scope.workers;
      self.selected = $scope.selectedModel;
      self.selectWorker = function(event, worker) {
        mediator.publish('wfm:worker:selected', worker);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isWorkerShown = function(worker) {
        return self.shownWorker === worker;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.workers = $scope.workers.filter(function(worker) {
          return String(worker.id).indexOf(term) !== -1
            || String(worker.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('worker', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker.tpl.html')
  , scope: {
      worker : '=',
      group : '='
    }
  , controller: function($scope) {
      var self = this;
      self.worker = $scope.worker;
      self.group = $scope.group;
      var bannerUrl = self.worker.banner || self.worker.avatar;
      self.style = {
        'background-image': 'url(' + bannerUrl + ')',
        'background-position': self.worker.banner ? 'center center' : 'top center',
        'background-size': self.worker.banner ? 'auto' : 'contain',
        'background-repeat': 'no-repeat'
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('workerForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-form.tpl.html')
  , scope: {
      worker : '=value',
      groups : '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.model = angular.copy($scope.worker);
      self.submitted = false;
      self.selectWorker = function(event, worker) {
        if(worker.id) {
          mediator.publish('wfm:worker:selected', worker);
        }
        else {
          mediator.publish('wfm:worker:list');
        }
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          if (!self.model.id && self.model.id !== 0) {
            mediator.publish('wfm:worker:created', self.model);
          } else {
            mediator.publish('wfm:worker:updated', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group-list.tpl.html')
  , scope: {
      groups : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.selected = $scope.selectedModel;
      self.selectGroup = function(event, group) {
        mediator.publish('wfm:group:selected', group);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isGroupShown = function(group) {
        return self.shownGroup === group;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.groups = $scope.groups.filter(function(group) {
          return String(group.id).indexOf(term) !== -1
            || String(group.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('group', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group.tpl.html')
  , scope: {
      group : '=',
      members : '='
    }
  , controller: function($scope) {
      var self = this;
      self.group = $scope.group;
      self.members = $scope.members;
      self.selectMember = function(event, member) {
        mediator.publish('wfm:worker:selected', member);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/group-form.tpl.html')
    , scope: {
        group : '=value'
      }
    , controller: function($scope) {
        var self = this;
        self.model = angular.copy($scope.group);
        self.submitted = false;
        self.selectGroup = function(event, group) {
          if(group.id) {
            mediator.publish('wfm:group:selected', group);
          }
          else {
            mediator.publish('wfm:group:list');
          }
          event.preventDefault();
          event.stopPropagation();
        }
        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
            if (!self.model.id && self.model.id !== 0) {
              mediator.publish('wfm:group:created', self.model);
            } else {
              mediator.publish('wfm:group:updated', self.model);
            }
          }
        }
      }
    , controllerAs: 'ctrl'
    };
  });

},{"../../dist":70}],75:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.user.services', ['wfm.core.mediator'])
module.exports = 'wfm.user.services';

var UserClient = require('../user/user-client'),
    GroupClient = require('../group/group-client'),
    MembershipClient = require('../membership/membership-client');
 
function wrapClient($q, client, methodNames) {
  var wrapper = {};
  methodNames.forEach(function(methodName) {
    wrapper[methodName] = function() {
      return $q.when(client[methodName].apply(client, arguments));
    }
  });
  return wrapper;
}

ngModule.factory('userClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'auth', 'hasSession', 'clearSession', 'verify', 'getProfile'];
  var userClient = wrapClient($q, new UserClient(mediator), methodNames);
  return userClient;
});

ngModule.factory('groupClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new GroupClient(mediator), methodNames);
  return groupClient;
});

ngModule.factory('membershipClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new MembershipClient(mediator), methodNames);
  return groupClient;
});

},{"../group/group-client":78,"../membership/membership-client":80,"../user/user-client":82}],76:[function(require,module,exports){
'use strict';

module.exports = 'wfm.user';

angular.module('wfm.user', [
  require('./directive')
, require('./service.js')
])

},{"./directive":74,"./service.js":75}],77:[function(require,module,exports){
'use strict';

module.exports = {
  apiPath: '/api/wfm/group'
}

},{}],78:[function(require,module,exports){
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-group');

var GroupClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

GroupClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  return deferred.promise;
}

GroupClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

GroupClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

GroupClient.prototype.update = function(group) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + group.id,
    method: 'put',
    data: group
  });
};

GroupClient.prototype.create = function(group) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: group
  });
};

GroupClient.prototype.delete = function(group) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + group.id,
    method: 'delete',
    data: group
  });
};

module.exports = function(mediator) {
  return new GroupClient(mediator);
}

},{"./config-group":77,"lodash":"lodash","q":"q"}],79:[function(require,module,exports){
'use strict';

module.exports = {
  apiPath: '/api/wfm/membership'
}

},{}],80:[function(require,module,exports){
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-membership');

var MembershipClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

MembershipClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  return deferred.promise;
}

MembershipClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

MembershipClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

MembershipClient.prototype.update = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'put',
    data: membership
  });
};

MembershipClient.prototype.create = function(membership) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: membership
  });
};

MembershipClient.prototype.delete = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'delete',
    data: membership
  });
};

module.exports = function(mediator) {
  return new MembershipClient(mediator);
}

},{"./config-membership":79,"lodash":"lodash","q":"q"}],81:[function(require,module,exports){
(function (process){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/user',
  authpolicyPath: '/box/srv/1.1/admin/authpolicy',
  policyId: process.env.WFM_AUTH_POLICY_ID || 'wfm'
}

}).call(this,require('_process'))

},{"_process":104}],82:[function(require,module,exports){
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-user');
var policyId;

var UserClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

var storeProfile = function(profileData) {
  localStorage.setItem('fh.wfm.profileData', JSON.stringify(profileData));
};

var retrieveProfileData = function() {
  var json = localStorage.getItem('fh.wfm.profileData');
  return json ? JSON.parse(json) : null;
}

UserClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  var promiseConfig = xhr({
    path: config.apiPath + '/config/authpolicy'
  }).then(function(_policyId) {
    policyId = _policyId;
    return policyId;
  })
  return q.all([deferred.promise, promiseConfig]);
}

UserClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

UserClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

UserClient.prototype.update = function(user) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + user.id,
    method: 'put',
    data: user
  });
};

UserClient.prototype.delete = function(user) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + user.id,
    method: 'delete',
    data: user
  });
};

UserClient.prototype.create = function(user) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: user
  });
};

UserClient.prototype.auth = function(username, password) {
  var deferred = q.defer();
  var self = this;
  this.initPromise.then(function() {
    $fh.auth({
      policyId: policyId,
      clientToken: self.appid,
      params: {
        userId: username,
        password: password
      }
    }, function (res) {
      // res.sessionToken; // The platform session identifier
      // res.authResponse; // The authetication information returned from the authetication service.
      var profileData = res.authResponse;
      if (typeof profileData === 'string' || profileData instanceof String) {
        try {
          profileData = JSON.parse(profileData);
        } catch(e) {
          console.error(e)
          console.log('Unable to parse the $fh.auth response. Using a workaround');
          profileData = JSON.parse(profileData.replace(/,\s/g, ',').replace(/[^,={}]+/g, '"$&"').replace(/=/g, ':'))
        }
      }
      storeProfile(profileData);
      self.mediator.publish('wfm:auth:profile:change', profileData);
      deferred.resolve(res);
    }, function (msg, err) {
      console.log(msg, err);
      var errorMsg = err.message;
      /* Possible errors:
      unknown_policyId - The policyId provided did not match any defined policy. Check the Auth Policies defined. See Auth Policies Administration
      user_not_found - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating exist on the platform, but this user does not exists.
      user_not_approved - - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating are in a list of approved users, but this user is not in that list.
      user_disabled - The user has been disabled from logging in.
      user_purge_data - The user has been flagged for data purge and all local data should be deleted.
      device_disabled - The device has been disabled. No user or apps can log in from the requesting device.
      device_purge_data - The device has been flagged for data purge and all local data should be deleted.
      */
      if (errorMsg == "user_purge_data" || errorMsg == "device_purge_data") {
        // TODO: User or device has been black listed from administration console and all local data should be wiped
        console.log('User or device has been black listed from administration console and all local data should be wiped');
      } else {
        console.log("Authentication failed - " + errorMsg);
        deferred.reject(errorMsg);
      }
    });
  })
  return deferred.promise;
}

UserClient.prototype.hasSession = function() {
  var deferred = q.defer();
  $fh.auth.hasSession(function(err, exists){
    if(err) {
      console.log('Failed to check session: ', err);
      deferred.reject(err);
    } else if (exists){
      //user is already authenticated
      //optionally we can also verify the session is acutally valid from client. This requires network connection.
      deferred.resolve(true)
    } else {
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

UserClient.prototype.clearSession = function() {
  var deferred = q.defer();
  var self = this;
  $fh.auth.clearSession(function(err){
    if(err) {
      console.log('Failed to clear session: ', err);
      deferred.reject(err);
    } else {
      storeProfile(null);
      self.mediator.publish('wfm:auth:profile:change', null);
      deferred.resolve(true);
    }
  });
  return deferred.promise;
}

UserClient.prototype.verify = function() {
  var deferred = q.defer();
  $fh.auth.verify(function(err, valid){
    if(err){
      console.log('failed to verify session');
      deferred.reject(err);
      return;
    } else if(valid) {
      console.log('session is valid');
      deferred.resolve(true)
    } else {
      console.log('session is not valid');
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

UserClient.prototype.getProfile = function() {
  return q.when(retrieveProfileData());
}

module.exports = function(mediator) {
  return new UserClient(mediator);
}

},{"./config-user":81,"lodash":"lodash","q":"q"}],83:[function(require,module,exports){
require('./vehicle-inspection-form.tpl.html.js');
require('./vehicle-inspection.tpl.html.js');

},{"./vehicle-inspection-form.tpl.html.js":84,"./vehicle-inspection.tpl.html.js":85}],84:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.vehicle-inspection');
} catch (e) {
  ngModule = angular.module('wfm.vehicle-inspection', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/vehicle-inspection-form.tpl.html',
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="40" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">local_gas_station</md-icon>\n' +
    '        Fuel (%)\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <md-slider flex md-discrete ng-model="ctrl.model.fuel" step="25" min="0" max="100" aria-label="rating">\n' +
    '    </md-slider>\n' +
    '  </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="30" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">album</md-icon>\n' +
    '        Tires\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <div flex layout-align="start start">\n' +
    '      <md-radio-group layout ng-model="ctrl.model.tires">\n' +
    '        <md-radio-button ng-value="false" >Fail</md-radio-button>\n' +
    '        <md-radio-button ng-value="true"> Pass </md-radio-button>\n' +
    '      </md-radio-group>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  <div layout="row" class="wfm-inspection-row">\n' +
    '    <div flex="30" layout="row" layout-align="start center">\n' +
    '      <span class="md-body-2">\n' +
    '        <md-icon md-font-set="material-icons">brightness_low</md-icon>\n' +
    '        Lights\n' +
    '      </span>\n' +
    '    </div>\n' +
    '    <div flex layout-align="start start">\n' +
    '      <md-radio-group layout ng-model="ctrl.model.lights">\n' +
    '        <md-radio-button ng-value="false">Fail</md-radio-button>\n' +
    '        <md-radio-button ng-value="true"> Pass </md-radio-button>\n' +
    '      </md-radio-group>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '\n' +
    '    <div class="workflow-actions md-padding md-whiteframe-z4">\n' +
    '      <md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>\n' +
    '      <md-button class="md-primary" ng-click="ctrl.done($event)">Continue</md-button>\n' +
    '    </div><!-- workflow-actions-->\n' +
    '');
}]);

},{}],85:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.vehicle-inspection');
} catch (e) {
  ngModule = angular.module('wfm.vehicle-inspection', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/vehicle-inspection.tpl.html',
    '\n' +
    '  <md-subheader>Vehicle Inspection</md-subheader>\n' +
    '\n' +
    '  <md-list class="risk-assessment">\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">local_gas_station</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{vehicleInspection.fuel}} %</h3>\n' +
    '        <p>Fuel</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="vehicleInspection.tires" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! vehicleInspection.tires" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="vehicleInspection.tires">Pass</h3>\n' +
    '        <h3 ng-if="! vehicleInspection.tires">Fail</h3>\n' +
    '        <p>Tires</p>\n' +
    '      </div>\n' +
    '    <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons" ng-if="vehicleInspection.lights" class="success">check_circle</md-icon>\n' +
    '      <md-icon md-font-set="material-icons" ng-if="! vehicleInspection.lights" class="danger">cancel</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3 ng-if="vehicleInspection.lights">Pass</h3>\n' +
    '        <h3 ng-if="! vehicleInspection.lights">Fail</h3>\n' +
    '        <p>Lights</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '</md-list>\n' +
    '');
}]);

},{}],86:[function(require,module,exports){
'use strict';

var _ = require('lodash');

var ngModule = angular.module('wfm.vehicle-inspection', ['wfm.core.mediator']);

require('../../dist');

ngModule.directive('vehicleInspection', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/vehicle-inspection.tpl.html')
  , scope: {
      vehicleInspection: '=value'
    }
  };
})

ngModule.directive('vehicleInspectionForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/vehicle-inspection-form.tpl.html')
  , scope: {
    }
  , controller: function() {
    var self = this;
    self.model = {};
    self.back = function(event) {
      mediator.publish('wfm:workflow:step:back');
      event.preventDefault();
      event.stopPropagation();
    }
    self.done = function(event) {
      mediator.publish('wfm:workflow:step:done', self.model);
      event.preventDefault();
      event.stopPropagation();
    }
  }
  , controllerAs: 'ctrl'
  };
})

module.exports = 'wfm.vehicle-inspection';

},{"../../dist":83,"lodash":"lodash"}],87:[function(require,module,exports){
require('./workflow-form.tpl.html.js');
require('./workflow-progress.tpl.html.js');
require('./workflow-step-detail.tpl.html.js');
require('./workflow-step-form.tpl.html.js');

},{"./workflow-form.tpl.html.js":88,"./workflow-progress.tpl.html.js":89,"./workflow-step-detail.tpl.html.js":90,"./workflow-step-form.tpl.html.js":91}],88:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-form.tpl.html',
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>{{ctrl.model.id ? \'Update\' : \'Create\'}} workflow</h3>\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkflow($event, workflow)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<div class="wfm-maincol-scroll">\n' +
    '<form name="workflowForm" ng-submit="ctrl.done(workflowForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Title</label>\n' +
    '    <input type="text" id="title" name="title" ng-model="ctrl.model.title" required>\n' +
    '    <div ng-messages="workflow.title.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A title is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id ? \'Update\' : \'Create\'}} Workflow</md-button>\n' +
    '</form>\n' +
    '</div>\n' +
    '');
}]);

},{}],89:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-progress.tpl.html',
    '<div class="workflow-progress" ng-class="{close: ctrl.closed}">\n' +
    '\n' +
    '<md-button class="md-icon-button md-warm expand-collapse">\n' +
    '  <md-icon ng-show="ctrl.closed" md-font-set="material-icons" ng-click="ctrl.open()">keyboard_arrow_down</md-icon>\n' +
    '  <md-icon ng-show="!ctrl.closed" md-font-set="material-icons" ng-click="ctrl.close()">keyboard_arrow_up</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<div class="scroll-box">\n' +
    '  <ol>\n' +
    '    <li ng-class="{active: \'-1\' == ctrl.stepIndex, complete: -1 < ctrl.stepIndex}">\n' +
    '      <span class="md-caption"><md-icon md-font-set="material-icons">visibility</md-icon></span>Overview\n' +
    '    </li>\n' +
    '    <li ng-repeat="step in ctrl.steps" ng-class="{active: $index == ctrl.stepIndex, complete: $index < ctrl.stepIndex}">\n' +
    '      <span class="md-caption">{{$index + 1}}</span>{{step.name}}\n' +
    '    </li>\n' +
    '    <li ng-class="{active: ctrl.steps.length <= ctrl.stepIndex, complete: ctrl.steps.length <= ctrl.stepIndex}">\n' +
    '      <span class="md-caption"><md-icon md-font-set="material-icons">done</md-icon></span>Summary\n' +
    '    </li>\n' +
    '  </ol>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '</div><!-- workflow-progress -->\n' +
    '');
}]);

},{}],90:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-step-detail.tpl.html',
    '<h2 class="md-title">Step: {{step.name}}</h2>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.code}}</h3>\n' +
    '      <p>Step code</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.formId">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.formId}}</h3>\n' +
    '      <p>FormId</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.templates && step.templates.view">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.templates.view}}</h3>\n' +
    '      <p>View template</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '  <md-list-item class="md-2-line" ng-show="step.templates.form">\n' +
    '    <md-icon md-font-set="material-icons">label</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{step.templates.form}}</h3>\n' +
    '      <p>Form template</p>\n' +
    '    </div>\n' +
    '  </md-list-item>\n' +
    '  <md-divider></md-divider>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],91:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-step-form.tpl.html',
    '<md-toolbar class="content-toolbar md-primary" ng-show="step">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>Update step</h3>\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkflow($event, workflow)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form name="workflowStepForm" ng-submit="ctrl.done(workflowStepForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Code</label>\n' +
    '    <input type="text" id="code" name="code" ng-model="ctrl.model.step.code" required>\n' +
    '    <div ng-messages="workflow.model.step.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A code is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Name</label>\n' +
    '    <input type="text" id="name" name="name" ng-model="ctrl.model.step.name" required>\n' +
    '    <div ng-messages="workflow.name.$error" ng-if="ctrl.submitted || workflowForm.name.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>FormID</label>\n' +
    '    <md-select ng-model="ctrl.model.step.formId" name="formId" id="formId">\n' +
    '       <md-option ng-repeat="form in ctrl.forms" value="{{form._id}}">{{form._id}} ({{form.name}})</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>form template</label>\n' +
    '    <input type="text" id="form" name="form" ng-model="ctrl.model.step.templates.form">\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>view template</label>\n' +
    '    <input type="text" id="view" name="view" ng-model="ctrl.model.step.templates.view">\n' +
    '  </md-input-container>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.isNew ? \'Add\' : \'Update\'}} step</md-button>\n' +
    '</form>\n' +
    '');
}]);

},{}],92:[function(require,module,exports){
'use strict';

var _ = require('lodash');

var ngModule = angular.module('wfm.workflow.directives', [
  'wfm.core.mediator'
]);
module.exports = 'wfm.workflow.directives';

require('../../dist');

ngModule.directive('workflowProgress', function($templateCache, $timeout) {
  function parseStepIndex(ctrl, stepIndex) {
    ctrl.stepIndex = stepIndex;
    ctrl.step = ctrl.steps[ctrl.stepIndex];
  }
  function scrollToActive(element) {
    element = element[0];
    var active = element.querySelector('li.active');
    if (!active) {
      active = element.querySelector('li');
    };
    var scroller = element.querySelector('.scroll-box');
    var offset = active.offsetTop;
    scroller.scrollTop = offset;
  }
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workflow-progress.tpl.html')
  , scope: {
      stepIndex: '=',
      workflow: '='
    }
  , link: function (scope, element, attrs) {
      $timeout(function() {
        scrollToActive(element);
      }, 0);
    }
  , controller: function($scope, $element) {
      var self = this;
      self.workflow = $scope.workflow;
      self.steps = $scope.workflow.steps;
      self.open = function() {
        self.closed = false;
      }
      self.close = function() {
        scrollToActive($element);
        self.closed = true;
      }
      parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0)

      $scope.$watch('stepIndex', function() {
        console.log('stepIndex changed')
        parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0);
        self.closed = true;
        $timeout(function() {
          scrollToActive($element);
        }, 0);
      });
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowStep', function($templateRequest, $compile, mediator) {
  return {
    restrict: 'E'
  , scope: {
      step: '=' // { ..., template: "an html template to use", templatePath: "a template path to load"}
    , workorder: '='
    }
  , link: function (scope, element, attrs) {
      scope.$watch('step', function(step) {
        if (scope.step) {
          if (scope.step.formId) {
            element.html('<appform form-id="step.formId"></appform>');
            $compile(element.contents())(scope);
          } else if (scope.step.templatePath) {
            $templateRequest(scope.step.templatePath).then(function(template) {
              element.html(template);
              $compile(element.contents())(scope);
            });
          } else {
            element.html(scope.step.templates.form);
            $compile(element.contents())(scope);
          };
        };
      });
    }
  , controller: function() {
      var self = this;
      self.mediator = mediator;
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowResult', function($compile) {
  var render = function(scope, element, attrs) {
    if (scope.workflow.steps && scope.result) {
      element.children().remove();
      scope.workflow.steps.forEach(function(step, stepIndex) {
        if (scope.result.stepResults && scope.result.stepResults[step.code]) {
          element.append('<md-divider></md-divider>');
          var template = '';
          template = '<workorder-submission-result'
          template += ' result="result.stepResults[\''+step.code+'\']"'
          template += ' step="workflow.steps[\''+stepIndex+'\']"'
          template += '></workorder-submission-result>';
          console.log(template);
          element.append(template);
        }
      });
      $compile(element.contents())(scope);
    };
  }
  return {
    restrict: 'E'
  , scope: {
      workflow: '='
    , result: '='
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
.directive('workflowForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/workflow-form.tpl.html')
    , scope: {
      workflow : '=value'
      }
    , controller: function($scope) {
        var self = this;
        self.model = angular.copy($scope.workflow);
        self.submitted = false;
        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
            if (!self.model.id && self.model.id !== 0) {
              self.model.steps = [];
              mediator.publish('wfm:workflow:created', self.model);
            }  else {
              mediator.publish('wfm:workflow:updated', self.model);
            }
          }
        };
        self.selectWorkflow = function(event, workflow) {
          if(workflow.id) {
            mediator.publish('wfm:workflow:selected', workflow);
          }
          else {
            mediator.publish('wfm:workflow:list');
          }
          event.preventDefault();
          event.stopPropagation();
        }
      }
    , controllerAs: 'ctrl'
    };
  })
.directive('workflowStepForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/workflow-step-form.tpl.html')
    , scope: {
      workflow : '=',
      step : '=',
      forms: '='
      }
    , controller: function($scope) {
        var self = this;
        self.forms = $scope.forms;
        var existingStep;
        self.submitted = false;
        if(!$scope.step){
          self.model = {
            step : {
              templates : {}
            },
            workflow : angular.copy($scope.workflow),
            isNew : true
          }
        }
        else {
          self.model = {
            workflow : angular.copy($scope.workflow),
            step : angular.copy($scope.step)
          }
          existingStep = $scope.workflow.steps.filter(function(item) {return item.code == $scope.step.code;}).length>0;
        }

        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
              //we check if the step already exist or not, if it exsit we remove the old element
              if(existingStep){
                var updatedStepIndex = _.findIndex($scope.workflow.steps, function(o) { return o.code == $scope.step.code; });
                $scope.workflow.steps[updatedStepIndex] = self.model.step;
                //$scope.workflow.steps = $scope.workflow.steps.filter(function(item) {return item.code != $scope.step.code;});
              }
              else {
               $scope.workflow.steps.push(self.model.step);
              }
              mediator.publish('wfm:workflow:updated', $scope.workflow);
          }
        };

        self.selectWorkflow = function(event, workflow) {
          mediator.publish('wfm:workflow:selected', workflow);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    , controllerAs: 'ctrl'
    };
  })
  .directive('workflowStepDetail', function($templateCache, mediator) {
      return {
        restrict: 'E'
      , template: $templateCache.get('wfm-template/workflow-step-detail.tpl.html')
      , scope: {
          step : '='
        }
      };
    })
;

},{"../../dist":87,"lodash":"lodash"}],93:[function(require,module,exports){
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.workflow.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workflow = {
        title: ''
      };
      deferred.resolve(workflow);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workflow.sync', [require('fh-wfm-sync')])
.factory('workflowSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var workflowSync = {};
  workflowSync.createManager = function(queryParams) {
    if (workflowSync.manager) {
      return $q.when(workflowSync.manager);
    } else {
      return workflowSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workflowSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        // TODO: we should refactor these utilities functions somewhere else probably
        workflowSync.manager.stepReview = function(steps, result) {
          var stepIndex = -1;
          var complete;
          if (result && result.stepResults && result.stepResults.length !== 0) {
            complete = true;
            for (var i=0; i < steps.length; i++) {
              var step = steps[i];
              var stepResult = result.stepResults[step.code];
              if (stepResult && (stepResult.status === 'complete' || stepResult.status === 'pending')) {
                stepIndex = i;
                if (stepResult.status === 'pending') {
                  complete = false;
                }
              } else {
                break;
              };
            };
          }
          return {
            nextStepIndex: stepIndex,
            complete: complete // false is any steps are "pending"
          };
        }

        workflowSync.manager.nextStepIndex = function(steps, result) {
          return this.stepReview(steps, result).nextStepIndex;
        }

        workflowSync.manager.checkStatus = function(workorder, workflow, result) {
          var status;
          var stepReview = this.stepReview(workflow.steps, result);
          if (stepReview.nextStepIndex >= workflow.steps.length - 1 && stepReview.complete) {
            status = 'Complete';
          } else if (!workorder.assignee) {
            status = 'Unassigned';
          } else if (stepReview.nextStepIndex < 0) {
            status = 'New';
          } else {
            status = 'In Progress';
          }
          return status;
        }
        return workflowSync.manager;
      })
    }
  };
  workflowSync.removeManager = function() {
    if (workflowSync.manager) {
      return workflowSync.manager.safeStop()
      .then(function() {
        delete workflowSync.manager;
      })
    }
  };
  return workflowSync;
})
;

},{"../config":95,"fh-wfm-sync":64,"lodash":"lodash"}],94:[function(require,module,exports){
'use strict';

module.exports = 'wfm.workflow';

angular.module('wfm.workflow', [
  require('./directive')
, require('./service.js')
])

},{"./directive":92,"./service.js":93}],95:[function(require,module,exports){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/workflow',
  datasetId : 'workflows',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],96:[function(require,module,exports){
require('./workorder-form.tpl.html.js');
require('./workorder-list.tpl.html.js');
require('./workorder.tpl.html.js');

},{"./workorder-form.tpl.html.js":97,"./workorder-list.tpl.html.js":98,"./workorder.tpl.html.js":99}],97:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-form.tpl.html',
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>{{ctrl.model.id ? \'Update\' : \'Create\'}} workorder</h3>\n' +
    '    <md-button class="md-icon-button" aria-label="{{ctrl.status}}">\n' +
    '      <workorder-status status="ctrl.status"></workorder-status>\n' +
    '    </md-button>\n' +
    '\n' +
    '    <span flex></span>\n' +
    '    <md-button class="md-icon-button" aria-label="Close" ng-click="ctrl.selectWorkorder($event, ctrl.model)">\n' +
    '      <md-icon md-font-set="material-icons">close</md-icon>\n' +
    '    </md-button>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form name="workorderForm" ng-submit="ctrl.done(workorderForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '  <!--\n' +
    '  <md-input-container>\n' +
    '    <label for="workorderState">Status</label>\n' +
    '    <input type="text" id="inputWorkorderType" name="workorderStatus" ng-model="ctrl.model.status" disabled="true">\n' +
    '  </md-input-container>\n' +
    '  -->\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="workorderType">Type</label>\n' +
    '    <md-select ng-model="ctrl.model.type" name="workorderType" id="workorderType">\n' +
    '       <md-option value="Job Order">Job Order</md-option>\n' +
    '       <md-option value="Type 02">Type 02</md-option>\n' +
    '       <md-option value="Type 03">Type 03</md-option>\n' +
    '       <md-option value="Type 04">Type 04</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="workflow">Workflow</label>\n' +
    '    <md-select ng-model="ctrl.model.workflowId" name="workflow" id="workflow" required>\n' +
    '       <md-option ng-repeat="workflow in ctrl.workflows" value="{{workflow.id}}">{{workflow.id}} - {{workflow.title}}</md-option>\n' +
    '     </md-select>\n' +
    '     <div ng-messages="workorderForm.workflow.$error" ng-if="ctrl.submitted || workorderForm.workflow.$dirty">\n' +
    '       <div ng-message="required">A workflow is required.</div>\n' +
    '     </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="assignee">Assignee</label>\n' +
    '    <md-select ng-model="ctrl.model.assignee" name="assignee" id="assignee">\n' +
    '       <md-option ng-repeat="worker in ctrl.workers" value="{{worker.id}}">{{worker.name}} ({{worker.position}})</md-option>\n' +
    '     </md-select>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Title</label>\n' +
    '    <input type="text" id="inputTitle" name="title" ng-model="ctrl.model.title" required>\n' +
    '    <div ng-messages="workorderForm.title.$error" ng-if="ctrl.submitted || workorderForm.title.$dirty">\n' +
    '      <div ng-message="required">A title is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label for="inputAddress">Address</label>\n' +
    '    <input type="text"  id="inputAddress" name="address" ng-model="ctrl.model.address" required>\n' +
    '    <div ng-messages="workorderForm.address.$error" ng-show="ctrl.submitted || workorderForm.address.$dirty">\n' +
    '      <div ng-message="required">An address is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputAddress">Lattitude</label>\n' +
    '    <input type="number"  id="inputLattitude" name="lattitude" ng-model="ctrl.model.location[0]" required>\n' +
    '    <div ng-messages="workorderForm.lattitude.$error" ng-show="ctrl.submitted || workorderForm.lattitude.$dirty">\n' +
    '      <div ng-message="required">An lattitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputAddress">Longitude</label>\n' +
    '    <input type="number"  id="inputLattitude" name="longitude" ng-model="ctrl.model.location[1]" required>\n' +
    '    <div ng-messages="workorderForm.longitude.$error" ng-show="ctrl.submitted || workorderForm.longitude.$dirty">\n' +
    '      <div ng-message="required">An longitude is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div layout-gt-sm="row">\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputFinishDate">Finish Date</label>\n' +
    '    <input type="date"  id="inputFinishDate" name="finishDate" min="{{today}}" max="{{maxDate}}" ng-model="ctrl.model.finishDate" required>\n' +
    '    <div ng-messages="workorderForm.finishDate.$error" ng-show="ctrl.submitted || workorderForm.finishDate.$dirty">\n' +
    '      <div ng-message="required">A finish date is required.</div>\n' +
    '      <div ng-message="min">Start Date should not be less than current date.</div>\n' +
    '      <div ng-message="max">Start Date is too far in the future.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block" flex-gt-sm>\n' +
    '    <label for="inputFinishTime" >Finish Time</label>\n' +
    '    <input type="time"  id="inputFinishTime" name="finishTime"  ng-model="ctrl.model.finishTime" required>\n' +
    '    <div ng-messages="workorderForm.finishTime.$error" ng-show="ctrl.submitted || workorderForm.finishTime.$dirty">\n' +
    '      <div ng-message="required">A finish time is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block" ng-class="{ \'has-error\' : workorderForm.summary.$invalid && !workorderForm.summary.$pristine }">\n' +
    '    <label for="inputSummary">Summary</label>\n' +
    '    <textarea id="inputSummary" name="summary" ng-model="ctrl.model.summary" required md-maxlength="150"></textarea>\n' +
    '\n' +
    '    <div ng-messages="workorderForm.summary.$error" ng-show="ctrl.submitted || workorderForm.summary.$dirty">\n' +
    '      <div ng-message="required">A summary date is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id ? \'Update\' : \'Create\'}} Workorder</md-button>\n' +
    '</form>\n' +
    '');
}]);

},{}],98:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder-list.tpl.html',
    '<md-toolbar>\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      <span>Workorders</span>\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form action="#" class="persistent-search" hide-xs hide-sm>\n' +
    '  <label for="search"><i class="material-icons">search</i></label>\n' +
    '  <input type="text" name="search" placeholder="Search" ng-model="searchValue" ng-change="ctrl.applyFilter(searchValue)">\n' +
    '</form>\n' +
    '\n' +
    '<md-list>\n' +
    '  <md-list-item\n' +
    '    ng-repeat="workorder in ctrl.workorders"\n' +
    '    ng-click="ctrl.selectWorkorder($event, workorder)"\n' +
    '    ng-class="{active: ctrl.selected.id === workorder.id}"\n' +
    '    class="md-2-line workorder-item"\n' +
    '  >\n' +
    '<!--\n' +
    '  TODO: change class name according to the color:\n' +
    '    "success" = green\n' +
    '    danger = "red"\n' +
    '    warning = "yellow"\n' +
    '    no class = grey\n' +
    '  -->\n' +
    '  <workorder-status class="" status="ctrl.resultMap[workorder.id].status"></workorder-status>\n' +
    '\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{workorder.title}}</h3>\n' +
    '      <p>{{workorder.address}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);

},{}],99:[function(require,module,exports){
var ngModule;
try {
  ngModule = angular.module('wfm.workorder.directives');
} catch (e) {
  ngModule = angular.module('wfm.workorder.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workorder.tpl.html',
    '  <md-list>\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">portrait</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.id}}</h3>\n' +
    '        <p>Workorder id</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon>\n' +
    '      <workorder-status status="status"></workorder-status>\n' +
    '    </md-icon>\n' +
    '        <div class="md-list-item-text">\n' +
    '           <h3>{{status || "New"}}</h3>\n' +
    '           <p>Status</p>\n' +
    '        </div>\n' +
    '      </md-list-item>\n' +
    '    </md-button>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line md-long-text">\n' +
    '      <md-icon md-font-set="material-icons">place</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '         <h3>{{workorder.location[0]}}, {{workorder.location[1]}}</h3>\n' +
    '         <p>\n' +
    '           {{workorder.address}}\n' +
    '         </p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">assignment</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.title}}</h3>\n' +
    '        <p>Workorder</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">event</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.startTimestamp | date:\'yyyy-MM-dd\' }}</h3>\n' +
    '        <p>Finish Date</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">schedule</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{workorder.startTimestamp | date:\'HH:mm:ss Z\' }}</h3>\n' +
    '        <p>Finish Time</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" ng-show="assignee && assignee.name">\n' +
    '      <md-icon md-font-set="material-icons">person</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{assignee.name}}</h3>\n' +
    '        <p>Asignee</p>\n' +
    '      </div>\n' +
    '    </md-list-item>\n' +
    '    <md-divider></md-divider>\n' +
    '\n' +
    '  </md-list>\n' +
    '\n' +
    '  <md-subheader class="md-no-sticky">Work Summary</md-subheader>\n' +
    '  <p class="md-body-1" layout-padding layout-margin>\n' +
    '    {{workorder.summary}}\n' +
    '  </p>\n' +
    '');
}]);

},{}],100:[function(require,module,exports){
'use strict';

var ngModule = angular.module('wfm.workorder.directives', ['wfm.core.mediator']);
module.exports = 'wfm.workorder.directives';

require('../../dist');

var getStatusIcon = function(status) {
  var statusIcon;
  switch(status) {
    case 'In Progress':
      statusIcon = 'autorenew';
      break;
    case 'Complete':
      statusIcon = 'assignment_turned_in';
      break;
    case 'Aborted':
      statusIcon = 'assignment_late';
      break;
    case 'On Hold':
      statusIcon = 'pause';
      break;
    case 'Unassigned':
      statusIcon = 'assignment_ind';
      break;
    case 'New':
      statusIcon = 'new_releases';
      break;
    default:
      statusIcon = 'radio_button_unchecked';
  }
  return statusIcon;
}

ngModule.directive('workorderList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder-list.tpl.html')
  , scope: {
      workorders : '=',
      resultMap: '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.workorders = $scope.workorders;
      $scope.$watch('workorders', function() {
        self.workorders = $scope.workorders;
      })
      self.resultMap = $scope.resultMap;
      self.selected = $scope.selectedModel;
      self.selectWorkorder = function(event, workorder) {
        // self.selectedWorkorderId = workorder.id;
        mediator.publish('wfm:workorder:selected', workorder);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isWorkorderShown = function(workorder) {
        return self.shownWorkorder === workorder;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.workorders = $scope.workorders.filter(function(workorder) {
          return String(workorder.id).indexOf(term) !== -1
            || String(workorder.title).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorder', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder.tpl.html')
  , scope: {
    workorder: '=',
    assignee: '=',
    status: '='
    }
  , controller: function($scope) {
      var self = this;
      self.showSelectButton = !! $scope.$parent.workorders;
      self.selectWorkorder = function(event, workorder) {
        if(workorder.id) {
          mediator.publish('wfm:workorder:selected', workorder);
        }
        else {
          mediator.publish('wfm:workorder:list');
        }

        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorderForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workorder-form.tpl.html')
  , scope: {
    workorder : '=value'
  , workflows: '='
  , workers: '='
  , status: '='
    }
  , controller: function($scope) {
      var self = this;
      var today = new Date();
      today.setHours(today.getHours()-24);
      $scope.today = today.toISOString();
      var maxDate = new Date()
      maxDate.setFullYear(today.getFullYear()+100);
      $scope.maxDate = maxDate.toISOString();
      self.model = angular.copy($scope.workorder);
      self.workflows = $scope.workflows;
      self.workers = $scope.workers;
      self.submitted = false;

      if (self.model && self.model.startTimestamp) {
        self.model.finishDate = new Date(self.model.startTimestamp);
        self.model.finishTime = new Date(self.model.startTimestamp);
      };
      self.selectWorkorder = function(event, workorder) {
        if(workorder.id) {
          mediator.publish('wfm:workorder:selected', workorder);
        }
        else {
          mediator.publish('wfm:workorder:list');
        }
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          self.model.startTimestamp = new Date(self.model.finishDate); // TODO: incorporate self.model.finishTime
          self.model.startTimestamp.setHours(
            self.model.finishTime.getHours(),
            self.model.finishTime.getMinutes(),
            self.model.finishTime.getSeconds(),
            self.model.finishTime.getMilliseconds()
          );
          self.model.finishDate = new Date(self.model.startTimestamp);
          self.model.finishTime = new Date(self.model.startTimestamp);
          if (!self.model.id && self.model.id !== 0) {
            mediator.publish('wfm:workorder:created', self.model);
          } else {
            mediator.publish('wfm:workorder:updated', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workorderStatus', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: '<md-icon md-font-set="material-icons">{{statusIcon}}<md-tooltip>{{status}}</md-tooltip></md-icon>'
  , scope: {
      status : '=status'
    }
  , controller: function($scope) {
      $scope.statusIcon = getStatusIcon($scope.status);
    }
  , controllerAs: 'ctrl'
  }
})

.directive('workorderSubmissionResult', function($compile) {
  var render = function(scope, element, attrs) {
    if (!scope.result) {
      return;
    }
    var result = scope.result;
    var template = '';
    if (scope.step.formId) {
      var submission = result.submission;
      var tag, subId;
      if (submission._submission) {
        tag = 'submission';
        subId = submission._submission
        template = '<appform-submission submission="result.submission._submission"></appform-submission>';
      } else if (submission.submissionId) {
        template = '<appform-submission submission-id="\''+submission.submissionId+'\'"></appform-submission>';
      } else if (submission.submissionLocalId) {
        template = '<appform-submission submission-local-id="\''+submission.submissionLocalId+'\'"></appform-submission>';
      };
    } else {
      template = scope.step.templates.view;
    }
    element.append(template);
    $compile(element.contents())(scope);
  };

  return {
    restrict: 'E'
  , scope: {
      result: '='
    , step: '='
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
;

},{"../../dist":96}],101:[function(require,module,exports){
'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.workorder.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workorder = {
        type: 'Job Order'
      , status: 'New'
      };
      deferred.resolve(workorder);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workorder.sync', [require('fh-wfm-sync')])
.factory('workorderSync', function($q, $timeout, syncService) {
  syncService.init($fh, config.syncOptions);
  var workorderSync = {};
  workorderSync.createManager = function(queryParams) {
    if (workorderSync.manager) {
      return $q.when(workorderSync.manager);
    } else {
      return workorderSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workorderSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        return workorderSync.manager;
      })
    }
  };
  workorderSync.removeManager = function() {
    if (workorderSync.manager) {
      return workorderSync.manager.safeStop()
      .then(function() {
        delete workorderSync.manager;
      })
    }
  }
  return workorderSync;
})
;

},{"../config":103,"fh-wfm-sync":64,"lodash":"lodash"}],102:[function(require,module,exports){
'use strict';

module.exports = 'wfm.workorder';

angular.module('wfm.workorder', [
  require('./directive')
, require('./sync-service')
])

},{"./directive":100,"./sync-service":101}],103:[function(require,module,exports){
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/workorder',
  datasetId : 'workorders',
  syncOptions : {
    "sync_frequency" : 5,
    "storage_strategy": "dom",
    "do_console_log": false
  }
}

},{}],104:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],105:[function(require,module,exports){
'use strict';

var d3 = require('d3')
var c3 = require('c3')
var _ = require('lodash');

module.exports = 'app.analytics';

angular.module('app.analytics', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.analytics', {
      url: '/analytics',
      data: {
        columns: 2
      },
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/analytics/analytics.tpl.html',
          controller: 'analyticsController as ctrl'
        }
      }
    })
})

.controller('analyticsController', function (workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;

  //add fake data for bar charts
  self.workorders.forEach(function(workorder) {
    var estimated  = Math.floor((Math.random() * 10) + 15);
    var real = Math.floor((Math.random() * 10) + 15);
    workorder.estimatedHours = estimated;
    workorder.effectiveHours = real;
  });

  var areaChart = c3.generate({
    bindto: '#area-chart',
    size: {
      width: 450
    },
    data: {
      columns: [
        ['data1', 300, 350, 300, 0, 0, 0],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
    types: {
      data1: 'area',
      data2: 'area-spline'
    }
  }
});

})

;

},{"c3":"c3","d3":"d3","lodash":"lodash"}],106:[function(require,module,exports){
'use strict';
var _ = require('lodash');

angular.module('app.appform', ['ui.router'])

.config(function ($stateProvider) {
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

},{"lodash":"lodash"}],107:[function(require,module,exports){
'use strict';

module.exports = 'app.auth';

angular.module('app.auth', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login',
      data: {
        columns: 2
      },
      views: {
        'content@app': {
          templateUrl: 'app/auth/login.tpl.html',
          controller: 'LoginCtrl as ctrl',
          resolve: {
            hasSession: function(userClient) {
              return userClient.hasSession();
            }
          }
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'content@app': {
          templateUrl: 'app/auth/profile.tpl.html',
          controller: 'ProfileCtrl as ctrl',
        }
      }
    })
})

.controller('LoginCtrl', function($state, $rootScope, userClient, hasSession) {
  var self = this;

  self.hasSession = hasSession;

  self.login = function(valid) {
    if (valid) {
      userClient.auth(self.username, self.password)
      .then(function() {
        self.loginMessages.success = true;
      }, function(err) {
        console.log(err);
        self.loginMessages.error = true;
      });
    }
  }

  self.loginMessages = {success: false, error: false};

  self.login = function(valid) {
    if (!valid) {
      return
    }
    userClient.auth(self.username, self.password)
    .then(function() {
      self.loginMessages.success = true;
      return userClient.hasSession();
    })
    .then(function(hasSession) {
      self.hasSession = hasSession;
      if ($rootScope.toState) {
        $state.go($rootScope.toState, $rootScope.toParams);
        delete $rootScope.toState;
        delete $rootScope.toParams;
      } else {
        $state.go('app.workorder');
      }
    }, function(err) {
      self.loginMessages.error = true;
      console.error(err);
    });
  }

  self.logout = function() {
    userClient.clearSession()
    .then(userClient.hasSession)
    .then(function(hasSession) {
      self.hasSession = hasSession;
    }, function(err) {
      console.err(err);
    });
  }
})

.controller('ProfileCtrl', function() {
})
;

},{}],108:[function(require,module,exports){
'use strict';

var _ = require('lodash');

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
          controller: 'FileListController as ctrl',
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
          controller: 'FileController as ctrl'
        }
      }
    })
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:file:selected', function(file) {
    $state.go('app.file.detail', {
      fileUid: file.uid},
      { reload: true }
    );
  });
})

.controller('FileListController', function ($scope, files, workerMap) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.files = files;
  self.workerMap = workerMap;
})

.controller('FileController', function ($scope, file, workerMap) {
  var self = this;
  $scope.$parent.selected = {id: file.id};
  self.file = file;
  self.workerMap = workerMap;
})
;

},{"lodash":"lodash"}],109:[function(require,module,exports){
'use strict';

var _ = require('lodash');

module.exports = 'app.group';

angular.module('app.group', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.group', {
      url: '/groups',
      resolve: {
        groups: function(groupClient) {
          return groupClient.list();
        },
        users: function(userClient) {
          return userClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        column2: {
          templateUrl: 'app/group/group-list.tpl.html',
          controller: 'groupListController as ctrl'
        },
        'content': {
          templateUrl: 'app/group/empty.tpl.html',
        }
      }
    })
    .state('app.group.detail', {
      url: '/group/:groupId',
      resolve: {
        group: function($stateParams, groups) {
          return groups.filter(function(group) {
            return String(group.id) === String($stateParams.groupId);
          })[0];
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-detail.tpl.html',
          controller: 'groupDetailController as ctrl'
        }
      }
    })
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
          controller: 'groupFormController as ctrl',
        }
      }
    })
    .state('app.group.new', {
      url: '/new',
      resolve: {
        group: function() {
          return {}
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/group/group-edit.tpl.html',
          controller: 'groupFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:group:selected', function(group) {
    $state.go('app.group.detail', {
      groupId: group.id
    });
  });
  mediator.subscribe('wfm:group:list', function(group) {
    $state.go('app.group', null, {reload: true});
  });
})

.controller('groupListController', function ($scope, mediator, groups) {
  this.groups = groups;
  $scope.$parent.selected = {id: null};
})

.controller('groupDetailController', function ($scope, $state, $mdDialog, mediator, group, users, membership, groupClient) {
  var self = this;
  self.group = group;
  $scope.selected.id = group.id;
  var groupMembership = membership.filter(function(_membership) {
    return _membership.group == group.id
  });
  self.members = users.filter(function(user) {
    return _.some(groupMembership, function(_membership) {
      return _membership.user == user.id;
    })
  });
  self.delete = function($event, group) {
    $event.preventDefault();
    if(self.members.length > 0) {
      var alert = $mdDialog.confirm()
            .title('Operation not possible')
            .textContent('Group can not be deleted if it contains members.')
            .ok('Ok')
            .targetEvent($event);
      $mdDialog.show(alert);
    }
    else {
      var confirm = $mdDialog.confirm()
            .title('Would you like to delete group #'+group.id+'?')
            .textContent(group.name)
            .ariaLabel('Delete Group')
            .targetEvent($event)
            .ok('Proceed')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        groupClient.delete(group).then(function() {
          $state.go('app.group', null, {reload: true});
        }, function(err) {
          throw err;
        })
      });
    }
  };
})

.controller('groupFormController', function ($state, $scope, mediator, group, groupClient) {
  var self = this;
  self.group = group;
  mediator.subscribeForScope('wfm:group:updated', $scope, function(group) {
    return groupClient.update(group)
        .then(function() {
          $state.go('app.group.detail', {groupId: self.group.id}, {reload: true});
        })
    });
  mediator.subscribeForScope('wfm:group:created', $scope, function(group) {
    return groupClient.create(group)
        .then(function(createdgroup) {
          $state.go('app.group.detail', {groupId: createdgroup.id}, {reload: true});
        })
    });
})

;

},{"lodash":"lodash"}],110:[function(require,module,exports){
'use strict';
angular.module('app.home', ['ui.router'])

.config(function ($stateProvider) {
  $stateProvider
    .state('app.home', {
      url: '/home',
      views: {
        content: {
          templateUrl: 'app/home/home.tpl.html'
        }
      }
    });
})
;

module.exports = 'app.home';

},{}],111:[function(require,module,exports){
'use strict';

var angular = require('angular');
require('feedhenry');

angular.module('app', [
  require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-result')
, require('fh-wfm-message')
, require('fh-wfm-file')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-user')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-map')
, require('fh-wfm-schedule')
, require('fh-wfm-analytics')
, require('fh-wfm-camera')

, require('./auth/auth')
, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./home/home')
, require('./appform/appform')
, require('./worker/worker')
, require('./group/group')
, require('./message/message')
, require('./file/file')
, require('./schedule/schedule')
, require('./map/map')
, require('./analytics/analytics')
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      data: {
        columns: 3
      },
      resolve: {
        workorderManager: function(workorderSync) {
          return workorderSync.createManager();
        },
        workflowManager: function(workflowSync) {
          return workflowSync.createManager();
        },
        messageManager: function(messageSync) {
          return messageSync.createManager();
        },
        profileData: function(userClient) {
          return userClient.getProfile();
        }
      },
      controller: function($scope, $state, $mdSidenav, mediator, profileData){
        console.log('profileData', profileData);
        $scope.profileData = profileData;
        mediator.subscribe('wfm:auth:profile:change', function(_profileData) {
          $scope.profileData = _profileData;
        });
        $scope.$state = $state;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            if ($mdSidenav('left').isOpen()) {
              $mdSidenav('left').close();
            };
            $state.go(state, params);
          }
        }
      }
    });
})

.run(function($rootScope, $state, $q, mediator, userClient) {
  var initPromises = [];
  var initListener = mediator.subscribe('promise:init', function(promise) {
    initPromises.push(promise);
  });
  mediator.publish('init');
  console.log(initPromises.length, 'init promises to resolve.');
  var all = (initPromises.length > 0) ? $q.all(initPromises) : $q.when(null);
  all.then(function() {
    $rootScope.ready = true;
    console.log(initPromises.length, 'init promises resolved.');
    mediator.remove('promise:init', initListener.id);
    return null;
  });

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if(toState.name !== "app.login"){
      userClient.hasSession().then(function(hasSession) {
        if(!hasSession) {
          e.preventDefault();
          $rootScope.toState = toState;
          $rootScope.toParams = toParams;
          $state.go('app.login');
        }
      });
    };
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});

},{"./analytics/analytics":105,"./appform/appform":106,"./auth/auth":107,"./file/file":108,"./group/group":109,"./home/home":110,"./map/map":112,"./message/message":113,"./schedule/schedule":114,"./worker/worker":115,"./workflow/workflow":116,"./workorder/workorder":117,"angular":"angular","angular-material":"angular-material","angular-ui-router":"angular-ui-router","feedhenry":"feedhenry","fh-wfm-analytics":5,"fh-wfm-appform":17,"fh-wfm-camera":24,"fh-wfm-file":29,"fh-wfm-map":35,"fh-wfm-mediator":37,"fh-wfm-message":44,"fh-wfm-result":47,"fh-wfm-risk-assessment":53,"fh-wfm-schedule":58,"fh-wfm-user":76,"fh-wfm-vehicle-inspection":86,"fh-wfm-workflow":94,"fh-wfm-workorder":102}],112:[function(require,module,exports){
'use strict';

module.exports = 'app.map';

angular.module('app.map', [
  'ui.router',
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.map', {
      url: '/map',
      data: {
        columns: 2
      },
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        }
      },
      views: {
        content: {
          templateUrl: 'app/map/map.tpl.html',
          controller: 'mapController as ctrl'
        }
      }

    })
})

.controller('mapController', function ($window, $document, $timeout, workorders) {
  this.center = [49.27, -123.08];
  this.workorders = workorders;
})

;

},{}],113:[function(require,module,exports){
'use strict';

var _ = require('lodash');
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
          templateUrl: 'app/message/empty.tpl.html',
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
              return messageManager.read($stateParams.messageId)
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

.controller('MessageListController', function ($scope, messages) {
  var self = this;
  $scope.$parent.selected = {id: null};
  self.messages = messages;
})

.controller('messageDetailController', function ($scope, message) {
  var self = this;
  self.message = message;
  message.status = "read";
  $scope.selected.id = message.id;
})

.controller('messageFormController', function (mediator) {
})

.controller('messageNewController', function ($scope, $state, mediator, messageManager, workers) {
  var self = this;
  self.workers = workers;
  mediator.subscribeForScope('wfm:message:created', $scope, function(message) {
    message.sender = $scope.profileData;
    return messageManager.create(message).then(function(_message) {
      $state.go('app.message', {workers: workers}, {reload: true});
    })
  });
})
;
module.exports = 'app.message';

},{"angular-messages":"angular-messages","lodash":"lodash"}],114:[function(require,module,exports){
'use strict';

var _ = require('lodash');

module.exports = 'app.schedule';

angular.module('app.schedule', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.schedule', {
      url: '/schedule',
      resolve: {
        workorders: function(workorderManager) {
          return workorderManager.list();
        },
        workers: function(userClient) {
          return userClient.list();
        }
      },
      data: {
        columns: 2
      },
      views: {
        content: {
          templateUrl: 'app/schedule/schedule.tpl.html',
          controller: 'scheduleController as ctrl'
        }
      }
    })
})

.controller('scheduleController', function (mediator, workorderManager, workorders, workers) {
  var self = this;
  self.workorders = workorders;
  self.workers = workers;
  mediator.subscribe('wfm:schedule:workorder', function(workorder) {
    workorderManager.update(workorder).then(function(updatedWorkorder) {
      mediator.publish('done:wfm:schedule:workorder:' + workorder.id, updatedWorkorder);
    }, function(error) {
      console.error(error);
    });
  })
})

;

},{"lodash":"lodash"}],115:[function(require,module,exports){
'use strict';

var _ = require('lodash');
require('angular-messages');

module.exports = 'app.worker';

angular.module('app.worker', [
  'ui.router'
, 'wfm.core.mediator'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.worker', {
      url: '/workers',
      resolve: {
        workers: function(userClient) {
          return userClient.list();
        }
      },
      views: {
        column2: {
          templateUrl: 'app/worker/worker-list.tpl.html',
          controller: 'WorkerListController as ctrl',
        },
        'content': {
          templateUrl: 'app/worker/empty.tpl.html',
        }
      }
    })
    .state('app.worker.detail', {
      url: '/worker/:workerId',
      resolve: {
        worker: function($stateParams, userClient) {
          return userClient.read($stateParams.workerId);
        },
        workorders: function($stateParams, workorderManager) {
          return workorderManager.list().then(function(workorders) {
            return workorders.filter(function(workorder) {
              return String(workorder.assignee) === String($stateParams.workerId);
            });
          });
        },
        messages: function($stateParams, messageManager) {
          return messageManager.list().then(function(messages){
            return messages.filter(function(message) {
             return String(message.receiverId) === String($stateParams.workerId);
           });
          });
        },
        files: function($stateParams, fileClient) {
          return fileClient.list().then(function(files){
            return files.filter(function(file) {
             return String(file.owner) === String($stateParams.workerId);
           });
          })
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        },
        groups: function(groupClient) {
          return groupClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-detail.tpl.html',
          controller: 'WorkerDetailController as ctrl'
        }
      }
    })
    .state('app.worker.edit', {
      url: '/worker/:workerId/edit',
      resolve: {
        worker: function($stateParams, userClient) {
          return userClient.read($stateParams.workerId);
        },
        groups: function(groupClient) {
          return groupClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-edit.tpl.html',
          controller: 'WorkerFormController as ctrl',
        }
      }
    })
    .state('app.worker.new', {
      url: '/new',
      resolve: {
        worker: function() {
          return {};
        },
        groups: function(groupClient) {
          return groupClient.list();
        },
        membership: function(membershipClient) {
          return membershipClient.list();
        }
      },
      views: {
        'content@app': {
          templateUrl: 'app/worker/worker-edit.tpl.html',
          controller: 'WorkerFormController as ctrl',
        }
      }
    });
})

.run(function($state, mediator) {
  mediator.subscribe('wfm:worker:selected', function(worker) {
    $state.go('app.worker.detail', {
      workerId: worker.id
    });
  });
  mediator.subscribe('wfm:worker:list', function(worker) {
    $state.go('app.worker', null, {reload: true});
  });
})

.controller('WorkerListController', function ($scope, mediator, workers) {
  var self = this;
  self.workers = workers;
  $scope.$parent.selected = {id: null};
})

.controller('WorkerDetailController', function ($scope, $state, $stateParams, $mdDialog, mediator, worker, workorders, messages, files, membership, groups, userClient) {
  var self = this;
  self.worker = worker;
  self.workorders = workorders;
  self.messages =  messages;
  self.files = files;
  $scope.selected.id = worker.id;

  var userMembership = membership.filter(function(_membership) {
    return _membership.user == worker.id
  })[0];
  if(userMembership){
    self.group = groups.filter(function(group) {
        return userMembership.group == group.id;
    })[0];
  }

  self.delete = function(event, worker) {
    event.preventDefault();
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete worker #'+worker.id+'?')
          .textContent(worker.name)
          .ariaLabel('Delete Worker')
          .targetEvent(event)
          .ok('Proceed')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      userClient.delete(worker)
      .then(function() {
        $state.go('app.worker', null, {reload: true});
      }, function(err) {
        throw err;
      })
    });
  },
  self.selectWorkorder = function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: true }
    );
  },
  self.selectMessage =  function(message) {
    $state.go('app.message.detail', {
      messageId: message.id || message._localuid },
      { reload: true }
    );
  }

})

.controller('WorkerFormController', function ($state, $scope, mediator, worker, groups, membership, userClient, membershipClient) {
  var self = this;
  self.worker = worker;
  self.groups = groups;
  //if we are updating let's assign the group
  if(worker.id || worker.id === 0) {
    var userMembership = membership.filter(function(_membership) {
      return _membership.user == worker.id
    })[0];
    if(userMembership){
      self.worker.group = groups.filter(function(group) {
          return userMembership.group == group.id;
      })[0].id;
    }
  }

  mediator.subscribeForScope('wfm:worker:updated', $scope, function(worker) {
    return userClient.update(worker)
        .then(function(updatedWorker) {
          //retrieve the existing membership
          var userMembership = membership.filter(function(_membership) {
            return _membership.user == worker.id
          })[0];
          if(userMembership){
            userMembership.group = updatedWorker.group;
            return membershipClient.update(userMembership)
              .then(function(updatedMembership) {
                $state.go('app.worker.detail', {workerId: updatedMembership.user}, {reload: true});
              });
          }
          else {
            return membershipClient.create({
              group : updatedWorker.group,
              user: updatedWorker.id
            }).then(function (createdMembership) {
                $state.go('app.worker.detail', {workerId: createdMembership.user}, {reload: true});
              })
          }

        })
    });
  mediator.subscribeForScope('wfm:worker:created', $scope, function(worker) {
    return userClient.create(worker)
        .then(function(createdWorker) {
          return membershipClient.create({
            group : createdWorker.group,
            user: createdWorker.id
          }).then(function (createdMembership) {
              $state.go('app.worker.detail', {workerId: createdMembership.user}, {reload: true});
            })
        })
    });
})

;

},{"angular-messages":"angular-messages","lodash":"lodash"}],116:[function(require,module,exports){
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
          templateUrl: 'app/workflow/empty.tpl.html',
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
  mediator.subscribe('wfm:workflow:list', function(workflow) {
    $state.go('app.workflow', null, {reload: true});
  });
})

.controller('WorkflowListController', function ($scope, mediator, workflows, $stateParams) {
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

.controller('WorkflowDetailController', function ($scope, $state, $mdDialog, mediator, workflowManager, workorderManager, workflow, forms) {
  var self = this;
  $scope.selected.id = workflow.id;
  $scope.dragControlListeners = {
    containment: '#stepList',
    orderChanged :  function (event) {
      workflowManager.update(workflow).then(function(_workflow) {
        $state.go('app.workflow.detail',
         {workflowId: _workflow.id},
         { reload: true }
       );
      }, function(error) {
        console.log(error);
      })
    }
  }
  self.workflow = workflow;
  self.forms = forms;
  self.delete = function(event, workflow) {
    event.preventDefault();
    workorderManager.list()
      .then(function(workorders){
        var workorder = workorders.filter(function(workorder) {
          return String(workorder.workflowId) === String(workflow.id);
        })
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
        return $mdDialog.show(confirm)
      })
      .then(function() {
        return workflowManager.delete(workflow)
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
      })
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
    })
  });
})

.controller('WorkflowAddController', function ($scope, mediator, workflowManager, workflow ) {
  var self = this;
  self.workflow = workflow;

  mediator.subscribeForScope('wfm:workflow:created', $scope, function(workflow) {
    workflowManager.create(workflow).then(function(_workflow) {
      mediator.publish('wfm:workflow:selected', _workflow);
    });
  });

})

.controller('WorkflowFormController', function ($scope, $state, mediator, workflow, workflowManager) {
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
    })
  });
})

.controller('WorkflowStepFormController', function ($scope, $state, $stateParams, mediator, workflow, workflowManager, forms) {
  var self = this;

  self.workflow = workflow;
  self.forms = forms;
  self.step = workflow.steps.filter(function(item) {
    return item.code == $stateParams.code;
  })[0];
  mediator.subscribeForScope('wfm:workflow:updated', $scope, function(workflow) {
    workflowManager.update(workflow).then(function(_workflow) {
      $state.go('app.workflow.detail',
      {workflowId: _workflow.id},
      { reload: true }
    );
    }, function(error) {
      console.log(error);
    })
  });
})

;

module.exports = 'app.workflow';

},{"angular-messages":"angular-messages","ng-sortable":"ng-sortable"}],117:[function(require,module,exports){
'use strict';

var _ = require('lodash');
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
        resultManager: function(resultSync) {
          return resultSync.managerPromise;
        },
        resultMap: function(resultManager) {
          return resultManager.list()
          .then(function(results) {
            var map = {};
            results.forEach(function(result) {
              map[result.workorderId] = result;
            });
            return map;
          })
        }
      },
      views: {
        column2: {
          templateUrl: 'app/workorder/workorder-list.tpl.html',
          controller: 'WorkorderListController as workorderListController',
        },
        'content': {
          templateUrl: 'app/workorder/empty.tpl.html',
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
              return workorderManager.read($stateParams.workorderId)
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
  mediator.subscribe('wfm:workorder:list', function(workflow) {
    $state.go('app.workorder', null, {reload: true});
  });
})

.controller('WorkorderListController', function ($scope, workorders, resultMap) {
  var self = this;
  self.workorders = workorders;
  self.resultMap = resultMap;
  $scope.$parent.selected = {id: null};
})

.controller('WorkorderDetailController', function ($scope, $state, $mdDialog, mediator, workorderManager, workflowManager, workflows, workorder, result, workers) {
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
  })
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
      })
    });
  }
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

.controller('WorkorderFormController', function ($scope, $state, mediator, workorderManager, workorder, workflows, workers, result) {
  var self = this;

  self.workorder = workorder;
  self.workflows = workflows;
  self.workers = workers;
  self.result = result;

  mediator.subscribeForScope('wfm:workorder:updated', $scope, function(workorder) {
    return workorderManager.update(workorder).then(function(_workorder) {
      mediator.publish('wfm:workorder:selected', _workorder);
    })
  });
})

;

module.exports = 'app.workorder';

},{"angular-messages":"angular-messages","lodash":"lodash"}]},{},[111])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2FyZWEudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFuYWx5dGljcy9kaXN0L2NoYXJ0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYW5hbHl0aWNzL2Rpc3QvcGllLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvYW5hbHl0aWNzLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hbmFseXRpY3MvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2FwcGZvcm0tZmllbGQtcGhvdG8udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vZGlzdC9hcHBmb3JtLWZpZWxkLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS1zdWJtaXNzaW9uLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2Rpc3QvYXBwZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tYXBwZm9ybS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL2FwcGZvcm0tbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1hcHBmb3JtL2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0tbWVkaWF0b3IuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWFwcGZvcm0vbGliL2FwcGZvcm0uanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9kaXN0L2NhbWVyYS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tY2FtZXJhL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9saWIvYW5ndWxhci9jYW1lcmEtbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWNhbWVyYS9saWIvYW5ndWxhci9zZXJ2aWNlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1jYW1lcmEvbGliL2NhbWVyYS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tZmlsZS9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLWZpbGUvbGliL2FuZ3VsYXIvZmlsZS1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tZmlsZS9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1maWxlL2xpYi9maWxlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tYXAvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2Rpc3Qvd29ya29yZGVyLW1hcC50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2xpYi9hbmd1bGFyL21hcC1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWFwL2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lZGlhdG9yL2xpYi9hbmd1bGFyL21lZGlhdG9yLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZWRpYXRvci9saWIvbWVkaWF0b3IuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLW1lc3NhZ2UvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9kaXN0L21lc3NhZ2UtZGV0YWlsLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2Rpc3QvbWVzc2FnZS1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2Rpc3QvbWVzc2FnZS1saXN0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2xpYi9hbmd1bGFyL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvYW5ndWxhci9tZXNzYWdlLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1tZXNzYWdlL2xpYi9hbmd1bGFyL3N5bmMtc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tbWVzc2FnZS9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yZXN1bHQvbGliL2FuZ3VsYXIvcmVzdWx0LW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yZXN1bHQvbGliL2FuZ3VsYXIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmVzdWx0L2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXJpc2stYXNzZXNzbWVudC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yaXNrLWFzc2Vzc21lbnQvZGlzdC9yaXNrLWFzc2Vzc21lbnQtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tcmlzay1hc3Nlc3NtZW50L2Rpc3Qvcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1yaXNrLWFzc2Vzc21lbnQvbGliL2FuZ3VsYXIvcmlzay1hc3Nlc3NtZW50LW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zY2hlZHVsZS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zY2hlZHVsZS9kaXN0L3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zY2hlZHVsZS9kaXN0L3NjaGVkdWxlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zY2hlZHVsZS9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXNpZ25hdHVyZS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zaWduYXR1cmUvZGlzdC9zaWduYXR1cmUtZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc2lnbmF0dXJlL2Rpc3Qvc2lnbmF0dXJlLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zaWduYXR1cmUvbGliL2FuZ3VsYXIvc2lnbmF0dXJlLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zaWduYXR1cmUvbGliL2NhbnZhcy1kcmF3ci5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tc3luYy9saWIvYW5ndWxhci9zeW5jLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS1zeW5jL2xpYi9jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXN5bmMvbGliL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L2dyb3VwLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC9ncm91cC1saXN0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3QvZ3JvdXAudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9kaXN0L3dvcmtlci1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2Rpc3Qvd29ya2VyLWxpc3QudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvZGlzdC93b3JrZXIudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2FuZ3VsYXIvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL2FuZ3VsYXIvdXNlci1uZy5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdXNlci9saWIvZ3JvdXAvY29uZmlnLWdyb3VwLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS11c2VyL2xpYi9ncm91cC9ncm91cC1jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL21lbWJlcnNoaXAvY29uZmlnLW1lbWJlcnNoaXAuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL21lbWJlcnNoaXAvbWVtYmVyc2hpcC1jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL3VzZXIvY29uZmlnLXVzZXIuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXVzZXIvbGliL3VzZXIvdXNlci1jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXZlaGljbGUtaW5zcGVjdGlvbi9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24vZGlzdC92ZWhpY2xlLWluc3BlY3Rpb24tZm9ybS50cGwuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0tdmVoaWNsZS1pbnNwZWN0aW9uL2Rpc3QvdmVoaWNsZS1pbnNwZWN0aW9uLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS12ZWhpY2xlLWluc3BlY3Rpb24vbGliL2FuZ3VsYXIvdmVoaWNsZS1pbnNwZWN0aW9uLW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3JrZmxvdy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3JrZmxvdy9kaXN0L3dvcmtmbG93LWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3Qvd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3Qvd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2Rpc3Qvd29ya2Zsb3ctc3RlcC1mb3JtLnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3JrZmxvdy9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9hbmd1bGFyL3NlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtmbG93L2xpYi9hbmd1bGFyL3dvcmtmbG93LW5nLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3JrZmxvdy9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3Jrb3JkZXIvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9maC13Zm0td29ya29yZGVyL2Rpc3Qvd29ya29yZGVyLWZvcm0udHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9kaXN0L3dvcmtvcmRlci1saXN0LnRwbC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2ZoLXdmbS13b3Jrb3JkZXIvZGlzdC93b3Jrb3JkZXIudHBsLmh0bWwuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9saWIvYW5ndWxhci9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9saWIvYW5ndWxhci9zeW5jLXNlcnZpY2UuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9saWIvYW5ndWxhci93b3Jrb3JkZXItbmcuanMiLCJub2RlX21vZHVsZXMvZmgtd2ZtLXdvcmtvcmRlci9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsInNyYy9hcHAvYW5hbHl0aWNzL2FuYWx5dGljcy5qcyIsInNyYy9hcHAvYXBwZm9ybS9hcHBmb3JtLmpzIiwic3JjL2FwcC9hdXRoL2F1dGguanMiLCJzcmMvYXBwL2ZpbGUvZmlsZS5qcyIsInNyYy9hcHAvZ3JvdXAvZ3JvdXAuanMiLCJzcmMvYXBwL2hvbWUvaG9tZS5qcyIsInNyYy9hcHAvbWFpbi5qcyIsInNyYy9hcHAvbWFwL21hcC5qcyIsInNyYy9hcHAvbWVzc2FnZS9tZXNzYWdlLmpzIiwic3JjL2FwcC9zY2hlZHVsZS9zY2hlZHVsZS5qcyIsInNyYy9hcHAvd29ya2VyL3dvcmtlci5qcyIsInNyYy9hcHAvd29ya2Zsb3cvd29ya2Zsb3cuanMiLCJzcmMvYXBwL3dvcmtvcmRlci93b3Jrb3JkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaFFBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FyZWEudHBsLmh0bWwnLFxuICAgICc8ZGl2IGZsZXggaGlkZS1zbT5cXG4nICtcbiAgICAnICAgIDxtZC1jYXJkPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGlkPVwiYXJlYS1jaGFydFwiPjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtY2FyZC1jb250ZW50PlxcbicgK1xuICAgICcgICAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+QXJlYSBDaGFydDwvaDI+XFxuJyArXG4gICAgJyAgICAgICAgPHA+XFxuJyArXG4gICAgJyAgICAgICAgICBUaGlzIGFyZWEgY2hhcnQgY29tcGFyZXMgdGhlIGVzdGltYXRlZCB3b3Jrb3JkZXIgdGltZSA8YnI+Y29tcGxldGlvbiB0aW1lIHdpdGhcXG4nICtcbiAgICAnICAgICAgICAgIHRoZSByZWFsIGNvbXBsZXRpb24gdGltZS5cXG4nICtcbiAgICAnICAgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtY2FyZC1jb250ZW50PlxcbicgK1xuICAgICcgICAgPC9tZC1jYXJkPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2NoYXJ0LnRwbC5odG1sJyxcbiAgICAnPGRpdiBmbGV4PlxcbicgK1xuICAgICcgIDxtZC1jYXJkPlxcbicgK1xuICAgICcgICAgPGRpdiBpZD1cImJhci1jaGFydFwiPjwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICAgICAgPGgyIGNsYXNzPVwibWQtdGl0bGVcIj5Db21wbGV0aW9uIHRpbWUgLyBFc3RpbWF0ZWQgdGltZTwvaDI+XFxuJyArXG4gICAgJyAgICAgIDxwPlxcbicgK1xuICAgICcgICAgICAgIFRoaXMgYmFyIGNoYXJ0IGNvbXBhcmVzIHRoZSBlc3RpbWF0ZWQgd29ya29yZGVyIHRpbWUgPGJyPmNvbXBsZXRpb24gdGltZSB3aXRoXFxuJyArXG4gICAgJyAgICAgICAgdGhlIHJlYWwgY29tcGxldGlvbiB0aW1lLlxcbicgK1xuICAgICcgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICA8L21kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICA8L21kLWNhcmQ+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInJlcXVpcmUoJy4vYXJlYS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9jaGFydC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9waWUudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYW5hbHl0aWNzLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3BpZS50cGwuaHRtbCcsXG4gICAgJzxkaXYgZmxleD5cXG4nICtcbiAgICAnICA8bWQtY2FyZD5cXG4nICtcbiAgICAnICAgIDxkaXYgaWQ9XCJwaWUtY2hhcnRcIj48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1jYXJkLWNvbnRlbnQ+XFxuJyArXG4gICAgJyAgICAgIDxoMiBjbGFzcz1cIm1kLXRpdGxlXCI+V29ya29yZGVycyBieSBhc3NpZ25lZTwvaDI+XFxuJyArXG4gICAgJyAgICAgIDxwPlxcbicgK1xuICAgICcgICAgICAgIFRoaXMgcGllIGNoYXJ0IHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiB3b3Jrb3JkZXJzIGFzc2lnbmVkIHRvIGVhY2ggd29ya2VyLlxcbicgK1xuICAgICcgICAgICA8L3A+XFxuJyArXG4gICAgJyAgICA8L21kLWNhcmQtY29udGVudD5cXG4nICtcbiAgICAnICA8L21kLWNhcmQ+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFuYWx5dGljcy5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5hbmFseXRpY3MuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcbnZhciBjMyA9IHJlcXVpcmUoJ2MzJylcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhbmFseXRpY3NQaWVjaGFydCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvciwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9waWUudHBsLmh0bWwnKSxcbiAgICBzY29wZToge1xuICAgICAgd29ya2VyczogJz0nLFxuICAgICAgd29ya29yZGVyczogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgfSxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgd29ya2VyTWFwID0ge307XG4gICAgICAkc2NvcGUud29ya2Vycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtlcikge1xuICAgICAgICB3b3JrZXJNYXBbd29ya2VyLmlkXSA9IHdvcmtlcjtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgd29ya29yZGVyQ291bnRzID0ge307XG4gICAgICAkc2NvcGUud29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICB3b3Jrb3JkZXJDb3VudHNbd29ya29yZGVyLmFzc2lnbmVlXSA9IHdvcmtvcmRlckNvdW50c1t3b3Jrb3JkZXIuYXNzaWduZWVdIHx8IDA7XG4gICAgICAgIHdvcmtvcmRlckNvdW50c1t3b3Jrb3JkZXIuYXNzaWduZWVdKys7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbHVtbnMgPSBbXTtcbiAgICAgIF8uZm9ySW4od29ya29yZGVyQ291bnRzLCBmdW5jdGlvbihjb3VudCwgd29ya2VyaWQpIHtcbiAgICAgICAgdmFyIHdvcmtlciA9IHdvcmtlck1hcFt3b3JrZXJpZF07XG4gICAgICAgIHZhciBuYW1lID0gd29ya2VyID8gd29ya2VyLm5hbWUgOiAnVW5hc3NpZ25lZCc7XG4gICAgICAgIHZhciBjb2x1bW4gPSBbbmFtZSwgY291bnRdO1xuICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICAgIH0pO1xuXG5cbiAgICAgIHZhciBwaWVDaGFydCA9IGMzLmdlbmVyYXRlKHtcbiAgICAgICAgYmluZHRvOiAnI3BpZS1jaGFydCcsXG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB3aWR0aDogNDUwXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgICAgICB0eXBlIDogJ3BpZScsXG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbiAoZCwgaSkgeyBjb25zb2xlLmxvZyhcIm9uY2xpY2tcIiwgZCwgaSk7IH0sXG4gICAgICAgICAgICBvbm1vdXNlb3ZlcjogZnVuY3Rpb24gKGQsIGkpIHsgY29uc29sZS5sb2coXCJvbm1vdXNlb3ZlclwiLCBkLCBpKTsgfSxcbiAgICAgICAgICAgIG9ubW91c2VvdXQ6IGZ1bmN0aW9uIChkLCBpKSB7IGNvbnNvbGUubG9nKFwib25tb3VzZW91dFwiLCBkLCBpKTsgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH19KVxuICAuZGlyZWN0aXZlKCdhbmFseXRpY3NCYXJjaGFydCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvciwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9jaGFydC50cGwuaHRtbCcpLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgd29ya29yZGVyczogJz0nXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgfSxcbiAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgICAgLy9hZGQgZmFrZSBkYXRhIGZvciBiYXIgY2hhcnRzXG4gICAgICAgIHZhciBjb2x1bW5Fc3RpbWF0ZWQgPSBbXCJlc3RpbWF0ZWRcIl07XG4gICAgICAgIHZhciBjb2x1bW5SZWFsID0gW1wicmVhbFwiXTtcbiAgICAgICAgdmFyIHhBeGlzID0gW107XG4gICAgICAgICRzY29wZS53b3Jrb3JkZXJzLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICAgICAgdmFyIGVzdGltYXRlZCAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTApICsgMTUpO1xuICAgICAgICAgIHZhciByZWFsID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICAgICAgICB4QXhpcy5wdXNoKFwiI1wiICsgd29ya29yZGVyLmlkICsgXCI6XCIgKyB3b3Jrb3JkZXIudGl0bGUpO1xuICAgICAgICAgIGNvbHVtbkVzdGltYXRlZC5wdXNoKGVzdGltYXRlZCk7XG4gICAgICAgICAgY29sdW1uUmVhbC5wdXNoKHJlYWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYmFyQ2hhcnQgPSBjMy5nZW5lcmF0ZSh7XG4gICAgICAgICAgYmluZHRvOiAnI2Jhci1jaGFydCcsXG4gICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgd2lkdGg6IDQ1MFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICBjb2x1bW5Fc3RpbWF0ZWQsXG4gICAgICAgICAgICAgIGNvbHVtblJlYWxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0eXBlOiAnYmFyJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXhpczoge1xuICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXG4gICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IHhBeGlzXG4gICAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgICBiYXI6IHtcbiAgICAgICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICAgIHJhdGlvOiAuOFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9fSlcbiAgLmRpcmVjdGl2ZSgnYW5hbHl0aWNzQXJlYWNoYXJ0JywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yLCAkd2luZG93LCAkdGltZW91dCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FyZWEudHBsLmh0bWwnKSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICAgIC8vYWRkIGZha2UgZGF0YSBmb3IgYmFyIGNoYXJ0c1xuICAgICAgICB2YXIgY29sdW1uRXN0aW1hdGVkID0gW1wiZXN0aW1hdGVkXCJdO1xuICAgICAgICB2YXIgY29sdW1uUmVhbCA9IFtcInJlYWxcIl07XG4gICAgICAgIHZhciB4QXhpcyA9IFtdO1xuICAgICAgICAkc2NvcGUud29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHZhciBlc3RpbWF0ZWQgID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICAgICAgICB2YXIgcmVhbCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxNSk7XG4gICAgICAgICAgeEF4aXMucHVzaChcIiNcIiArIHdvcmtvcmRlci5pZCArIFwiOlwiICsgd29ya29yZGVyLnRpdGxlKTtcbiAgICAgICAgICBjb2x1bW5Fc3RpbWF0ZWQucHVzaChlc3RpbWF0ZWQpO1xuICAgICAgICAgIGNvbHVtblJlYWwucHVzaChyZWFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFyZWFDaGFydCA9IGMzLmdlbmVyYXRlKHtcbiAgICAgICAgICAgIGJpbmR0bzogJyNhcmVhLWNoYXJ0JyxcbiAgICAgICAgICAgIHNpemU6IHtcbiAgICAgICAgICAgICAgd2lkdGg6IDQ1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgIGNvbHVtbkVzdGltYXRlZCxcbiAgICAgICAgICAgICAgICBjb2x1bW5SZWFsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0eXBlczoge1xuICAgICAgICAgICAgICBlc3RpbWF0ZWQ6ICdhcmVhJyxcbiAgICAgICAgICAgICAgcmVhbDogJ2FyZWEtc3BsaW5lJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgfSxcbiAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH19KTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sJyxcbiAgICAnXFxuJyArXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJpbnB1dERhdGVcIiBjbGFzcz1cIlwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cImRhdGVcIlxcbicgK1xuICAgICcgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICBuYW1lPVwiaW5wdXREYXRlXCJcXG4nICtcbiAgICAnICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5kYXRlXCJcXG4nICtcbiAgICAnICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICBtaW49XCJ7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19XCJcXG4nICtcbiAgICAnICAgIG1heD1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX1cIlxcbicgK1xuICAgICcgICAgbmctcmVxdWlyZWQ9XCJjdHJsLmZpZWxkLnByb3BzLnJlcXVpcmVkXCJcXG4nICtcbiAgICAnICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm51bWJlclwiPllvdSBkaWQgbm90IGVudGVyIGEgdmFsaWQgZGF0YWU8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbCcsXG4gICAgJ1xcbicgK1xuICAgICc8cCBjbGFzcz1cIm1kLWNhcHRpb25cIj57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnPGRpdiBsYXlvdXQ9XCJyb3dcIj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGZsZXggY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0RGF0ZVwiIGNsYXNzPVwiXCI+RGF0ZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cImRhdGVcIlxcbicgK1xuICAgICcgICAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgICAgbmFtZT1cImlucHV0RGF0ZVwiXFxuJyArXG4gICAgJyAgICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5kYXRlXCJcXG4nICtcbiAgICAnICAgICAgbmctY2hhbmdlPVwiY3RybC51cGRhdGVNb2RlbCgpXCJcXG4nICtcbiAgICAnICAgICAgbWluPVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5taW59fVwiXFxuJyArXG4gICAgJyAgICAgIG1heD1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX1cIlxcbicgK1xuICAgICcgICAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8ICRwYXJlbnQuZmllbGRGb3JtLiRzdWJtaXR0ZWRcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJudW1iZXJcIj5Zb3UgZGlkIG5vdCBlbnRlciBhIHZhbGlkIGRhdGU8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWF4XCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4ge3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fS48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwibWluXCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsYXJnZXIgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19LjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBmbGV4IGNsYXNzPVwibWQtYmxvY2tcIiBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1udW1iZXJcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dFRpbWVcIiBjbGFzcz1cIlwiPlRpbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0aW1lXCJcXG4nICtcbiAgICAnICAgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICAgIG5hbWU9XCJpbnB1dFRpbWVcIlxcbicgK1xuICAgICcgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudGltZVwiXFxuJyArXG4gICAgJyAgICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cIm51bWJlclwiPllvdSBkaWQgbm90IGVudGVyIGEgdmFsaWQgdGltZTwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtYXhcIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1heH19LjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLWxvY2F0aW9uLnRwbC5odG1sJyxcbiAgICAnPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJzxwPnt7ZmllbGQucHJvcHMuaGVscFRleHR9fTwvcD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1idXR0b24gdHlwZT1cImJ1dHRvblwiIG5nLWNsaWNrPVwiY3RybC5zZXRMb2NhdGlvbigkZXZlbnQpXCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sb2NhdGlvbl9zZWFyY2hpbmc8L21kLWljb24+XFxuJyArXG4gICAgJyAgR2V0IExvY2F0aW9uXFxuJyArXG4gICAgJzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBsYXlvdXQ9XCJyb3dcIj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLWxvY2F0aW9uIG1kLWJsb2NrXCIgZmxleD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCJcXG4nICtcbiAgICAnICAgICAgcGxhY2Vob2xkZXI9XCJMYXRpdHVkZVwiXFxuJyArXG4gICAgJyAgICAgIG5hbWU9XCJpbnB1dE5hbWVYXCJcXG4nICtcbiAgICAnICAgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlLmxhdFwiXFxuJyArXG4gICAgJyAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICA+PC9pbnB1dD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lWC4kZXJyb3JcIiBuZy1zaG93PVwiJHBhcmVudC5maWVsZEZvcm0uaW5wdXROYW1lWC4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEge3tmaWVsZC5wcm9wcy5uYW1lfX0gbGF0aXR1ZGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cInt7ZmllbGQucHJvcHMuZmllbGRDb2RlfX0gYXBwZm9ybS1maWVsZC1sb2NhdGlvbiBtZC1ibG9ja1wiIGZsZXg+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiXFxuJyArXG4gICAgJyAgICAgIHBsYWNlaG9sZGVyPVwiTG9uZ2l0dWRlXCJcXG4nICtcbiAgICAnICAgICAgbmFtZT1cImlucHV0TmFtZVlcIlxcbicgK1xuICAgICcgICAgICBuZy1tb2RlbD1cImN0cmwubW9kZWwudmFsdWUubG9uZ1wiXFxuJyArXG4gICAgJyAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICA+PC9pbnB1dD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWVZLiRlcnJvclwiIG5nLXNob3c9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWVZLiRkaXJ0eSB8fCAkcGFyZW50LmZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB7e2ZpZWxkLnByb3BzLm5hbWV9fSBsb25naXR1ZGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLW51bWJlci50cGwuaHRtbCcsXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJpbnB1dE5hbWVcIiBjbGFzcz1cIlwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cIm51bWJlclwiXFxuJyArXG4gICAgJyAgICBwbGFjZWhvbGRlcj1cInt7Y3RybC5maWVsZC5wcm9wcy5oZWxwVGV4dH19XCJcXG4nICtcbiAgICAnICAgIG5hbWU9XCJpbnB1dE5hbWVcIlxcbicgK1xuICAgICcgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlXCJcXG4nICtcbiAgICAnICAgIG1pbj1cInt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX1cIlxcbicgK1xuICAgICcgICAgbWF4PVwie3tmaWVsZC5wcm9wcy5maWVsZE9wdGlvbnMudmFsaWRhdGlvbi5tYXh9fVwiXFxuJyArXG4gICAgJyAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgID48L2lucHV0PlxcbicgK1xuICAgICcgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibnVtYmVyXCI+WW91IGRpZCBub3QgZW50ZXIgYSB2YWxpZCBudW1iZXI8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZT1cIm1heFwiIGNsYXNzPVwiaGVscC1ibG9ja1wiPlZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWF4fX0uPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtaW5cIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxhcmdlciB0aGFuIHt7ZmllbGQucHJvcHMuZmllbGRPcHRpb25zLnZhbGlkYXRpb24ubWlufX0uPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1waG90by50cGwuaHRtbCcsXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbmctY2xpY2s9XCJjdHJsLmNhcHR1cmUoJGV2ZW50KVwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwudmFsdWUgPyBcXCdSZXBsYWNlXFwnIDogXFwnVGFrZSBhXFwnfX0gcGhvdG88L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8YnI+XFxuJyArXG4gICAgJyAgPGltZyBjbGFzcz1cXCdhcHBmb3JtLXBob3RvXFwnIG5nLWlmPVwiZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmxvY2FsVVJJfX1cIiBhbHQ9XCJwaG90b1wiPjwvaW1nPlxcbicgK1xuICAgICcgIDxpbWcgY2xhc3M9XFwnYXBwZm9ybS1waG90b1xcJyBuZy1pZj1cImN0cmwubW9kZWwudmFsdWVcIiBuZy1zcmM9XCJ7e2N0cmwubW9kZWwudmFsdWV9fVwiIGFsdD1cInBob3RvXCI+PC9pbWc+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC10aW1lLnRwbC5odG1sJyxcbiAgICAnXFxuJyArXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGNsYXNzPVwie3tmaWVsZC5wcm9wcy5maWVsZENvZGV9fSBhcHBmb3JtLWZpZWxkLW51bWJlclwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJpbnB1dFRpbWVcIiBjbGFzcz1cIlwiPnt7ZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICA8aW5wdXQgdHlwZT1cInRpbWVcIlxcbicgK1xuICAgICcgICAgcGxhY2Vob2xkZXI9XCJ7e2N0cmwuZmllbGQucHJvcHMuaGVscFRleHR9fVwiXFxuJyArXG4gICAgJyAgICBuYW1lPVwiaW5wdXRUaW1lXCJcXG4nICtcbiAgICAnICAgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC50aW1lXCJcXG4nICtcbiAgICAnICAgIG5nLWNoYW5nZT1cImN0cmwudXBkYXRlTW9kZWwoKVwiXFxuJyArXG4gICAgJyAgICBuZy1yZXF1aXJlZD1cImN0cmwuZmllbGQucHJvcHMucmVxdWlyZWRcIlxcbicgK1xuICAgICcgID48L2lucHV0PlxcbicgK1xuICAgICcgIDxkaXYgbmctbWVzc2FnZXM9XCIkcGFyZW50LmZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cIiRwYXJlbnQuZmllbGRGb3JtLmlucHV0TmFtZS4kZGlydHkgfHwgJHBhcmVudC5maWVsZEZvcm0uJHN1Ym1pdHRlZFwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHt7ZmllbGQucHJvcHMubmFtZX19IGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibnVtYmVyXCI+WW91IGRpZCBub3QgZW50ZXIgYSB2YWxpZCB0aW1lPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtYXhcIiBjbGFzcz1cImhlbHAtYmxvY2tcIj5WYWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1heH19LjwvZGl2PlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlPVwibWluXCIgY2xhc3M9XCJoZWxwLWJsb2NrXCI+VmFsdWUgbXVzdCBiZSBsYXJnZXIgdGhhbiB7e2ZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy52YWxpZGF0aW9uLm1pbn19LjwvZGl2PlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQudHBsLmh0bWwnLFxuICAgICc8bmctZm9ybSBuYW1lPVwiZmllbGRGb3JtXCIgbmctc3VibWl0PVwiY3RybC5zdWJtaXQoKVwiPlxcbicgK1xuICAgICcgIDxkaXYgbmctc3dpdGNoPVwiY3RybC5maWVsZC5wcm9wcy50eXBlXCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cIm51bWJlclwiPlxcbicgK1xuICAgICcgICAgICA8YXBwZm9ybS1maWVsZC1udW1iZXIgbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLW51bWJlcj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJkYXRlVGltZVwiIG5nLXN3aXRjaD1cImN0cmwuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGF0ZXRpbWVVbml0XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJkYXRlXCI+XFxuJyArXG4gICAgJyAgICAgICAgPGFwcGZvcm0tZmllbGQtZGF0ZSBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtZGF0ZT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwiZGF0ZXRpbWVcIj5cXG4nICtcbiAgICAnICAgICAgICAgPGFwcGZvcm0tZmllbGQtZGF0ZXRpbWUgbW9kZWw9XCJjdHJsLm1vZGVsXCIgZmllbGQ9XCJjdHJsLmZpZWxkXCI+PC9hcHBmb3JtLWZpZWxkLWRhdGV0aW1lPlxcbicgK1xuICAgICcgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwidGltZVwiPlxcbicgK1xuICAgICcgICAgICAgICA8YXBwZm9ybS1maWVsZC10aW1lIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC10aW1lPlxcbicgK1xuICAgICcgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0PlxcbicgK1xuICAgICcgICAgICAgICB7e2N0cmwuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGF0ZXRpbWVVbml0fX1cXG4nICtcbiAgICAnICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cImxvY2F0aW9uXCI+XFxuJyArXG4gICAgJyAgICAgIDxhcHBmb3JtLWZpZWxkLWxvY2F0aW9uIG1vZGVsPVwiY3RybC5tb2RlbFwiIGZpZWxkPVwiY3RybC5maWVsZFwiPjwvYXBwZm9ybS1maWVsZC1sb2NhdGlvbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJzaWduYXR1cmVcIiBmbGV4IGNsYXNzPVwiYXBwZm9ybS1zaWduYXR1cmVcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+e3tjdHJsLmZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICA8c2lnbmF0dXJlLWZvcm0gdmFsdWU9XCJjdHJsLm1vZGVsLnZhbHVlXCI+PC9zaWduYXR1cmUtZm9ybT5cXG4nICtcbiAgICAnICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwicGhvdG9cIiBmbGV4IGNsYXNzPVwiYXBwZm9ybS1waG90b1wiPlxcbicgK1xuICAgICcgICAgICA8YXBwZm9ybS1maWVsZC1waG90byBtb2RlbD1cImN0cmwubW9kZWxcIiBmaWVsZD1cImN0cmwuZmllbGRcIj48L2FwcGZvcm0tZmllbGQtcGhvdG8+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0IGZsZXg+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgICAgIDxsYWJlbD57e2N0cmwuZmllbGQucHJvcHMubmFtZX19PC9sYWJlbD5cXG4nICtcbiAgICAnICAgICAgICA8aW5wdXRcXG4nICtcbiAgICAnICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcXG4nICtcbiAgICAnICAgICAgICAgIG5hbWU9XCJpbnB1dE5hbWVcIlxcbicgK1xuICAgICcgICAgICAgICAgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnZhbHVlXCJcXG4nICtcbiAgICAnICAgICAgICAgIG5nLXJlcXVpcmVkPVwiY3RybC5maWVsZC5wcm9wcy5yZXF1aXJlZFwiXFxuJyArXG4gICAgJyAgICAgICAgICBuZy1jbGFzcz1cImN0cmwuZmllbGQucHJvcHMudHlwZVwiXFxuJyArXG4gICAgJyAgICAgICAgPjwvaW5wdXQ+XFxuJyArXG4gICAgJyAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cImZpZWxkRm9ybS5pbnB1dE5hbWUuJGVycm9yXCIgbmctc2hvdz1cImZpZWxkRm9ybS5pbnB1dE5hbWUuJGRpcnR5IHx8IGZpZWxkRm9ybS4kc3VibWl0dGVkXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiIG5nLXNob3c9XCJjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0XCI+e3tjdHJsLmZpZWxkLnByb3BzLmhlbHBUZXh0fX08L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCIgbmctaGlkZT1cImN0cmwuZmllbGQucHJvcHMuaGVscFRleHRcIj5BIHt7Y3RybC5maWVsZC5wcm9wcy5uYW1lfX0gaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L25nLWZvcm0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLXN1Ym1pc3Npb24udHBsLmh0bWwnLFxuICAgICdcXG4nICtcbiAgICAnPG1kLXN1YmhlYWRlcj57e2N0cmwuZm9ybS5wcm9wcy5uYW1lfX08L21kLXN1YmhlYWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1saXN0IGNsYXNzPVwiYXBwZm9ybS12aWV3XCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gbmctaWY9XCIhIGN0cmwuZmllbGRzXCIgY2xhc3M9XCJsb2FkaW5nXCI+XFxuJyArXG4gICAgJyAgICBMb2FkaW5nIGFwcEZvcm0gc3VibWlzc2lvbi4uLlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8ZGl2IG5nLXJlcGVhdD1cImZpZWxkIGluIGN0cmwuZmllbGRzXCI+XFxuJyArXG4gICAgJyAgICA8bmctc3dpdGNoIG9uPVwiZmllbGQucHJvcHMudHlwZVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwic2lnbmF0dXJlXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSB3aXRoLWltYWdlXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Z2VzdHVyZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPHNpZ25hdHVyZSBuZy1pZj1cImZpZWxkLnZhbHVlLmxvY2FsVVJJXCIgdmFsdWU9XCJmaWVsZC52YWx1ZS5sb2NhbFVSSVwiIGFsdD1cIlNpZ25hdHVyZVwiPjwvc2lnbmF0dXJlPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxzaWduYXR1cmUgbmctaWY9XCIhZmllbGQudmFsdWUubG9jYWxVUklcIiB2YWx1ZT1cImZpZWxkLnZhbHVlLmltZ0hlYWRlciArIGZpZWxkLnZhbHVlLmRhdGFcIiBhbHQ9XCJTaWduYXR1cmVcIj48L3NpZ25hdHVyZT5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHA+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC13aGVuPVwibG9jYXRpb25cIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMy1saW5lXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cGxhY2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPnt7ZmllbGQudmFsdWUubGF0fX1OLCB7e2ZpZWxkLnZhbHVlLmxvbmd9fVc8L2gzPlxcbicgK1xuICAgICcgICAgICAgICAgICA8cD57e2ZpZWxkLnByb3BzLm5hbWV9fTwvcD5cXG4nICtcbiAgICAnICAgICAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctc3dpdGNoLXdoZW49XCJudW1iZXJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+ZmlsdGVyXzQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICAgPGgzPnt7ZmllbGQudmFsdWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxwPnt7ZmllbGQucHJvcHMubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1zd2l0Y2gtd2hlbj1cInBob3RvXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSB3aXRoLWltYWdlXCI+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Y2FtZXJhPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgICA8aW1nIG5nLWlmPVwiZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmxvY2FsVVJJfX1cIiBhbHQ9XCJwaG90b1wiPjwvaW1nPlxcbicgK1xuICAgICcgICAgICAgICAgICAgIDxpbWcgbmctaWY9XCIhZmllbGQudmFsdWUubG9jYWxVUklcIiBuZy1zcmM9XCJ7e2ZpZWxkLnZhbHVlLmltZ0hlYWRlciArIGZpZWxkLnZhbHVlLmRhdGF9fVwiIGFsdD1cInBob3RvXCI+PC9pbWc+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLXN3aXRjaC1kZWZhdWx0PlxcbicgK1xuICAgICcgICAgICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj50ZXh0X2Zvcm1hdDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDM+e3tmaWVsZC52YWx1ZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHA+e3tmaWVsZC5wcm9wcy5uYW1lfX08L3A+XFxuJyArXG4gICAgJyAgICAgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L25nLXN3aXRjaD5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS50cGwuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJhcHAtZm9ybVwiIGxheW91dC1wYWRkaW5nID5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJ3b3Jrb3JkZXJGb3JtXCIgbm92YWxpZGF0ZT5cXG4nICtcbiAgICAnICA8ZGl2IG5nLXJlcGVhdD1cImZpZWxkIGluIGN0cmwuZmllbGRzXCI+XFxuJyArXG4gICAgJyAgICA8YXBwZm9ybS1maWVsZCBmaWVsZD1cImZpZWxkXCIgbW9kZWw9XCJjdHJsLm1vZGVsW2ZpZWxkLnByb3BzLmZpZWxkQ29kZSB8fCBmaWVsZC5wcm9wcy5faWRdXCI+PC9hcHBmb3JtLWZpZWxkPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwid29ya2Zsb3ctYWN0aW9ucyBtZC1wYWRkaW5nIG1kLXdoaXRlZnJhbWUtejRcIj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5IG1kLWh1ZS0xXCIgbmctY2xpY2s9XCJjdHJsLmJhY2soJGV2ZW50KVwiPkJhY2s8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gdHlwZT1cImJ1dHRvblwiIG5nLWNsaWNrPVwiY3RybC5kb25lKCRldmVudCwgd29ya29yZGVyRm9ybS4kdmFsaWQpXCIgY2xhc3M9XCJtZC1wcmltYXJ5XCI+Q29udGludWU8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICA8L2Rpdj48IS0tIHdvcmtmbG93LWFjdGlvbnMtLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZGl2PjwhLS0gYXBwLWZvcm0gLS0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwicmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLWRhdGUudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9hcHBmb3JtLWZpZWxkLWxvY2F0aW9uLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtbnVtYmVyLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQtcGhvdG8udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1maWVsZC10aW1lLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0tZmllbGQudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vYXBwZm9ybS1zdWJtaXNzaW9uLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL2FwcGZvcm0udHBsLmh0bWwuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmFwcGZvcm0nO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0nLCBbXG4gICd3Zm0uY29yZS5tZWRpYXRvcidcbiwgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuXSlcblxuLnJ1bihmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXF1aXJlKCcuLi9hcHBmb3JtLW1lZGlhdG9yJykobWVkaWF0b3IpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uYXBwZm9ybS5kaXJlY3RpdmVzJywgW1xuICAnd2ZtLmNvcmUubWVkaWF0b3InLFxuICByZXF1aXJlKCcuL3NlcnZpY2UnKSxcbiAgcmVxdWlyZSgnZmgtd2ZtLXNpZ25hdHVyZScpXG5dKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5hcHBmb3JtLmRpcmVjdGl2ZXMnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5ydW4oZnVuY3Rpb24oYXBwZm9ybUNsaWVudCkge1xuICBhcHBmb3JtQ2xpZW50LmluaXQoKTtcbn0pXG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybVN1Ym1pc3Npb24nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgJHEsIGFwcGZvcm1DbGllbnQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tc3VibWlzc2lvbi50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHN1Ym1pc3Npb25Mb2NhbElkOiAnPXN1Ym1pc3Npb25Mb2NhbElkJ1xuICAgICwgc3VibWlzc2lvbklkOiAnPXN1Ym1pc3Npb25JZCdcbiAgICAsIHN1Ym1pc3Npb246ICc9c3VibWlzc2lvbidcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgc3VibWlzc2lvblByb21pc2U7XG4gICAgICBpZiAoJHNjb3BlLnN1Ym1pc3Npb24pIHtcbiAgICAgICAgc3VibWlzc2lvblByb21pc2UgPSAkcS53aGVuKCRzY29wZS5zdWJtaXNzaW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLnN1Ym1pc3Npb25JZCkge1xuICAgICAgICBzdWJtaXNzaW9uUHJvbWlzZSA9IGFwcGZvcm1DbGllbnQuZ2V0U3VibWlzc2lvbigkc2NvcGUuc3VibWlzc2lvbklkKTtcbiAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLnN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgICAgIHN1Ym1pc3Npb25Qcm9taXNlID0gYXBwZm9ybUNsaWVudC5nZXRTdWJtaXNzaW9uTG9jYWwoJHNjb3BlLnN1Ym1pc3Npb25Mb2NhbElkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2FwcGZvcm1TdWJtaXNzaW9uIGNhbGxlZCB3aXRoIG5vIHN1Ym1pc3Npb24nKTtcbiAgICAgIH1cbiAgICAgIHN1Ym1pc3Npb25Qcm9taXNlLnRoZW4oZnVuY3Rpb24oc3VibWlzc2lvbikge1xuICAgICAgICB2YXIgZm9ybVByb21pc2UgPSBzdWJtaXNzaW9uLmZvcm0gPyAkcS53aGVuKHN1Ym1pc3Npb24uZm9ybSkgOiBhcHBmb3JtQ2xpZW50LmdldEZvcm0oc3VibWlzc2lvbi5wcm9wcy5mb3JtSWQpO1xuICAgICAgICByZXR1cm4gZm9ybVByb21pc2UudGhlbihmdW5jdGlvbihmb3JtKSB7XG4gICAgICAgICAgc2VsZi5mb3JtID0gZm9ybTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGZvcm1DbGllbnQuZ2V0RmllbGRzKHN1Ym1pc3Npb24pO1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZpZWxkcykge1xuICAgICAgICBzZWxmLmZpZWxkcyA9IGZpZWxkcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICRxLCBtZWRpYXRvciwgYXBwZm9ybUNsaWVudCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIGZvcm06ICc9JyxcbiAgICAgIGZvcm1JZDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZvcm07XG4gICAgdmFyIGZvcm1Qcm9taXNlID0gJHNjb3BlLmZvcm0gPyAkcS53aGVuKCRzY29wZS5mb3JtKSA6IGFwcGZvcm1DbGllbnQuZ2V0Rm9ybSgkc2NvcGUuZm9ybUlkKTtcbiAgICBmb3JtUHJvbWlzZS50aGVuKGZ1bmN0aW9uKF9mb3JtKSB7XG4gICAgICBmb3JtID0gX2Zvcm07XG4gICAgICBzZWxmLmZpZWxkcyA9IGZvcm0uZmllbGRzO1xuICAgICAgc2VsZi5tb2RlbCA9IHt9O1xuICAgICAgXy5mb3JFYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICBzZWxmLm1vZGVsW2ZpZWxkLnByb3BzLmZpZWxkQ29kZSB8fCBmaWVsZC5wcm9wcy5faWRdID0ge307XG4gICAgICB9KTtcbiAgICB9KVxuICAgIHNlbGYuYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c3RlcDpiYWNrJyk7XG4gICAgfVxuICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGV2ZW50LCBpc1ZhbGlkKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3BhcmVudEZvcm1TdWJtaXR0ZWQnKTtcbiAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCcsIGV2ZW50KVxuICAgICAgICB2YXIgZmlyc3RJbnZhbGlkID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignaW5wdXQubmctaW52YWxpZCcpO1xuICAgICAgICAvLyBpZiB3ZSBmaW5kIG9uZSwgc2V0IGZvY3VzXG4gICAgICAgIGlmIChmaXJzdEludmFsaWQpIHtcbiAgICAgICAgICBmaXJzdEludmFsaWQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHN1Ym1pc3Npb25GaWVsZHMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHNlbGYubW9kZWxbZmllbGQucHJvcHMuZmllbGRDb2RlIHx8IGZpZWxkLnByb3BzLl9pZF0udmFsdWU7XG4gICAgICAgICAgc3VibWlzc2lvbkZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgIGZpZWxkSWQ6IGZpZWxkLnByb3BzLl9pZCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICBhcHBmb3JtQ2xpZW50LmNyZWF0ZVN1Ym1pc3Npb24oZm9ybSwgc3VibWlzc2lvbkZpZWxkcylcbiAgICAgICAgLnRoZW4oYXBwZm9ybUNsaWVudC5zdWJtaXRTdWJtaXNzaW9uKVxuICAgICAgICAudGhlbihhcHBmb3JtQ2xpZW50LmNvbXBvc2VTdWJtaXNzaW9uUmVzdWx0KVxuICAgICAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0KSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6ZG9uZScsIHN1Ym1pc3Npb25SZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3N1Ym1pc3Npb25GaWVsZHMnLCBzdWJtaXNzaW9uRmllbGRzKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBmaWVsZDogJz0nLFxuICAgICAgbW9kZWw6ICc9J1xuICAgIH1cbiAgLCBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICB2YXIgcGFyZW50Rm9ybSA9IGVsZW1lbnQucGFyZW50KCk7XG4gICAgICB3aGlsZSAocGFyZW50Rm9ybSAmJiBwYXJlbnRGb3JtLnByb3AoJ3RhZ05hbWUnKSAhPT0gJ0ZPUk0nKSB7XG4gICAgICAgIHBhcmVudEZvcm0gPSBwYXJlbnRGb3JtLnBhcmVudCgpO1xuICAgICAgfTtcbiAgICAgIGlmIChwYXJlbnRGb3JtKSB7XG4gICAgICAgIHZhciBmb3JtQ29udHJvbGxlciA9IGVsZW1lbnQuZmluZCgnbmctZm9ybScpLmNvbnRyb2xsZXIoJ2Zvcm0nKTtcbiAgICAgICAgc2NvcGUuJG9uKCdwYXJlbnRGb3JtU3VibWl0dGVkJyxmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGN0cmwuc3VibWl0KGVsZW1lbnQpO1xuICAgICAgICAgIGZvcm1Db250cm9sbGVyLiRzZXRTdWJtaXR0ZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgICBzZWxmLm1vZGVsID0ge307XG4gICAgaWYgKCRzY29wZS5tb2RlbCAmJiAkc2NvcGUubW9kZWwudmFsdWUpIHtcbiAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1vZGVsKTtcbiAgICB9IGVsc2UgaWYgKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24gJiYgc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIHNlbGYubW9kZWwudmFsdWUgPSBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZTtcbiAgICB9O1xuICAgIHNlbGYuc3VibWl0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICBpZiAoc2VsZi5maWVsZC5wcm9wcy50eXBlID09PSAnbG9jYXRpb24nKSB7XG4gICAgICAgIHZhciBpbnB1dHMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0ge1xuICAgICAgICAgIGxhdDogaW5wdXRzWzBdLnZhbHVlLFxuICAgICAgICAgIGxvbmc6IGlucHV0c1sxXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBzZWxmLm1vZGVsLnZhbHVlO1xuICAgIH1cbiAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRMb2NhdGlvbicsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2FwcGZvcm0tZmllbGQtbG9jYXRpb24udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBmaWVsZDogJz0nXG4gICAgLCBtb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWwgPyBhbmd1bGFyLmNvcHkoJHNjb3BlLm1vZGVsKSA6IHt9O1xuICAgIHNlbGYubW9kZWwudmFsdWUgPSBzZWxmLm1vZGVsLnZhbHVlIHx8IHt9O1xuICAgIHNlbGYuaXNWYWxpZCA9IGZ1bmN0aW9uKGZvcm0sIGVsZW1lbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3JtJywgZm9ybSk7XG4gICAgICBjb25zb2xlLmxvZygnZWxlbWVudCcsIGVsZW1lbnQpO1xuICAgIH1cbiAgICBzZWxmLnNldExvY2F0aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYubW9kZWwudmFsdWUubGF0ID0gcGFyc2VGbG9hdChwb3MuY29vcmRzLmxhdGl0dWRlKTtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxvbmcgPSBwYXJzZUZsb2F0KHBvcy5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygncG9zaXRpb24gc2V0Jywgc2VsZi5tb2RlbC52YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgYWxlcnQoJ1VuYWJsZSB0byBnZXQgY3VycmVudCBwb3NpdGlvbicpO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxhdCA9IC0xO1xuICAgICAgICBzZWxmLm1vZGVsLnZhbHVlLmxvbmcgPSAtMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRQaG90bycsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCBtZWRpYXRvciwgbW9iaWxlQ2FtZXJhLCBkZXNrdG9wQ2FtZXJhKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLXBob3RvLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZmllbGQ6ICc9J1xuICAgICwgbW9kZWw6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgICBzZWxmLm1vZGVsID0gJHNjb3BlLm1vZGVsOyAvLyA/IGFuZ3VsYXIuY29weSgkc2NvcGUubW9kZWwpIDoge307XG4gICAgc2VsZi5pc1ZhbGlkID0gZnVuY3Rpb24oZm9ybSwgZWxlbWVudCkge1xuICAgICAgY29uc29sZS5sb2coJ2Zvcm0nLCBmb3JtKTtcbiAgICAgIGNvbnNvbGUubG9nKCdlbGVtZW50JywgZWxlbWVudCk7XG4gICAgfVxuICAgIHNlbGYuY2FwdHVyZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCR3aW5kb3cuY29yZG92YSkge1xuICAgICAgICBtb2JpbGVDYW1lcmEuY2FwdHVyZSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNhcHR1cmUpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0gY2FwdHVyZTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc2t0b3BDYW1lcmEuY2FwdHVyZSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnZhbHVlID0gZGF0YVVybDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ2FwcGZvcm1GaWVsZE51bWJlcicsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1udW1iZXIudHBsLmh0bWwnKVxuICwgc2NvcGU6IHtcbiAgIGZpZWxkOiAnPScsXG4gICBtb2RlbDogJz0nLFxuIH1cbiAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7XG4gICBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICBzZWxmLm1vZGVsLnZhbHVlID0gcGFyc2VGbG9hdChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSk7XG4gICB9O1xuIH1cbiAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gfTtcbn0pO1xuXG5mdW5jdGlvbiBnZXREYXRlKGQpe1xuICByZXR1cm4gJ1lZWVktTU0tREQnLnJlcGxhY2UoJ1lZWVknLCBkLmdldEZ1bGxZZWFyKCkpLnJlcGxhY2UoJ01NJywgdHdvRGlnaShkLmdldE1vbnRoKCkrMSkpLnJlcGxhY2UoJ0REJywgdHdvRGlnaShkLmdldERhdGUoKSkpO1xufTtcblxuZnVuY3Rpb24gZ2V0VGltZShkKXtcbiAgcmV0dXJuICdISDptbScucmVwbGFjZSgnSEgnLCB0d29EaWdpKGQuZ2V0SG91cnMoKSkpLnJlcGxhY2UoJ21tJywgdHdvRGlnaShkLmdldE1pbnV0ZXMoKSkpO1xufTtcblxuZnVuY3Rpb24gdHdvRGlnaShudW0pe1xuICBpZiAobnVtIDwgMTApe1xuICAgIHJldHVybiAnMCcgKyBudW0udG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGREYXRldGltZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRldGltZS50cGwuaHRtbCcpXG4gLCBzY29wZToge1xuICAgZmllbGQ6ICc9JyxcbiAgIG1vZGVsOiAnPScsXG4gfVxuICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmZpZWxkID0gJHNjb3BlLmZpZWxkO1xuICAgc2VsZi5tb2RlbCA9ICRzY29wZS5tb2RlbDtcbiAgIGlmIChzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uICYmIHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKSB7XG4gICAgIHNlbGYubW9kZWwudmFsdWUgPSBuZXcgRGF0ZShzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSk7XG4gICB9O1xuICAgc2VsZi51cGRhdGVNb2RlbCA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuZGF0ZSk7XG4gICAgIHZhciB0aW1lID0gbmV3IERhdGUoc2VsZi5tb2RlbC50aW1lKTtcbiAgICAgJHNjb3BlLm1vZGVsLnZhbHVlID0gZ2V0RGF0ZShkYXRlKSArICcgJyArIGdldFRpbWUodGltZSk7XG4gICB9XG4gfVxuICwgY29udHJvbGxlckFzOiAnY3RybCdcbiB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnYXBwZm9ybUZpZWxkRGF0ZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkd2luZG93LCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuIHJldHVybiB7XG4gICByZXN0cmljdDogJ0UnXG4gLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvYXBwZm9ybS1maWVsZC1kYXRlLnRwbC5odG1sJylcbiAsIHNjb3BlOiB7XG4gICBmaWVsZDogJz0nLFxuICAgbW9kZWw6ICc9JyxcbiB9XG4gLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuZmllbGQgPSAkc2NvcGUuZmllbGQ7XG4gICBzZWxmLm1vZGVsID0gJHNjb3BlLm1vZGVsO1xuICAgaWYgKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24gJiYgc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpIHtcbiAgICAgc2VsZi5tb2RlbC52YWx1ZSA9IG5ldyBEYXRlKHNlbGYuZmllbGQucHJvcHMuZmllbGRPcHRpb25zLmRlZmluaXRpb24uZGVmYXVsdFZhbHVlKTtcbiAgIH07XG4gICBzZWxmLnVwZGF0ZU1vZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBkYXRlID0gbmV3IERhdGUoc2VsZi5tb2RlbC5kYXRlKTtcbiAgICAgJHNjb3BlLm1vZGVsLnZhbHVlID0gZ2V0RGF0ZShkYXRlKTtcbiAgIH1cbiB9XG4gLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuIH07XG59KTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdhcHBmb3JtRmllbGRUaW1lJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIG1lZGlhdG9yKSB7XG4gcmV0dXJuIHtcbiAgIHJlc3RyaWN0OiAnRSdcbiAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9hcHBmb3JtLWZpZWxkLXRpbWUudHBsLmh0bWwnKVxuICwgc2NvcGU6IHtcbiAgIGZpZWxkOiAnPScsXG4gICBtb2RlbDogJz0nLFxuIH1cbiAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgc2VsZi5maWVsZCA9ICRzY29wZS5maWVsZDtcbiAgIHNlbGYubW9kZWwgPSAkc2NvcGUubW9kZWw7XG4gICBpZiAoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbiAmJiBzZWxmLmZpZWxkLnByb3BzLmZpZWxkT3B0aW9ucy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSkge1xuICAgICBzZWxmLm1vZGVsLnZhbHVlID0gbmV3IERhdGUoc2VsZi5maWVsZC5wcm9wcy5maWVsZE9wdGlvbnMuZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpO1xuICAgfTtcbiAgIHNlbGYudXBkYXRlTW9kZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnRpbWUpO1xuICAgICAkc2NvcGUubW9kZWwudmFsdWUgPSBnZXRUaW1lKHRpbWUpO1xuICAgfVxuIH1cbiAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xpZW50ID0gcmVxdWlyZSgnLi4vYXBwZm9ybScpXG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5hcHBmb3JtLnNlcnZpY2UnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmFwcGZvcm0uc2VydmljZScsIFtdKVxuXG4uc2VydmljZSgnYXBwZm9ybUNsaWVudCcsIGZ1bmN0aW9uKCRxKSB7XG4gIHZhciBzZXJ2aWNlID0ge307XG5cbiAgdmFyIG1ldGhvZHMgPSBbXG4gICAgJ2luaXQnLFxuICAgICdsaXN0JyxcbiAgICAnZ2V0Rm9ybScsXG4gICAgJ2dldFN1Ym1pc3Npb25Mb2NhbCcsXG4gICAgJ2dldFN1Ym1pc3Npb24nLFxuICAgICdnZXRTdWJtaXNzaW9ucycsXG4gICAgJ2dldEZpZWxkcycsXG4gICAgJ2NyZWF0ZVN1Ym1pc3Npb24nLFxuICAgICdzdWJtaXRTdWJtaXNzaW9uJyxcbiAgICAndXBsb2FkU3VibWlzc2lvbicsXG4gICAgJ2NvbXBvc2VTdWJtaXNzaW9uUmVzdWx0JyxcbiAgICAnc3luY1N0ZXBSZXN1bHQnLFxuICAgICd3YXRjaFN1Ym1pc3Npb25Nb2RlbCdcbiAgXTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgc2VydmljZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJHEud2hlbihjbGllbnRbbWV0aG9kXS5hcHBseShjbGllbnQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBzZXJ2aWNlO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGllbnQgPSByZXF1aXJlKCcuL2FwcGZvcm0nKVxuXG5mdW5jdGlvbiB3cmFwcGVyKG1lZGlhdG9yKSB7XG4gIHZhciBpbml0UHJvbWlzZSA9IGNsaWVudC5pbml0KCk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIGluaXRQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOmluaXQnKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTppbml0JywgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ2luaXQnLCBmdW5jdGlvbigpIHtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCdwcm9taXNlOmluaXQnLCBpbml0UHJvbWlzZSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06Zm9ybTpsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgY2xpZW50Lmxpc3QoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZvcm1zKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOmZvcm06bGlzdCcsIGZvcm1zKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpmb3JtOmxpc3QnLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06Zm9ybTpyZWFkJywgZnVuY3Rpb24oZm9ybUlkKSB7XG4gICAgY2xpZW50LmdldEZvcm0oZm9ybUlkKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZvcm0pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06Zm9ybTpyZWFkOicgKyBmb3JtSWQsIGZvcm0pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOmZvcm06cmVhZDonICsgZm9ybUlkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpsb2NhbDpyZWFkJywgZnVuY3Rpb24oc3VibWlzc2lvbkxvY2FsSWQpIHtcbiAgICBjbGllbnQuZ2V0U3VibWlzc2lvbkxvY2FsKHN1Ym1pc3Npb25Mb2NhbElkKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpsb2NhbDpyZWFkOicrc3VibWlzc2lvbkxvY2FsSWQsIHN1Ym1pc3Npb24pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246bG9jYWw6cmVhZDonK3N1Ym1pc3Npb25Mb2NhbElkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpyZW1vdGU6cmVhZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgIGNsaWVudC5nZXRTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZClcbiAgICAudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246cmVtb3RlOnJlYWQ6JytzdWJtaXNzaW9uSWQsIHN1Ym1pc3Npb24pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdlcnJvcjphcHBmb3JtOnN1Ym1pc3Npb246cmVtb3RlOnJlYWQ6JytzdWJtaXNzaW9uSWQsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmxpc3Q6cmVtb3RlOnJlYWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uSWRzLCBpZCkge1xuICAgIGNsaWVudC5nZXRTdWJtaXNzaW9ucyhzdWJtaXNzaW9uSWRzKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25zKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCdkb25lOndmbTphcHBmb3JtOnN1Ym1pc3Npb246bGlzdDpyZW1vdGU6cmVhZDonK2lkLCBzdWJtaXNzaW9ucyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjpsaXN0OnJlbW90ZTpyZWFkOicraWQsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3QnLCBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gICAgY2xpZW50LmdldEZpZWxkcyhzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKGZpZWxkcykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3Q6JytzdWJtaXNzaW9uLmdldExvY2FsSWQoKSwgZmllbGRzKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOmZpZWxkOmxpc3Q6JytzdWJtaXNzaW9uLmdldExvY2FsSWQoKSwgZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246Y3JlYXRlJywgZnVuY3Rpb24oZm9ybSwgc3VibWlzc2lvbkZpZWxkcywgdHMpIHtcbiAgICBjbGllbnQuY3JlYXRlU3VibWlzc2lvbihmb3JtLCBzdWJtaXNzaW9uRmllbGRzKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpjcmVhdGU6JyArIHRzLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOmNyZWF0ZTonICsgdHMsIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnN1Ym1pdCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICBjbGllbnQuc3VibWl0U3VibWlzc2lvbihzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2RvbmU6d2ZtOmFwcGZvcm06c3VibWlzc2lvbjpzdWJtaXQ6JyArIHN1Ym1pc3Npb24uZ2V0TG9jYWxJZCgpLCBzdWJtaXNzaW9uKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZXJyb3I6YXBwZm9ybTpzdWJtaXNzaW9uOnN1Ym1pdDonICsgc3VibWlzc2lvbi5nZXRMb2NhbElkKCksIGVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnVwbG9hZCcsIGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICBjbGllbnQudXBsb2FkU3VibWlzc2lvbihzdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06YXBwZm9ybTpzdWJtaXNzaW9uOnVwbG9hZDonICsgc3VibWlzc2lvbi5wcm9wcy5fbHVkaWQsIHN1Ym1pc3Npb25JZCk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ2Vycm9yOmFwcGZvcm06c3VibWlzc2lvbjp1cGxvYWQ6JyArIHN1Ym1pc3Npb24ucHJvcHMuX2x1ZGlkLCBlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNsaWVudC5hZGRTdWJtaXNzaW9uQ29tcGxldGVMaXN0ZW5lcihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0LCBtZXRhRGF0YSkge1xuICAgIGlmIChtZXRhRGF0YSkge1xuICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICBzdWJtaXNzaW9uUmVzdWx0OiBzdWJtaXNzaW9uUmVzdWx0LFxuICAgICAgICBtZXRhRGF0YTogbWV0YURhdGFcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCdtZXRhRGF0YScsIG1ldGFEYXRhKTtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTphcHBmb3JtOnN1Ym1pc3Npb246Y29tcGxldGUnLCBldmVudClcbiAgICB9XG4gIH0pXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBxID0gcmVxdWlyZSgncScpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIGNsaWVudCA9IHt9O1xudmFyIGluaXRQcm9taXNlO1xuXG5jbGllbnQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoaW5pdFByb21pc2UpIHtcbiAgICByZXR1cm4gaW5pdFByb21pc2U7XG4gIH1cbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYubGlzdGVuZXJzID0gW107XG4gIGluaXRQcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkZmguZm9ybXMuaW5pdChmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3JtcyBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgJGZoLmZvcm1zLm9uKFwic3VibWlzc2lvbjpzdWJtaXR0ZWRcIiwgZnVuY3Rpb24oc3VibWlzc2lvbklkKSB7XG4gICAgdmFyIHN1Ym1pc3Npb24gPSB0aGlzO1xuICAgIHZhciBtZXRhRGF0YSA9IHN1Ym1pc3Npb24uZ2V0KCdtZXRhRGF0YScpO1xuICAgIGlmIChzZWxmLmxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgIHNlbGYuY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQoc3VibWlzc2lvbikudGhlbihmdW5jdGlvbihzdWJtaXNzaW9uUmVzdWx0KSB7XG4gICAgICAgIHNlbGYubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgICBsaXN0ZW5lcihzdWJtaXNzaW9uUmVzdWx0LCBtZXRhRGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGluaXRQcm9taXNlO1xufTtcblxuY2xpZW50LmFkZFN1Ym1pc3Npb25Db21wbGV0ZUxpc3RlbmVyID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG59O1xuXG5jbGllbnQubGlzdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgJGZoLmZvcm1zLmdldEZvcm1zKGZ1bmN0aW9uKGVycm9yLCBmb3Jtc01vZGVsKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgZm9ybXMgPSBmb3Jtc01vZGVsLnByb3BzLmZvcm1zO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmb3Jtcyk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbmNsaWVudC5nZXRGb3JtID0gZnVuY3Rpb24oZm9ybUlkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguZm9ybXMuZ2V0Rm9ybSh7Zm9ybUlkOiBmb3JtSWR9LCBmdW5jdGlvbiAoZXJyb3IsIGZvcm0pIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZm9ybSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb25Mb2NhbCA9IGZ1bmN0aW9uKHN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguZm9ybXMuZ2V0U3VibWlzc2lvbnMoZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb25zKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdWJtaXNzaW9ucy5nZXRTdWJtaXNzaW9uQnlNZXRhKHtfbHVkaWQ6IHN1Ym1pc3Npb25Mb2NhbElkfSwgZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb24pIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb24gPSBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICRmaC5mb3Jtcy5kb3dubG9hZFN1Ym1pc3Npb24oe3N1Ym1pc3Npb25JZDogc3VibWlzc2lvbklkfSwgZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb24pIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50LmdldFN1Ym1pc3Npb25zID0gZnVuY3Rpb24oc3VibWlzc2lvbklkcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBwcm9taXNlcyA9IHN1Ym1pc3Npb25JZHMubWFwKGZ1bmN0aW9uKHN1Ym1pc3Npb25JZCkge1xuICAgIHJldHVybiBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5nZXRTdWJtaXNzaW9uKHN1Ym1pc3Npb25JZCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcS5hbGxTZXR0bGVkKHByb21pc2VzKTtcbn1cblxuY2xpZW50LmdldEZpZWxkcyA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN1Ym1pc3Npb24uZ2V0Rm9ybShmdW5jdGlvbihlcnJvciwgZm9ybSkge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGZpZWxkcyA9IGZvcm0uZmllbGRzO1xuICAgICAgdmFyIHFzID0gW107XG4gICAgICBfLmZvck93bihmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIF9kZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgICAgICAgcXMucHVzaChfZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgIHN1Ym1pc3Npb24uZ2V0SW5wdXRWYWx1ZUJ5RmllbGRJZChmaWVsZC5nZXRGaWVsZElkKCksIGZ1bmN0aW9uKGVycm9yLCBmaWVsZFZhbHVlcykge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgX2RlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmllbGQudmFsdWUgPSBmaWVsZFZhbHVlc1swXTtcbiAgICAgICAgICBfZGVmZXJyZWQucmVzb2x2ZShmaWVsZFZhbHVlcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBxLmFsbChxcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmaWVsZHMpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuLyoqXG4qIFRoZSBmaWVsZHMgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mIHtmaWVsZElkOiA8Li4uPiwgdmFsdWU6IDwuLi4+fSBvYmplY3RzXG4qL1xuY2xpZW50LmNyZWF0ZVN1Ym1pc3Npb24gPSBmdW5jdGlvbihmb3JtLCBzdWJtaXNzaW9uRmllbGRzKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICB2YXIgc3VibWlzc2lvbiA9IGZvcm0ubmV3U3VibWlzc2lvbigpO1xuICAgIHZhciBkcyA9IFtdO1xuICAgIF8uZm9yRWFjaChzdWJtaXNzaW9uRmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgdmFyIGQgPSBxLmRlZmVyKCk7XG4gICAgICBkcy5wdXNoKGQucHJvbWlzZSk7XG4gICAgICBzdWJtaXNzaW9uLmFkZElucHV0VmFsdWUoZmllbGQsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBxLmFsbChkcylcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VibWlzc2lvbik7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuY2xpZW50LnN1Ym1pdFN1Ym1pc3Npb24gPSBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICBzdWJtaXNzaW9uLnN1Ym1pdChmdW5jdGlvbihlcnJvciwgc3VibWl0UmVzcG9uc2UpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb24pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5jbGllbnQudXBsb2FkU3VibWlzc2lvbiA9IGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBpbml0UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHN1Ym1pc3Npb24udXBsb2FkKGZ1bmN0aW9uKGVycm9yLCB1cGxvYWRUYXNrKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9O1xuICAgICAgdXBsb2FkVGFzay5zdWJtaXNzaW9uTW9kZWwoZnVuY3Rpb24oZXJyb3IsIHN1Ym1pc3Npb25Nb2RlbCkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Ym1pc3Npb25Nb2RlbCk7XG4gICAgICB9KVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5jbGllbnQuY29tcG9zZVN1Ym1pc3Npb25SZXN1bHQgPSBmdW5jdGlvbihzdWJtaXNzaW9uKSB7XG4gIHZhciBzdWJtaXNzaW9uUmVzdWx0ID0ge1xuICAgICAgc3VibWlzc2lvbkxvY2FsSWQ6IHN1Ym1pc3Npb24ucHJvcHMuX2x1ZGlkXG4gICAgLCBmb3JtSWQ6IHN1Ym1pc3Npb24ucHJvcHMuZm9ybUlkXG4gICAgLCBzdGF0dXM6IHN1Ym1pc3Npb24ucHJvcHMuc3RhdHVzXG4gIH07XG4gIGlmIChzdWJtaXNzaW9uLnByb3BzLl9pZCkge1xuICAgIHN1Ym1pc3Npb25SZXN1bHQuc3VibWlzc2lvbklkID0gc3VibWlzc2lvbi5wcm9wcy5faWQ7XG4gIH1cbiAgcmV0dXJuIHEud2hlbihzdWJtaXNzaW9uUmVzdWx0KTtcbn07XG5cbmNsaWVudC5zeW5jU3RlcFJlc3VsdCA9IGZ1bmN0aW9uKHdvcmtvcmRlciwgc3RlcFJlc3VsdCkge1xuICAvLyBraWNrLW9mZiBhbiBhcHBmb3JtIHVwbG9hZCwgdXBkYXRlIHRoZSB3b3Jrb3JkZXIgd2hlbiBjb21wbGV0ZVxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgcmV0dXJuIGluaXRQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2VsZi5nZXRTdWJtaXNzaW9uTG9jYWwoc3RlcFJlc3VsdC5zdWJtaXNzaW9uLnN1Ym1pc3Npb25Mb2NhbElkKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb24pIHtcbiAgICAgIHN1Ym1pc3Npb24uc2V0KCdtZXRhRGF0YScsIHtcbiAgICAgICAgd2ZtOiB7XG4gICAgICAgICAgd29ya29yZGVySWQ6IHdvcmtvcmRlci5pZCxcbiAgICAgICAgICBzdGVwOiBzdGVwUmVzdWx0LnN0ZXAsXG4gICAgICAgICAgdGltZXN0YW1wOiBzdGVwUmVzdWx0LnRpbWVzdGFtcFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzdWJtaXNzaW9uO1xuICAgIH0pXG4gICAgLnRoZW4oc2VsZi51cGxvYWRTdWJtaXNzaW9uKVxuICAgIC50aGVuKGZ1bmN0aW9uKHN1Ym1pc3Npb25Nb2RlbCkge1xuICAgICAgc2VsZi53YXRjaFN1Ym1pc3Npb25Nb2RlbChzdWJtaXNzaW9uTW9kZWwpOyAvLyBuZWVkIHRoaXMgdG8gdHJpZ2dldCB0aGUgZ2xvYmFsIGV2ZW50XG4gICAgICByZXR1cm4gc3VibWlzc2lvbk1vZGVsO1xuICAgIH0pO1xufTtcblxuY2xpZW50LndhdGNoU3VibWlzc2lvbk1vZGVsID0gZnVuY3Rpb24oc3VibWlzc2lvbk1vZGVsKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgc3VibWlzc2lvbk1vZGVsLm9uKCdzdWJtaXR0ZWQnLCBmdW5jdGlvbihzdWJtaXNzaW9uSWQpIHtcbiAgICAkZmguZm9ybXMuZG93bmxvYWRTdWJtaXNzaW9uKHtzdWJtaXNzaW9uSWQ6IHN1Ym1pc3Npb25JZH0sIGZ1bmN0aW9uKGVycm9yLCByZW1vdGVTdWJtaXNzaW9uKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVtb3RlU3VibWlzc2lvbik7XG4gICAgfSk7XG4gIH0pO1xuICAvLyAgVE9ETzogRG8gd2UgbmVlZCBhIHRpbWVvdXQgaGVyZSB0byBjbGVhbnVwIHN1Ym1pc3Npb25Nb2RlbCBsaXN0ZW5lcnM/XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGllbnQ7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uY2FtZXJhLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLmNhbWVyYS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9jYW1lcmEudHBsLmh0bWwnLFxuICAgICc8IS0tXFxuJyArXG4gICAgJyBDT05GSURFTlRJQUxcXG4nICtcbiAgICAnIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxcbicgK1xuICAgICcgVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxcbicgK1xuICAgICctLT5cXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1jYW1lcmFcIiBmbGV4PlxcbicgK1xuICAgICcgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJCYWNrXCIgbmctY2xpY2s9XCJjdHJsLmNhbmNlbCgpXCIgZmxleD5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hcnJvd19iYWNrPC9tZC1pY29uPlxcbicgK1xuICAgICcgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDx2aWRlbyAgbmctc2hvdz1cImN0cmwuY2FtZXJhT25cIiBhdXRvcGxheT48L3ZpZGVvPlxcbicgK1xuICAgICcgIDxjYW52YXMgbmctaGlkZT1cImN0cmwuY2FtZXJhT25cIj48L2NhbnZhcz5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwid2ZtLWNhbWVyYS1hY3Rpb25zXCIgc3R5bGU9XCJ6LWluZGV4OiAxMDAwXCI+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIG5nLXNob3c9XCJjdHJsLmNhbWVyYU9uXCIgY2xhc3M9XCJ3Zm0tY2FtZXJhLWJ0blwiIG5nLWNsaWNrPVwiY3RybC5zbmFwKClcIj48L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gbmctaGlkZT1cImN0cmwuY2FtZXJhT25cIiBjbGFzcz1cIndmbS1jYW1lcmEtY29uZmlybWF0aW9uLWJ0biBtZC13YXJuXCIgbmctY2xpY2s9XCJjdHJsLnN0YXJ0Q2FtZXJhKClcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIG5nLWhpZGU9XCJjdHJsLmNhbWVyYU9uXCIgY2xhc3M9XCJ3Zm0tY2FtZXJhLWNvbmZpcm1hdGlvbi1idG5cIiBuZy1jbGljaz1cImN0cmwuZG9uZSgpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jaGVjazwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJyZXF1aXJlKCcuL2NhbWVyYS50cGwuaHRtbC5qcycpO1xuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5jYW1lcmEnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmNhbWVyYScsIFtcbiAgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuLCByZXF1aXJlKCcuL3NlcnZpY2UnKVxuXSk7XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uY2FtZXJhLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnY2FtZXJhJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yLCAkd2luZG93LCAkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL2NhbWVyYS50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlbDogJz0nLFxuICAgICAgYXV0b3N0YXJ0OiAnPSdcbiAgICB9LFxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LmF0dHIoJ2ZsZXgnLCB0cnVlKTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBlbGVtZW50ID0gJGVsZW1lbnRbMF0sXG4gICAgICAgICAgY2FudmFzID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF0sXG4gICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxuICAgICAgICAgIHZpZGVvID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKVswXSxcbiAgICAgICAgICBzdHJlYW0sIHdpZHRoLCBoZWlnaHQsIHpvb207XG5cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB2aWRlby5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgICAgIHNlbGYuY2FtZXJhT24gPSBmYWxzZTtcbiAgICAgICAgaWYgKCRzY29wZS5hdXRvc3RhcnQpIHtcbiAgICAgICAgICBzZWxmLnN0YXJ0Q2FtZXJhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xuXG4gICAgICBzZWxmLnNuYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN4ID0gKHZpZGVvLmNsaWVudFdpZHRoIC0gd2lkdGggKSAvIDI7XG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHZpZGVvLCBzeC96b29tLCAwLCB3aWR0aC96b29tLCBoZWlnaHQvem9vbSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHNlbGYuc3RvcENhbWVyYSgpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zdGFydENhbWVyYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPOiBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9nZXR1c2VybWVkaWEtanNcbiAgICAgICAgdmFyIGdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhXG4gICAgICAgIGdldFVzZXJNZWRpYS5jYWxsKG5hdmlnYXRvciwgeyAndmlkZW8nOiB0cnVlIH0sIGZ1bmN0aW9uKF9zdHJlYW0pIHtcbiAgICAgICAgICBzdHJlYW0gPSBfc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnNyYyA9ICR3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLm1vZGVsID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuY2FtZXJhT24gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHZpZGVvV2lkdGg7XG4gICAgICAgICAgICB2aWRlby5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2aWRlb1dpZHRoID0gdmlkZW8uY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWRlby5vbmNhbnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgem9vbSA9IHZpZGVvV2lkdGggLyB2aWRlby5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgdmlkZW8uc3R5bGUubGVmdCA9IC0odmlkZW8uY2xpZW50V2lkdGggLSB3aWR0aCApIC8gMiArICdweCc7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZpZGVvIGNhcHR1cmUgZXJyb3I6ICcsIGVycm9yLmNvZGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zdG9wQ2FtZXJhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLnN0b3AoKTtcbiAgICAgICAgc2VsZi5jYW1lcmFPbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBzZWxmLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnN0b3BDYW1lcmEoKTtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmNhbWVyYTpjYW5jZWwnKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5tb2RlbCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zdG9wQ2FtZXJhKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuIiwiLyoqXG4qIENPTkZJREVOVElBTFxuKiBDb3B5cmlnaHQgMjAxNiBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlcy5cbiogVGhpcyBpcyB1bnB1Ymxpc2hlZCBwcm9wcmlldGFyeSBzb3VyY2UgY29kZSBvZiBSZWQgSGF0LlxuKiovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjYW1lcmEgPSByZXF1aXJlKCcuLi9jYW1lcmEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLmNhbWVyYS5zZXJ2aWNlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5jYW1lcmEuc2VydmljZScsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSlcblxuLmZhY3RvcnkoJ21vYmlsZUNhbWVyYScsIGZ1bmN0aW9uKCRxLCAkd2luZG93LCBtZWRpYXRvcikge1xuICByZXR1cm4gY2FtZXJhO1xufSlcblxuLmZhY3RvcnkoJ2Rlc2t0b3BDYW1lcmEnLCBmdW5jdGlvbigkbWREaWFsb2csIG1lZGlhdG9yKSB7XG4gIHZhciBjYW1lcmEgPSB7fTtcbiAgY2FtZXJhLmNhcHR1cmUgPSBmdW5jdGlvbihldikge1xuICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyh7XG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBDYW1lcmFDdHJsKCRzY29wZSwgbWVkaWF0b3IpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IG51bGw7XG5cbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghIF8uaXNFbXB0eSgkc2NvcGUuZGF0YSkgKSB7XG4gICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgkc2NvcGUuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06Y2FtZXJhOmNhbmNlbCcsICRzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgnUGhvdG8gY2FwdHVyZSBjYW5jZWxsZWQuJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlOiAnPGNhbWVyYSBtb2RlbD1cImRhdGFcIiBhdXRvc3RhcnQ9XCJ0cnVlXCI+PC9jYW1lcmE+JyxcbiAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxuICAgICAgY2xpY2tPdXRzaWRlVG9DbG9zZTogZmFsc2UsXG4gICAgICBmdWxsc2NyZWVuOiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGNhbWVyYTtcbn0pXG47XG4iLCIvKipcbiogQ09ORklERU5USUFMXG4qIENvcHlyaWdodCAyMDE2IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzLlxuKiBUaGlzIGlzIHVucHVibGlzaGVkIHByb3ByaWV0YXJ5IHNvdXJjZSBjb2RlIG9mIFJlZCBIYXQuXG4qKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbmZ1bmN0aW9uIENhbWVyYSgpIHtcbiAgdGhpcy5pbml0KCk7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGlmICh3aW5kb3cuY29yZG92YSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiBjYW1lcmFSZWFkeSgpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9O1xuXG4gIHNlbGYuaW5pdFByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xuICByZXR1cm4gc2VsZi5pbml0UHJvbWlzZTtcbn07XG5cbkNhbWVyYS5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cubmF2aWdhdG9yLmNhbWVyYS5jbGVhbnVwKCk7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLmNhcHR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICBzZWxmLmluaXRQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgd2luZG93Lm5hdmlnYXRvci5jYW1lcmEuZ2V0UGljdHVyZShmdW5jdGlvbiBjYXB0dXJlU3VjY2VzcyhmaWxlVVJJKSB7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBmaWxlVVJJLnN1YnN0cihmaWxlVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgIGZpbGVVUkk6IGZpbGVVUklcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIGNhcHR1cmVGYWlsdXJlKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgIH0sIHtcbiAgICAgIHF1YWxpdHk6IDEwMCxcbiAgICAgIGRlc3RpbmF0aW9uVHlwZTogd2luZG93Lm5hdmlnYXRvci5jYW1lcmEuRGVzdGluYXRpb25UeXBlLkZJTEVfVVJJLFxuICAgICAgZW5jb2RpbmdUeXBlOiB3aW5kb3cuQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGNhbWVyYTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uZmlsZS5kaXJlY3RpdmVzJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5maWxlLmRpcmVjdGl2ZXMnLCBbXSlcblxuLmRpcmVjdGl2ZSgnd2ZtSW1nJywgZnVuY3Rpb24oJHEpIHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgY2xvdWRVcmwgPSAkZmguZ2V0Q2xvdWRVUkwoKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoY2xvdWRVcmwpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgdmFyIGluaXRQcm9taXNlID0gaW5pdCgpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZToge1xuICAgICAgdWlkOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCd1aWQnLCBmdW5jdGlvbih1aWQpIHtcbiAgICAgICAgaW5pdFByb21pc2UudGhlbihmdW5jdGlvbihjbG91ZFVybCkge1xuICAgICAgICAgIGVsZW1lbnRbMF0uc3JjID0gY2xvdWRVcmwgKyBjb25maWcuYXBpUGF0aCArICcvZ2V0LycgKyB1aWQ7XG4gICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudFswXS5zcmMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSlcbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsaWVudCA9IHJlcXVpcmUoJy4uL2ZpbGUnKSxcbiAgICBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKSxcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5maWxlLnNlcnZpY2UnO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLmZpbGUuc2VydmljZScsIFtcbiAgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuXSlcblxuLmZhY3RvcnkoJ2ZpbGVDbGllbnQnLCBmdW5jdGlvbigkcSkge1xuICB2YXIgZmlsZUNsaWVudCA9IHt9O1xuXG4gIF8uZm9yT3duKGNsaWVudCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmaWxlQ2xpZW50W2tleV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRxLndoZW4oY2xpZW50W2tleV0uYXBwbHkoY2xpZW50LCBhcmd1bWVudHMpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZUNsaWVudFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZmlsZUNsaWVudDtcbn0pXG47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ1xuLCBhcGlQYXRoOiAnL2ZpbGUvd2ZtJ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICBxID0gcmVxdWlyZSgncScpO1xuXG52YXIgY2xpZW50ID0ge307XG5cbmNsaWVudC5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZEZoaW5pdCA9IHEuZGVmZXIoKTtcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWRGaGluaXQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGllbnQuY2xvdWRVcmwgPSAkZmguZ2V0Q2xvdWRVUkwoKTtcbiAgICBkZWZlcnJlZEZoaW5pdC5yZXNvbHZlKCk7XG4gIH0pO1xuXG4gIHZhciBkZWZlcnJlZFJlYWR5ID0gcS5kZWZlcigpO1xuICBpZiAod2luZG93LmNvcmRvdmEpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24gY2FtZXJhUmVhZHkoKSB7XG4gICAgICBkZWZlcnJlZFJlYWR5LnJlc29sdmUoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgZGVmZXJyZWRSZWFkeS5yZXNvbHZlKCk7XG4gIH07XG5cbiAgY2xpZW50LmluaXRQcm9taXNlID0gcS5hbGwoW2RlZmVycmVkRmhpbml0LnByb21pc2UsIGRlZmVycmVkUmVhZHkucHJvbWlzZV0pXG4gIHJldHVybiBjbGllbnQuaW5pdFByb21pc2U7XG59O1xuXG5jbGllbnQudXBsb2FkRGF0YVVybCA9IGZ1bmN0aW9uKHVzZXJJZCwgZGF0YVVybCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIGRlZmVycmVkLnJlamVjdCgnQm90aCB1c2VySWQgYW5kIGEgZGF0YVVybCBwYXJhbWV0ZXJzIGFyZSByZXF1aXJlZC4nKTtcbiAgfSBlbHNlIHtcbiAgICAkZmguY2xvdWQoe1xuICAgICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnL293bmVyLycrdXNlcklkKycvdXBsb2FkL2Jhc2U2NC9waG90by5wbmcnLFxuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBkYXRhOiBkYXRhVXJsXG4gICAgfSxcbiAgICBmdW5jdGlvbihyZXMpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BzKSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuY2xpZW50Lmxpc3QgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHVybCA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyBjb25maWcuYXBpUGF0aCArICcvYWxsJ1xuICAgIDogY29uZmlnLmFwaVBhdGggKyAnL293bmVyLycgKyB1c2VySWQ7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmNsb3VkKHtcbiAgICAgIHBhdGg6IHVybCxcbiAgICAgIG1ldGhvZDogJ2dldCdcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlcykge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24obWVzc2FnZSwgcHJvcHMpIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgZS5wcm9wcyA9IHByb3BzO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIH1cbiAgKTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkKGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgdHJhbnNmZXIgPSBuZXcgRmlsZVRyYW5zZmVyKCk7XG4gIHRyYW5zZmVyLnVwbG9hZChmaWxlVVJJLCBzZXJ2ZXJVUkksIGZ1bmN0aW9uIHVwbG9hZFN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSwgZnVuY3Rpb24gdXBsb2FkRmFpbHVyZShlcnJvcikge1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0sIGZpbGVVcGxvYWRPcHRpb25zKTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkUmV0cnkoZmlsZVVSSSwgc2VydmVyVVJJLCBmaWxlVXBsb2FkT3B0aW9ucywgdGltZW91dCwgcmV0cmllcykge1xuICByZXR1cm4gZmlsZVVwbG9hZChmaWxlVVJJLCBzZXJ2ZXJVUkksIGZpbGVVcGxvYWRPcHRpb25zKVxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmIChyZXRyaWVzID09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHVwbG9hZCB0byBcIiArIEpTT04uc3RyaW5naWZ5KHNlcnZlclVSSSkpO1xuICAgIH07XG4gICAgcmV0dXJuIHEuZGVsYXkodGltZW91dClcbiAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmlsZVVwbG9hZFJldHJ5KGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMsIHRpbWVvdXQsIHJldHJpZXMgLSAxKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jbGllbnQudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKHVzZXJJZCwgZmlsZVVSSSwgb3B0aW9ucykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gcS5yZWplY3QoJ3VzZXJJZCBhbmQgZmlsZVVSSSBwYXJhbWV0ZXJzIGFyZSByZXF1aXJlZC4nKTtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZmlsZVVwbG9hZE9wdGlvbnMgPSBuZXcgRmlsZVVwbG9hZE9wdGlvbnMoKTtcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5maWxlS2V5ID0gb3B0aW9ucy5maWxlS2V5IHx8ICdiaW5hcnlmaWxlJztcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5maWxlTmFtZSA9IG9wdGlvbnMuZmlsZU5hbWU7XG4gICAgZmlsZVVwbG9hZE9wdGlvbnMubWltZVR5cGUgPSBvcHRpb25zLm1pbWVUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgICBmaWxlVXBsb2FkT3B0aW9ucy5wYXJhbXMgPSB7XG4gICAgICBvd25lcklkOiB1c2VySWQsXG4gICAgICBmaWxlTmFtZTogb3B0aW9ucy5maWxlTmFtZVxuICAgIH07XG4gICAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgMjAwMDtcbiAgICB2YXIgcmV0cmllcyA9IG9wdGlvbnMucmV0cmllcyB8fCAxO1xuICAgIHJldHVybiBjbGllbnQuaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZXJ2ZXJVUkkgPSB3aW5kb3cuZW5jb2RlVVJJKGNsaWVudC5jbG91ZFVybCArIGNvbmZpZy5hcGlQYXRoICsgJy91cGxvYWQvYmluYXJ5Jyk7XG4gICAgICByZXR1cm4gZmlsZVVwbG9hZFJldHJ5KGZpbGVVUkksIHNlcnZlclVSSSwgZmlsZVVwbG9hZE9wdGlvbnMsIHRpbWVvdXQsIHJldHJpZXMpO1xuICAgIH0pXG4gIH07XG59O1xuXG5jbGllbnQuaW5pdCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsaWVudDtcbiIsInJlcXVpcmUoJy4vd29ya29yZGVyLW1hcC50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1hcC5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tYXAuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLW1hcC50cGwuaHRtbCcsXG4gICAgJzxkaXYgaWQ9XFwnZ21hcF9jYW52YXNcXCc+PC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1hcC5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5tYXAuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCd3b3Jrb3JkZXJNYXAnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IsICR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQpIHtcbiAgZnVuY3Rpb24gaW5pdE1hcChlbGVtZW50LCBjZW50ZXIpIHtcbiAgICB2YXIgbXlPcHRpb25zID0ge1xuICAgICAgem9vbToxNCxcbiAgICAgIGNlbnRlcjpuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNlbnRlclswXSwgY2VudGVyWzFdKSxcbiAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcbiAgICB9O1xuICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignI2dtYXBfY2FudmFzJyksIG15T3B0aW9ucyk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfTtcblxuICBmdW5jdGlvbiByZXNpemVNYXAoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgdmFyIG1hcEVsZW1lbnQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJyNnbWFwX2NhbnZhcycpXG4gICAgdmFyIGhlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQ7XG4gICAgdmFyIHdpZHRoID0gcGFyZW50LmNsaWVudFdpZHRoO1xuICAgIG1hcEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICBtYXBFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXG4gICAgY29uc29sZS5sb2coJ01hcCBkaW1lbnNpb25zOicsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwRWxlbWVudCwgJ3Jlc2l6ZScpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGFkZE1hcmtlcnMobWFwLCBlbGVtZW50LCB3b3Jrb3JkZXJzKSB7XG4gICAgd29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgaWYgKHdvcmtvcmRlci5sb2NhdGlvbikge1xuICAgICAgICAvLyB2YXIgbGF0ID0gY2VudGVyWzBdICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4wNTtcbiAgICAgICAgLy8gdmFyIGxvbmcgPSBjZW50ZXJbMV0gKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjI7XG4gICAgICAgIHZhciBsYXQgPSB3b3Jrb3JkZXIubG9jYXRpb25bMF07XG4gICAgICAgIHZhciBsb25nID0gd29ya29yZGVyLmxvY2F0aW9uWzFdO1xuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7bWFwOiBtYXAscG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKX0pO1xuICAgICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtjb250ZW50Oic8c3Ryb25nPldvcmtvcmRlciAjJyt3b3Jrb3JkZXIuaWQrJzwvc3Ryb25nPjxicj4nK3dvcmtvcmRlci5hZGRyZXNzKyc8YnI+J30pO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCxtYXJrZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBmaW5kUGFyZW50KGRvY3VtZW50LCBlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgdmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZShwYXJlbnQpIHtcbiAgICAgIHZhciBpc1BhcmVudE1hdGNoID0gQXJyYXkucHJvdG90eXBlLnNvbWUuY2FsbChtYXRjaGVzLCBmdW5jdGlvbihfbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudCA9PT0gX21hdGNoO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNQYXJlbnRNYXRjaCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH07XG4gICAgICB2YXIgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBjb25zb2xlLmxvZygncGFyZW50JywgcGFyZW50KVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50IHx8IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLW1hcC50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICBsaXN0OiAnPScsXG4gICAgICBjZW50ZXI6ICc9JyxcbiAgICAgIHdvcmtvcmRlcnM6ICc9JyxcbiAgICAgIGNvbnRhaW5lclNlbGVjdG9yOiAnQCdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIHZhciBtYXAgPSBpbml0TWFwKGVsZW1lbnQsIHNjb3BlLmNlbnRlciB8fCBbNDkuMjcsIC0xMjMuMDhdKTtcbiAgICAgIGFkZE1hcmtlcnMobWFwLCBlbGVtZW50LCBzY29wZS53b3Jrb3JkZXJzKTtcbiAgICAgIHZhciBwYXJlbnQgPSBmaW5kUGFyZW50KCRkb2N1bWVudFswXSwgZWxlbWVudFswXSwgc2NvcGUuY29udGFpbmVyU2VsZWN0b3IpO1xuICAgICAgdmFyIHJlc2l6ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc2l6ZU1hcChlbGVtZW50LCBwYXJlbnQpO1xuICAgICAgfVxuICAgICAgJHRpbWVvdXQocmVzaXplTGlzdGVuZXIpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcik7IC8vIFRPRE86IHRocm90dGxlIHRoaXNcbiAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLm9mZigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csICRlbGVtZW50KSB7XG5cbiAgICB9LFxuICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWFwJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5tYXAnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlJylcbl0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWFwLnNlcnZpY2VzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5tYXAuc2VydmljZXMnO1xuXG5uZ01vZHVsZS5mYWN0b3J5KCdtYXBDbGllbnQnLCBmdW5jdGlvbigpIHtcbiAgdmFyIG1hcENsaWVudCA9IHt9O1xuICBtYXBDbGllbnQuZ2V0Q29vcmRzID0gZnVuY3Rpb24oYWRkcmVzcykge1xuICAgIC8vIGludm9rZSB0aGUgZ29vZ2xlIEFQSSB0byByZXR1cm4gdGhlIGNvLW9yZGluYXRlcyBvZiB0aGUgZ2l2ZW4gbG9jYXRpb25cbiAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vZ2VvY29kaW5nL2ludHJvXG4gIH1cbn0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtZWRpYXRvciA9IHJlcXVpcmUoJy4uL21lZGlhdG9yJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0uY29yZS5tZWRpYXRvcicsIFsnbmcnXSlcblxuLmZhY3RvcnkoJ21lZGlhdG9yJywgZnVuY3Rpb24gbWVkaWF0b3JTZXJ2aWNlKCRxLCAkbG9nKSB7XG4gIHZhciBvcmlnaW5hbFJlcXVlc3QgPSBtZWRpYXRvci5yZXF1ZXN0O1xuXG4gIC8vIG1vbmtleSBwYXRjaCB0aGUgcmVxdWVzdCBmdW5jdGlvbiwgd3JhcHBpbmcgdGhlIHJldHVybmVkIHByb21pc2UgYXMgYW4gYW5ndWxhciBwcm9taXNlXG4gIG1lZGlhdG9yLnJlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG9yaWdpbmFsUmVxdWVzdC5hcHBseShtZWRpYXRvciwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gJHEud2hlbihwcm9taXNlKTtcbiAgfTtcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSA9IGZ1bmN0aW9uKHRvcGljLHNjb3BlLGZuKSB7XG4gICAgdmFyIHN1YnNjcmliZXIgPSBtZWRpYXRvci5zdWJzY3JpYmUodG9waWMsZm4pO1xuICAgIHNjb3BlLiRvbihcIiRkZXN0cm95XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgbWVkaWF0b3IucmVtb3ZlKHRvcGljLCBzdWJzY3JpYmVyLmlkKTtcbiAgICB9KTtcblxuICB9O1xuXG4gIHJldHVybiBtZWRpYXRvcjtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uY29yZS5tZWRpYXRvcic7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgTWVkaWF0b3IgPSByZXF1aXJlKCdtZWRpYXRvci1qcycpLk1lZGlhdG9yO1xudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbnZhciBtZWRpYXRvciA9IG5ldyBNZWRpYXRvcigpO1xuXG5tZWRpYXRvci5wcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIGNiID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gIH07XG4gIHZhciBhcmdzID0gW107XG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gIGFyZ3Muc3BsaWNlKDEsIDAsIGNiKTtcbiAgbWVkaWF0b3Iub25jZS5hcHBseShtZWRpYXRvciwgYXJncyk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5tZWRpYXRvci5yZXF1ZXN0ID0gZnVuY3Rpb24odG9waWMsIHBhcmFtZXRlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHRvcGljcyA9IHt9LCBzdWJzID0ge30sIGNvbXBsZXRlID0gZmFsc2UsIHRpbWVvdXQ7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdG9waWNzLnJlcXVlc3QgPSB0b3BpYztcbiAgdG9waWNzLmRvbmUgPSBvcHRpb25zLmRvbmVUb3BpYyB8fCAnZG9uZTonICsgdG9waWM7XG4gIHRvcGljcy5lcnJvciA9IG9wdGlvbnMuZXJyb3JUb3BpYyB8fCAnZXJyb3I6JyArIHRvcGljO1xuXG4gIHZhciB1aWQgPSBudWxsO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ3VpZCcpKSB7XG4gICAgdWlkID0gb3B0aW9ucy51aWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcnMgIT09IFwidW5kZWZpbmVkXCIgJiYgcGFyYW1ldGVycyAhPT0gbnVsbCkge1xuICAgIHVpZCA9IHBhcmFtZXRlcnMgaW5zdGFuY2VvZiBBcnJheSA/IHBhcmFtZXRlcnNbMF0gOiBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgaWYgKHVpZCAhPT0gbnVsbCkge1xuICAgICB0b3BpY3MuZG9uZSArPSAnOicgKyB1aWQ7XG4gICAgIHRvcGljcy5lcnJvciArPSAnOicgKyB1aWQ7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMudGltZW91dCkge1xuICAgIG9wdGlvbnMudGltZW91dCA9IDIwMDA7XG4gIH07XG5cbiAgdmFyIGNsZWFuVXAgPSBmdW5jdGlvbigpIHtcbiAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIG1lZGlhdG9yLnJlbW92ZSh0b3BpY3MuZG9uZSwgc3Vicy5kb25lLmlkKTtcbiAgICBtZWRpYXRvci5yZW1vdmUodG9waWNzLmVycm9yLCBzdWJzLmVycm9yLmlkKTtcbiAgfTtcblxuICBzdWJzLmRvbmUgPSBtZWRpYXRvci5zdWJzY3JpYmUodG9waWNzLmRvbmUsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIGNsZWFuVXAoKTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gIH0pO1xuXG4gIHN1YnMuZXJyb3IgPSBtZWRpYXRvci5zdWJzY3JpYmUodG9waWNzLmVycm9yLCBmdW5jdGlvbihlcnJvcikge1xuICAgIGNsZWFuVXAoKTtcbiAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICB9KTtcblxuICB2YXIgYXJncyA9IFt0b3BpY3MucmVxdWVzdF07XG4gIGlmIChwYXJhbWV0ZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShhcmdzLCBwYXJhbWV0ZXJzKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzLnB1c2gocGFyYW1ldGVycyk7XG4gIH1cbiAgbWVkaWF0b3IucHVibGlzaC5hcHBseShtZWRpYXRvciwgYXJncyk7XG5cbiAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgY2xlYW5VcCgpO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignTWVkaWF0b3IgcmVxdWVzdCB0aW1lb3V0IGZvciB0b3BpYyAnICsgIHRvcGljKSk7XG4gICAgfVxuICB9LCBvcHRpb25zLnRpbWVvdXQpO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZWRpYXRvcjtcbiIsInJlcXVpcmUoJy4vbWVzc2FnZS1kZXRhaWwudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vbWVzc2FnZS1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL21lc3NhZ2UtbGlzdC50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyXCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gbmctY2xpY2s9XCJjdHJsLmNsb3NlTWVzc2FnZSgkZXZlbnQsIGN0cmwubWVzc2FnZSlcIiBoaWRlLWd0LXNtIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gYXJpYS1sYWJlbD1cIkNsb3NlXCIgbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAge3tjdHJsLm1lc3NhZ2Uuc3ViamVjdH19XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3Zm0tbWFpbmNvbC1zY3JvbGxcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtaGVhZGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1ib2R5LTFcIj5cXG4nICtcbiAgICAnICAgICAgICA8c3Bhbj5Gcm9tOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2Uuc2VuZGVyLm5hbWV9fVxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWJvZHktMVwiPlxcbicgK1xuICAgICcgICAgICAgIDxzcGFuPlRvOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2UucmVjZWl2ZXIubmFtZX19XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtYm9keS0xXCI+XFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4+U3RhdHVzOjwvc3Bhbj4ge3tjdHJsLm1lc3NhZ2Uuc3RhdHVzfX1cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwhLS08ZGl2IGNsYXNzPVwibWQtYm9keS0xIHRpbWUtc3RhbXBcIj4xMTozOCBBTSAoMyBob3VycyBhZ28pPC9kaXY+LS0+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIj57e2N0cmwubWVzc2FnZS5jb250ZW50fX08L3A+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1mb3JtLnRwbC5odG1sJyxcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXIgbWQtcHJpbWFyeVwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+TmV3IG1lc3NhZ2U8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJ3Zm0tbWFpbmNvbC1zY3JvbGxcIj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJtZXNzYWdlRm9ybVwiIG5nLXN1Ym1pdD1cImN0cmwuZG9uZShtZXNzYWdlRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICcgIDwhLS1cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIm1lc3NhZ2VTdGF0ZVwiPlN0YXR1czwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0bWVzc2FnZVR5cGVcIiBuYW1lPVwibWVzc2FnZVN0YXR1c1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGF0dXNcIiBkaXNhYmxlZD1cInRydWVcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAtLT5cXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1jbGFzcz1cInsgXFwnaGFzLWVycm9yXFwnIDogbWVzc2FnZUZvcm0ucmVjZWl2ZXIuJGludmFsaWQgJiYgIW1lc3NhZ2VGb3JtLnJlY2VpdmVyLiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwic2VsZWN0UmVjZWl2ZXJcIj5UbzwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5yZWNlaXZlclwiIG5hbWU9XCJyZWNlaXZlclwiIGlkPVwic2VsZWN0UmVjZWl2ZXJcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVwid29ya2VyIGluIGN0cmwud29ya2Vyc1wiIHZhbHVlPVwie3t3b3JrZXJ9fVwiPnt7d29ya2VyLm5hbWV9fSAoe3t3b3JrZXIucG9zaXRpb259fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwibWVzc2FnZUZvcm0ucmVjZWl2ZXIuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCBtZXNzYWdlRm9ybS5yZWNlaXZlci4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+VGhlIFRvOiBmaWVsZCBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWNsYXNzPVwieyBcXCdoYXMtZXJyb3JcXCcgOiBtZXNzYWdlRm9ybS5zdWJqZWN0LiRpbnZhbGlkICYmICFtZXNzYWdlRm9ybS5zdWJqZWN0LiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRTdWJqZWN0XCI+U3ViamVjdDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0U3ViamVjdFwiIG5hbWU9XCJzdWJqZWN0XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN1YmplY3RcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJtZXNzYWdlRm9ybS5zdWJqZWN0LiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgbWVzc2FnZUZvcm0uc3ViamVjdC4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHN1YmplY3QgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWNsYXNzPVwieyBcXCdoYXMtZXJyb3JcXCcgOiBtZXNzYWdlRm9ybS5jb250ZW50LiRpbnZhbGlkICYmICFtZXNzYWdlRm9ybS5jb250ZW50LiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRDb250ZW50XCI+TWVzc2FnZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8dGV4dGFyZWEgaWQ9XCJpbnB1dENvbnRlbnRcIiBuYW1lPVwiY29udGVudFwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5jb250ZW50XCIgcmVxdWlyZWQgbWQtbWF4bGVuZ3RoPVwiMzUwXCI+PC90ZXh0YXJlYT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwibWVzc2FnZUZvcm0uY29udGVudC4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgbWVzc2FnZUZvcm0uY29udGVudC4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5NZXNzYWdlIGNvbnRlbnQgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj5TZW5kIG1lc3NhZ2U8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWxpc3QudHBsLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5NZXNzYWdlczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCIgIGhpZGUteHMgaGlkZS1zbT5cXG4nICtcbiAgICAnICA8bGFiZWwgZm9yPVwic2VhcmNoXCI+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPnNlYXJjaDwvaT48L2xhYmVsPlxcbicgK1xuICAgICcgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIiBuZy1tb2RlbD1cInNlYXJjaFZhbHVlXCIgbmctY2hhbmdlPVwiY3RybC5hcHBseUZpbHRlcihzZWFyY2hWYWx1ZSlcIj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJtZXNzYWdlc1wiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdD5cXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0zLWxpbmVcIiBuZy1yZXBlYXQ9XCJtZXNzYWdlIGluIGN0cmwubGlzdCB8IHJldmVyc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0TWVzc2FnZSgkZXZlbnQsIG1lc3NhZ2UpXCIgY2xhc3M9XCJtZC0zLWxpbmUgd29ya29yZGVyLWl0ZW1cIlxcbicgK1xuICAgICcgICAgIG5nLWNsYXNzPVwie2FjdGl2ZTogY3RybC5zZWxlY3RlZC5pZCA9PT0gbWVzc2FnZS5pZCwgbmV3OiBtZXNzYWdlLnN0YXR1cyA9PT0gXFwndW5yZWFkXFwnfVwiPlxcbicgK1xuICAgICcgICAgICA8aW1nIG5nLXNyYz1cInt7bWVzc2FnZS5zZW5kZXIuYXZhdGFyfX1cIiBjbGFzcz1cIm1kLWF2YXRhclwiIGFsdD1cInt7bWVzc2FnZS5zZW5kZXIubmFtZX19XCIgLz5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCIgbGF5b3V0PVwiY29sdW1uXCI+XFxuJyArXG4gICAgJyAgICAgICAgPCEtLTxzcGFuIGNsYXNzPVwibWQtY2FwdGlvbiB0aW1lLXN0YW1wXCI+MTMgbWlucyBhZ288L3NwYW4+LS0+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7bWVzc2FnZS5zZW5kZXIubmFtZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDQ+e3ttZXNzYWdlLnN1YmplY3R9fTwvaDQ+XFxuJyArXG4gICAgJyAgICAgICAgPHA+e3ttZXNzYWdlLmNvbnRlbnR9fTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxtZC1kaXZpZGVyIG1kLWluc2V0PjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLmRpcmVjdGl2ZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLm1lc3NhZ2UuZGlyZWN0aXZlcyc7XG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdtZXNzYWdlTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgbGlzdCA6ICc9bGlzdCcsXG4gICAgICBzZWxlY3RlZE1vZGVsOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5saXN0ID0gJHNjb3BlLmxpc3Q7XG4gICAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgICAgc2VsZi5zZWxlY3RNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQsIG1lc3NhZ2UpIHtcbiAgICAgICAgc2VsZi5zZWxlY3RlZE1lc3NhZ2VJZCA9IG1lc3NhZ2UuaWQ7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOnNlbGVjdGVkJywgbWVzc2FnZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgc2VsZi5pc21lc3NhZ2VTaG93biA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc2hvd25tZXNzYWdlID09PSBtZXNzYWdlO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi5saXN0ID0gJHNjb3BlLmxpc3QuZmlsdGVyKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKG1lc3NhZ2Uuc2VuZGVyLm5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgICAgIHx8IFN0cmluZyhtZXNzYWdlLnN1YmplY3QpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ21lc3NhZ2VGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9tZXNzYWdlLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgbWVzc2FnZSA6ICc9dmFsdWUnXG4gICwgd29ya2VyczogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5tb2RlbCA9IGFuZ3VsYXIuY29weSgkc2NvcGUubWVzc2FnZSk7XG4gICAgICBzZWxmLndvcmtlcnMgPSAkc2NvcGUud29ya2VycztcbiAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5tb2RlbC5yZWNlaXZlciA9IEpTT04ucGFyc2Uoc2VsZi5tb2RlbC5yZWNlaXZlcik7XG4gICAgICAgIHNlbGYubW9kZWwucmVjZWl2ZXJJZCA9IHNlbGYubW9kZWwucmVjZWl2ZXIuaWQ7XG4gICAgICAgIHNlbGYubW9kZWwuc3RhdHVzID0gXCJ1bnJlYWRcIjtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnbWVzc2FnZURldGFpbCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvbWVzc2FnZS1kZXRhaWwudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgbWVzc2FnZSA6ICc9bWVzc2FnZSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLm1lc3NhZ2UgPSAkc2NvcGUubWVzc2FnZTtcbiAgICAgIHNlbGYuc2hvd1NlbGVjdEJ1dHRvbiA9ICEhICRzY29wZS4kcGFyZW50Lm1lc3NhZ2VzO1xuICAgICAgc2VsZi5zZWxlY3RtZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQsIG1lc3NhZ2UpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOm1lc3NhZ2U6c2VsZWN0ZWQnLCBtZXNzYWdlKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmNsb3NlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50LCBtZXNzYWdlKSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTptZXNzYWdlOmNsb3NlOicgKyBtZXNzYWdlLmlkKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWVzc2FnZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ubWVzc2FnZScsIFtcbiAgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuLCByZXF1aXJlKCcuL3N5bmMtc2VydmljZScpXG5dKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbiAgLCBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ubWVzc2FnZS5zeW5jJztcblxuZnVuY3Rpb24gcmVtb3ZlTG9jYWxWYXJzKG9iamVjdCkge1xuICBfLmtleXMob2JqZWN0KS5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKCdfJykgPT09IDA7XG4gIH0pLmZvckVhY2goZnVuY3Rpb24obG9jYWxLZXkpIHtcbiAgICBkZWxldGUgb2JqZWN0W2xvY2FsS2V5XTtcbiAgfSk7XG4gIGlmIChvYmplY3QucmVzdWx0cykge1xuICAgIF8udmFsdWVzKG9iamVjdC5yZXN1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgXy5rZXlzKHJlc3VsdC5zdWJtaXNzaW9uKS5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuaW5kZXhPZignXycpID09PSAwO1xuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihsb2NhbEtleSkge1xuICAgICAgICBkZWxldGUgcmVzdWx0LnN1Ym1pc3Npb25bbG9jYWxLZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpIHtcbiAgdmFyIHdyYXBwZWRNYW5hZ2VyID0gXy5jcmVhdGUobWFuYWdlcik7XG4gIHdyYXBwZWRNYW5hZ2VyLm5ldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ01lc3NhZ2UnXG4gICAgICAsIHN0YXR1czogJ05ldydcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG1lc3NhZ2UpO1xuICAgIH0sIDApO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuXG4gIHJldHVybiB3cmFwcGVkTWFuYWdlcjtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5tZXNzYWdlLnN5bmMnLCBbcmVxdWlyZSgnZmgtd2ZtLXN5bmMnKV0pXG4uZmFjdG9yeSgnbWVzc2FnZVN5bmMnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIHN5bmNTZXJ2aWNlKSB7XG4gIHN5bmNTZXJ2aWNlLmluaXQoJGZoLCBjb25maWcuc3luY09wdGlvbnMpO1xuICB2YXIgbWVzc2FnZVN5bmMgPSB7fTtcbiAgbWVzc2FnZVN5bmMuY3JlYXRlTWFuYWdlciA9IGZ1bmN0aW9uKHF1ZXJ5UGFyYW1zKSB7XG4gICAgaWYgKG1lc3NhZ2VTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKG1lc3NhZ2VTeW5jLm1hbmFnZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWVzc2FnZVN5bmMubWFuYWdlclByb21pc2UgPSBzeW5jU2VydmljZS5tYW5hZ2UoY29uZmlnLmRhdGFzZXRJZCwgbnVsbCwgcXVlcnlQYXJhbXMpXG4gICAgICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgICAgIG1lc3NhZ2VTeW5jLm1hbmFnZXIgPSB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQsICd3aXRoIGZpbHRlcjogJywgcXVlcnlQYXJhbXMpO1xuICAgICAgICByZXR1cm4gbWVzc2FnZVN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9O1xuICBtZXNzYWdlU3luYy5yZW1vdmVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1lc3NhZ2VTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlU3luYy5tYW5hZ2VyLnNhZmVTdG9wKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGUgbWVzc2FnZVN5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHJldHVybiBtZXNzYWdlU3luYztcbn0pXG4uZmlsdGVyKCdyZXZlcnNlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbihpdGVtcykge1xuICAgIHJldHVybiBpdGVtcy5zbGljZSgpLnJldmVyc2UoKTtcbiAgfTtcbn0pO1xuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9tZXNzYWdlJyxcbiAgZGF0YXNldElkIDogJ21lc3NhZ2VzJyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnJlc3VsdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ucmVzdWx0JywgW1xuICByZXF1aXJlKCcuL3NlcnZpY2UnKVxuXSlcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnJlc3VsdC5zeW5jJztcblxuZnVuY3Rpb24gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKSB7XG4gIHZhciB3cmFwcGVkTWFuYWdlciA9IF8uY3JlYXRlKG1hbmFnZXIpO1xuICB3cmFwcGVkTWFuYWdlci5nZXRCeVdvcmtvcmRlcklkID0gZnVuY3Rpb24od29ya29yZGVySWQpIHtcbiAgICByZXR1cm4gd3JhcHBlZE1hbmFnZXIubGlzdCgpXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgcmV0dXJuIHdyYXBwZWRNYW5hZ2VyLmZpbHRlckJ5V29ya29yZGVyKHJlc3VsdHMsIHdvcmtvcmRlcklkKTtcbiAgICB9KTtcbiAgfTtcbiAgd3JhcHBlZE1hbmFnZXIuZmlsdGVyQnlXb3Jrb3JkZXIgPSBmdW5jdGlvbihyZXN1bHRzQXJyYXksIHdvcmtvcmRlcklkKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgZmlsdGVyZWQgPSByZXN1bHRzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhyZXN1bHQud29ya29yZGVySWQpID09PSBTdHJpbmcod29ya29yZGVySWQpO1xuICAgIH0pO1xuICAgIHZhciByZXN1bHQgPSAgZmlsdGVyZWQgJiYgZmlsdGVyZWQubGVuZ3RoID8gZmlsdGVyZWRbMF0gOiB7fTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG4gIHdyYXBwZWRNYW5hZ2VyLmV4dHJhY3RBcHBmb3JtU3VibWlzc2lvbklkcyA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBzdWJtaXNzaW9uSWRzID0gbnVsbDtcbiAgICBpZiAoIHJlc3VsdCAmJiByZXN1bHQuc3RlcFJlc3VsdHMgJiYgISBfLmlzRW1wdHkocmVzdWx0LnN0ZXBSZXN1bHRzKSkge1xuICAgICAgdmFyIGFwcGZvcm1TdGVwUmVzdWx0cyA9IF8uZmlsdGVyKHJlc3VsdC5zdGVwUmVzdWx0cywgZnVuY3Rpb24oc3RlcFJlc3VsdCkge1xuICAgICAgICByZXR1cm4gISEgc3RlcFJlc3VsdC5zdGVwLmZvcm1JZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCEgXy5pc0VtcHR5KGFwcGZvcm1TdGVwUmVzdWx0cykpIHtcbiAgICAgICAgc3VibWlzc2lvbklkcyA9IF8ubWFwKGFwcGZvcm1TdGVwUmVzdWx0cywgZnVuY3Rpb24oc3RlcFJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiBzdGVwUmVzdWx0LnN1Ym1pc3Npb24uc3VibWlzc2lvbklkO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICByZXR1cm4gISEgaWQ7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBzdWJtaXNzaW9uSWRzO1xuICB9XG4gIHJldHVybiB3cmFwcGVkTWFuYWdlcjtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5yZXN1bHQuc3luYycsIFtyZXF1aXJlKCdmaC13Zm0tc3luYycpXSlcbi5mYWN0b3J5KCdyZXN1bHRTeW5jJywgZnVuY3Rpb24oJHEsICR0aW1lb3V0LCBzeW5jU2VydmljZSkge1xuICBzeW5jU2VydmljZS5pbml0KCRmaCwgY29uZmlnLnN5bmNPcHRpb25zKTtcbiAgdmFyIHJlc3VsdFN5bmMgPSB7fTtcbiAgcmVzdWx0U3luYy5tYW5hZ2VyUHJvbWlzZSA9IHN5bmNTZXJ2aWNlLm1hbmFnZShjb25maWcuZGF0YXNldElkKVxuICAudGhlbihmdW5jdGlvbihtYW5hZ2VyKSB7XG4gICAgcmVzdWx0U3luYy5tYW5hZ2VyID0gd3JhcE1hbmFnZXIoJHEsICR0aW1lb3V0LCBtYW5hZ2VyKTtcbiAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQpO1xuICAgIHJldHVybiByZXN1bHRTeW5jLm1hbmFnZXI7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0U3luYztcbn0pXG5cbi5maWx0ZXIoJ2lzRW1wdHknLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIChPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aCA9PT0gMCk7XG4gIH07XG59KVxuXG4ucnVuKGZ1bmN0aW9uKG1lZGlhdG9yLCByZXN1bHRTeW5jKSB7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmFwcGZvcm06c3VibWlzc2lvbjpjb21wbGV0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG1ldGFEYXRhID0gZXZlbnQubWV0YURhdGEud2ZtO1xuICAgIHZhciBzdWJtaXNzaW9uUmVzdWx0ID0gZXZlbnQuc3VibWlzc2lvblJlc3VsdDtcbiAgICByZXN1bHRTeW5jLm1hbmFnZXJQcm9taXNlXG4gICAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0QnlXb3Jrb3JkZXJJZChtZXRhRGF0YS53b3Jrb3JkZXJJZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICB2YXIgc3RlcFJlc3VsdCA9IHJlc3VsdC5zdGVwUmVzdWx0c1ttZXRhRGF0YS5zdGVwLmNvZGVdO1xuICAgICAgICBzdGVwUmVzdWx0LnN1Ym1pc3Npb24gPSBzdWJtaXNzaW9uUmVzdWx0O1xuICAgICAgICByZXR1cm4gbWFuYWdlci51cGRhdGUocmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpyZXN1bHQ6cmVtb3RlLXVwZGF0ZTonICsgcmVzdWx0LndvcmtvcmRlcklkLCByZXN1bHQpO1xuICAgIH0pXG4gIH0pXG59KVxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9yZXN1bHQnLFxuICBkYXRhc2V0SWQgOiAncmVzdWx0JyxcbiAgc3luY09wdGlvbnMgOiB7XG4gICAgXCJzeW5jX2ZyZXF1ZW5jeVwiIDogNSxcbiAgICBcInN0b3JhZ2Vfc3RyYXRlZ3lcIjogXCJkb21cIixcbiAgICBcImRvX2NvbnNvbGVfbG9nXCI6IGZhbHNlXG4gIH1cbn1cbiIsInJlcXVpcmUoJy4vcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50Jyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5yaXNrLWFzc2Vzc21lbnQnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3Jpc2stYXNzZXNzbWVudC1mb3JtLnRwbC5odG1sJyxcbiAgICAnICA8ZGl2IG5nLXNob3c9XCJyaXNrQXNzZXNzbWVudFN0ZXAgPT09IDBcIiBsYXlvdXQtcGFkZGluZyBjbGFzcz1cInJpc2stYXNzZXNzc21lbnRcIj5cXG4nICtcbiAgICAnICAgICAgPGgyIGNsYXNzPVwibWQtdGl0bGVcIj5SaXNrIGFzc2Vzc21lbnQgY29tcGxldGU/PC9oMj5cXG4nICtcbiAgICAnICAgICAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIj5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLjwvcD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICAgIDxwIGNsYXNzPVwibWQtYm9keS0xXCI+RXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS48L3A+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIndvcmtmbG93LWFjdGlvbnMgbWQtcGFkZGluZyBtZC13aGl0ZWZyYW1lLXo0XCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5IG1kLXdhcm5cIiBuZy1jbGljaz1cImN0cmwuYW5zd2VyQ29tcGxldGUoJGV2ZW50LCB0cnVlKVwiPk5vPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1wcmltYXJ5XCIgbmctY2xpY2s9XCJjdHJsLmFuc3dlckNvbXBsZXRlKCRldmVudCwgdHJ1ZSlcIj5ZZXM8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PjwhLS0gd29ya2Zsb3ctYWN0aW9ucy0tPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBuZy1pZj1cInJpc2tBc3Nlc3NtZW50U3RlcCA9PSAxXCIgbGF5b3V0LXBhZGRpbmc+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGgzIGNsYXNzPVwibWQtdGl0bGVcIj5TaWduYXR1cmU8L2gzPlxcbicgK1xuICAgICcgICAgPHAgY2xhc3M9XCJtZC1jYXB0aW9uXCI+RHJhdyB5b3VyIHNpZ25hdHVyZSBpbnNpZGUgdGhlIHNxdWFyZTwvcD5cXG4nICtcbiAgICAnICAgIDxzaWduYXR1cmUtZm9ybSB2YWx1ZT1cImN0cmwubW9kZWwuc2lnbmF0dXJlXCI+PC9zaWduYXR1cmUtZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid29ya2Zsb3ctYWN0aW9ucyBtZC1wYWRkaW5nIG1kLXdoaXRlZnJhbWUtejRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnkgbWQtaHVlLTFcIiBuZy1jbGljaz1cImN0cmwuYmFjaygkZXZlbnQpXCI+QmFjazwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeVwiIG5nLWNsaWNrPVwiY3RybC5kb25lKCRldmVudClcIj5Db250aW51ZTwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPC9kaXY+PCEtLSB3b3JrZmxvdy1hY3Rpb25zLS0+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnJpc2stYXNzZXNzbWVudCcpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50JywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9yaXNrLWFzc2Vzc21lbnQudHBsLmh0bWwnLFxuICAgICcgIDxtZC1zdWJoZWFkZXI+UmlzayBBc3Nlc3NtZW50PC9tZC1zdWJoZWFkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1saXN0IGNsYXNzPVwicmlzay1hc3Nlc3NtZW50XCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwicmlza0Fzc2Vzc21lbnQuY29tcGxldGVcIiBjbGFzcz1cInN1Y2Nlc3NcIj5jaGVja19jaXJjbGU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cIiEgcmlza0Fzc2Vzc21lbnQuY29tcGxldGVcIiBjbGFzcz1cImRhbmdlclwiPmNhbmNlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwicmlza0Fzc2Vzc21lbnQuY29tcGxldGVcIj5Db21wbGV0ZTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwiISByaXNrQXNzZXNzbWVudC5jb21wbGV0ZVwiPlVuY29tcGxldGVkPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5SaXNrIEFzc2Vzc21lbnQ8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSB3aXRoLWltYWdlXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5nZXN0dXJlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+PHNpZ25hdHVyZSB2YWx1ZT1cInJpc2tBc3Nlc3NtZW50LnNpZ25hdHVyZVwiPjwvc2lnbmF0dXJlPjwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+UmlzayBBc3Nlc3NtZW50IHNpZ25hdHVyZTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ucmlzay1hc3Nlc3NtZW50JywgWyd3Zm0uY29yZS5tZWRpYXRvcicsIHJlcXVpcmUoJ2ZoLXdmbS1zaWduYXR1cmUnKV0pXG5cbnJlcXVpcmUoJy4uLy4uL2Rpc3QnKTtcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdyaXNrQXNzZXNzbWVudCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgcmlza0Fzc2Vzc21lbnQ6IFwiPXZhbHVlXCJcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3Jpc2tBc3Nlc3NtZW50Rm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvcmlzay1hc3Nlc3NtZW50LWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJHNjb3BlLnJpc2tBc3Nlc3NtZW50U3RlcCA9IDBcbiAgICAgIHNlbGYubW9kZWwgPSB7fTtcbiAgICAgIHNlbGYuYW5zd2VyQ29tcGxldGUgPSBmdW5jdGlvbihldmVudCwgYW5zd2VyKSB7XG4gICAgICAgIHNlbGYubW9kZWwuY29tcGxldGUgPSBhbnN3ZXI7XG4gICAgICAgICRzY29wZS5yaXNrQXNzZXNzbWVudFN0ZXArKztcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgICAgc2VsZi5iYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnN0ZXA6YmFjaycpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmRvbmUnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbjtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnJpc2stYXNzZXNzbWVudCc7XG4iLCJyZXF1aXJlKCcuL3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3NjaGVkdWxlLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2NoZWR1bGUuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2NoZWR1bGUuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvc2NoZWR1bGUtd29ya29yZGVyLWNoaXAudHBsLmh0bWwnLFxuICAgICc8c3BhbiBjbGFzcz1cIndmbS1jaGlwIHdmbS1jaGlwLW5vLXBpY3R1cmVcIiBzdHlsZT1cIndpZHRoOjMwMHB4O1wiPlxcbicgK1xuICAgICcgIDxzcGFuIGNsYXNzPVwid2ZtLWNoaXAtbmFtZVwiID57e2N0cmwud29ya29yZGVyLnR5cGV9fSAtIHt7Y3RybC53b3Jrb3JkZXIudGl0bGV9fTwvc3Bhbj5cXG4nICtcbiAgICAnPC9zcGFuPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS50cGwuaHRtbCcsXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwid2ZtLXNjaGVkdWxlci10b29sYmFyXCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+U2NoZWR1bGVyPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9oMz5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8c3BhbiBmbGV4Pjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDxtZC1kYXRlcGlja2VyIG5nLW1vZGVsPVwiY3RybC5zY2hlZHVsZURhdGVcIiBtZC1wbGFjZWhvbGRlcj1cIkVudGVyIGRhdGVcIiBuZy1jaGFuZ2U9XCJjdHJsLmRhdGVDaGFuZ2UoKVwiPjwvbWQtZGF0ZXBpY2tlcj5cXG4nICtcbiAgICAnICAgIDwhLS1cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1pY29uLWJ1dHRvblwiIGFyaWEtbGFiZWw9XCJGYXZvcml0ZVwiPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmRhdGVfcmFuZ2U8L21kLWljb24+XFxuJyArXG4gICAgJyAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJy0tPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBsYXlvdXQ9XCJyb3dcIj5cXG4nICtcbiAgICAnICA8ZGl2IGZsZXg9XCI3MFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDx0YWJsZSBjbGFzcz1cIndmbS1zY2hlZHVsZXJcIj5cXG4nICtcbiAgICAnICAgICAgPGNvbCB3aWR0aD1cIjMwXCI+XFxuJyArXG4gICAgJyAgICAgIDxjb2wgd2lkdGg9XCI3MFwiPlxcbicgK1xuICAgICcgICAgICA8dHI+XFxuJyArXG4gICAgJyAgICAgICAgPHRkIGNsYXNzPVwid2ZtLXNjaGVkdWxlci13b3JrZXJcIj5cXG4nICtcbiAgICAnICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3Zm0tdG9vbGJhci1zbVwiPlxcbicgK1xuICAgICcgICAgICAgICAgICA8aDMgY2xhc3M9XCJtZC1zdWJoZWFkXCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgV29ya2Vyc1xcbicgK1xuICAgICcgICAgICAgICAgICA8L2gzPlxcbicgK1xuICAgICcgICAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgICAgICA8bWQtbGlzdD5cXG4nICtcbiAgICAnICAgICAgICAgICAgPG1kLWxpc3QtaXRlbSBuZy1yZXBlYXQ9XCJ3b3JrZXIgaW4gY3RybC53b3JrZXJzXCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPGltZyBhbHQ9XCJOYW1lXCIgbmctc3JjPVwie3t3b3JrZXIuYXZhdGFyfX1cIiBjbGFzcz1cIm1kLWF2YXRhclwiIC8+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPHA+e3t3b3JrZXIubmFtZX19PC9wPlxcbicgK1xuICAgICcgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgICAgICAgIDwvbWQtbGlzdD5cXG4nICtcbiAgICAnICAgICAgICA8L3RkPlxcbicgK1xuICAgICcgICAgICAgIDx0ZCBjbGFzcz1cIndmbS1zY2hlZHVsZXItY2FsZW5kYXJcIj5cXG4nICtcbiAgICAnICAgICAgICAgIDx0YWJsZT5cXG4nICtcbiAgICAnICAgICAgICAgICAgPHRyPjx0aCBuZy1yZXBlYXQ9XCJob3VyIGluIFtcXCc3YW1cXCcsIFxcJzhhbVxcJywgXFwnOWFtXFwnLCBcXCcxMGFtXFwnLCBcXCcxMWFtXFwnLCBcXCcxMnBtXFwnLCBcXCcxcG1cXCcsIFxcJzJwbVxcJywgXFwnM3BtXFwnLCBcXCc0cG1cXCcsIFxcJzVwbVxcJywgXFwnNnBtXFwnLCBcXCc3cG1cXCddXCI+e3tob3VyfX08L3RoPjwvdHI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XCJ3b3JrZXIgaW4gY3RybC53b3JrZXJzXCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgICAgPHRkIG5nLXJlcGVhdD1cImhvdXIgaW4gWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XVwiIGRyb3BwYWJsZT1cInRydWVcIiBkYXRhLWhvdXI9XCJ7e2hvdXJ9fVwiIGRhdGEtd29ya2VySWQ9XCJ7e3dvcmtlci5pZH19XCI+PC90ZD5cXG4nICtcbiAgICAnICAgICAgICAgICAgPC90cj5cXG4nICtcbiAgICAnICAgICAgICAgIDwvdGFibGU+XFxuJyArXG4gICAgJyAgICAgICAgICA8ZGl2IGNsYXNzPVwid2ZtLXNjaGVkdWxlci1zY2hlZHVsZWRcIj48L2Rpdj5cXG4nICtcbiAgICAnICAgICAgICA8L3RkPlxcbicgK1xuICAgICcgICAgICA8L3RyPlxcbicgK1xuICAgICcgICAgPC90YWJsZT5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBmbGV4PVwiMzBcIiBjbGFzcz1cIndmbS1zY2hlZHVsZXItdW5zY2hlZHVsZWRcIiBpZD1cIndvcmtvcmRlcnMtbGlzdFwiIGRyb3BwYWJsZT1cInRydWVcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJ3Zm0tdG9vbGJhci1zbVwiPlxcbicgK1xuICAgICcgICAgICA8aDMgY2xhc3M9XCJtZC1zdWJoZWFkXCI+XFxuJyArXG4gICAgJyAgICAgICAgV29ya29yZGVyc1xcbicgK1xuICAgICcgICAgICA8L2gzPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS5zY2hlZHVsZS5kaXJlY3RpdmVzJztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3NjaGVkdWxlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsICRjb21waWxlLCAkdGltZW91dCwgbWVkaWF0b3IpIHtcbiAgZnVuY3Rpb24gZ2V0V29ya2VyUm93RWxlbWVudHMoZWxlbWVudCwgd29ya2VySWQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS13b3JrZXJJZD1cIicrd29ya2VySWQrJ1wiXScpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SG91ckVsZW1lbnQocm93RWxlbWVudHMsIGhvdXIpIHtcbiAgICB2YXIgaG91ckVsZW1lbnQgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwocm93RWxlbWVudHMsIGZ1bmN0aW9uKF9ob3VyRWxlbWVudCkge1xuICAgICAgcmV0dXJuIF9ob3VyRWxlbWVudC5kYXRhc2V0LmhvdXIgPT09IFN0cmluZyhob3VyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKGhvdXJFbGVtZW50Lmxlbmd0aCkgPyBob3VyRWxlbWVudFswXSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHBhcmVudEVsZW1lbnQsIHdvcmtvcmRlcikge1xuICAgIHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KHBhcmVudEVsZW1lbnQpO1xuICAgIHZhciBfd29ya29yZGVyID0gc2NvcGUud29ya29yZGVyO1xuICAgIHNjb3BlLndvcmtvcmRlciA9IHdvcmtvcmRlcjtcbiAgICB2YXIgY2hpcCA9IGFuZ3VsYXIuZWxlbWVudCgnPHNjaGVkdWxlLXdvcmtvcmRlci1jaGlwIHdvcmtvcmRlcj1cIndvcmtvcmRlclwiIGRyYWdnYWJsZT1cInRydWVcIj48L3NjaGVkdWxlLXdvcmtvcmRlci1jaGlwPicpO1xuXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpKSB7XG4gICAgICB2YXIgaG91ckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50O1xuICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53Zm0tc2NoZWR1bGVyLXNjaGVkdWxlZCcpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KHBhcmVudEVsZW1lbnQpLmFwcGVuZChjaGlwKTtcbiAgICAgICRjb21waWxlKGNoaXApKHNjb3BlKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjaGlwWzBdLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICBjaGlwWzBdLnN0eWxlLmxlZnQgPSBob3VyRWxlbWVudC5vZmZzZXRMZWZ0ICsgJ3B4JztcbiAgICAgICAgY2hpcFswXS5zdHlsZS50b3AgPSBob3VyRWxlbWVudC5vZmZzZXRUb3AgKyAncHgnO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5hcHBlbmQoY2hpcCk7XG4gICAgICAkY29tcGlsZShjaGlwKShzY29wZSk7XG4gICAgfVxuICAgIGNoaXBbMF0uaWQgPSB3b3Jrb3JkZXIuaWQ7XG4gICAgY2hpcFswXS5kYXRhc2V0LndvcmtvcmRlcklkID0gd29ya29yZGVyLmlkO1xuICAgIHNjb3BlLndvcmtvcmRlciA9IF93b3Jrb3JkZXI7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJXb3Jrb3JkZXJzKHNjb3BlLCBlbGVtZW50LCB3b3Jrb3JkZXJzKSB7XG4gICAgdmFyIHdvcmtvcmRlcnNCeVdvcmtlciA9IHt9O1xuICAgIHdvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgIHdvcmtvcmRlcnNCeVdvcmtlclt3b3Jrb3JkZXIuYXNzaWduZWVdID0gd29ya29yZGVyc0J5V29ya2VyW3dvcmtvcmRlci5hc3NpZ25lZV0gfHwgW107XG4gICAgICB3b3Jrb3JkZXJzQnlXb3JrZXJbd29ya29yZGVyLmFzc2lnbmVlXS5wdXNoKHdvcmtvcmRlcik7XG4gICAgfSk7XG5cbiAgICBfLmZvckluKHdvcmtvcmRlcnNCeVdvcmtlciwgZnVuY3Rpb24od29ya29yZGVycywgd29ya2VySWQpIHtcbiAgICAgIHZhciB3b3JrZXJSb3dFbGVtZW50cyA9IGdldFdvcmtlclJvd0VsZW1lbnRzKGVsZW1lbnQsIHdvcmtlcklkKTtcbiAgICAgIHdvcmtvcmRlcnMuZm9yRWFjaChmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgICAgdmFyIGhvdXIgPSBuZXcgRGF0ZSh3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXApLmdldEhvdXJzKCk7XG4gICAgICAgIHZhciBob3VyRWxlbWVudCA9IGdldEhvdXJFbGVtZW50KHdvcmtlclJvd0VsZW1lbnRzLCBob3VyKTtcbiAgICAgICAgaWYgKGhvdXJFbGVtZW50KSB7XG4gICAgICAgICAgcmVuZGVyV29ya29yZGVyKHNjb3BlLCBob3VyRWxlbWVudCwgd29ya29yZGVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJVbnNjaGVkdWxlZFdvcmtvcmRlckxpc3Qoc2NvcGUsIGN0cmwsIGVsZW1lbnQpIHtcbiAgICB2YXIgdW5zY2hlZHVsZWQgPSBzY29wZS53b3Jrb3JkZXJzLmZpbHRlcihmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXIuYXNzaWduZWUgPT0gbnVsbCB8fCB3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXAgPT0gbnVsbDtcbiAgICB9KTtcbiAgICB2YXIgdW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpO1xuICAgIHVuc2NoZWR1bGVkLmZvckVhY2goZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHVuc2NoZWR1bGVkV29ya29yZGVyTGlzdCwgd29ya29yZGVyKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVXb3Jrb3JkZXIod29ya29yZGVyLCB3b3JrZXJJZCwgZGF0ZSwgaG91cikge1xuICAgIHdvcmtvcmRlci5hc3NpZ25lZSA9IHdvcmtlcklkO1xuICAgIGlmIChkYXRlICE9IG51bGwgJiYgaG91ciAhPT0gbnVsbCkge1xuICAgICAgZGF0ZS5zZXRIb3Vycyhob3VyKTtcbiAgICAgIGRhdGUuc2V0TWludXRlcygwKTtcbiAgICAgIGRhdGUuc2V0U2Vjb25kcygwKTtcbiAgICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICAgICAgd29ya29yZGVyLnN0YXJ0VGltZXN0YW1wID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V29ya29yZGVyKHdvcmtvcmRlcnMsIGlkKSB7XG4gICAgdmFyIGZpbHRlcmVkID0gd29ya29yZGVycy5maWx0ZXIoZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHdvcmtvcmRlci5pZCkgPT09IFN0cmluZyhpZCk7XG4gICAgfSlcbiAgICByZXR1cm4gZmlsdGVyZWQubGVuZ3RoID8gZmlsdGVyZWRbMF0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V29ya2VyKHdvcmtlcnMsIGlkKSB7XG4gICAgdmFyIGZpbHRlcmVkID0gd29ya2Vycy5maWx0ZXIoZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICByZXR1cm4gd29ya2VyLmlkID09PSBpZDtcbiAgICB9KVxuICAgIHJldHVybiBmaWx0ZXJlZC5sZW5ndGggPyBmaWx0ZXJlZFswXSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVXb3Jrb3JkZXJzKGVsZW1lbnQpIHtcbiAgICB2YXIgc2NoZWR1bGVkID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci1zY2hlZHVsZWQnKTtcbiAgICB3aGlsZShzY2hlZHVsZWQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBzY2hlZHVsZWQucmVtb3ZlQ2hpbGQoc2NoZWR1bGVkLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihzY29wZSwgY3RybCwgZWxlbWVudCkge1xuICAgIHZhciB3b3Jrb3JkZXJzT25EYXRlID0gc2NvcGUud29ya29yZGVycy5maWx0ZXIoZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUod29ya29yZGVyLnN0YXJ0VGltZXN0YW1wKS50b0RhdGVTdHJpbmcoKSA9PT0gY3RybC5zY2hlZHVsZURhdGUudG9EYXRlU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgcmVuZGVyV29ya29yZGVycyhzY29wZSwgZWxlbWVudCwgd29ya29yZGVyc09uRGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVXb3Jrb3JkZXIod29ya29yZGVyKSB7XG4gICAgcmV0dXJuIG1lZGlhdG9yLnJlcXVlc3QoJ3dmbTpzY2hlZHVsZTp3b3Jrb3JkZXInLCB3b3Jrb3JkZXIsIHt1aWQ6IHdvcmtvcmRlci5pZH0pXG4gIH1cblxuICBmdW5jdGlvbiB3b3Jrb3JkZXJVcGRhdGVkKHNjb3BlLCBzY2hlZHVsZXJFbGVtZW50LCB3b3Jrb3JkZXIpIHtcbiAgICB2YXIgcHJldmlvdXNDaGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdvcmtvcmRlci5pZCk7XG4gICAgaWYgKHByZXZpb3VzQ2hpcEVsZW1lbnQpIHtcbiAgICAgIHByZXZpb3VzQ2hpcEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwcmV2aW91c0NoaXBFbGVtZW50KTtcbiAgICB9XG4gICAgdmFyIHBhcmVudEVsZW1lbnQ7XG4gICAgaWYgKHdvcmtvcmRlci5hc3NpZ25lZSAmJiB3b3Jrb3JkZXIuc3RhcnRUaW1lc3RhbXApIHtcbiAgICAgIHZhciB3b3JrZXJSb3dFbGVtZW50cyA9IGdldFdvcmtlclJvd0VsZW1lbnRzKHNjaGVkdWxlckVsZW1lbnRbMF0sIHdvcmtvcmRlci5hc3NpZ25lZSk7XG4gICAgICB2YXIgaG91ciA9IG5ldyBEYXRlKHdvcmtvcmRlci5zdGFydFRpbWVzdGFtcCkuZ2V0SG91cnMoKTtcbiAgICAgIHBhcmVudEVsZW1lbnQgPSBnZXRIb3VyRWxlbWVudCh3b3JrZXJSb3dFbGVtZW50cywgaG91cik7XG4gICAgfVxuICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50IHx8IHNjaGVkdWxlckVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLndmbS1zY2hlZHVsZXItdW5zY2hlZHVsZWQnKTtcbiAgICByZW5kZXJXb3Jrb3JkZXIoc2NvcGUsIHBhcmVudEVsZW1lbnQsIHdvcmtvcmRlcik7XG4gICAgdmFyIGluZGV4ID0gXy5maW5kSW5kZXgoc2NvcGUud29ya29yZGVycywgZnVuY3Rpb24oX3dvcmtvcmRlcikge1xuICAgICAgcmV0dXJuIF93b3Jrb3JkZXIuaWQgPT09IHdvcmtvcmRlci5pZDtcbiAgICB9KVxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBzY29wZS53b3Jrb3JkZXJzW2luZGV4XSA9IHdvcmtvcmRlcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnb3ZlcihlLCBzY29wZSkge1xuICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyYWdlbnRlcihlKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdkcmFnb3ZlcicpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyYWdsZWF2ZShlKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnb3ZlcicpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGRyb3AoZSwgc2NvcGUsIHNjaGVkdWxlckVsZW1lbnQsIHVuc2NoZWR1bGVkV29ya29yZGVyTGlzdCkge1xuICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciB3b3Jrb3JkZXIgPSBnZXRXb3Jrb3JkZXIoc2NvcGUud29ya29yZGVycywgZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnd29ya29yZGVyaWQnKSk7XG4gICAgdmFyIGRyb3BFbGVtZW50ID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgIGRyb3BFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdvdmVyJyk7XG4gICAgdmFyIHNjaGVkdWxlZFdvcmtvcmRlciA9IGFuZ3VsYXIuY29weSh3b3Jrb3JkZXIpO1xuICAgIGlmIChkcm9wRWxlbWVudC5pZCA9PT0gJ3dvcmtvcmRlcnMtbGlzdCcpIHtcbiAgICAgIHNjaGVkdWxlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlciwgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB3b3JrZXJJZCA9IGRyb3BFbGVtZW50LmRhdGFzZXQud29ya2VyaWQ7XG4gICAgICB2YXIgaG91ciA9IGRyb3BFbGVtZW50LmRhdGFzZXQuaG91cjtcbiAgICAgIHNjaGVkdWxlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlciwgd29ya2VySWQsIHNjb3BlLmN0cmwuc2NoZWR1bGVEYXRlLCBob3VyKTtcbiAgICB9XG4gICAgdXBkYXRlV29ya29yZGVyKHNjaGVkdWxlZFdvcmtvcmRlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWQpIHtcbiAgICAgICAgd29ya29yZGVyVXBkYXRlZChzY29wZSwgc2NoZWR1bGVyRWxlbWVudCwgdXBkYXRlZClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNpemVDYWxlbmRhcihlbGVtZW50KSB7XG4gICAgdmFyIGNhbGVuZGFyID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci1jYWxlbmRhcicpO1xuICAgIGNhbGVuZGFyLnN0eWxlLnBvc2l0aW9uID0gJ2luaGVyaXQnO1xuICAgIHZhciB3aWR0aCA9ICBjYWxlbmRhci5jbGllbnRXaWR0aDtcbiAgICBjYWxlbmRhci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY2FsZW5kYXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3NjaGVkdWxlLnRwbC5odG1sJyksXG4gICAgc2NvcGU6IHtcbiAgICAgIHdvcmtvcmRlcnMgOiAnPScsXG4gICAgICB3b3JrZXJzOiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIC8vIEdldCB0aGUgdGhyZWUgbWFqb3IgZXZlbnRzXG4gICAgICAkdGltZW91dChmdW5jdGlvbiBhZnRlckRpZ2VzdCgpIHtcbiAgICAgICAgc2l6ZUNhbGVuZGFyKGVsZW1lbnQpO1xuICAgICAgICBlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKCFldmVudC5zcmNFbGVtZW50LmdldEF0dHJpYnV0ZSB8fCBldmVudC5zcmNFbGVtZW50LmdldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJykgIT09ICd0cnVlJykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGNoaXAgPSBldmVudC5zcmNFbGVtZW50O1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd3b3Jrb3JkZXJpZCcsIGNoaXAuZGF0YXNldC53b3Jrb3JkZXJJZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZHJvcHBhYmxlcyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnW2Ryb3BwYWJsZT10cnVlXScpO1xuICAgICAgICB2YXIgdW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcud2ZtLXNjaGVkdWxlci11bnNjaGVkdWxlZCcpO1xuXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZHJvcHBhYmxlcywgZnVuY3Rpb24oZHJvcHBhYmxlKSB7XG4gICAgICAgICAgZHJvcHBhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZHJhZ292ZXIpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcmFnZW50ZXIpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBkcmFnbGVhdmUpO1xuICAgICAgICAgIGRyb3BwYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRyb3AoZSwgc2NvcGUsIGVsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkdGltZW91dCwgJGVsZW1lbnQsICR3aW5kb3cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2NoZWR1bGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpemVDYWxlbmRhcigkZWxlbWVudCk7XG4gICAgICB9KVxuICAgICAgcmVuZGVyVW5zY2hlZHVsZWRXb3Jrb3JkZXJMaXN0KCRzY29wZSwgc2VsZiwgJGVsZW1lbnRbMF0pO1xuICAgICAgc2VsZi5kYXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlbW92ZVdvcmtvcmRlcnMoJGVsZW1lbnRbMF0pO1xuICAgICAgICByZW5kZXIoJHNjb3BlLCBzZWxmLCAkZWxlbWVudFswXSk7XG5cbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZW5kZXIoJHNjb3BlLCBzZWxmLCAkZWxlbWVudFswXSk7XG4gICAgICB9KVxuICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnM7XG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2NoZWR1bGVXb3Jrb3JkZXJDaGlwJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9zY2hlZHVsZS13b3Jrb3JkZXItY2hpcC50cGwuaHRtbCcpLFxuICAgIHNjb3BlOiB7XG4gICAgICB3b3Jrb3JkZXIgOiAnPSdcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdGhpcy53b3Jrb3JkZXIgPSAkc2NvcGUud29ya29yZGVyO1xuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9zaWduYXR1cmUtZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9zaWduYXR1cmUudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnNpZ25hdHVyZScsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLWZvcm0udHBsLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwic2lnbmF0dXJlLWZvcm1cIj5cXG4nICtcbiAgICAnICA8Y2FudmFzIHRhYmluZGV4PVwiMFwiPjwvY2FudmFzPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS5zaWduYXR1cmUnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3NpZ25hdHVyZS50cGwuaHRtbCcsXG4gICAgJzxpbWcgbmctc3JjPVwie3tjdHJsLnNpZ25hdHVyZX19XCI+PC9pbWc+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FudmFzRHJhd3IgPSByZXF1aXJlKCcuLi9jYW52YXMtZHJhd3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnNpZ25hdHVyZSc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0uc2lnbmF0dXJlJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKVxuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnc2lnbmF0dXJlRm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkZG9jdW1lbnQsICR0aW1lb3V0LCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB2YWx1ZTogJz0nLFxuICAgICAgb3B0aW9uczogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucyB8fCB7fTtcbiAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdXBwb3J0JywgJ29udG91Y2hzdGFydCcgaW4gJGRvY3VtZW50WzBdKTtcbiAgICAgIHZhciBkcmF3ciA9ICdvbnRvdWNoc3RhcnQnIGluICRkb2N1bWVudFswXVxuICAgICAgICA/IG5ldyBjYW52YXNEcmF3ci5DYW52YXNEcmF3cihlbGVtZW50LCBvcHRpb25zLCAkZG9jdW1lbnQpXG4gICAgICAgIDogbmV3IGNhbnZhc0RyYXdyLkNhbnZhc0RyYXdyTW91c2UoZWxlbWVudCwgb3B0aW9ucywgJGRvY3VtZW50KTtcblxuICAgICAgdmFyICRjYW52YXMgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF0pO1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICRjYW52YXMub24oJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHJsLnN1Ym1pdChlbGVtZW50KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5zdWJtaXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgICAgICAgJHNjb3BlLnZhbHVlID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxubmdNb2R1bGUuZGlyZWN0aXZlKCdzaWduYXR1cmUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvc2lnbmF0dXJlLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgdmFsdWU6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2lnbmF0dXJlID0gJHNjb3BlLnZhbHVlO1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbnZhc0RyYXdyTW91c2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICB2YXIgY2FudmFzID0gZWxlbWVudFswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF07XG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBjYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gIGNhbnZhcy53aWR0aCA9ICh3aW5kb3cuaW5uZXJXaWR0aCk7XG4gIGNhbnZhcy5oZWlnaHQgPSAyMDA7XG4gIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcnO1xuXG4gIC8vIHNldCBwcm9wcyBmcm9tIG9wdGlvbnMsIGJ1dCB0aGUgZGVmYXVsdHMgYXJlIGZvciB0aGUgY29vbCBraWRzXG4gIGN0eC5saW5lV2lkdGggPSBvcHRpb25zLnNpemUgfHwgNTtcbiAgY3R4LmxpbmVDYXAgPSBvcHRpb25zLmxpbmVDYXAgfHwgXCJyb3VuZFwiO1xuICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnYmx1ZSc7XG5cbiAgLy8gbGFzdCBrbm93biBwb3NpdGlvblxuICB2YXIgcG9zID0geyB4OiAwLCB5OiAwIH07XG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYXcpO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2V0UG9zaXRpb24pO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHN0b3ApO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBzdG9wKTtcblxuICAvLyBuZXcgcG9zaXRpb24gZnJvbSBtb3VzZSBldmVudFxuICBmdW5jdGlvbiBzZXRQb3NpdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY2FudmFzLmZvY3VzKCk7XG4gICAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdmFyIG9mZnNldCA9IHtcbiAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICBsZWZ0OiByZWN0LmxlZnRcbiAgICB9O1xuICAgIHBvcy54ID0gZS5jbGllbnRYIC0gb2Zmc2V0LmxlZnQ7XG4gICAgcG9zLnkgPSBlLmNsaWVudFkgLSBvZmZzZXQudG9wO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhdyhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgLy8gbW91c2UgbGVmdCBidXR0b24gbXVzdCBiZSBwcmVzc2VkXG4gICAgaWYgKGUuYnV0dG9ucyAhPT0gMSkgcmV0dXJuO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpOyAvLyBiZWdpblxuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gb3B0aW9ucy5jb2xvcjtcblxuICAgIGN0eC5tb3ZlVG8ocG9zLngsIHBvcy55KTsgLy8gZnJvbVxuXG4gICAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdmFyIG9mZnNldCA9IHtcbiAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICBsZWZ0OiByZWN0LmxlZnRcbiAgICB9O1xuICAgIHBvcy54ID0gZS5jbGllbnRYIC0gb2Zmc2V0LmxlZnQ7XG4gICAgcG9zLnkgPSBlLmNsaWVudFkgLSBvZmZzZXQudG9wO1xuICAgIGN0eC5saW5lVG8ocG9zLngsIHBvcy55KTsgLy8gdG9cblxuICAgIGN0eC5zdHJva2UoKTsgLy8gZHJhdyBpdCFcblxuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICBjYW52YXMuYmx1cigpO1xuICB9XG59O1xuXG52YXIgQ2FudmFzRHJhd3IgPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zLCAkZG9jdW1lbnQpIHtcbiAgdmFyIGNhbnZhcyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICBjYW52YXMud2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XG4gIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcnO1xuXG4gIC8vIHNldCBwcm9wcyBmcm9tIG9wdGlvbnMsIGJ1dCB0aGUgZGVmYXVsdHMgYXJlIGZvciB0aGUgY29vbCBraWRzXG4gIGN0eC5saW5lV2lkdGggPSBvcHRpb25zLnNpemUgfHwgNTtcbiAgY3R4LmxpbmVDYXAgPSBvcHRpb25zLmxpbmVDYXAgfHwgJ3JvdW5kJztcbiAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJ2JsdWUnO1xuICBjdHgucFggPSB1bmRlZmluZWQ7XG4gIGN0eC5wWSA9IHVuZGVmaW5lZDtcblxuICB2YXIgbGluZXMgPSBbLCxdO1xuICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICB2YXIgb2Zmc2V0ID0ge1xuICAgIHRvcDogcmVjdC50b3AgKyAkZG9jdW1lbnRbMF0uYm9keS5zY3JvbGxUb3AsXG4gICAgbGVmdDogcmVjdC5sZWZ0ICsgJGRvY3VtZW50WzBdLmJvZHkuc2Nyb2xsTGVmdFxuICB9O1xuXG4gIHZhciBzZWxmID0ge1xuICAgIC8vYmluZCBjbGljayBldmVudHNcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIHVzZSBhbmd1bGVyLmVsZW1lbnQjb24gZm9yIGF1dG9tYXRpYyBsaXN0ZW5lciBjbGVhbnVwXG4gICAgICB2YXIgY2FudmFzTmcgPSBhbmd1bGFyLmVsZW1lbnQoY2FudmFzKTtcbiAgICAgIC8vc2V0IHBYIGFuZCBwWSBmcm9tIGZpcnN0IGNsaWNrXG4gICAgICBjYW52YXNOZy5vbigndG91Y2hzdGFydCcsIHNlbGYucHJlRHJhdyk7XG4gICAgICBjYW52YXNOZy5vbigndG91Y2htb3ZlJywgc2VsZi5kcmF3KTtcbiAgICAgIGNhbnZhc05nLm9uKCd0b3VjaGVuZCcsIHNlbGYuc3RvcCk7XG4gICAgICBjYW52YXNOZy5vbigndG91Y2hjYW5jZWwnLCBzZWxmLnN0b3ApO1xuICAgIH0sXG5cbiAgICBwcmVEcmF3OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgY2FudmFzLmZvY3VzKCk7XG4gICAgICByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgb2Zmc2V0ID0ge1xuICAgICAgICB0b3A6IHJlY3QudG9wICsgJGRvY3VtZW50WzBdLmJvZHkuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyAkZG9jdW1lbnRbMF0uYm9keS5zY3JvbGxMZWZ0XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQudG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGlkICAgICAgPSB0b3VjaC5pZGVudGlmaWVyO1xuXG4gICAgICAgIGxpbmVzW2lkXSA9IHtcbiAgICAgICAgICB4ICAgICA6IHRvdWNoLnBhZ2VYIC0gb2Zmc2V0LmxlZnQsXG4gICAgICAgICAgeSAgICAgOiB0b3VjaC5wYWdlWSAtIG9mZnNldC50b3AsXG4gICAgICAgICAgY29sb3IgOiBvcHRpb25zLmNvbG9yXG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGRyYXc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQudG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGlkID0gdG91Y2guaWRlbnRpZmllcixcblxuICAgICAgICBtb3ZlWCA9IHRvdWNoLnBhZ2VYIC0gb2Zmc2V0LmxlZnQgLSBsaW5lc1tpZF0ueCxcbiAgICAgICAgbW92ZVkgPSB0b3VjaC5wYWdlWSAtIG9mZnNldC50b3AgLSBsaW5lc1tpZF0ueTtcblxuICAgICAgICB2YXIgcmV0ID0gc2VsZi5tb3ZlKGlkLCBtb3ZlWCwgbW92ZVkpO1xuICAgICAgICBsaW5lc1tpZF0ueCA9IHJldC54O1xuICAgICAgICBsaW5lc1tpZF0ueSA9IHJldC55O1xuICAgICAgfTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24oaSwgY2hhbmdlWCwgY2hhbmdlWSkge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZXNbaV0uY29sb3I7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKGxpbmVzW2ldLngsIGxpbmVzW2ldLnkpO1xuXG4gICAgICBjdHgubGluZVRvKGxpbmVzW2ldLnggKyBjaGFuZ2VYLCBsaW5lc1tpXS55ICsgY2hhbmdlWSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgIHJldHVybiB7IHg6IGxpbmVzW2ldLnggKyBjaGFuZ2VYLCB5OiBsaW5lc1tpXS55ICsgY2hhbmdlWSB9O1xuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIGNhbnZhcy5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBzZWxmLmluaXQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENhbnZhc0RyYXdyOiBDYW52YXNEcmF3cixcbiAgQ2FudmFzRHJhd3JNb3VzZTogQ2FudmFzRHJhd3JNb3VzZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN5bmMgPSByZXF1aXJlKCcuLi9jbGllbnQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0uc3luYy5zZXJ2aWNlJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS5zeW5jLnNlcnZpY2UnLCBbXSlcblxuLmZhY3RvcnkoJ3N5bmNTZXJ2aWNlJywgZnVuY3Rpb24oJHEpIHtcbiAgdmFyIHN5bmNTZXJ2aWNlID0ge307XG4gIHZhciBtYW5hZ2VyUHJvbWlzZTtcblxuICBmdW5jdGlvbiBNYW5hZ2VyV3JhcHBlcihfbWFuYWdlcikge1xuICAgIHRoaXMubWFuYWdlciA9IF9tYW5hZ2VyO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBtZXRob2ROYW1lcyA9IFsnY3JlYXRlJywgJ3JlYWQnLCAndXBkYXRlJywgJ2RlbGV0ZScsICdsaXN0JywgJ3N0YXJ0JywgJ3N0b3AnLCAnc2FmZVN0b3AnLCAnZ2V0UXVldWVTaXplJywgJ2ZvcmNlU3luYycsICd3YWl0Rm9yU3luYyddO1xuICAgIG1ldGhvZE5hbWVzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgc2VsZlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHEud2hlbihzZWxmLm1hbmFnZXJbbWV0aG9kTmFtZV0uYXBwbHkoc2VsZi5tYW5hZ2VyLCBhcmd1bWVudHMpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBzeW5jU2VydmljZS5pbml0ID0gZnVuY3Rpb24oJGZoLCBzeW5jT3B0aW9ucykge1xuICAgIHN5bmMuaW5pdCgkZmgsIHN5bmNPcHRpb25zKTtcbiAgfVxuXG4gIHN5bmNTZXJ2aWNlLm1hbmFnZSA9IGZ1bmN0aW9uKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSB7XG4gICAgcmV0dXJuICRxLndoZW4oc3luYy5tYW5hZ2UoZGF0YXNldElkLCBvcHRpb25zLCBxdWVyeVBhcmFtcywgbWV0YURhdGEpKVxuICAgIC50aGVuKGZ1bmN0aW9uKF9tYW5hZ2VyKSB7XG4gICAgICB2YXIgbWFuYWdlciA9IG5ldyBNYW5hZ2VyV3JhcHBlcihfbWFuYWdlcik7XG4gICAgICBtYW5hZ2VyLnN0cmVhbSA9IF9tYW5hZ2VyLnN0cmVhbTtcbiAgICAgIHJldHVybiBtYW5hZ2VyO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBzeW5jU2VydmljZTtcbn0pXG47XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgLCBxID0gcmVxdWlyZSgncScpXG4gICwgZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbiAgLCBSeCA9IHJlcXVpcmUoJ3J4JylcbiAgO1xuXG52YXIgJGZoLCBpbml0aWFsaXplZCA9IGZhbHNlLCBub3RpZmljYXRpb25TdHJlYW0sIGxpc3RlbmVycyA9IFtdO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1EYXRhU2V0KHN5bmNEYXRhKSB7XG4gIHZhciByZXN1bHQgPSBfLnZhbHVlcyhzeW5jRGF0YSkubWFwKGZ1bmN0aW9uKHN5bmNEYXRhKSB7XG4gICAgcmV0dXJuIHN5bmNEYXRhLmRhdGE7XG4gIH0pO1xuICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmlkOyB9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoY29kZSwgbXNnKSB7XG4gIHZhciBlcnJvciA9ICdFcnJvcic7XG4gIGlmIChjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICcgJyArIGNvZGUgKyAnOiAnICsgbXNnO1xuICB9IGVsc2UgaWYgKGNvZGUgJiYgIW1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBjb2RlO1xuICB9IGVsc2UgaWYgKCFjb2RlICYmIG1zZykge1xuICAgIGVycm9yICs9ICc6ICcgKyBtc2c7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgKz0gJzogbm8gZXJyb3IgZGV0YWlscyBhdmFpbGFibGUnXG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBpbml0KF8kZmgsIF9zeW5jT3B0aW9ucykge1xuICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICBjb25zb2xlLmxvZygnc3luYy1jbGllbnQgYWxyZWFkeSBpbml0YWxpemVkLicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdzeW5jLWNsaWVudCBpbml0YWxpemluZy4nKTtcbiAgICAkZmggPSBfJGZoO1xuICAgIG5vdGlmaWNhdGlvblN0cmVhbSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgYWRkTGlzdGVuZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChub3RpZmljYXRpb24pO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuc2hhcmUoKTtcbiAgICB2YXIgc3luY09wdGlvbnMgPSBfLmRlZmF1bHRzKF9zeW5jT3B0aW9ucywgZGVmYXVsdENvbmZpZy5zeW5jT3B0aW9ucyk7XG5cbiAgICAkZmguc3luYy5pbml0KHN5bmNPcHRpb25zKTtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgJGZoLnN5bmMubm90aWZ5KGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbCh1bmRlZmluZWQsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoJ1N5bmMgbm90IHlldCBpbml0aWFsaXplZC4gIENhbGwgc3luYy1jbGllbnQuaW5pdCgpIGZpcnN0LicpO1xuICB9IGVsc2Uge1xuICAgIC8vbWFuYWdlIHRoZSBkYXRhU2V0XG4gICAgJGZoLnN5bmMubWFuYWdlKGRhdGFzZXRJZCwgb3B0aW9ucywgcXVlcnlQYXJhbXMsIG1ldGFEYXRhLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtYW5hZ2VyID0gbmV3IERhdGFNYW5hZ2VyKGRhdGFzZXRJZCk7XG4gICAgICBtYW5hZ2VyLnN0cmVhbSA9IG5vdGlmaWNhdGlvblN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uZGF0YXNldF9pZCA9PSBkYXRhc2V0SWQ7XG4gICAgICB9KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShtYW5hZ2VyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xufVxuXG5mdW5jdGlvbiBEYXRhTWFuYWdlcihkYXRhc2V0SWQpIHtcbiAgdGhpcy5kYXRhc2V0SWQgPSBkYXRhc2V0SWQ7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9MaXN0KHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihyZXMpIHtcbiAgICB2YXIgb2JqZWN0cyA9IHRyYW5zZm9ybURhdGFTZXQocmVzKTtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKG9iamVjdHMpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLnN5bmMuZG9DcmVhdGUoc2VsZi5kYXRhc2V0SWQsIG9iamVjdCwgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PSAnbG9jYWxfdXBkYXRlX2FwcGxpZWQnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi5tZXNzYWdlID09ICdjcmVhdGUnXG4gICAgICAgIDsgLy8gJiYgbm90aWZpY2F0aW9uLnVpZCA9PSBvYmplY3QuX2xvY2FsdWlkOyAgVE9ETzogZ2V0IHRoZSBzeW5jIGZyYW1ld29yayB0byBpbmNsdWRlIHRoZSB0ZW1wb3JhcnkgdWlkIGluIHRoZSBub3RpZmljYXRpb25cbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICBvYmplY3QuX2xvY2FsdWlkID0gbXNnLnVpZDtcbiAgICAgIHJldHVybiBzZWxmLnVwZGF0ZShvYmplY3QpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLnN5bmMuZG9SZWFkKHRoaXMuZGF0YXNldElkLCBpZCwgZnVuY3Rpb24ocmVzKSB7XG4gICAgLy8gc3VjY2Vzc1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzLmRhdGEpO1xuICB9LCBmdW5jdGlvbihjb2RlLCBtc2cpIHtcbiAgICAvLyBmYWlsdXJlXG4gICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihmb3JtYXRFcnJvcihjb2RlLCBtc2cpKSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1aWRQcm9taXNlID0gXy5oYXMob2JqZWN0LCAnaWQnKVxuICAgID8gcS53aGVuKFN0cmluZyhvYmplY3QuaWQpKVxuICAgIDogc2VsZi5yZWFkKG9iamVjdC5fbG9jYWx1aWQpLnRoZW4oZnVuY3Rpb24oX29iamVjdCkge1xuICAgICAgY29uc29sZS5sb2coJ19vYmplY3QnLCBfb2JqZWN0KVxuICAgICAgaWYgKF8uaGFzKF9vYmplY3QsICdpZCcpKSB7XG4gICAgICAgIG9iamVjdC5pZCA9IF9vYmplY3QuaWQ7XG4gICAgICAgIHJldHVybiBTdHJpbmcoX29iamVjdC5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JqZWN0Ll9sb2NhbHVpZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgdWlkUHJvbWlzZS50aGVuKGZ1bmN0aW9uKHVpZCkge1xuICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZyB3aXRoIGlkJywgdWlkKVxuICAkZmguc3luYy5kb1VwZGF0ZShzZWxmLmRhdGFzZXRJZCwgdWlkLCBvYmplY3QsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vIHN1Y2Nlc3NcbiAgICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmNvZGUgPT09ICdsb2NhbF91cGRhdGVfYXBwbGllZCdcbiAgICAgICAgJiYgbm90aWZpY2F0aW9uLm1lc3NhZ2UgPT09ICd1cGRhdGUnXG4gICAgICAgICYmIG5vdGlmaWNhdGlvbi51aWQgPT09IHVpZDtcbiAgICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gICAgLnRoZW4oZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gc2VsZi5yZWFkKHVpZCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nJywgb2JqZWN0KTtcbiAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGZvcm1hdEVycm9yKGNvZGUsIG1zZykpKTtcbiAgfSk7XG59KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5kb0RlbGV0ZShzZWxmLmRhdGFzZXRJZCwgb2JqZWN0LmlkLCBmdW5jdGlvbihyZXMpIHtcbiAgICAvLyBzdWNjZXNzXG4gICAgdmFyIHVpZCA9IFN0cmluZyhvYmplY3QuaWQpO1xuICAgIHNlbGYuc3RyZWFtLmZpbHRlcihmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb24uY29kZSA9PT0gJ2xvY2FsX3VwZGF0ZV9hcHBsaWVkJ1xuICAgICAgICAmJiBub3RpZmljYXRpb24ubWVzc2FnZSA9PT0gJ2RlbGV0ZSdcbiAgICAgICAgJiYgU3RyaW5nKG5vdGlmaWNhdGlvbi51aWQpID09PSB1aWQ7XG4gICAgfSkudGFrZSgxKS50b1Byb21pc2UocS5Qcm9taXNlKVxuICAgIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShub3RpZmljYXRpb24ubWVzc2FnZSk7XG4gICAgfSlcbiAgfSwgZnVuY3Rpb24oY29kZSwgbXNnKSB7XG4gICAgLy8gZmFpbHVyZVxuICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoZm9ybWF0RXJyb3IoY29kZSwgbXNnKSkpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5EYXRhTWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5zdGFydFN5bmModGhpcy5kYXRhc2V0SWQsIGZ1bmN0aW9uKCl7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgnc3luYyBsb29wIHN0YXJ0ZWQnKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmguc3luYy5zdG9wU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBpZiAoc2VsZi5yZWNvcmREZWx0YVJlY2VpdmVkU3Vic2NyaXB0aW9uKSB7XG4gICAgICBzZWxmLnJlY29yZERlbHRhUmVjZWl2ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgIH1cbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agc3RvcHBlZCcpO1xuICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLmZvcmNlU3luYyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5zeW5jLmZvcmNlU3luYyh0aGlzLmRhdGFzZXRJZCwgZnVuY3Rpb24oKXtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKCdzeW5jIGxvb3Agd2lsbCBydW4nKTtcbiAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5nZXRRdWV1ZVNpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguc3luYy5nZXRQZW5kaW5nKHRoaXMuZGF0YXNldElkLCBmdW5jdGlvbihwZW5kaW5nKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShfLnNpemUocGVuZGluZykpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZS5zYWZlU3RvcCA9IGZ1bmN0aW9uKHVzZXJPcHRpb25zKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHRpbWVvdXQ6IDIwMDBcbiAgfVxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyh1c2VyT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICBzZWxmLmdldFF1ZXVlU2l6ZSgpXG4gIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgc2VsZi5zdG9wKCkudGhlbihkZWZlcnJlZC5yZXNvbHZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQubm90aWZ5KCdDYWxsaW5nIGZvcmNlU3luYyBzeW5jIGJlZm9yZSBzdG9wJyk7XG4gICAgICByZXR1cm4gc2VsZi5mb3JjZVN5bmMoKVxuICAgICAgLnRoZW4oc2VsZi53YWl0Rm9yU3luYy5iaW5kKHNlbGYpKVxuICAgICAgLnRpbWVvdXQob3B0aW9ucy50aW1lb3V0KVxuICAgICAgLnRoZW4oc2VsZi5nZXRRdWV1ZVNpemUuYmluZChzZWxmKSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIGZhaWxlZCwgb3V0c3RhbmRpbmcgcmVzdWx0cyBzdGlsbCBwcmVzZW50JykpO1xuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC50aGVuKHNlbGYuc3RvcC5iaW5kKHNlbGYpKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKVxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignZm9yY2VTeW5jIHRpbWVvdXQnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLndhaXRGb3JTeW5jID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5jb2RlID09ICdzeW5jX2NvbXBsZXRlJyB8fCBub3RpZmljYXRpb24uY29kZSA9PSAnc3luY19mYWlsZWQnO1xuICB9KS50YWtlKDEpLnRvUHJvbWlzZShxLlByb21pc2UpXG4gIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfY29tcGxldGUnKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKG5vdGlmaWNhdGlvbik7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24uY29kZSA9PT0gJ3N5bmNfZmFpbGVkJykge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignU3luYyBGYWlsZWQnLCBub3RpZmljYXRpb24pKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuRGF0YU1hbmFnZXIucHJvdG90eXBlLnB1Ymxpc2hSZWNvcmREZWx0YVJlY2VpdmVkID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLnJlY29yZERlbHRhUmVjZWl2ZWRTdWJzY3JpcHRpb24gPSBzZWxmLnN0cmVhbS5maWx0ZXIoZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5jb2RlID09ICdyZWNvcmRfZGVsdGFfcmVjZWl2ZWQnXG4gIH0pLnN1YnNjcmliZShmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06c3luYzpyZWNvcmRfZGVsdGFfcmVjZWl2ZWQ6JyArIHNlbGYuZGF0YXNldElkLCBub3RpZmljYXRpb24pO1xuICB9KVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXRcbiwgbWFuYWdlOiBtYW5hZ2VcbiwgYWRkTGlzdGVuZXI6IGFkZExpc3RlbmVyXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW5jT3B0aW9ucyA6IHtcbiAgICBcInN5bmNfZnJlcXVlbmN5XCIgOiA1LFxuICAgIFwic3RvcmFnZV9zdHJhdGVneVwiOiBcImRvbVwiLFxuICAgIFwiZG9fY29uc29sZV9sb2dcIjogZmFsc2VcbiAgfVxufVxuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS9ncm91cC1mb3JtLnRwbC5odG1sJyxcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJjb250ZW50LXRvb2xiYXJcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICBHcm91cCAjIHt7Y3RybC5tb2RlbC5pZH19XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdEdyb3VwKCRldmVudCwgY3RybC5tb2RlbClcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWZhYlwiIGFyaWEtbGFiZWw9XCJOZXcgZ3JvdXBcIiB1aS1zcmVmPVwiYXBwLmdyb3VwLm5ld1wiPlxcbicgK1xuICAgICcgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hZGQ8L21kLWljb24+XFxuJyArXG4gICAgJzwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbFwiPlxcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwiZ3JvdXBGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKGdyb3VwRm9ybS4kdmFsaWQpXCIgbm92YWxpZGF0ZSBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJncm91cG5hbWVcIj5Hcm91cCBOYW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZ3JvdXBuYW1lXCIgbmFtZT1cImdyb3VwbmFtZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5uYW1lXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5ncm91cG5hbWUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCBncm91cEZvcm0uZ3JvdXBuYW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgbmFtZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJhc3NpZ25lZVwiPlJvbGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cImN0cmwubW9kZWwucm9sZVwiIG5hbWU9XCJhc3NpZ25lZVwiIGlkPVwiYXNzaWduZWVcIj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJhZG1pblwiPkFkbWluPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwibWFuYWdlclwiPk1hbmFnZXI8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJ3b3JrZXJcIj5Xb3JrZXI8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1yYWlzZWQgbWQtcHJpbWFyeVwiPnt7Y3RybC5tb2RlbC5pZCB8fCBjdHJsLm1vZGVsLmlkID09PSAwID8gXFwnVXBkYXRlXFwnIDogXFwnQ3JlYXRlXFwnfX0gR3JvdXA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL2dyb3VwLWxpc3QudHBsLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5Hcm91cHM8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2gzPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBhY3Rpb249XCIjXCIgY2xhc3M9XCJwZXJzaXN0ZW50LXNlYXJjaFwiPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPjwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiIG5nLW1vZGVsPVwic2VhcmNoVmFsdWVcIiBuZy1jaGFuZ2U9XCJjdHJsLmFwcGx5RmlsdGVyKHNlYXJjaFZhbHVlKVwiPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdEdyb3VwKCRldmVudCwgZ3JvdXApXCIgbmctcmVwZWF0PVwiZ3JvdXAgaW4gY3RybC5ncm91cHNcIiBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc2VsZWN0ZWQuaWQgPT09IGdyb3VwLmlkfVwiPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2dyb3VwLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnPC9tZC1saXN0PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAudHBsLmh0bWwnLFxuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmdyb3VwPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e2N0cmwuZ3JvdXAuaWR9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgIDxwPkdyb3VwIGlkPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Z3JvdXA8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7Y3RybC5ncm91cC5uYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Hcm91cCBuYW1lPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+Z3JvdXA8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7Y3RybC5ncm91cC5yb2xlfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Sb2xlPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyXCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgTWVtYmVyc1xcbicgK1xuICAgICcgICAgPC9oMz5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdE1lbWJlcigkZXZlbnQsIG1lbWJlcilcIiBuZy1yZXBlYXQ9XCJtZW1iZXIgaW4gY3RybC5tZW1iZXJzXCI+XFxuJyArXG4gICAgJyAgICA8aW1nIGFsdD1cInVzZXIubmFtZVwiIG5nLXNyYz1cInt7bWVtYmVyLmF2YXRhcn19XCIgY2xhc3M9XCJtZC1hdmF0YXJcIiAvPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e21lbWJlci5uYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD57e21lbWJlci5wb3NpdGlvbn19PC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJyZXF1aXJlKCcuL2dyb3VwLWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vZ3JvdXAtbGlzdC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi9ncm91cC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZXItZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZXItbGlzdC50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi93b3JrZXIudHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLWZvcm0udHBsLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhclwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+XFxuJyArXG4gICAgJyAgICAgIFdvcmtlciA6IHt7Y3RybC5tb2RlbC5uYW1lfX1cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0V29ya2VyKCRldmVudCwgY3RybC5tb2RlbClcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWZhYlwiIGFyaWEtbGFiZWw9XCJOZXcgV29ya29yZGVyXCIgdWktc3JlZj1cImFwcC53b3JrZXIubmV3XCI+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmFkZDwvbWQtaWNvbj5cXG4nICtcbiAgICAnPC9tZC1idXR0b24+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsXCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya2VyRm9ybVwiIG5nLXN1Ym1pdD1cImN0cmwuZG9uZSh3b3JrZXJGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5Xb3JrZXIgTmFtZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIndvcmtlcm5hbWVcIiBuYW1lPVwid29ya2VybmFtZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5uYW1lXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS53b3JrZXJuYW1lLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS53b3JrZXJuYW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgbmFtZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZXJuYW1lXCI+VXNlcm5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1c2VybmFtZVwiIG5hbWU9XCJ1c2VybmFtZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC51c2VybmFtZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0udXNlcm5hbWUuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZXJGb3JtLnVzZXJuYW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgdXNlcm5hbWUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPkJhbm5lciBVUkw8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ1cmxcIiBpZD1cImJhbm5lclwiIG5hbWU9XCJiYW5uZXJcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuYmFubmVyXCI+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS5iYW5uZXIuJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZXJGb3JtLmJhbm5lci4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwidXJsXCI+SW52YWxpZCBVUkwuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtlcm5hbWVcIj5BdmF0YXIgVVJMPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidXJsXCIgaWQ9XCJhdmF0YXJcIiBuYW1lPVwiYXZhdGFyXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmF2YXRhclwiPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0uYXZhdGFyLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5hdmF0YXIuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJ1cmxcIj5JbnZhbGlkIFVSTC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZXJuYW1lXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJwaG9uZW51bWJlclwiIG5hbWU9XCJwaG9uZW51bWJlclwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5waG9uZVwiIHBhdHRlcm49XCIoWzAtOV17NywxNX0pXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS5waG9uZW51bWJlci4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0ucGhvbmVudW1iZXIuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBwaG9uZSBudW1iZXIgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInBhdHRlcm5cIj5BIHBob25lIG51bWJlciBjYW5cXCd0IGJlIGxlc3MgdGhhbiA3IG9yIG1vcmUgdGhhbiAxNSBkaWdpdHMuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwid29ya2VybmFtZVwiPkVtYWlsPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmVtYWlsXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2VyRm9ybS5lbWFpbC4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtlckZvcm0uZW1haWwuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gZW1haWwgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cImVtYWlsXCI+SW52YWxpZCBlbWFpbC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZXJuYW1lXCI+UG9zaXRpb248L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwb3NpdGlvblwiIG5hbWU9XCJwb3NpdGlvblwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5wb3NpdGlvblwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtlckZvcm0ucG9zaXRpb24uJGVycm9yXCIgbmctaWY9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3JrZXJGb3JtLnBvc2l0aW9uLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkFuIHBvc2l0aW9uIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImFzc2lnbmVlXCI+R3JvdXA8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cImN0cmwubW9kZWwuZ3JvdXBcIiBuYW1lPVwiZ3JvdXBcIiBpZD1cImdyb3VwXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cImdyb3VwIGluIGN0cmwuZ3JvdXBzXCIgdmFsdWU9XCJ7e2dyb3VwLmlkfX1cIj57e2dyb3VwLm5hbWV9fTwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICcgICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZXJGb3JtLmdyb3VwLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2VyRm9ybS5ncm91cC4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gZ3JvdXAgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwuaWQgfHwgY3RybC5tb2RlbC5pZCA9PT0gMCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IFdvcmtlcjwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLWxpc3QudHBsLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhcj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPlxcbicgK1xuICAgICcgICAgICA8c3Bhbj5Xb3JrZXJzPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9oMz5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnPC9tZC10b29sYmFyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGZvcm0gYWN0aW9uPVwiI1wiIGNsYXNzPVwicGVyc2lzdGVudC1zZWFyY2hcIj5cXG4nICtcbiAgICAnICA8bGFiZWwgZm9yPVwic2VhcmNoXCI+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPnNlYXJjaDwvaT48L2xhYmVsPlxcbicgK1xuICAgICcgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiIG5nLW1vZGVsPVwic2VhcmNoVmFsdWVcIiBuZy1jaGFuZ2U9XCJjdHJsLmFwcGx5RmlsdGVyKHNlYXJjaFZhbHVlKVwiPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtbGlzdD5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtlcigkZXZlbnQsIHVzZXIpXCIgIG5nLXJlcGVhdD1cInVzZXIgaW4gY3RybC53b3JrZXJzXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiBjdHJsLnNlbGVjdGVkLmlkID09PSB1c2VyLmlkfVwiPlxcbicgK1xuICAgICcgICAgPGltZyBhbHQ9XCJ1c2VyLm5hbWVcIiBuZy1zcmM9XCJ7e3VzZXIuYXZhdGFyfX1cIiBjbGFzcz1cIm1kLWF2YXRhclwiIC8+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7dXNlci5uYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD57e3VzZXIucG9zaXRpb259fTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3JrZXIudHBsLmh0bWwnLFxuICAgICc8bWQtY29udGVudCBjbGFzcz1cIndmbS1tYWluY29sLXNjcm9sbCB3Zm0tbWFpbmNvbC1zY3JvbGxfd2l0aC1tZW51XCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cInVzZXItaW5mby1oZWFkZXJcIiBuZy1zdHlsZT1cImN0cmwuc3R5bGVcIj5cXG4nICtcbiAgICAnICAgIDxoMSBjbGFzcz1cIm1kLWRpc3BsYXktMVwiPnt7Y3RybC53b3JrZXIubmFtZX19PC9oMT5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnICA8bWQtbGlzdD5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+cG9ydHJhaXQ8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLmlkfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPldvcmtlciBpZDwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5wZXJzb248L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLnVzZXJuYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPlVzZXJuYW1lPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBob25lPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3tjdHJsLndvcmtlci5waG9uZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5QaG9uZSBOdW1iZXI8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+ZW1haWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2N0cmwud29ya2VyLmVtYWlsfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkVtYWlsPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBvcnRyYWl0PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3tjdHJsLndvcmtlci5wb3NpdGlvbn19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5Qb3NpdGlvbjwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5ncm91cDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7Y3RybC5ncm91cC5uYW1lfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkdyb3VwPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLXN1YmhlYWRlciBjbGFzcz1cIm1kLW5vLXN0aWNreVwiPk5vdGVzPC9tZC1zdWJoZWFkZXI+XFxuJyArXG4gICAgJyAgICA8cCBjbGFzcz1cIm1kLWJvZHktMVwiIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+e3tjdHJsLndvcmtlci5ub3Rlc319PC9wPlxcbicgK1xuICAgICcgIDwvbWQtY29udGVudD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udXNlci5kaXJlY3RpdmVzJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcbm1vZHVsZS5leHBvcnRzID0gJ3dmbS51c2VyLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnd29ya2VyTGlzdCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvd29ya2VyLWxpc3QudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB3b3JrZXJzIDogJz0nLFxuICAgICAgc2VsZWN0ZWRNb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnM7XG4gICAgICBzZWxmLnNlbGVjdGVkID0gJHNjb3BlLnNlbGVjdGVkTW9kZWw7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZXIpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIHdvcmtlcik7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgc2VsZi5pc1dvcmtlclNob3duID0gZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnNob3duV29ya2VyID09PSB3b3JrZXI7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmFwcGx5RmlsdGVyID0gZnVuY3Rpb24odGVybSkge1xuICAgICAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzZWxmLndvcmtlcnMgPSAkc2NvcGUud29ya2Vycy5maWx0ZXIoZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh3b3JrZXIuaWQpLmluZGV4T2YodGVybSkgIT09IC0xXG4gICAgICAgICAgICB8fCBTdHJpbmcod29ya2VyLm5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCd3b3JrZXInLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtlci50cGwuaHRtbCcpXG4gICwgc2NvcGU6IHtcbiAgICAgIHdvcmtlciA6ICc9JyxcbiAgICAgIGdyb3VwIDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi53b3JrZXIgPSAkc2NvcGUud29ya2VyO1xuICAgICAgc2VsZi5ncm91cCA9ICRzY29wZS5ncm91cDtcbiAgICAgIHZhciBiYW5uZXJVcmwgPSBzZWxmLndvcmtlci5iYW5uZXIgfHwgc2VsZi53b3JrZXIuYXZhdGFyO1xuICAgICAgc2VsZi5zdHlsZSA9IHtcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAndXJsKCcgKyBiYW5uZXJVcmwgKyAnKScsXG4gICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogc2VsZi53b3JrZXIuYmFubmVyID8gJ2NlbnRlciBjZW50ZXInIDogJ3RvcCBjZW50ZXInLFxuICAgICAgICAnYmFja2dyb3VuZC1zaXplJzogc2VsZi53b3JrZXIuYmFubmVyID8gJ2F1dG8nIDogJ2NvbnRhaW4nLFxuICAgICAgICAnYmFja2dyb3VuZC1yZXBlYXQnOiAnbm8tcmVwZWF0J1xuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ3dvcmtlckZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtlci1mb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgd29ya2VyIDogJz12YWx1ZScsXG4gICAgICBncm91cHMgOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmdyb3VwcyA9ICRzY29wZS5ncm91cHM7XG4gICAgICBzZWxmLm1vZGVsID0gYW5ndWxhci5jb3B5KCRzY29wZS53b3JrZXIpO1xuICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgIHNlbGYuc2VsZWN0V29ya2VyID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtlcikge1xuICAgICAgICBpZih3b3JrZXIuaWQpIHtcbiAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2VyOnNlbGVjdGVkJywgd29ya2VyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2VyOmxpc3QnKTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGlzVmFsaWQpIHtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2VyOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuLmRpcmVjdGl2ZSgnZ3JvdXBMaXN0JywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS9ncm91cC1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgZ3JvdXBzIDogJz0nLFxuICAgICAgc2VsZWN0ZWRNb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5ncm91cHMgPSAkc2NvcGUuZ3JvdXBzO1xuICAgICAgc2VsZi5zZWxlY3RlZCA9ICRzY29wZS5zZWxlY3RlZE1vZGVsO1xuICAgICAgc2VsZi5zZWxlY3RHcm91cCA9IGZ1bmN0aW9uKGV2ZW50LCBncm91cCkge1xuICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06Z3JvdXA6c2VsZWN0ZWQnLCBncm91cCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgc2VsZi5pc0dyb3VwU2hvd24gPSBmdW5jdGlvbihncm91cCkge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bkdyb3VwID09PSBncm91cDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuYXBwbHlGaWx0ZXIgPSBmdW5jdGlvbih0ZXJtKSB7XG4gICAgICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHNlbGYuZ3JvdXBzID0gJHNjb3BlLmdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKGdyb3VwLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKGdyb3VwLm5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCdncm91cCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICBncm91cCA6ICc9JyxcbiAgICAgIG1lbWJlcnMgOiAnPSdcbiAgICB9XG4gICwgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmdyb3VwID0gJHNjb3BlLmdyb3VwO1xuICAgICAgc2VsZi5tZW1iZXJzID0gJHNjb3BlLm1lbWJlcnM7XG4gICAgICBzZWxmLnNlbGVjdE1lbWJlciA9IGZ1bmN0aW9uKGV2ZW50LCBtZW1iZXIpIHtcbiAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtlcjpzZWxlY3RlZCcsIG1lbWJlcik7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcbi5kaXJlY3RpdmUoJ2dyb3VwRm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvZ3JvdXAtZm9ybS50cGwuaHRtbCcpXG4gICAgLCBzY29wZToge1xuICAgICAgICBncm91cCA6ICc9dmFsdWUnXG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLm1vZGVsID0gYW5ndWxhci5jb3B5KCRzY29wZS5ncm91cCk7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICAgIHNlbGYuc2VsZWN0R3JvdXAgPSBmdW5jdGlvbihldmVudCwgZ3JvdXApIHtcbiAgICAgICAgICBpZihncm91cC5pZCkge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmdyb3VwOnNlbGVjdGVkJywgZ3JvdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDpsaXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oaXNWYWxpZCkge1xuICAgICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLm1vZGVsLmlkICYmIHNlbGYubW9kZWwuaWQgIT09IDApIHtcbiAgICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOmdyb3VwOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTpncm91cDp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnVzZXIuc2VydmljZXMnLCBbJ3dmbS5jb3JlLm1lZGlhdG9yJ10pXG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0udXNlci5zZXJ2aWNlcyc7XG5cbnZhciBVc2VyQ2xpZW50ID0gcmVxdWlyZSgnLi4vdXNlci91c2VyLWNsaWVudCcpLFxuICAgIEdyb3VwQ2xpZW50ID0gcmVxdWlyZSgnLi4vZ3JvdXAvZ3JvdXAtY2xpZW50JyksXG4gICAgTWVtYmVyc2hpcENsaWVudCA9IHJlcXVpcmUoJy4uL21lbWJlcnNoaXAvbWVtYmVyc2hpcC1jbGllbnQnKTtcbiBcbmZ1bmN0aW9uIHdyYXBDbGllbnQoJHEsIGNsaWVudCwgbWV0aG9kTmFtZXMpIHtcbiAgdmFyIHdyYXBwZXIgPSB7fTtcbiAgbWV0aG9kTmFtZXMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgd3JhcHBlclttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRxLndoZW4oY2xpZW50W21ldGhvZE5hbWVdLmFwcGx5KGNsaWVudCwgYXJndW1lbnRzKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ3VzZXJDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnYXV0aCcsICdoYXNTZXNzaW9uJywgJ2NsZWFyU2Vzc2lvbicsICd2ZXJpZnknLCAnZ2V0UHJvZmlsZSddO1xuICB2YXIgdXNlckNsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBVc2VyQ2xpZW50KG1lZGlhdG9yKSwgbWV0aG9kTmFtZXMpO1xuICByZXR1cm4gdXNlckNsaWVudDtcbn0pO1xuXG5uZ01vZHVsZS5mYWN0b3J5KCdncm91cENsaWVudCcsIGZ1bmN0aW9uKCRxLCBtZWRpYXRvcikge1xuICB2YXIgbWV0aG9kTmFtZXMgPSBbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnbGlzdCcsICdtZW1iZXJzaGlwJ107XG4gIHZhciBncm91cENsaWVudCA9IHdyYXBDbGllbnQoJHEsIG5ldyBHcm91cENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG5cbm5nTW9kdWxlLmZhY3RvcnkoJ21lbWJlcnNoaXBDbGllbnQnLCBmdW5jdGlvbigkcSwgbWVkaWF0b3IpIHtcbiAgdmFyIG1ldGhvZE5hbWVzID0gWydjcmVhdGUnLCAncmVhZCcsICd1cGRhdGUnLCAnZGVsZXRlJywgJ2xpc3QnLCAnbWVtYmVyc2hpcCddO1xuICB2YXIgZ3JvdXBDbGllbnQgPSB3cmFwQ2xpZW50KCRxLCBuZXcgTWVtYmVyc2hpcENsaWVudChtZWRpYXRvciksIG1ldGhvZE5hbWVzKTtcbiAgcmV0dXJuIGdyb3VwQ2xpZW50O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS51c2VyJztcblxuYW5ndWxhci5tb2R1bGUoJ3dmbS51c2VyJywgW1xuICByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG4sIHJlcXVpcmUoJy4vc2VydmljZS5qcycpXG5dKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL2dyb3VwJ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWctZ3JvdXAnKTtcblxudmFyIEdyb3VwQ2xpZW50ID0gZnVuY3Rpb24obWVkaWF0b3IpIHtcbiAgdGhpcy5tZWRpYXRvciA9IG1lZGlhdG9yO1xuICB0aGlzLmluaXRDb21wbGV0ZSA9IGZhbHNlO1xuICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG59O1xuXG52YXIgeGhyID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBhdGg6ICcvJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMoX29wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICAkZmguY2xvdWQob3B0aW9ucywgZnVuY3Rpb24ocmVzKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICB9LCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGUucHJvcHMgPSBwcm9wcztcbiAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbkdyb3VwQ2xpZW50LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIGlkXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxuR3JvdXBDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uKGdyb3VwKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBncm91cC5pZCxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIGRhdGE6IGdyb3VwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IEdyb3VwQ2xpZW50KG1lZGlhdG9yKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaVBhdGg6ICcvYXBpL3dmbS9tZW1iZXJzaGlwJ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWctbWVtYmVyc2hpcCcpO1xuXG52YXIgTWVtYmVyc2hpcENsaWVudCA9IGZ1bmN0aW9uKG1lZGlhdG9yKSB7XG4gIHRoaXMubWVkaWF0b3IgPSBtZWRpYXRvcjtcbiAgdGhpcy5pbml0Q29tcGxldGUgPSBmYWxzZTtcbiAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xufTtcblxudmFyIHhociA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBwYXRoOiAnLycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH1cbiAgdmFyIG9wdGlvbnMgPSBfLmRlZmF1bHRzKF9vcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmNsb3VkKG9wdGlvbnMsIGZ1bmN0aW9uKHJlcykge1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgfSwgZnVuY3Rpb24obWVzc2FnZSwgcHJvcHMpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICBlLnByb3BzID0gcHJvcHM7XG4gICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkZmgub24oJ2ZoaW5pdCcsIGZ1bmN0aW9uKGVycm9yLCBob3N0KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuYXBwaWQgPSAkZmguZ2V0RkhQYXJhbXMoKS5hcHBpZDtcbiAgICBzZWxmLmluaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLmxpc3QgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGhcbiAgfSk7XG59O1xuXG5NZW1iZXJzaGlwQ2xpZW50LnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyBpZFxuICB9KTtcbn07XG5cbk1lbWJlcnNoaXBDbGllbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1lbWJlcnNoaXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIG1lbWJlcnNoaXAuaWQsXG4gICAgbWV0aG9kOiAncHV0JyxcbiAgICBkYXRhOiBtZW1iZXJzaGlwXG4gIH0pO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24obWVtYmVyc2hpcCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBkYXRhOiBtZW1iZXJzaGlwXG4gIH0pO1xufTtcblxuTWVtYmVyc2hpcENsaWVudC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24obWVtYmVyc2hpcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgbWVtYmVyc2hpcC5pZCxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIGRhdGE6IG1lbWJlcnNoaXBcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1lZGlhdG9yKSB7XG4gIHJldHVybiBuZXcgTWVtYmVyc2hpcENsaWVudChtZWRpYXRvcik7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL3VzZXInLFxuICBhdXRocG9saWN5UGF0aDogJy9ib3gvc3J2LzEuMS9hZG1pbi9hdXRocG9saWN5JyxcbiAgcG9saWN5SWQ6IHByb2Nlc3MuZW52LldGTV9BVVRIX1BPTElDWV9JRCB8fCAnd2ZtJ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWctdXNlcicpO1xudmFyIHBvbGljeUlkO1xuXG52YXIgVXNlckNsaWVudCA9IGZ1bmN0aW9uKG1lZGlhdG9yKSB7XG4gIHRoaXMubWVkaWF0b3IgPSBtZWRpYXRvcjtcbiAgdGhpcy5pbml0Q29tcGxldGUgPSBmYWxzZTtcbiAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xufTtcblxudmFyIHhociA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBwYXRoOiAnLycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH1cbiAgdmFyIG9wdGlvbnMgPSBfLmRlZmF1bHRzKF9vcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG4gIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKTtcbiAgJGZoLmNsb3VkKG9wdGlvbnMsIGZ1bmN0aW9uKHJlcykge1xuICAgIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgfSwgZnVuY3Rpb24obWVzc2FnZSwgcHJvcHMpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICBlLnByb3BzID0gcHJvcHM7XG4gICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgc3RvcmVQcm9maWxlID0gZnVuY3Rpb24ocHJvZmlsZURhdGEpIHtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ZoLndmbS5wcm9maWxlRGF0YScsIEpTT04uc3RyaW5naWZ5KHByb2ZpbGVEYXRhKSk7XG59O1xuXG52YXIgcmV0cmlldmVQcm9maWxlRGF0YSA9IGZ1bmN0aW9uKCkge1xuICB2YXIganNvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmaC53Zm0ucHJvZmlsZURhdGEnKTtcbiAgcmV0dXJuIGpzb24gPyBKU09OLnBhcnNlKGpzb24pIDogbnVsbDtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJGZoLm9uKCdmaGluaXQnLCBmdW5jdGlvbihlcnJvciwgaG9zdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmFwcGlkID0gJGZoLmdldEZIUGFyYW1zKCkuYXBwaWQ7XG4gICAgc2VsZi5pbml0Q29tcGxldGUgPSB0cnVlO1xuICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgfSk7XG4gIHZhciBwcm9taXNlQ29uZmlnID0geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvY29uZmlnL2F1dGhwb2xpY3knXG4gIH0pLnRoZW4oZnVuY3Rpb24oX3BvbGljeUlkKSB7XG4gICAgcG9saWN5SWQgPSBfcG9saWN5SWQ7XG4gICAgcmV0dXJuIHBvbGljeUlkO1xuICB9KVxuICByZXR1cm4gcS5hbGwoW2RlZmVycmVkLnByb21pc2UsIHByb21pc2VDb25maWddKTtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aFxuICB9KTtcbn07XG5cblVzZXJDbGllbnQucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4geGhyKHtcbiAgICBwYXRoOiBjb25maWcuYXBpUGF0aCArICcvJyArIGlkXG4gIH0pO1xufTtcblxuVXNlckNsaWVudC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiB4aHIoe1xuICAgIHBhdGg6IGNvbmZpZy5hcGlQYXRoICsgJy8nICsgdXNlci5pZCxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIGRhdGE6IHVzZXJcbiAgfSk7XG59O1xuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGggKyAnLycgKyB1c2VyLmlkLFxuICAgIG1ldGhvZDogJ2RlbGV0ZScsXG4gICAgZGF0YTogdXNlclxuICB9KTtcbn07XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgcmV0dXJuIHhocih7XG4gICAgcGF0aDogY29uZmlnLmFwaVBhdGgsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgZGF0YTogdXNlclxuICB9KTtcbn07XG5cblVzZXJDbGllbnQucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuaW5pdFByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAkZmguYXV0aCh7XG4gICAgICBwb2xpY3lJZDogcG9saWN5SWQsXG4gICAgICBjbGllbnRUb2tlbjogc2VsZi5hcHBpZCxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB1c2VySWQ6IHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAvLyByZXMuc2Vzc2lvblRva2VuOyAvLyBUaGUgcGxhdGZvcm0gc2Vzc2lvbiBpZGVudGlmaWVyXG4gICAgICAvLyByZXMuYXV0aFJlc3BvbnNlOyAvLyBUaGUgYXV0aGV0aWNhdGlvbiBpbmZvcm1hdGlvbiByZXR1cm5lZCBmcm9tIHRoZSBhdXRoZXRpY2F0aW9uIHNlcnZpY2UuXG4gICAgICB2YXIgcHJvZmlsZURhdGEgPSByZXMuYXV0aFJlc3BvbnNlO1xuICAgICAgaWYgKHR5cGVvZiBwcm9maWxlRGF0YSA9PT0gJ3N0cmluZycgfHwgcHJvZmlsZURhdGEgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwcm9maWxlRGF0YSA9IEpTT04ucGFyc2UocHJvZmlsZURhdGEpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBwYXJzZSB0aGUgJGZoLmF1dGggcmVzcG9uc2UuIFVzaW5nIGEgd29ya2Fyb3VuZCcpO1xuICAgICAgICAgIHByb2ZpbGVEYXRhID0gSlNPTi5wYXJzZShwcm9maWxlRGF0YS5yZXBsYWNlKC8sXFxzL2csICcsJykucmVwbGFjZSgvW14sPXt9XSsvZywgJ1wiJCZcIicpLnJlcGxhY2UoLz0vZywgJzonKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RvcmVQcm9maWxlKHByb2ZpbGVEYXRhKTtcbiAgICAgIHNlbGYubWVkaWF0b3IucHVibGlzaCgnd2ZtOmF1dGg6cHJvZmlsZTpjaGFuZ2UnLCBwcm9maWxlRGF0YSk7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gICAgfSwgZnVuY3Rpb24gKG1zZywgZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhtc2csIGVycik7XG4gICAgICB2YXIgZXJyb3JNc2cgPSBlcnIubWVzc2FnZTtcbiAgICAgIC8qIFBvc3NpYmxlIGVycm9yczpcbiAgICAgIHVua25vd25fcG9saWN5SWQgLSBUaGUgcG9saWN5SWQgcHJvdmlkZWQgZGlkIG5vdCBtYXRjaCBhbnkgZGVmaW5lZCBwb2xpY3kuIENoZWNrIHRoZSBBdXRoIFBvbGljaWVzIGRlZmluZWQuIFNlZSBBdXRoIFBvbGljaWVzIEFkbWluaXN0cmF0aW9uXG4gICAgICB1c2VyX25vdF9mb3VuZCAtIFRoZSBBdXRoIFBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhlIHBvbGljeUlkIHByb3ZpZGVkIGhhcyBiZWVuIHNldCB1cCB0byByZXF1aXJlIHRoYXQgYWxsIHVzZXJzIGF1dGhlbnRpY2F0aW5nIGV4aXN0IG9uIHRoZSBwbGF0Zm9ybSwgYnV0IHRoaXMgdXNlciBkb2VzIG5vdCBleGlzdHMuXG4gICAgICB1c2VyX25vdF9hcHByb3ZlZCAtIC0gVGhlIEF1dGggUG9saWN5IGFzc29jaWF0ZWQgd2l0aCB0aGUgcG9saWN5SWQgcHJvdmlkZWQgaGFzIGJlZW4gc2V0IHVwIHRvIHJlcXVpcmUgdGhhdCBhbGwgdXNlcnMgYXV0aGVudGljYXRpbmcgYXJlIGluIGEgbGlzdCBvZiBhcHByb3ZlZCB1c2VycywgYnV0IHRoaXMgdXNlciBpcyBub3QgaW4gdGhhdCBsaXN0LlxuICAgICAgdXNlcl9kaXNhYmxlZCAtIFRoZSB1c2VyIGhhcyBiZWVuIGRpc2FibGVkIGZyb20gbG9nZ2luZyBpbi5cbiAgICAgIHVzZXJfcHVyZ2VfZGF0YSAtIFRoZSB1c2VyIGhhcyBiZWVuIGZsYWdnZWQgZm9yIGRhdGEgcHVyZ2UgYW5kIGFsbCBsb2NhbCBkYXRhIHNob3VsZCBiZSBkZWxldGVkLlxuICAgICAgZGV2aWNlX2Rpc2FibGVkIC0gVGhlIGRldmljZSBoYXMgYmVlbiBkaXNhYmxlZC4gTm8gdXNlciBvciBhcHBzIGNhbiBsb2cgaW4gZnJvbSB0aGUgcmVxdWVzdGluZyBkZXZpY2UuXG4gICAgICBkZXZpY2VfcHVyZ2VfZGF0YSAtIFRoZSBkZXZpY2UgaGFzIGJlZW4gZmxhZ2dlZCBmb3IgZGF0YSBwdXJnZSBhbmQgYWxsIGxvY2FsIGRhdGEgc2hvdWxkIGJlIGRlbGV0ZWQuXG4gICAgICAqL1xuICAgICAgaWYgKGVycm9yTXNnID09IFwidXNlcl9wdXJnZV9kYXRhXCIgfHwgZXJyb3JNc2cgPT0gXCJkZXZpY2VfcHVyZ2VfZGF0YVwiKSB7XG4gICAgICAgIC8vIFRPRE86IFVzZXIgb3IgZGV2aWNlIGhhcyBiZWVuIGJsYWNrIGxpc3RlZCBmcm9tIGFkbWluaXN0cmF0aW9uIGNvbnNvbGUgYW5kIGFsbCBsb2NhbCBkYXRhIHNob3VsZCBiZSB3aXBlZFxuICAgICAgICBjb25zb2xlLmxvZygnVXNlciBvciBkZXZpY2UgaGFzIGJlZW4gYmxhY2sgbGlzdGVkIGZyb20gYWRtaW5pc3RyYXRpb24gY29uc29sZSBhbmQgYWxsIGxvY2FsIGRhdGEgc2hvdWxkIGJlIHdpcGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZCAtIFwiICsgZXJyb3JNc2cpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3JNc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuVXNlckNsaWVudC5wcm90b3R5cGUuaGFzU2Vzc2lvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5hdXRoLmhhc1Nlc3Npb24oZnVuY3Rpb24oZXJyLCBleGlzdHMpe1xuICAgIGlmKGVycikge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjaGVjayBzZXNzaW9uOiAnLCBlcnIpO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSBlbHNlIGlmIChleGlzdHMpe1xuICAgICAgLy91c2VyIGlzIGFscmVhZHkgYXV0aGVudGljYXRlZFxuICAgICAgLy9vcHRpb25hbGx5IHdlIGNhbiBhbHNvIHZlcmlmeSB0aGUgc2Vzc2lvbiBpcyBhY3V0YWxseSB2YWxpZCBmcm9tIGNsaWVudC4gVGhpcyByZXF1aXJlcyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5jbGVhclNlc3Npb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmVycmVkID0gcS5kZWZlcigpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRmaC5hdXRoLmNsZWFyU2Vzc2lvbihmdW5jdGlvbihlcnIpe1xuICAgIGlmKGVycikge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjbGVhciBzZXNzaW9uOiAnLCBlcnIpO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0b3JlUHJvZmlsZShudWxsKTtcbiAgICAgIHNlbGYubWVkaWF0b3IucHVibGlzaCgnd2ZtOmF1dGg6cHJvZmlsZTpjaGFuZ2UnLCBudWxsKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblVzZXJDbGllbnQucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG4gICRmaC5hdXRoLnZlcmlmeShmdW5jdGlvbihlcnIsIHZhbGlkKXtcbiAgICBpZihlcnIpe1xuICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCB0byB2ZXJpZnkgc2Vzc2lvbicpO1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmKHZhbGlkKSB7XG4gICAgICBjb25zb2xlLmxvZygnc2Vzc2lvbiBpcyB2YWxpZCcpO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnc2Vzc2lvbiBpcyBub3QgdmFsaWQnKTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5Vc2VyQ2xpZW50LnByb3RvdHlwZS5nZXRQcm9maWxlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBxLndoZW4ocmV0cmlldmVQcm9maWxlRGF0YSgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZWRpYXRvcikge1xuICByZXR1cm4gbmV3IFVzZXJDbGllbnQobWVkaWF0b3IpO1xufVxuIiwicmVxdWlyZSgnLi92ZWhpY2xlLWluc3BlY3Rpb24tZm9ybS50cGwuaHRtbC5qcycpO1xucmVxdWlyZSgnLi92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwuanMnKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS52ZWhpY2xlLWluc3BlY3Rpb24nKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnZlaGljbGUtaW5zcGVjdGlvbicsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvdmVoaWNsZS1pbnNwZWN0aW9uLWZvcm0udHBsLmh0bWwnLFxuICAgICcgIDxkaXYgbGF5b3V0PVwicm93XCIgY2xhc3M9XCJ3Zm0taW5zcGVjdGlvbi1yb3dcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleD1cIjQwXCIgbGF5b3V0PVwicm93XCIgbGF5b3V0LWFsaWduPVwic3RhcnQgY2VudGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtYm9keS0yXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxvY2FsX2dhc19zdGF0aW9uPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgIEZ1ZWwgKCUpXFxuJyArXG4gICAgJyAgICAgIDwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLXNsaWRlciBmbGV4IG1kLWRpc2NyZXRlIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5mdWVsXCIgc3RlcD1cIjI1XCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIGFyaWEtbGFiZWw9XCJyYXRpbmdcIj5cXG4nICtcbiAgICAnICAgIDwvbWQtc2xpZGVyPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPGRpdiBsYXlvdXQ9XCJyb3dcIiBjbGFzcz1cIndmbS1pbnNwZWN0aW9uLXJvd1wiPlxcbicgK1xuICAgICcgICAgPGRpdiBmbGV4PVwiMzBcIiBsYXlvdXQ9XCJyb3dcIiBsYXlvdXQtYWxpZ249XCJzdGFydCBjZW50ZXJcIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1ib2R5LTJcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+YWxidW08L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgICAgVGlyZXNcXG4nICtcbiAgICAnICAgICAgPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8ZGl2IGZsZXggbGF5b3V0LWFsaWduPVwic3RhcnQgc3RhcnRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLXJhZGlvLWdyb3VwIGxheW91dCBuZy1tb2RlbD1cImN0cmwubW9kZWwudGlyZXNcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtcmFkaW8tYnV0dG9uIG5nLXZhbHVlPVwiZmFsc2VcIiA+RmFpbDwvbWQtcmFkaW8tYnV0dG9uPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1yYWRpby1idXR0b24gbmctdmFsdWU9XCJ0cnVlXCI+IFBhc3MgPC9tZC1yYWRpby1idXR0b24+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtcmFkaW8tZ3JvdXA+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxkaXYgbGF5b3V0PVwicm93XCIgY2xhc3M9XCJ3Zm0taW5zcGVjdGlvbi1yb3dcIj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleD1cIjMwXCIgbGF5b3V0PVwicm93XCIgbGF5b3V0LWFsaWduPVwic3RhcnQgY2VudGVyXCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtYm9keS0yXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmJyaWdodG5lc3NfbG93PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICAgIExpZ2h0c1xcbicgK1xuICAgICcgICAgICA8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDxkaXYgZmxleCBsYXlvdXQtYWxpZ249XCJzdGFydCBzdGFydFwiPlxcbicgK1xuICAgICcgICAgICA8bWQtcmFkaW8tZ3JvdXAgbGF5b3V0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5saWdodHNcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtcmFkaW8tYnV0dG9uIG5nLXZhbHVlPVwiZmFsc2VcIj5GYWlsPC9tZC1yYWRpby1idXR0b24+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLXJhZGlvLWJ1dHRvbiBuZy12YWx1ZT1cInRydWVcIj4gUGFzcyA8L21kLXJhZGlvLWJ1dHRvbj5cXG4nICtcbiAgICAnICAgICAgPC9tZC1yYWRpby1ncm91cD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwid29ya2Zsb3ctYWN0aW9ucyBtZC1wYWRkaW5nIG1kLXdoaXRlZnJhbWUtejRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXByaW1hcnkgbWQtaHVlLTFcIiBuZy1jbGljaz1cImN0cmwuYmFjaygkZXZlbnQpXCI+QmFjazwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtcHJpbWFyeVwiIG5nLWNsaWNrPVwiY3RybC5kb25lKCRldmVudClcIj5Db250aW51ZTwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgICAgPC9kaXY+PCEtLSB3b3JrZmxvdy1hY3Rpb25zLS0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLnZlaGljbGUtaW5zcGVjdGlvbicpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udmVoaWNsZS1pbnNwZWN0aW9uJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwnLFxuICAgICdcXG4nICtcbiAgICAnICA8bWQtc3ViaGVhZGVyPlZlaGljbGUgSW5zcGVjdGlvbjwvbWQtc3ViaGVhZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtbGlzdCBjbGFzcz1cInJpc2stYXNzZXNzbWVudFwiPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sb2NhbF9nYXNfc3RhdGlvbjwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7dmVoaWNsZUluc3BlY3Rpb24uZnVlbH19ICU8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkZ1ZWw8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIiBjbGFzcz1cInN1Y2Nlc3NcIj5jaGVja19jaXJjbGU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1pZj1cIiEgdmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIiBjbGFzcz1cImRhbmdlclwiPmNhbmNlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24udGlyZXNcIj5QYXNzPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLnRpcmVzXCI+RmFpbDwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+VGlyZXM8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiIG5nLWlmPVwidmVoaWNsZUluc3BlY3Rpb24ubGlnaHRzXCIgY2xhc3M9XCJzdWNjZXNzXCI+Y2hlY2tfY2lyY2xlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLmxpZ2h0c1wiIGNsYXNzPVwiZGFuZ2VyXCI+Y2FuY2VsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCJ2ZWhpY2xlSW5zcGVjdGlvbi5saWdodHNcIj5QYXNzPC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8aDMgbmctaWY9XCIhIHZlaGljbGVJbnNwZWN0aW9uLmxpZ2h0c1wiPkZhaWw8L2gzPlxcbicgK1xuICAgICcgICAgICAgIDxwPkxpZ2h0czwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0udmVoaWNsZS1pbnNwZWN0aW9uJywgWyd3Zm0uY29yZS5tZWRpYXRvciddKTtcblxucmVxdWlyZSgnLi4vLi4vZGlzdCcpO1xuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3ZlaGljbGVJbnNwZWN0aW9uJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS92ZWhpY2xlLWluc3BlY3Rpb24udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgICB2ZWhpY2xlSW5zcGVjdGlvbjogJz12YWx1ZSdcbiAgICB9XG4gIH07XG59KVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3ZlaGljbGVJbnNwZWN0aW9uRm9ybScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCBtZWRpYXRvcikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgLCB0ZW1wbGF0ZTogJHRlbXBsYXRlQ2FjaGUuZ2V0KCd3Zm0tdGVtcGxhdGUvdmVoaWNsZS1pbnNwZWN0aW9uLWZvcm0udHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLm1vZGVsID0ge307XG4gICAgc2VsZi5iYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmJhY2snKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgc2VsZi5kb25lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzdGVwOmRvbmUnLCBzZWxmLm1vZGVsKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLnZlaGljbGUtaW5zcGVjdGlvbic7XG4iLCJyZXF1aXJlKCcuL3dvcmtmbG93LWZvcm0udHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctc3RlcC1kZXRhaWwudHBsLmh0bWwuanMnKTtcbnJlcXVpcmUoJy4vd29ya2Zsb3ctc3RlcC1mb3JtLnRwbC5odG1sLmpzJyk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctZm9ybS50cGwuaHRtbCcsXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyIG1kLXByaW1hcnlcIj5cXG4nICtcbiAgICAnICA8ZGl2IGNsYXNzPVwibWQtdG9vbGJhci10b29sc1wiPlxcbicgK1xuICAgICcgICAgPGgzPnt7Y3RybC5tb2RlbC5pZCA/IFxcJ1VwZGF0ZVxcJyA6IFxcJ0NyZWF0ZVxcJ319IHdvcmtmbG93PC9oMz5cXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtmbG93KCRldmVudCwgd29ya2Zsb3cpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2IGNsYXNzPVwid2ZtLW1haW5jb2wtc2Nyb2xsXCI+XFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJ3b3JrZmxvd0Zvcm1cIiBuZy1zdWJtaXQ9XCJjdHJsLmRvbmUod29ya2Zsb3dGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8ZGl2PlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPlRpdGxlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidGl0bGVcIiBuYW1lPVwidGl0bGVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwudGl0bGVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZmxvdy50aXRsZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtmbG93Rm9ybS50aXRsZS4kZGlydHlcIj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj5BIHRpdGxlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlkID8gXFwnVXBkYXRlXFwnIDogXFwnQ3JlYXRlXFwnfX0gV29ya2Zsb3c8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya2Zsb3ctcHJvZ3Jlc3MudHBsLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwid29ya2Zsb3ctcHJvZ3Jlc3NcIiBuZy1jbGFzcz1cIntjbG9zZTogY3RybC5jbG9zZWR9XCI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b24gbWQtd2FybSBleHBhbmQtY29sbGFwc2VcIj5cXG4nICtcbiAgICAnICA8bWQtaWNvbiBuZy1zaG93PVwiY3RybC5jbG9zZWRcIiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCIgbmctY2xpY2s9XCJjdHJsLm9wZW4oKVwiPmtleWJvYXJkX2Fycm93X2Rvd248L21kLWljb24+XFxuJyArXG4gICAgJyAgPG1kLWljb24gbmctc2hvdz1cIiFjdHJsLmNsb3NlZFwiIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIiBuZy1jbGljaz1cImN0cmwuY2xvc2UoKVwiPmtleWJvYXJkX2Fycm93X3VwPC9tZC1pY29uPlxcbicgK1xuICAgICc8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgY2xhc3M9XCJzY3JvbGwtYm94XCI+XFxuJyArXG4gICAgJyAgPG9sPlxcbicgK1xuICAgICcgICAgPGxpIG5nLWNsYXNzPVwie2FjdGl2ZTogXFwnLTFcXCcgPT0gY3RybC5zdGVwSW5kZXgsIGNvbXBsZXRlOiAtMSA8IGN0cmwuc3RlcEluZGV4fVwiPlxcbicgK1xuICAgICcgICAgICA8c3BhbiBjbGFzcz1cIm1kLWNhcHRpb25cIj48bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+dmlzaWJpbGl0eTwvbWQtaWNvbj48L3NwYW4+T3ZlcnZpZXdcXG4nICtcbiAgICAnICAgIDwvbGk+XFxuJyArXG4gICAgJyAgICA8bGkgbmctcmVwZWF0PVwic3RlcCBpbiBjdHJsLnN0ZXBzXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkaW5kZXggPT0gY3RybC5zdGVwSW5kZXgsIGNvbXBsZXRlOiAkaW5kZXggPCBjdHJsLnN0ZXBJbmRleH1cIj5cXG4nICtcbiAgICAnICAgICAgPHNwYW4gY2xhc3M9XCJtZC1jYXB0aW9uXCI+e3skaW5kZXggKyAxfX08L3NwYW4+e3tzdGVwLm5hbWV9fVxcbicgK1xuICAgICcgICAgPC9saT5cXG4nICtcbiAgICAnICAgIDxsaSBuZy1jbGFzcz1cInthY3RpdmU6IGN0cmwuc3RlcHMubGVuZ3RoIDw9IGN0cmwuc3RlcEluZGV4LCBjb21wbGV0ZTogY3RybC5zdGVwcy5sZW5ndGggPD0gY3RybC5zdGVwSW5kZXh9XCI+XFxuJyArXG4gICAgJyAgICAgIDxzcGFuIGNsYXNzPVwibWQtY2FwdGlvblwiPjxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5kb25lPC9tZC1pY29uPjwvc3Bhbj5TdW1tYXJ5XFxuJyArXG4gICAgJyAgICA8L2xpPlxcbicgK1xuICAgICcgIDwvb2w+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZGl2PjwhLS0gd29ya2Zsb3ctcHJvZ3Jlc3MgLS0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXN0ZXAtZGV0YWlsLnRwbC5odG1sJyxcbiAgICAnPGgyIGNsYXNzPVwibWQtdGl0bGVcIj5TdGVwOiB7e3N0ZXAubmFtZX19PC9oMj5cXG4nICtcbiAgICAnPG1kLWxpc3Q+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sYWJlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3tzdGVwLmNvZGV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgIDxwPlN0ZXAgY29kZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLXNob3c9XCJzdGVwLmZvcm1JZFwiPlxcbicgK1xuICAgICcgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmxhYmVsPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3N0ZXAuZm9ybUlkfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Gb3JtSWQ8L3A+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLXNob3c9XCJzdGVwLnRlbXBsYXRlcyAmJiBzdGVwLnRlbXBsYXRlcy52aWV3XCI+XFxuJyArXG4gICAgJyAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+bGFiZWw8L21kLWljb24+XFxuJyArXG4gICAgJyAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPGgzPnt7c3RlcC50ZW1wbGF0ZXMudmlld319PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+VmlldyB0ZW1wbGF0ZTwvcD5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgbmctc2hvdz1cInN0ZXAudGVtcGxhdGVzLmZvcm1cIj5cXG4nICtcbiAgICAnICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5sYWJlbDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICA8aDM+e3tzdGVwLnRlbXBsYXRlcy5mb3JtfX08L2gzPlxcbicgK1xuICAgICcgICAgICA8cD5Gb3JtIHRlbXBsYXRlPC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICc8L21kLWxpc3Q+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXN0ZXAtZm9ybS50cGwuaHRtbCcsXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwiY29udGVudC10b29sYmFyIG1kLXByaW1hcnlcIiBuZy1zaG93PVwic3RlcFwiPlxcbicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJtZC10b29sYmFyLXRvb2xzXCI+XFxuJyArXG4gICAgJyAgICA8aDM+VXBkYXRlIHN0ZXA8L2gzPlxcbicgK1xuICAgICcgICAgPHNwYW4gZmxleD48L3NwYW4+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtaWNvbi1idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBuZy1jbGljaz1cImN0cmwuc2VsZWN0V29ya2Zsb3coJGV2ZW50LCB3b3JrZmxvdylcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIG5hbWU9XCJ3b3JrZmxvd1N0ZXBGb3JtXCIgbmctc3VibWl0PVwiY3RybC5kb25lKHdvcmtmbG93U3RlcEZvcm0uJHZhbGlkKVwiIG5vdmFsaWRhdGUgbGF5b3V0LXBhZGRpbmcgbGF5b3V0LW1hcmdpbj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWw+Q29kZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImNvZGVcIiBuYW1lPVwiY29kZVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLmNvZGVcIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3JrZmxvdy5tb2RlbC5zdGVwLiRlcnJvclwiIG5nLWlmPVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya2Zsb3dGb3JtLnRpdGxlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgY29kZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPk5hbWU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuc3RlcC5uYW1lXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya2Zsb3cubmFtZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtmbG93Rm9ybS5uYW1lLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgbmFtZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPlxcbicgK1xuICAgICcgICAgPGxhYmVsPkZvcm1JRDwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGVwLmZvcm1JZFwiIG5hbWU9XCJmb3JtSWRcIiBpZD1cImZvcm1JZFwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJmb3JtIGluIGN0cmwuZm9ybXNcIiB2YWx1ZT1cInt7Zm9ybS5faWR9fVwiPnt7Zm9ybS5faWR9fSAoe3tmb3JtLm5hbWV9fSk8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD5mb3JtIHRlbXBsYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZm9ybVwiIG5hbWU9XCJmb3JtXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAudGVtcGxhdGVzLmZvcm1cIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbD52aWV3IHRlbXBsYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidmlld1wiIG5hbWU9XCJ2aWV3XCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnN0ZXAudGVtcGxhdGVzLnZpZXdcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1kLXJhaXNlZCBtZC1wcmltYXJ5XCI+e3tjdHJsLm1vZGVsLmlzTmV3ID8gXFwnQWRkXFwnIDogXFwnVXBkYXRlXFwnfX0gc3RlcDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Zvcm0+XFxuJyArXG4gICAgJycpO1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnLCBbXG4gICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pO1xubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLndvcmtmbG93LmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbm5nTW9kdWxlLmRpcmVjdGl2ZSgnd29ya2Zsb3dQcm9ncmVzcycsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlLCAkdGltZW91dCkge1xuICBmdW5jdGlvbiBwYXJzZVN0ZXBJbmRleChjdHJsLCBzdGVwSW5kZXgpIHtcbiAgICBjdHJsLnN0ZXBJbmRleCA9IHN0ZXBJbmRleDtcbiAgICBjdHJsLnN0ZXAgPSBjdHJsLnN0ZXBzW2N0cmwuc3RlcEluZGV4XTtcbiAgfVxuICBmdW5jdGlvbiBzY3JvbGxUb0FjdGl2ZShlbGVtZW50KSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnRbMF07XG4gICAgdmFyIGFjdGl2ZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGkuYWN0aXZlJyk7XG4gICAgaWYgKCFhY3RpdmUpIHtcbiAgICAgIGFjdGl2ZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGknKTtcbiAgICB9O1xuICAgIHZhciBzY3JvbGxlciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbC1ib3gnKTtcbiAgICB2YXIgb2Zmc2V0ID0gYWN0aXZlLm9mZnNldFRvcDtcbiAgICBzY3JvbGxlci5zY3JvbGxUb3AgPSBvZmZzZXQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXByb2dyZXNzLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgc3RlcEluZGV4OiAnPScsXG4gICAgICB3b3JrZmxvdzogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzY3JvbGxUb0FjdGl2ZShlbGVtZW50KTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLndvcmtmbG93ID0gJHNjb3BlLndvcmtmbG93O1xuICAgICAgc2VsZi5zdGVwcyA9ICRzY29wZS53b3JrZmxvdy5zdGVwcztcbiAgICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc2VsZi5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY3JvbGxUb0FjdGl2ZSgkZWxlbWVudCk7XG4gICAgICAgIHNlbGYuY2xvc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHBhcnNlU3RlcEluZGV4KHNlbGYsICRzY29wZS5zdGVwSW5kZXggPyBwYXJzZUludCgkc2NvcGUuc3RlcEluZGV4KSA6IDApXG5cbiAgICAgICRzY29wZS4kd2F0Y2goJ3N0ZXBJbmRleCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RlcEluZGV4IGNoYW5nZWQnKVxuICAgICAgICBwYXJzZVN0ZXBJbmRleChzZWxmLCAkc2NvcGUuc3RlcEluZGV4ID8gcGFyc2VJbnQoJHNjb3BlLnN0ZXBJbmRleCkgOiAwKTtcbiAgICAgICAgc2VsZi5jbG9zZWQgPSB0cnVlO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBzY3JvbGxUb0FjdGl2ZSgkZWxlbWVudCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd3b3JrZmxvd1N0ZXAnLCBmdW5jdGlvbigkdGVtcGxhdGVSZXF1ZXN0LCAkY29tcGlsZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgc2NvcGU6IHtcbiAgICAgIHN0ZXA6ICc9JyAvLyB7IC4uLiwgdGVtcGxhdGU6IFwiYW4gaHRtbCB0ZW1wbGF0ZSB0byB1c2VcIiwgdGVtcGxhdGVQYXRoOiBcImEgdGVtcGxhdGUgcGF0aCB0byBsb2FkXCJ9XG4gICAgLCB3b3Jrb3JkZXI6ICc9J1xuICAgIH1cbiAgLCBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goJ3N0ZXAnLCBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgIGlmIChzY29wZS5zdGVwKSB7XG4gICAgICAgICAgaWYgKHNjb3BlLnN0ZXAuZm9ybUlkKSB7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoJzxhcHBmb3JtIGZvcm0taWQ9XCJzdGVwLmZvcm1JZFwiPjwvYXBwZm9ybT4nKTtcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2NvcGUuc3RlcC50ZW1wbGF0ZVBhdGgpIHtcbiAgICAgICAgICAgICR0ZW1wbGF0ZVJlcXVlc3Qoc2NvcGUuc3RlcC50ZW1wbGF0ZVBhdGgpLnRoZW4oZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5odG1sKHNjb3BlLnN0ZXAudGVtcGxhdGVzLmZvcm0pO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYubWVkaWF0b3IgPSBtZWRpYXRvcjtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtmbG93UmVzdWx0JywgZnVuY3Rpb24oJGNvbXBpbGUpIHtcbiAgdmFyIHJlbmRlciA9IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIGlmIChzY29wZS53b3JrZmxvdy5zdGVwcyAmJiBzY29wZS5yZXN1bHQpIHtcbiAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgIHNjb3BlLndvcmtmbG93LnN0ZXBzLmZvckVhY2goZnVuY3Rpb24oc3RlcCwgc3RlcEluZGV4KSB7XG4gICAgICAgIGlmIChzY29wZS5yZXN1bHQuc3RlcFJlc3VsdHMgJiYgc2NvcGUucmVzdWx0LnN0ZXBSZXN1bHRzW3N0ZXAuY29kZV0pIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZCgnPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPicpO1xuICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuICAgICAgICAgIHRlbXBsYXRlID0gJzx3b3Jrb3JkZXItc3VibWlzc2lvbi1yZXN1bHQnXG4gICAgICAgICAgdGVtcGxhdGUgKz0gJyByZXN1bHQ9XCJyZXN1bHQuc3RlcFJlc3VsdHNbXFwnJytzdGVwLmNvZGUrJ1xcJ11cIidcbiAgICAgICAgICB0ZW1wbGF0ZSArPSAnIHN0ZXA9XCJ3b3JrZmxvdy5zdGVwc1tcXCcnK3N0ZXBJbmRleCsnXFwnXVwiJ1xuICAgICAgICAgIHRlbXBsYXRlICs9ICc+PC93b3Jrb3JkZXItc3VibWlzc2lvbi1yZXN1bHQ+JztcbiAgICAgICAgICBjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7XG4gICAgICAgICAgZWxlbWVudC5hcHBlbmQodGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93OiAnPSdcbiAgICAsIHJlc3VsdDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJlbmRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG4uZGlyZWN0aXZlKCd3b3JrZmxvd0Zvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93IDogJz12YWx1ZSdcbiAgICAgIH1cbiAgICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubW9kZWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtmbG93KTtcbiAgICAgICAgc2VsZi5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5kb25lID0gZnVuY3Rpb24oaXNWYWxpZCkge1xuICAgICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLm1vZGVsLmlkICYmIHNlbGYubW9kZWwuaWQgIT09IDApIHtcbiAgICAgICAgICAgICAgc2VsZi5tb2RlbC5zdGVwcyA9IFtdO1xuICAgICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6Y3JlYXRlZCcsIHNlbGYubW9kZWwpO1xuICAgICAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzZWxmLnNlbGVjdFdvcmtmbG93ID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtmbG93KSB7XG4gICAgICAgICAgaWYod29ya2Zsb3cuaWQpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIHdvcmtmbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6bGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgIH07XG4gIH0pXG4uZGlyZWN0aXZlKCd3b3JrZmxvd1N0ZXBGb3JtJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRSdcbiAgICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3JrZmxvdy1zdGVwLWZvcm0udHBsLmh0bWwnKVxuICAgICwgc2NvcGU6IHtcbiAgICAgIHdvcmtmbG93IDogJz0nLFxuICAgICAgc3RlcCA6ICc9JyxcbiAgICAgIGZvcm1zOiAnPSdcbiAgICAgIH1cbiAgICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYuZm9ybXMgPSAkc2NvcGUuZm9ybXM7XG4gICAgICAgIHZhciBleGlzdGluZ1N0ZXA7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gZmFsc2U7XG4gICAgICAgIGlmKCEkc2NvcGUuc3RlcCl7XG4gICAgICAgICAgc2VsZi5tb2RlbCA9IHtcbiAgICAgICAgICAgIHN0ZXAgOiB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlcyA6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya2Zsb3cgOiBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtmbG93KSxcbiAgICAgICAgICAgIGlzTmV3IDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzZWxmLm1vZGVsID0ge1xuICAgICAgICAgICAgd29ya2Zsb3cgOiBhbmd1bGFyLmNvcHkoJHNjb3BlLndvcmtmbG93KSxcbiAgICAgICAgICAgIHN0ZXAgOiBhbmd1bGFyLmNvcHkoJHNjb3BlLnN0ZXApXG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXN0aW5nU3RlcCA9ICRzY29wZS53b3JrZmxvdy5zdGVwcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge3JldHVybiBpdGVtLmNvZGUgPT0gJHNjb3BlLnN0ZXAuY29kZTt9KS5sZW5ndGg+MDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuZG9uZSA9IGZ1bmN0aW9uKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgLy93ZSBjaGVjayBpZiB0aGUgc3RlcCBhbHJlYWR5IGV4aXN0IG9yIG5vdCwgaWYgaXQgZXhzaXQgd2UgcmVtb3ZlIHRoZSBvbGQgZWxlbWVudFxuICAgICAgICAgICAgICBpZihleGlzdGluZ1N0ZXApe1xuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVkU3RlcEluZGV4ID0gXy5maW5kSW5kZXgoJHNjb3BlLndvcmtmbG93LnN0ZXBzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmNvZGUgPT0gJHNjb3BlLnN0ZXAuY29kZTsgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLndvcmtmbG93LnN0ZXBzW3VwZGF0ZWRTdGVwSW5kZXhdID0gc2VsZi5tb2RlbC5zdGVwO1xuICAgICAgICAgICAgICAgIC8vJHNjb3BlLndvcmtmbG93LnN0ZXBzID0gJHNjb3BlLndvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7cmV0dXJuIGl0ZW0uY29kZSAhPSAkc2NvcGUuc3RlcC5jb2RlO30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgJHNjb3BlLndvcmtmbG93LnN0ZXBzLnB1c2goc2VsZi5tb2RlbC5zdGVwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsICRzY29wZS53b3JrZmxvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuc2VsZWN0V29ya2Zsb3cgPSBmdW5jdGlvbihldmVudCwgd29ya2Zsb3cpIHtcbiAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya2Zsb3c6c2VsZWN0ZWQnLCB3b3JrZmxvdyk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgICB9O1xuICB9KVxuICAuZGlyZWN0aXZlKCd3b3JrZmxvd1N0ZXBEZXRhaWwnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRSdcbiAgICAgICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtmbG93LXN0ZXAtZGV0YWlsLnRwbC5odG1sJylcbiAgICAgICwgc2NvcGU6IHtcbiAgICAgICAgICBzdGVwIDogJz0nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSlcbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4gICwgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gIDtcblxubW9kdWxlLmV4cG9ydHMgPSAnd2ZtLndvcmtmbG93LnN5bmMnO1xuXG5mdW5jdGlvbiB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpIHtcbiAgdmFyIHdyYXBwZWRNYW5hZ2VyID0gXy5jcmVhdGUobWFuYWdlcik7XG4gIHdyYXBwZWRNYW5hZ2VyLm5ldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgd29ya2Zsb3cgPSB7XG4gICAgICAgIHRpdGxlOiAnJ1xuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUod29ya2Zsb3cpO1xuICAgIH0sIDApO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuXG4gIHJldHVybiB3cmFwcGVkTWFuYWdlcjtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3dmbS53b3JrZmxvdy5zeW5jJywgW3JlcXVpcmUoJ2ZoLXdmbS1zeW5jJyldKVxuLmZhY3RvcnkoJ3dvcmtmbG93U3luYycsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgc3luY1NlcnZpY2UpIHtcbiAgc3luY1NlcnZpY2UuaW5pdCgkZmgsIGNvbmZpZy5zeW5jT3B0aW9ucyk7XG4gIHZhciB3b3JrZmxvd1N5bmMgPSB7fTtcbiAgd29ya2Zsb3dTeW5jLmNyZWF0ZU1hbmFnZXIgPSBmdW5jdGlvbihxdWVyeVBhcmFtcykge1xuICAgIGlmICh3b3JrZmxvd1N5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuICRxLndoZW4od29ya2Zsb3dTeW5jLm1hbmFnZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd29ya2Zsb3dTeW5jLm1hbmFnZXJQcm9taXNlID0gc3luY1NlcnZpY2UubWFuYWdlKGNvbmZpZy5kYXRhc2V0SWQsIG51bGwsIHF1ZXJ5UGFyYW1zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlciA9IHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcik7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTeW5jIGlzIG1hbmFnaW5nIGRhdGFzZXQ6JywgY29uZmlnLmRhdGFzZXRJZCwgJ3dpdGggZmlsdGVyOiAnLCBxdWVyeVBhcmFtcyk7XG4gICAgICAgIC8vIFRPRE86IHdlIHNob3VsZCByZWZhY3RvciB0aGVzZSB1dGlsaXRpZXMgZnVuY3Rpb25zIHNvbWV3aGVyZSBlbHNlIHByb2JhYmx5XG4gICAgICAgIHdvcmtmbG93U3luYy5tYW5hZ2VyLnN0ZXBSZXZpZXcgPSBmdW5jdGlvbihzdGVwcywgcmVzdWx0KSB7XG4gICAgICAgICAgdmFyIHN0ZXBJbmRleCA9IC0xO1xuICAgICAgICAgIHZhciBjb21wbGV0ZTtcbiAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdGVwUmVzdWx0cyAmJiByZXN1bHQuc3RlcFJlc3VsdHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBzdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgc3RlcCA9IHN0ZXBzW2ldO1xuICAgICAgICAgICAgICB2YXIgc3RlcFJlc3VsdCA9IHJlc3VsdC5zdGVwUmVzdWx0c1tzdGVwLmNvZGVdO1xuICAgICAgICAgICAgICBpZiAoc3RlcFJlc3VsdCAmJiAoc3RlcFJlc3VsdC5zdGF0dXMgPT09ICdjb21wbGV0ZScgfHwgc3RlcFJlc3VsdC5zdGF0dXMgPT09ICdwZW5kaW5nJykpIHtcbiAgICAgICAgICAgICAgICBzdGVwSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwUmVzdWx0LnN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgICAgICAgICAgICBjb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZXh0U3RlcEluZGV4OiBzdGVwSW5kZXgsXG4gICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgLy8gZmFsc2UgaXMgYW55IHN0ZXBzIGFyZSBcInBlbmRpbmdcIlxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB3b3JrZmxvd1N5bmMubWFuYWdlci5uZXh0U3RlcEluZGV4ID0gZnVuY3Rpb24oc3RlcHMsIHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnN0ZXBSZXZpZXcoc3RlcHMsIHJlc3VsdCkubmV4dFN0ZXBJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHdvcmtmbG93U3luYy5tYW5hZ2VyLmNoZWNrU3RhdHVzID0gZnVuY3Rpb24od29ya29yZGVyLCB3b3JrZmxvdywgcmVzdWx0KSB7XG4gICAgICAgICAgdmFyIHN0YXR1cztcbiAgICAgICAgICB2YXIgc3RlcFJldmlldyA9IHRoaXMuc3RlcFJldmlldyh3b3JrZmxvdy5zdGVwcywgcmVzdWx0KTtcbiAgICAgICAgICBpZiAoc3RlcFJldmlldy5uZXh0U3RlcEluZGV4ID49IHdvcmtmbG93LnN0ZXBzLmxlbmd0aCAtIDEgJiYgc3RlcFJldmlldy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgc3RhdHVzID0gJ0NvbXBsZXRlJztcbiAgICAgICAgICB9IGVsc2UgaWYgKCF3b3Jrb3JkZXIuYXNzaWduZWUpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdVbmFzc2lnbmVkJztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXBSZXZpZXcubmV4dFN0ZXBJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdOZXcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0dXMgPSAnSW4gUHJvZ3Jlc3MnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3b3JrZmxvd1N5bmMubWFuYWdlcjtcbiAgICAgIH0pXG4gICAgfVxuICB9O1xuICB3b3JrZmxvd1N5bmMucmVtb3ZlTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh3b3JrZmxvd1N5bmMubWFuYWdlcikge1xuICAgICAgcmV0dXJuIHdvcmtmbG93U3luYy5tYW5hZ2VyLnNhZmVTdG9wKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGUgd29ya2Zsb3dTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHdvcmtmbG93U3luYztcbn0pXG47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3JrZmxvdyc7XG5cbmFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya2Zsb3cnLCBbXG4gIHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiwgcmVxdWlyZSgnLi9zZXJ2aWNlLmpzJylcbl0pXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgYXBpUGF0aDogJy9hcGkvd2ZtL3dvcmtmbG93JyxcbiAgZGF0YXNldElkIDogJ3dvcmtmbG93cycsXG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCJyZXF1aXJlKCcuL3dvcmtvcmRlci1mb3JtLnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3dvcmtvcmRlci1saXN0LnRwbC5odG1sLmpzJyk7XG5yZXF1aXJlKCcuL3dvcmtvcmRlci50cGwuaHRtbC5qcycpO1xuIiwidmFyIG5nTW9kdWxlO1xudHJ5IHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycsIFtdKTtcbn1cblxubmdNb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd3Zm0tdGVtcGxhdGUvd29ya29yZGVyLWZvcm0udHBsLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cImNvbnRlbnQtdG9vbGJhciBtZC1wcmltYXJ5XCI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz57e2N0cmwubW9kZWwuaWQgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSB3b3Jrb3JkZXI8L2gzPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cInt7Y3RybC5zdGF0dXN9fVwiPlxcbicgK1xuICAgICcgICAgICA8d29ya29yZGVyLXN0YXR1cyBzdGF0dXM9XCJjdHJsLnN0YXR1c1wiPjwvd29ya29yZGVyLXN0YXR1cz5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWljb24tYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtvcmRlcigkZXZlbnQsIGN0cmwubW9kZWwpXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICcgIDwvZGl2PlxcbicgK1xuICAgICc8L21kLXRvb2xiYXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8Zm9ybSBuYW1lPVwid29ya29yZGVyRm9ybVwiIG5nLXN1Ym1pdD1cImN0cmwuZG9uZSh3b3Jrb3JkZXJGb3JtLiR2YWxpZClcIiBub3ZhbGlkYXRlIGxheW91dC1wYWRkaW5nIGxheW91dC1tYXJnaW4+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDwhLS1cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cIndvcmtvcmRlclN0YXRlXCI+U3RhdHVzPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5wdXRXb3Jrb3JkZXJUeXBlXCIgbmFtZT1cIndvcmtvcmRlclN0YXR1c1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdGF0dXNcIiBkaXNhYmxlZD1cInRydWVcIj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnICAtLT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0LWd0LXNtPVwicm93XCI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3Jrb3JkZXJUeXBlXCI+VHlwZTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiY3RybC5tb2RlbC50eXBlXCIgbmFtZT1cIndvcmtvcmRlclR5cGVcIiBpZD1cIndvcmtvcmRlclR5cGVcIj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJKb2IgT3JkZXJcIj5Kb2IgT3JkZXI8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICAgIDxtZC1vcHRpb24gdmFsdWU9XCJUeXBlIDAyXCI+VHlwZSAwMjwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiB2YWx1ZT1cIlR5cGUgMDNcIj5UeXBlIDAzPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIHZhbHVlPVwiVHlwZSAwNFwiPlR5cGUgMDQ8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJ3b3JrZmxvd1wiPldvcmtmbG93PC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdHJsLm1vZGVsLndvcmtmbG93SWRcIiBuYW1lPVwid29ya2Zsb3dcIiBpZD1cIndvcmtmbG93XCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cIndvcmtmbG93IGluIGN0cmwud29ya2Zsb3dzXCIgdmFsdWU9XCJ7e3dvcmtmbG93LmlkfX1cIj57e3dvcmtmbG93LmlkfX0gLSB7e3dvcmtmbG93LnRpdGxlfX08L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS53b3JrZmxvdy4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0ud29ya2Zsb3cuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgd29ya2Zsb3cgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJhc3NpZ25lZVwiPkFzc2lnbmVlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdHJsLm1vZGVsLmFzc2lnbmVlXCIgbmFtZT1cImFzc2lnbmVlXCIgaWQ9XCJhc3NpZ25lZVwiPlxcbicgK1xuICAgICcgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJ3b3JrZXIgaW4gY3RybC53b3JrZXJzXCIgdmFsdWU9XCJ7e3dvcmtlci5pZH19XCI+e3t3b3JrZXIubmFtZX19ICh7e3dvcmtlci5wb3NpdGlvbn19KTwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWw+VGl0bGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJpbnB1dFRpdGxlXCIgbmFtZT1cInRpdGxlXCIgbmctbW9kZWw9XCJjdHJsLm1vZGVsLnRpdGxlXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS50aXRsZS4kZXJyb3JcIiBuZy1pZj1cImN0cmwuc3VibWl0dGVkIHx8IHdvcmtvcmRlckZvcm0udGl0bGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSB0aXRsZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRBZGRyZXNzXCI+QWRkcmVzczwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgaWQ9XCJpbnB1dEFkZHJlc3NcIiBuYW1lPVwiYWRkcmVzc1wiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5hZGRyZXNzXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5hZGRyZXNzLiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLmFkZHJlc3MuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gYWRkcmVzcyBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXYgbGF5b3V0LWd0LXNtPVwicm93XCI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dEFkZHJlc3NcIj5MYXR0aXR1ZGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiAgaWQ9XCJpbnB1dExhdHRpdHVkZVwiIG5hbWU9XCJsYXR0aXR1ZGVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwubG9jYXRpb25bMF1cIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmxhdHRpdHVkZS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5sYXR0aXR1ZGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gbGF0dGl0dWRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgZmxleC1ndC1zbT5cXG4nICtcbiAgICAnICAgIDxsYWJlbCBmb3I9XCJpbnB1dEFkZHJlc3NcIj5Mb25naXR1ZGU8L2xhYmVsPlxcbicgK1xuICAgICcgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiAgaWQ9XCJpbnB1dExhdHRpdHVkZVwiIG5hbWU9XCJsb25naXR1ZGVcIiBuZy1tb2RlbD1cImN0cmwubW9kZWwubG9jYXRpb25bMV1cIiByZXF1aXJlZD5cXG4nICtcbiAgICAnICAgIDxkaXYgbmctbWVzc2FnZXM9XCJ3b3Jrb3JkZXJGb3JtLmxvbmdpdHVkZS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5sb25naXR1ZGUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QW4gbG9uZ2l0dWRlIGlzIHJlcXVpcmVkLjwvZGl2PlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPGRpdiBsYXlvdXQtZ3Qtc209XCJyb3dcIj5cXG4nICtcbiAgICAnICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBmbGV4LWd0LXNtPlxcbicgK1xuICAgICcgICAgPGxhYmVsIGZvcj1cImlucHV0RmluaXNoRGF0ZVwiPkZpbmlzaCBEYXRlPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiICBpZD1cImlucHV0RmluaXNoRGF0ZVwiIG5hbWU9XCJmaW5pc2hEYXRlXCIgbWluPVwie3t0b2RheX19XCIgbWF4PVwie3ttYXhEYXRlfX1cIiBuZy1tb2RlbD1cImN0cmwubW9kZWwuZmluaXNoRGF0ZVwiIHJlcXVpcmVkPlxcbicgK1xuICAgICcgICAgPGRpdiBuZy1tZXNzYWdlcz1cIndvcmtvcmRlckZvcm0uZmluaXNoRGF0ZS4kZXJyb3JcIiBuZy1zaG93PVwiY3RybC5zdWJtaXR0ZWQgfHwgd29ya29yZGVyRm9ybS5maW5pc2hEYXRlLiRkaXJ0eVwiPlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPkEgZmluaXNoIGRhdGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cIm1pblwiPlN0YXJ0IERhdGUgc2hvdWxkIG5vdCBiZSBsZXNzIHRoYW4gY3VycmVudCBkYXRlLjwvZGl2PlxcbicgK1xuICAgICcgICAgICA8ZGl2IG5nLW1lc3NhZ2U9XCJtYXhcIj5TdGFydCBEYXRlIGlzIHRvbyBmYXIgaW4gdGhlIGZ1dHVyZS48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIGZsZXgtZ3Qtc20+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRGaW5pc2hUaW1lXCIgPkZpbmlzaCBUaW1lPC9sYWJlbD5cXG4nICtcbiAgICAnICAgIDxpbnB1dCB0eXBlPVwidGltZVwiICBpZD1cImlucHV0RmluaXNoVGltZVwiIG5hbWU9XCJmaW5pc2hUaW1lXCIgIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5maW5pc2hUaW1lXCIgcmVxdWlyZWQ+XFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5maW5pc2hUaW1lLiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLmZpbmlzaFRpbWUuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBmaW5pc2ggdGltZSBpcyByZXF1aXJlZC48L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvZGl2PlxcbicgK1xuICAgICcgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxkaXY+XFxuJyArXG4gICAgJyAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgbmctY2xhc3M9XCJ7IFxcJ2hhcy1lcnJvclxcJyA6IHdvcmtvcmRlckZvcm0uc3VtbWFyeS4kaW52YWxpZCAmJiAhd29ya29yZGVyRm9ybS5zdW1tYXJ5LiRwcmlzdGluZSB9XCI+XFxuJyArXG4gICAgJyAgICA8bGFiZWwgZm9yPVwiaW5wdXRTdW1tYXJ5XCI+U3VtbWFyeTwvbGFiZWw+XFxuJyArXG4gICAgJyAgICA8dGV4dGFyZWEgaWQ9XCJpbnB1dFN1bW1hcnlcIiBuYW1lPVwic3VtbWFyeVwiIG5nLW1vZGVsPVwiY3RybC5tb2RlbC5zdW1tYXJ5XCIgcmVxdWlyZWQgbWQtbWF4bGVuZ3RoPVwiMTUwXCI+PC90ZXh0YXJlYT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8ZGl2IG5nLW1lc3NhZ2VzPVwid29ya29yZGVyRm9ybS5zdW1tYXJ5LiRlcnJvclwiIG5nLXNob3c9XCJjdHJsLnN1Ym1pdHRlZCB8fCB3b3Jrb3JkZXJGb3JtLnN1bW1hcnkuJGRpcnR5XCI+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+QSBzdW1tYXJ5IGRhdGUgaXMgcmVxdWlyZWQuPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAnICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgIDxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtcmFpc2VkIG1kLXByaW1hcnlcIj57e2N0cmwubW9kZWwuaWQgPyBcXCdVcGRhdGVcXCcgOiBcXCdDcmVhdGVcXCd9fSBXb3Jrb3JkZXI8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9mb3JtPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsInZhciBuZ01vZHVsZTtcbnRyeSB7XG4gIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycpO1xufSBjYXRjaCAoZSkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnLCBbXSk7XG59XG5cbm5nTW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1saXN0LnRwbC5odG1sJyxcbiAgICAnPG1kLXRvb2xiYXI+XFxuJyArXG4gICAgJyAgPGRpdiBjbGFzcz1cIm1kLXRvb2xiYXItdG9vbHNcIj5cXG4nICtcbiAgICAnICAgIDxoMz5cXG4nICtcbiAgICAnICAgICAgPHNwYW4+V29ya29yZGVyczwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvaDM+XFxuJyArXG4gICAgJyAgPC9kaXY+XFxuJyArXG4gICAgJzwvbWQtdG9vbGJhcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxmb3JtIGFjdGlvbj1cIiNcIiBjbGFzcz1cInBlcnNpc3RlbnQtc2VhcmNoXCIgaGlkZS14cyBoaWRlLXNtPlxcbicgK1xuICAgICcgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPjwvbGFiZWw+XFxuJyArXG4gICAgJyAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCIgbmctbW9kZWw9XCJzZWFyY2hWYWx1ZVwiIG5nLWNoYW5nZT1cImN0cmwuYXBwbHlGaWx0ZXIoc2VhcmNoVmFsdWUpXCI+XFxuJyArXG4gICAgJzwvZm9ybT5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1saXN0PlxcbicgK1xuICAgICcgIDxtZC1saXN0LWl0ZW1cXG4nICtcbiAgICAnICAgIG5nLXJlcGVhdD1cIndvcmtvcmRlciBpbiBjdHJsLndvcmtvcmRlcnNcIlxcbicgK1xuICAgICcgICAgbmctY2xpY2s9XCJjdHJsLnNlbGVjdFdvcmtvcmRlcigkZXZlbnQsIHdvcmtvcmRlcilcIlxcbicgK1xuICAgICcgICAgbmctY2xhc3M9XCJ7YWN0aXZlOiBjdHJsLnNlbGVjdGVkLmlkID09PSB3b3Jrb3JkZXIuaWR9XCJcXG4nICtcbiAgICAnICAgIGNsYXNzPVwibWQtMi1saW5lIHdvcmtvcmRlci1pdGVtXCJcXG4nICtcbiAgICAnICA+XFxuJyArXG4gICAgJzwhLS1cXG4nICtcbiAgICAnICBUT0RPOiBjaGFuZ2UgY2xhc3MgbmFtZSBhY2NvcmRpbmcgdG8gdGhlIGNvbG9yOlxcbicgK1xuICAgICcgICAgXCJzdWNjZXNzXCIgPSBncmVlblxcbicgK1xuICAgICcgICAgZGFuZ2VyID0gXCJyZWRcIlxcbicgK1xuICAgICcgICAgd2FybmluZyA9IFwieWVsbG93XCJcXG4nICtcbiAgICAnICAgIG5vIGNsYXNzID0gZ3JleVxcbicgK1xuICAgICcgIC0tPlxcbicgK1xuICAgICcgIDx3b3Jrb3JkZXItc3RhdHVzIGNsYXNzPVwiXCIgc3RhdHVzPVwiY3RybC5yZXN1bHRNYXBbd29ya29yZGVyLmlkXS5zdGF0dXNcIj48L3dvcmtvcmRlci1zdGF0dXM+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgIDxoMz57e3dvcmtvcmRlci50aXRsZX19PC9oMz5cXG4nICtcbiAgICAnICAgICAgPHA+e3t3b3Jrb3JkZXIuYWRkcmVzc319PC9wPlxcbicgK1xuICAgICcgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJyAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJzwvbWQtbGlzdD5cXG4nICtcbiAgICAnJyk7XG59XSk7XG4iLCJ2YXIgbmdNb2R1bGU7XG50cnkge1xuICBuZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5kaXJlY3RpdmVzJywgW10pO1xufVxuXG5uZ01vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXIudHBsLmh0bWwnLFxuICAgICcgIDxtZC1saXN0PlxcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBvcnRyYWl0PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3t3b3Jrb3JkZXIuaWR9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+V29ya29yZGVyIGlkPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiID5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDx3b3Jrb3JkZXItc3RhdHVzIHN0YXR1cz1cInN0YXR1c1wiPjwvd29ya29yZGVyLXN0YXR1cz5cXG4nICtcbiAgICAnICAgIDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgICA8aDM+e3tzdGF0dXMgfHwgXCJOZXdcIn19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICAgICA8cD5TdGF0dXM8L3A+XFxuJyArXG4gICAgJyAgICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZSBtZC1sb25nLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgPG1kLWljb24gbWQtZm9udC1zZXQ9XCJtYXRlcmlhbC1pY29uc1wiPnBsYWNlPC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICAgPGgzPnt7d29ya29yZGVyLmxvY2F0aW9uWzBdfX0sIHt7d29ya29yZGVyLmxvY2F0aW9uWzFdfX08L2gzPlxcbicgK1xuICAgICcgICAgICAgICA8cD5cXG4nICtcbiAgICAnICAgICAgICAgICB7e3dvcmtvcmRlci5hZGRyZXNzfX1cXG4nICtcbiAgICAnICAgICAgICAgPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5hc3NpZ25tZW50PC9tZC1pY29uPlxcbicgK1xuICAgICcgICAgICA8ZGl2IGNsYXNzPVwibWQtbGlzdC1pdGVtLXRleHRcIj5cXG4nICtcbiAgICAnICAgICAgICA8aDM+e3t3b3Jrb3JkZXIudGl0bGV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+V29ya29yZGVyPC9wPlxcbicgK1xuICAgICcgICAgICA8L2Rpdj5cXG4nICtcbiAgICAnICAgIDwvbWQtbGlzdC1pdGVtPlxcbicgK1xuICAgICcgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XCJtZC0yLWxpbmVcIiA+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5ldmVudDwvbWQtaWNvbj5cXG4nICtcbiAgICAnICAgICAgPGRpdiBjbGFzcz1cIm1kLWxpc3QtaXRlbS10ZXh0XCI+XFxuJyArXG4gICAgJyAgICAgICAgPGgzPnt7d29ya29yZGVyLnN0YXJ0VGltZXN0YW1wIHwgZGF0ZTpcXCd5eXl5LU1NLWRkXFwnIH19PC9oMz5cXG4nICtcbiAgICAnICAgICAgICA8cD5GaW5pc2ggRGF0ZTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVwibWQtMi1saW5lXCIgPlxcbicgK1xuICAgICcgICAgICA8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+c2NoZWR1bGU8L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e3dvcmtvcmRlci5zdGFydFRpbWVzdGFtcCB8IGRhdGU6XFwnSEg6bW06c3MgWlxcJyB9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+RmluaXNoIFRpbWU8L3A+XFxuJyArXG4gICAgJyAgICAgIDwvZGl2PlxcbicgK1xuICAgICcgICAgPC9tZC1saXN0LWl0ZW0+XFxuJyArXG4gICAgJyAgICA8bWQtZGl2aWRlcj48L21kLWRpdmlkZXI+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICcgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cIm1kLTItbGluZVwiIG5nLXNob3c9XCJhc3NpZ25lZSAmJiBhc3NpZ25lZS5uYW1lXCI+XFxuJyArXG4gICAgJyAgICAgIDxtZC1pY29uIG1kLWZvbnQtc2V0PVwibWF0ZXJpYWwtaWNvbnNcIj5wZXJzb248L21kLWljb24+XFxuJyArXG4gICAgJyAgICAgIDxkaXYgY2xhc3M9XCJtZC1saXN0LWl0ZW0tdGV4dFwiPlxcbicgK1xuICAgICcgICAgICAgIDxoMz57e2Fzc2lnbmVlLm5hbWV9fTwvaDM+XFxuJyArXG4gICAgJyAgICAgICAgPHA+QXNpZ25lZTwvcD5cXG4nICtcbiAgICAnICAgICAgPC9kaXY+XFxuJyArXG4gICAgJyAgICA8L21kLWxpc3QtaXRlbT5cXG4nICtcbiAgICAnICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJyAgPC9tZC1saXN0PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnICA8bWQtc3ViaGVhZGVyIGNsYXNzPVwibWQtbm8tc3RpY2t5XCI+V29yayBTdW1tYXJ5PC9tZC1zdWJoZWFkZXI+XFxuJyArXG4gICAgJyAgPHAgY2xhc3M9XCJtZC1ib2R5LTFcIiBsYXlvdXQtcGFkZGluZyBsYXlvdXQtbWFyZ2luPlxcbicgK1xuICAgICcgICAge3t3b3Jrb3JkZXIuc3VtbWFyeX19XFxuJyArXG4gICAgJyAgPC9wPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3dmbS53b3Jrb3JkZXIuZGlyZWN0aXZlcycsIFsnd2ZtLmNvcmUubWVkaWF0b3InXSk7XG5tb2R1bGUuZXhwb3J0cyA9ICd3Zm0ud29ya29yZGVyLmRpcmVjdGl2ZXMnO1xuXG5yZXF1aXJlKCcuLi8uLi9kaXN0Jyk7XG5cbnZhciBnZXRTdGF0dXNJY29uID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gIHZhciBzdGF0dXNJY29uO1xuICBzd2l0Y2goc3RhdHVzKSB7XG4gICAgY2FzZSAnSW4gUHJvZ3Jlc3MnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhdXRvcmVuZXcnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQ29tcGxldGUnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdhc3NpZ25tZW50X3R1cm5lZF9pbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdBYm9ydGVkJzpcbiAgICAgIHN0YXR1c0ljb24gPSAnYXNzaWdubWVudF9sYXRlJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ09uIEhvbGQnOlxuICAgICAgc3RhdHVzSWNvbiA9ICdwYXVzZSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdVbmFzc2lnbmVkJzpcbiAgICAgIHN0YXR1c0ljb24gPSAnYXNzaWdubWVudF9pbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTmV3JzpcbiAgICAgIHN0YXR1c0ljb24gPSAnbmV3X3JlbGVhc2VzJztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0dXNJY29uID0gJ3JhZGlvX2J1dHRvbl91bmNoZWNrZWQnO1xuICB9XG4gIHJldHVybiBzdGF0dXNJY29uO1xufVxuXG5uZ01vZHVsZS5kaXJlY3RpdmUoJ3dvcmtvcmRlckxpc3QnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1saXN0LnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgICAgd29ya29yZGVycyA6ICc9JyxcbiAgICAgIHJlc3VsdE1hcDogJz0nLFxuICAgICAgc2VsZWN0ZWRNb2RlbDogJz0nXG4gICAgfVxuICAsIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnM7XG4gICAgICAkc2NvcGUuJHdhdGNoKCd3b3Jrb3JkZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYud29ya29yZGVycyA9ICRzY29wZS53b3Jrb3JkZXJzO1xuICAgICAgfSlcbiAgICAgIHNlbGYucmVzdWx0TWFwID0gJHNjb3BlLnJlc3VsdE1hcDtcbiAgICAgIHNlbGYuc2VsZWN0ZWQgPSAkc2NvcGUuc2VsZWN0ZWRNb2RlbDtcbiAgICAgIHNlbGYuc2VsZWN0V29ya29yZGVyID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgICAgICAvLyBzZWxmLnNlbGVjdGVkV29ya29yZGVySWQgPSB3b3Jrb3JkZXIuaWQ7XG4gICAgICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCB3b3Jrb3JkZXIpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuaXNXb3Jrb3JkZXJTaG93biA9IGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICByZXR1cm4gc2VsZi5zaG93bldvcmtvcmRlciA9PT0gd29ya29yZGVyO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5hcHBseUZpbHRlciA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc2VsZi53b3Jrb3JkZXJzID0gJHNjb3BlLndvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya29yZGVyLmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICAgICAgfHwgU3RyaW5nKHdvcmtvcmRlci50aXRsZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgLCBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUsIG1lZGlhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHRlbXBsYXRlOiAkdGVtcGxhdGVDYWNoZS5nZXQoJ3dmbS10ZW1wbGF0ZS93b3Jrb3JkZXIudHBsLmh0bWwnKVxuICAsIHNjb3BlOiB7XG4gICAgd29ya29yZGVyOiAnPScsXG4gICAgYXNzaWduZWU6ICc9JyxcbiAgICBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuc2hvd1NlbGVjdEJ1dHRvbiA9ICEhICRzY29wZS4kcGFyZW50LndvcmtvcmRlcnM7XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3dvcmtvcmRlckZvcm0nLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICR0ZW1wbGF0ZUNhY2hlLmdldCgnd2ZtLXRlbXBsYXRlL3dvcmtvcmRlci1mb3JtLnRwbC5odG1sJylcbiAgLCBzY29wZToge1xuICAgIHdvcmtvcmRlciA6ICc9dmFsdWUnXG4gICwgd29ya2Zsb3dzOiAnPSdcbiAgLCB3b3JrZXJzOiAnPSdcbiAgLCBzdGF0dXM6ICc9J1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgICB0b2RheS5zZXRIb3Vycyh0b2RheS5nZXRIb3VycygpLTI0KTtcbiAgICAgICRzY29wZS50b2RheSA9IHRvZGF5LnRvSVNPU3RyaW5nKCk7XG4gICAgICB2YXIgbWF4RGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgIG1heERhdGUuc2V0RnVsbFllYXIodG9kYXkuZ2V0RnVsbFllYXIoKSsxMDApO1xuICAgICAgJHNjb3BlLm1heERhdGUgPSBtYXhEYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgICBzZWxmLm1vZGVsID0gYW5ndWxhci5jb3B5KCRzY29wZS53b3Jrb3JkZXIpO1xuICAgICAgc2VsZi53b3JrZmxvd3MgPSAkc2NvcGUud29ya2Zsb3dzO1xuICAgICAgc2VsZi53b3JrZXJzID0gJHNjb3BlLndvcmtlcnM7XG4gICAgICBzZWxmLnN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc2VsZi5tb2RlbCAmJiBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKSB7XG4gICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUgPSBuZXcgRGF0ZShzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wKTtcbiAgICAgIH07XG4gICAgICBzZWxmLnNlbGVjdFdvcmtvcmRlciA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICAgICAgaWYod29ya29yZGVyLmlkKSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIHdvcmtvcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpsaXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmRvbmUgPSBmdW5jdGlvbihpc1ZhbGlkKSB7XG4gICAgICAgIHNlbGYuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICBzZWxmLm1vZGVsLnN0YXJ0VGltZXN0YW1wID0gbmV3IERhdGUoc2VsZi5tb2RlbC5maW5pc2hEYXRlKTsgLy8gVE9ETzogaW5jb3Jwb3JhdGUgc2VsZi5tb2RlbC5maW5pc2hUaW1lXG4gICAgICAgICAgc2VsZi5tb2RlbC5zdGFydFRpbWVzdGFtcC5zZXRIb3VycyhcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRIb3VycygpLFxuICAgICAgICAgICAgc2VsZi5tb2RlbC5maW5pc2hUaW1lLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZS5nZXRTZWNvbmRzKCksXG4gICAgICAgICAgICBzZWxmLm1vZGVsLmZpbmlzaFRpbWUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgICApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoRGF0ZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIHNlbGYubW9kZWwuZmluaXNoVGltZSA9IG5ldyBEYXRlKHNlbGYubW9kZWwuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgICAgIGlmICghc2VsZi5tb2RlbC5pZCAmJiBzZWxmLm1vZGVsLmlkICE9PSAwKSB7XG4gICAgICAgICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOmNyZWF0ZWQnLCBzZWxmLm1vZGVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjp1cGRhdGVkJywgc2VsZi5tb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAsIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd3b3Jrb3JkZXJTdGF0dXMnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSwgbWVkaWF0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnXG4gICwgdGVtcGxhdGU6ICc8bWQtaWNvbiBtZC1mb250LXNldD1cIm1hdGVyaWFsLWljb25zXCI+e3tzdGF0dXNJY29ufX08bWQtdG9vbHRpcD57e3N0YXR1c319PC9tZC10b29sdGlwPjwvbWQtaWNvbj4nXG4gICwgc2NvcGU6IHtcbiAgICAgIHN0YXR1cyA6ICc9c3RhdHVzJ1xuICAgIH1cbiAgLCBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICRzY29wZS5zdGF0dXNJY29uID0gZ2V0U3RhdHVzSWNvbigkc2NvcGUuc3RhdHVzKTtcbiAgICB9XG4gICwgY29udHJvbGxlckFzOiAnY3RybCdcbiAgfVxufSlcblxuLmRpcmVjdGl2ZSgnd29ya29yZGVyU3VibWlzc2lvblJlc3VsdCcsIGZ1bmN0aW9uKCRjb21waWxlKSB7XG4gIHZhciByZW5kZXIgPSBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBpZiAoIXNjb3BlLnJlc3VsdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gc2NvcGUucmVzdWx0O1xuICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuICAgIGlmIChzY29wZS5zdGVwLmZvcm1JZCkge1xuICAgICAgdmFyIHN1Ym1pc3Npb24gPSByZXN1bHQuc3VibWlzc2lvbjtcbiAgICAgIHZhciB0YWcsIHN1YklkO1xuICAgICAgaWYgKHN1Ym1pc3Npb24uX3N1Ym1pc3Npb24pIHtcbiAgICAgICAgdGFnID0gJ3N1Ym1pc3Npb24nO1xuICAgICAgICBzdWJJZCA9IHN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cbiAgICAgICAgdGVtcGxhdGUgPSAnPGFwcGZvcm0tc3VibWlzc2lvbiBzdWJtaXNzaW9uPVwicmVzdWx0LnN1Ym1pc3Npb24uX3N1Ym1pc3Npb25cIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25JZCkge1xuICAgICAgICB0ZW1wbGF0ZSA9ICc8YXBwZm9ybS1zdWJtaXNzaW9uIHN1Ym1pc3Npb24taWQ9XCJcXCcnK3N1Ym1pc3Npb24uc3VibWlzc2lvbklkKydcXCdcIj48L2FwcGZvcm0tc3VibWlzc2lvbj4nO1xuICAgICAgfSBlbHNlIGlmIChzdWJtaXNzaW9uLnN1Ym1pc3Npb25Mb2NhbElkKSB7XG4gICAgICAgIHRlbXBsYXRlID0gJzxhcHBmb3JtLXN1Ym1pc3Npb24gc3VibWlzc2lvbi1sb2NhbC1pZD1cIlxcJycrc3VibWlzc2lvbi5zdWJtaXNzaW9uTG9jYWxJZCsnXFwnXCI+PC9hcHBmb3JtLXN1Ym1pc3Npb24+JztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlID0gc2NvcGUuc3RlcC50ZW1wbGF0ZXMudmlldztcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmQodGVtcGxhdGUpO1xuICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAsIHNjb3BlOiB7XG4gICAgICByZXN1bHQ6ICc9J1xuICAgICwgc3RlcDogJz0nXG4gICAgfVxuICAsIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJlbmRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG47XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuICAsIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICA7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3Jrb3JkZXIuc3luYyc7XG5cbmZ1bmN0aW9uIHdyYXBNYW5hZ2VyKCRxLCAkdGltZW91dCwgbWFuYWdlcikge1xuICB2YXIgd3JhcHBlZE1hbmFnZXIgPSBfLmNyZWF0ZShtYW5hZ2VyKTtcbiAgd3JhcHBlZE1hbmFnZXIubmV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciB3b3Jrb3JkZXIgPSB7XG4gICAgICAgIHR5cGU6ICdKb2IgT3JkZXInXG4gICAgICAsIHN0YXR1czogJ05ldydcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHdvcmtvcmRlcik7XG4gICAgfSwgMCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgcmV0dXJuIHdyYXBwZWRNYW5hZ2VyO1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlci5zeW5jJywgW3JlcXVpcmUoJ2ZoLXdmbS1zeW5jJyldKVxuLmZhY3RvcnkoJ3dvcmtvcmRlclN5bmMnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIHN5bmNTZXJ2aWNlKSB7XG4gIHN5bmNTZXJ2aWNlLmluaXQoJGZoLCBjb25maWcuc3luY09wdGlvbnMpO1xuICB2YXIgd29ya29yZGVyU3luYyA9IHt9O1xuICB3b3Jrb3JkZXJTeW5jLmNyZWF0ZU1hbmFnZXIgPSBmdW5jdGlvbihxdWVyeVBhcmFtcykge1xuICAgIGlmICh3b3Jrb3JkZXJTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiAkcS53aGVuKHdvcmtvcmRlclN5bmMubWFuYWdlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLm1hbmFnZXJQcm9taXNlID0gc3luY1NlcnZpY2UubWFuYWdlKGNvbmZpZy5kYXRhc2V0SWQsIG51bGwsIHF1ZXJ5UGFyYW1zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24obWFuYWdlcikge1xuICAgICAgICB3b3Jrb3JkZXJTeW5jLm1hbmFnZXIgPSB3cmFwTWFuYWdlcigkcSwgJHRpbWVvdXQsIG1hbmFnZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU3luYyBpcyBtYW5hZ2luZyBkYXRhc2V0OicsIGNvbmZpZy5kYXRhc2V0SWQsICd3aXRoIGZpbHRlcjogJywgcXVlcnlQYXJhbXMpO1xuICAgICAgICByZXR1cm4gd29ya29yZGVyU3luYy5tYW5hZ2VyO1xuICAgICAgfSlcbiAgICB9XG4gIH07XG4gIHdvcmtvcmRlclN5bmMucmVtb3ZlTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh3b3Jrb3JkZXJTeW5jLm1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXJTeW5jLm1hbmFnZXIuc2FmZVN0b3AoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlbGV0ZSB3b3Jrb3JkZXJTeW5jLm1hbmFnZXI7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gd29ya29yZGVyU3luYztcbn0pXG47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3dmbS53b3Jrb3JkZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ZtLndvcmtvcmRlcicsIFtcbiAgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuLCByZXF1aXJlKCcuL3N5bmMtc2VydmljZScpXG5dKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBpSG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIGFwaVBhdGg6ICcvYXBpL3dmbS93b3Jrb3JkZXInLFxuICBkYXRhc2V0SWQgOiAnd29ya29yZGVycycsXG4gIHN5bmNPcHRpb25zIDoge1xuICAgIFwic3luY19mcmVxdWVuY3lcIiA6IDUsXG4gICAgXCJzdG9yYWdlX3N0cmF0ZWd5XCI6IFwiZG9tXCIsXG4gICAgXCJkb19jb25zb2xlX2xvZ1wiOiBmYWxzZVxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG4oZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkU2V0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxuICB0cnkge1xuICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICB9XG59ICgpKVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gY2FjaGVkU2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnZDMnKVxudmFyIGMzID0gcmVxdWlyZSgnYzMnKVxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLmFuYWx5dGljcyc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYW5hbHl0aWNzJywgW1xuICAndWkucm91dGVyJyxcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLmFuYWx5dGljcycsIHtcbiAgICAgIHVybDogJy9hbmFseXRpY3MnLFxuICAgICAgZGF0YToge1xuICAgICAgICBjb2x1bW5zOiAyXG4gICAgICB9LFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2FuYWx5dGljcy9hbmFseXRpY3MudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdhbmFseXRpY3NDb250cm9sbGVyIGFzIGN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ2FuYWx5dGljc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAod29ya29yZGVycywgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya29yZGVycyA9IHdvcmtvcmRlcnM7XG4gIHNlbGYud29ya2VycyA9IHdvcmtlcnM7XG5cbiAgLy9hZGQgZmFrZSBkYXRhIGZvciBiYXIgY2hhcnRzXG4gIHNlbGYud29ya29yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgIHZhciBlc3RpbWF0ZWQgID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE1KTtcbiAgICB2YXIgcmVhbCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxNSk7XG4gICAgd29ya29yZGVyLmVzdGltYXRlZEhvdXJzID0gZXN0aW1hdGVkO1xuICAgIHdvcmtvcmRlci5lZmZlY3RpdmVIb3VycyA9IHJlYWw7XG4gIH0pO1xuXG4gIHZhciBhcmVhQ2hhcnQgPSBjMy5nZW5lcmF0ZSh7XG4gICAgYmluZHRvOiAnI2FyZWEtY2hhcnQnLFxuICAgIHNpemU6IHtcbiAgICAgIHdpZHRoOiA0NTBcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgWydkYXRhMScsIDMwMCwgMzUwLCAzMDAsIDAsIDAsIDBdLFxuICAgICAgICBbJ2RhdGEyJywgMTMwLCAxMDAsIDE0MCwgMjAwLCAxNTAsIDUwXVxuICAgICAgXSxcbiAgICB0eXBlczoge1xuICAgICAgZGF0YTE6ICdhcmVhJyxcbiAgICAgIGRhdGEyOiAnYXJlYS1zcGxpbmUnXG4gICAgfVxuICB9XG59KTtcblxufSlcblxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5hcHBmb3JtJywgWyd1aS5yb3V0ZXInXSlcblxuLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5hcHBmb3JtLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy9hcHBmb3JtLzpmb3JtSWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2FwcGZvcm0vYXBwZm9ybS50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0FwcGZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBmb3JtOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGFwcGZvcm1DbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFwcGZvcm1DbGllbnQuZ2V0Rm9ybSgkc3RhdGVQYXJhbXMuZm9ybUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmFwcGZvcm0nLCB7XG4gICAgICB1cmw6ICcvYXBwZm9ybXMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29sdW1uMjoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2FwcGZvcm0vYXBwZm9ybS1saXN0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnQXBwZm9ybUxpc3RDb250cm9sbGVyJyxcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBmb3JtczogZnVuY3Rpb24oYXBwZm9ybUNsaWVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gYXBwZm9ybUNsaWVudC5saXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59KVxuXG4uY29udHJvbGxlcignQXBwZm9ybUNvbnRyb2xsZXInLCBmdW5jdGlvbigkcSwgZm9ybSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuZm9ybSA9IGZvcm07XG59KVxuXG4uY29udHJvbGxlcignQXBwZm9ybUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24oJHEsICRzdGF0ZSwgZm9ybXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmZvcm1zID0gZm9ybXM7XG4gIHNlbGYuc2VsZWN0Rm9ybSA9IGZ1bmN0aW9uKGV2ZW50LCBmb3JtKSB7XG4gICAgc2VsZi5zZWxlY3RlZEZvcm1JZCA9IGZvcm0uX2lkO1xuICAgICRzdGF0ZS5nbygnYXBwLmFwcGZvcm0uZGV0YWlsJywge2Zvcm1JZDogZm9ybS5faWR9KTtcbiAgfTtcblxuICBzZWxmLmFwcGx5RmlsdGVyID0gZnVuY3Rpb24odGVybSkge1xuICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgc2VsZi5mb3JtcyA9IGZvcm1zLmZpbHRlcihmdW5jdGlvbihmb3JtKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGZvcm0ubmFtZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICB8fCBTdHJpbmcoZm9ybS5kZXNjcmlwdGlvbikudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pICE9PSAtMVxuICAgICAgICB8fCBTdHJpbmcoZm9ybS5faWQpLmluZGV4T2YodGVybSkgIT09IC0xO1xuICAgIH0pO1xuICB9O1xuXG5cbn0pXG5cbjtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLmFwcGZvcm0nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuYXV0aCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuYXV0aCcsIFtcbiAgJ3VpLnJvdXRlcicsXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9sb2dpbi50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCBhcyBjdHJsJyxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBoYXNTZXNzaW9uOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLnByb2ZpbGUnLCB7XG4gICAgICB1cmw6ICcvcHJvZmlsZScsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXV0aC9wcm9maWxlLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUN0cmwgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxufSlcblxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSwgdXNlckNsaWVudCwgaGFzU2Vzc2lvbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5oYXNTZXNzaW9uID0gaGFzU2Vzc2lvbjtcblxuICBzZWxmLmxvZ2luID0gZnVuY3Rpb24odmFsaWQpIHtcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHVzZXJDbGllbnQuYXV0aChzZWxmLnVzZXJuYW1lLCBzZWxmLnBhc3N3b3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICBzZWxmLmxvZ2luTWVzc2FnZXMuZXJyb3IgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZi5sb2dpbk1lc3NhZ2VzID0ge3N1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZmFsc2V9O1xuXG4gIHNlbGYubG9naW4gPSBmdW5jdGlvbih2YWxpZCkge1xuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB1c2VyQ2xpZW50LmF1dGgoc2VsZi51c2VybmFtZSwgc2VsZi5wYXNzd29yZClcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYubG9naW5NZXNzYWdlcy5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmhhc1Nlc3Npb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKGhhc1Nlc3Npb24pIHtcbiAgICAgIHNlbGYuaGFzU2Vzc2lvbiA9IGhhc1Nlc3Npb247XG4gICAgICBpZiAoJHJvb3RTY29wZS50b1N0YXRlKSB7XG4gICAgICAgICRzdGF0ZS5nbygkcm9vdFNjb3BlLnRvU3RhdGUsICRyb290U2NvcGUudG9QYXJhbXMpO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1N0YXRlO1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS50b1BhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcicpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgc2VsZi5sb2dpbk1lc3NhZ2VzLmVycm9yID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgdXNlckNsaWVudC5jbGVhclNlc3Npb24oKVxuICAgIC50aGVuKHVzZXJDbGllbnQuaGFzU2Vzc2lvbilcbiAgICAudGhlbihmdW5jdGlvbihoYXNTZXNzaW9uKSB7XG4gICAgICBzZWxmLmhhc1Nlc3Npb24gPSBoYXNTZXNzaW9uO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnIoZXJyKTtcbiAgICB9KTtcbiAgfVxufSlcblxuLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oKSB7XG59KVxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAuZmlsZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsZScsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLmZpbGUnLCB7XG4gICAgICB1cmw6ICcvZmlsZXMnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmaWxlczogZnVuY3Rpb24oZmlsZUNsaWVudCkge1xuICAgICAgICAgIHJldHVybiBmaWxlQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgd29ya2VyTWFwOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpLnRoZW4oZnVuY3Rpb24od29ya2Vycykge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmtlcnMucmVkdWNlKGZ1bmN0aW9uKG1hcCwgd29ya2VyKSB7XG4gICAgICAgICAgICAgIG1hcFt3b3JrZXIuaWRdID0gd29ya2VyO1xuICAgICAgICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29sdW1uMjoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2ZpbGUvZmlsZS1saXN0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnRmlsZUxpc3RDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9LFxuICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9maWxlL2VtcHR5LnRwbC5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5maWxlLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy9kZXRhaWwvOmZpbGVVaWQnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmaWxlOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGZpbGVzKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGVzLmZpbHRlcihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS51aWQgPT09ICRzdGF0ZVBhcmFtcy5maWxlVWlkO1xuICAgICAgICAgIH0pWzBdO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2ZpbGUvZmlsZS1kZXRhaWwudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdGaWxlQ29udHJvbGxlciBhcyBjdHJsJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTpmaWxlOnNlbGVjdGVkJywgZnVuY3Rpb24oZmlsZSkge1xuICAgICRzdGF0ZS5nbygnYXBwLmZpbGUuZGV0YWlsJywge1xuICAgICAgZmlsZVVpZDogZmlsZS51aWR9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gIH0pO1xufSlcblxuLmNvbnRyb2xsZXIoJ0ZpbGVMaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGZpbGVzLCB3b3JrZXJNYXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG4gIHNlbGYuZmlsZXMgPSBmaWxlcztcbiAgc2VsZi53b3JrZXJNYXAgPSB3b3JrZXJNYXA7XG59KVxuXG4uY29udHJvbGxlcignRmlsZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBmaWxlLCB3b3JrZXJNYXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogZmlsZS5pZH07XG4gIHNlbGYuZmlsZSA9IGZpbGU7XG4gIHNlbGYud29ya2VyTWFwID0gd29ya2VyTWFwO1xufSlcbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLmdyb3VwJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5ncm91cCcsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLmdyb3VwJywge1xuICAgICAgdXJsOiAnL2dyb3VwcycsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGdyb3VwczogZnVuY3Rpb24oZ3JvdXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB1c2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVtYmVyc2hpcDogZnVuY3Rpb24obWVtYmVyc2hpcENsaWVudCkge1xuICAgICAgICAgIHJldHVybiBtZW1iZXJzaGlwQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9ncm91cC1saXN0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnZ3JvdXBMaXN0Q29udHJvbGxlciBhcyBjdHJsJ1xuICAgICAgICB9LFxuICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLmdyb3VwLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy9ncm91cC86Z3JvdXBJZCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGdyb3VwOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGdyb3Vwcykge1xuICAgICAgICAgIHJldHVybiBncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGdyb3VwLmlkKSA9PT0gU3RyaW5nKCRzdGF0ZVBhcmFtcy5ncm91cElkKTtcbiAgICAgICAgICB9KVswXTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ncm91cC9ncm91cC1kZXRhaWwudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdncm91cERldGFpbENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAuZ3JvdXAuZWRpdCcsIHtcbiAgICAgIHVybDogJy9ncm91cC86Z3JvdXBJZC9lZGl0JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgZ3JvdXA6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgZ3JvdXBzKSB7XG4gICAgICAgICAgcmV0dXJuIGdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZ3JvdXAuaWQpID09PSBTdHJpbmcoJHN0YXRlUGFyYW1zLmdyb3VwSWQpO1xuICAgICAgICAgIH0pWzBdO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2dyb3VwL2dyb3VwLWVkaXQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdncm91cEZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC5ncm91cC5uZXcnLCB7XG4gICAgICB1cmw6ICcvbmV3JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgZ3JvdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2dyb3VwL2dyb3VwLWVkaXQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdncm91cEZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59KVxuXG4ucnVuKGZ1bmN0aW9uKCRzdGF0ZSwgbWVkaWF0b3IpIHtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06Z3JvdXA6c2VsZWN0ZWQnLCBmdW5jdGlvbihncm91cCkge1xuICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwLmRldGFpbCcsIHtcbiAgICAgIGdyb3VwSWQ6IGdyb3VwLmlkXG4gICAgfSk7XG4gIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTpncm91cDpsaXN0JywgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAkc3RhdGUuZ28oJ2FwcC5ncm91cCcsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignZ3JvdXBMaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lZGlhdG9yLCBncm91cHMpIHtcbiAgdGhpcy5ncm91cHMgPSBncm91cHM7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbn0pXG5cbi5jb250cm9sbGVyKCdncm91cERldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZywgbWVkaWF0b3IsIGdyb3VwLCB1c2VycywgbWVtYmVyc2hpcCwgZ3JvdXBDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmdyb3VwID0gZ3JvdXA7XG4gICRzY29wZS5zZWxlY3RlZC5pZCA9IGdyb3VwLmlkO1xuICB2YXIgZ3JvdXBNZW1iZXJzaGlwID0gbWVtYmVyc2hpcC5maWx0ZXIoZnVuY3Rpb24oX21lbWJlcnNoaXApIHtcbiAgICByZXR1cm4gX21lbWJlcnNoaXAuZ3JvdXAgPT0gZ3JvdXAuaWRcbiAgfSk7XG4gIHNlbGYubWVtYmVycyA9IHVzZXJzLmZpbHRlcihmdW5jdGlvbih1c2VyKSB7XG4gICAgcmV0dXJuIF8uc29tZShncm91cE1lbWJlcnNoaXAsIGZ1bmN0aW9uKF9tZW1iZXJzaGlwKSB7XG4gICAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB1c2VyLmlkO1xuICAgIH0pXG4gIH0pO1xuICBzZWxmLmRlbGV0ZSA9IGZ1bmN0aW9uKCRldmVudCwgZ3JvdXApIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZihzZWxmLm1lbWJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGFsZXJ0ID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgICAgLnRpdGxlKCdPcGVyYXRpb24gbm90IHBvc3NpYmxlJylcbiAgICAgICAgICAgIC50ZXh0Q29udGVudCgnR3JvdXAgY2FuIG5vdCBiZSBkZWxldGVkIGlmIGl0IGNvbnRhaW5zIG1lbWJlcnMuJylcbiAgICAgICAgICAgIC5vaygnT2snKVxuICAgICAgICAgICAgLnRhcmdldEV2ZW50KCRldmVudCk7XG4gICAgICAkbWREaWFsb2cuc2hvdyhhbGVydCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXG4gICAgICAgICAgICAudGl0bGUoJ1dvdWxkIHlvdSBsaWtlIHRvIGRlbGV0ZSBncm91cCAjJytncm91cC5pZCsnPycpXG4gICAgICAgICAgICAudGV4dENvbnRlbnQoZ3JvdXAubmFtZSlcbiAgICAgICAgICAgIC5hcmlhTGFiZWwoJ0RlbGV0ZSBHcm91cCcpXG4gICAgICAgICAgICAudGFyZ2V0RXZlbnQoJGV2ZW50KVxuICAgICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbCcpO1xuICAgICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZ3JvdXBDbGllbnQuZGVsZXRlKGdyb3VwKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KVxuXG4uY29udHJvbGxlcignZ3JvdXBGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc3RhdGUsICRzY29wZSwgbWVkaWF0b3IsIGdyb3VwLCBncm91cENsaWVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuZ3JvdXAgPSBncm91cDtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTpncm91cDp1cGRhdGVkJywgJHNjb3BlLCBmdW5jdGlvbihncm91cCkge1xuICAgIHJldHVybiBncm91cENsaWVudC51cGRhdGUoZ3JvdXApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmdyb3VwLmRldGFpbCcsIHtncm91cElkOiBzZWxmLmdyb3VwLmlkfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgICB9KVxuICAgIH0pO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOmdyb3VwOmNyZWF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgcmV0dXJuIGdyb3VwQ2xpZW50LmNyZWF0ZShncm91cClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oY3JlYXRlZGdyb3VwKSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZ3JvdXAuZGV0YWlsJywge2dyb3VwSWQ6IGNyZWF0ZWRncm91cC5pZH0sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn0pXG5cbjtcbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdhcHAuaG9tZScsIFsndWkucm91dGVyJ10pXG5cbi5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcbiAgICAgIHVybDogJy9ob21lJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ob21lL2hvbWUudHBsLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5ob21lJztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5yZXF1aXJlKCdmZWVkaGVucnknKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgcmVxdWlyZSgnYW5ndWxhci11aS1yb3V0ZXInKVxuLCByZXF1aXJlKCdhbmd1bGFyLW1hdGVyaWFsJylcbiwgcmVxdWlyZSgnZmgtd2ZtLW1lZGlhdG9yJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXdvcmtvcmRlcicpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1yZXN1bHQnKVxuLCByZXF1aXJlKCdmaC13Zm0tbWVzc2FnZScpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1maWxlJylcbiwgcmVxdWlyZSgnZmgtd2ZtLXdvcmtmbG93JylcbiwgcmVxdWlyZSgnZmgtd2ZtLWFwcGZvcm0nKVxuLCByZXF1aXJlKCdmaC13Zm0tdXNlcicpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1yaXNrLWFzc2Vzc21lbnQnKVxuLCByZXF1aXJlKCdmaC13Zm0tdmVoaWNsZS1pbnNwZWN0aW9uJylcbiwgcmVxdWlyZSgnZmgtd2ZtLW1hcCcpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1zY2hlZHVsZScpXG4sIHJlcXVpcmUoJ2ZoLXdmbS1hbmFseXRpY3MnKVxuLCByZXF1aXJlKCdmaC13Zm0tY2FtZXJhJylcblxuLCByZXF1aXJlKCcuL2F1dGgvYXV0aCcpXG4sIHJlcXVpcmUoJy4vd29ya29yZGVyL3dvcmtvcmRlcicpXG4sIHJlcXVpcmUoJy4vd29ya2Zsb3cvd29ya2Zsb3cnKVxuLCByZXF1aXJlKCcuL2hvbWUvaG9tZScpXG4sIHJlcXVpcmUoJy4vYXBwZm9ybS9hcHBmb3JtJylcbiwgcmVxdWlyZSgnLi93b3JrZXIvd29ya2VyJylcbiwgcmVxdWlyZSgnLi9ncm91cC9ncm91cCcpXG4sIHJlcXVpcmUoJy4vbWVzc2FnZS9tZXNzYWdlJylcbiwgcmVxdWlyZSgnLi9maWxlL2ZpbGUnKVxuLCByZXF1aXJlKCcuL3NjaGVkdWxlL3NjaGVkdWxlJylcbiwgcmVxdWlyZSgnLi9tYXAvbWFwJylcbiwgcmVxdWlyZSgnLi9hbmFseXRpY3MvYW5hbHl0aWNzJylcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvd29ya29yZGVycy9saXN0Jyk7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWFpbi50cGwuaHRtbCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDNcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtvcmRlck1hbmFnZXI6IGZ1bmN0aW9uKHdvcmtvcmRlclN5bmMpIHtcbiAgICAgICAgICByZXR1cm4gd29ya29yZGVyU3luYy5jcmVhdGVNYW5hZ2VyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtmbG93TWFuYWdlcjogZnVuY3Rpb24od29ya2Zsb3dTeW5jKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtmbG93U3luYy5jcmVhdGVNYW5hZ2VyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VNYW5hZ2VyOiBmdW5jdGlvbihtZXNzYWdlU3luYykge1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlU3luYy5jcmVhdGVNYW5hZ2VyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHByb2ZpbGVEYXRhOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQuZ2V0UHJvZmlsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRtZFNpZGVuYXYsIG1lZGlhdG9yLCBwcm9maWxlRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcm9maWxlRGF0YScsIHByb2ZpbGVEYXRhKTtcbiAgICAgICAgJHNjb3BlLnByb2ZpbGVEYXRhID0gcHJvZmlsZURhdGE7XG4gICAgICAgIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOmF1dGg6cHJvZmlsZTpjaGFuZ2UnLCBmdW5jdGlvbihfcHJvZmlsZURhdGEpIHtcbiAgICAgICAgICAkc2NvcGUucHJvZmlsZURhdGEgPSBfcHJvZmlsZURhdGE7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICAkc2NvcGUudG9nZ2xlU2lkZW5hdiA9IGZ1bmN0aW9uKGV2ZW50LCBtZW51SWQpIHtcbiAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5uYXZpZ2F0ZVRvID0gZnVuY3Rpb24oc3RhdGUsIHBhcmFtcykge1xuICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgaWYgKCRtZFNpZGVuYXYoJ2xlZnQnKS5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAkbWRTaWRlbmF2KCdsZWZ0JykuY2xvc2UoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc3RhdGUuZ28oc3RhdGUsIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59KVxuXG4ucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgJHEsIG1lZGlhdG9yLCB1c2VyQ2xpZW50KSB7XG4gIHZhciBpbml0UHJvbWlzZXMgPSBbXTtcbiAgdmFyIGluaXRMaXN0ZW5lciA9IG1lZGlhdG9yLnN1YnNjcmliZSgncHJvbWlzZTppbml0JywgZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgIGluaXRQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICB9KTtcbiAgbWVkaWF0b3IucHVibGlzaCgnaW5pdCcpO1xuICBjb25zb2xlLmxvZyhpbml0UHJvbWlzZXMubGVuZ3RoLCAnaW5pdCBwcm9taXNlcyB0byByZXNvbHZlLicpO1xuICB2YXIgYWxsID0gKGluaXRQcm9taXNlcy5sZW5ndGggPiAwKSA/ICRxLmFsbChpbml0UHJvbWlzZXMpIDogJHEud2hlbihudWxsKTtcbiAgYWxsLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgJHJvb3RTY29wZS5yZWFkeSA9IHRydWU7XG4gICAgY29uc29sZS5sb2coaW5pdFByb21pc2VzLmxlbmd0aCwgJ2luaXQgcHJvbWlzZXMgcmVzb2x2ZWQuJyk7XG4gICAgbWVkaWF0b3IucmVtb3ZlKCdwcm9taXNlOmluaXQnLCBpbml0TGlzdGVuZXIuaWQpO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihlLCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgaWYodG9TdGF0ZS5uYW1lICE9PSBcImFwcC5sb2dpblwiKXtcbiAgICAgIHVzZXJDbGllbnQuaGFzU2Vzc2lvbigpLnRoZW4oZnVuY3Rpb24oaGFzU2Vzc2lvbikge1xuICAgICAgICBpZighaGFzU2Vzc2lvbikge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkcm9vdFNjb3BlLnRvU3RhdGUgPSB0b1N0YXRlO1xuICAgICAgICAgICRyb290U2NvcGUudG9QYXJhbXMgPSB0b1BhcmFtcztcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignU3RhdGUgY2hhbmdlIGVycm9yOiAnLCBlcnJvciwge1xuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdG9TdGF0ZTogdG9TdGF0ZSxcbiAgICAgIHRvUGFyYW1zOiB0b1BhcmFtcyxcbiAgICAgIGZyb21TdGF0ZTogZnJvbVN0YXRlLFxuICAgICAgZnJvbVBhcmFtczogZnJvbVBhcmFtcyxcbiAgICAgIGVycm9yOiBlcnJvclxuICAgIH0pO1xuICAgIGlmIChlcnJvclsnZ2V0IHN0YWNrJ10pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JbJ2dldCBzdGFjayddKCkpO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAubWFwJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5tYXAnLCBbXG4gICd1aS5yb3V0ZXInLFxuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAubWFwJywge1xuICAgICAgdXJsOiAnL21hcCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNvbHVtbnM6IDJcbiAgICAgIH0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHdvcmtvcmRlcnM6IGZ1bmN0aW9uKHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICByZXR1cm4gd29ya29yZGVyTWFuYWdlci5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWFwL21hcC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21hcENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSlcbn0pXG5cbi5jb250cm9sbGVyKCdtYXBDb250cm9sbGVyJywgZnVuY3Rpb24gKCR3aW5kb3csICRkb2N1bWVudCwgJHRpbWVvdXQsIHdvcmtvcmRlcnMpIHtcbiAgdGhpcy5jZW50ZXIgPSBbNDkuMjcsIC0xMjMuMDhdO1xuICB0aGlzLndvcmtvcmRlcnMgPSB3b3Jrb3JkZXJzO1xufSlcblxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnYW5ndWxhci1tZXNzYWdlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdhcHAubWVzc2FnZSc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAubWVzc2FnZScsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgICAuc3RhdGUoJ2FwcC5tZXNzYWdlJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2VzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tZXNzYWdlL21lc3NhZ2UtbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ01lc3NhZ2VMaXN0Q29udHJvbGxlciBhcyBtZXNzYWdlTGlzdENvbnRyb2xsZXInLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBmdW5jdGlvbihtZXNzYWdlTWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZU1hbmFnZXIubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL21lc3NhZ2UvOm1lc3NhZ2VJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgbWVzc2FnZU1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLm1lc3NhZ2VJZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLm1lc3NhZ2UubmV3Jywge1xuICAgICAgdXJsOiAnL25ldycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvbWVzc2FnZS9tZXNzYWdlLW5ldy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ21lc3NhZ2VOZXdDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2VNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5uZXcoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTptZXNzYWdlOnNlbGVjdGVkJywgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICRzdGF0ZS5nbygnYXBwLm1lc3NhZ2UuZGV0YWlsJywge1xuICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlLmlkIHx8IG1lc3NhZ2UuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignTWVzc2FnZUxpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVzc2FnZXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAkc2NvcGUuJHBhcmVudC5zZWxlY3RlZCA9IHtpZDogbnVsbH07XG4gIHNlbGYubWVzc2FnZXMgPSBtZXNzYWdlcztcbn0pXG5cbi5jb250cm9sbGVyKCdtZXNzYWdlRGV0YWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lc3NhZ2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICBtZXNzYWdlLnN0YXR1cyA9IFwicmVhZFwiO1xuICAkc2NvcGUuc2VsZWN0ZWQuaWQgPSBtZXNzYWdlLmlkO1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uIChtZWRpYXRvcikge1xufSlcblxuLmNvbnRyb2xsZXIoJ21lc3NhZ2VOZXdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgbWVzc2FnZU1hbmFnZXIsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOm1lc3NhZ2U6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIG1lc3NhZ2Uuc2VuZGVyID0gJHNjb3BlLnByb2ZpbGVEYXRhO1xuICAgIHJldHVybiBtZXNzYWdlTWFuYWdlci5jcmVhdGUobWVzc2FnZSkudGhlbihmdW5jdGlvbihfbWVzc2FnZSkge1xuICAgICAgJHN0YXRlLmdvKCdhcHAubWVzc2FnZScsIHt3b3JrZXJzOiB3b3JrZXJzfSwge3JlbG9hZDogdHJ1ZX0pO1xuICAgIH0pXG4gIH0pO1xufSlcbjtcbm1vZHVsZS5leHBvcnRzID0gJ2FwcC5tZXNzYWdlJztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLnNjaGVkdWxlJztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5zY2hlZHVsZScsIFtcbiAgJ3VpLnJvdXRlcidcbiwgJ3dmbS5jb3JlLm1lZGlhdG9yJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLnNjaGVkdWxlJywge1xuICAgICAgdXJsOiAnL3NjaGVkdWxlJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya29yZGVyczogZnVuY3Rpb24od29ya29yZGVyTWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLmxpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY29sdW1uczogMlxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zY2hlZHVsZS9zY2hlZHVsZS50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ3NjaGVkdWxlQ29udHJvbGxlciBhcyBjdHJsJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbn0pXG5cbi5jb250cm9sbGVyKCdzY2hlZHVsZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAobWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtvcmRlcnMsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtvcmRlcnMgPSB3b3Jrb3JkZXJzO1xuICBzZWxmLndvcmtlcnMgPSB3b3JrZXJzO1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTpzY2hlZHVsZTp3b3Jrb3JkZXInLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICB3b3Jrb3JkZXJNYW5hZ2VyLnVwZGF0ZSh3b3Jrb3JkZXIpLnRoZW4oZnVuY3Rpb24odXBkYXRlZFdvcmtvcmRlcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnZG9uZTp3Zm06c2NoZWR1bGU6d29ya29yZGVyOicgKyB3b3Jrb3JkZXIuaWQsIHVwZGF0ZWRXb3Jrb3JkZXIpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9KTtcbiAgfSlcbn0pXG5cbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItbWVzc2FnZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnYXBwLndvcmtlcic7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAud29ya2VyJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG5dKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAud29ya2VyJywge1xuICAgICAgdXJsOiAnL3dvcmtlcnMnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgY29sdW1uMjoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtlci93b3JrZXItbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckxpc3RDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9LFxuICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZXIvZW1wdHkudHBsLmh0bWwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZXIuZGV0YWlsJywge1xuICAgICAgdXJsOiAnL3dvcmtlci86d29ya2VySWQnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3JrZXI6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgdXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50LnJlYWQoJHN0YXRlUGFyYW1zLndvcmtlcklkKTtcbiAgICAgICAgfSxcbiAgICAgICAgd29ya29yZGVyczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCB3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpLnRoZW4oZnVuY3Rpb24od29ya29yZGVycykge1xuICAgICAgICAgICAgcmV0dXJuIHdvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHdvcmtvcmRlci5hc3NpZ25lZSkgPT09IFN0cmluZygkc3RhdGVQYXJhbXMud29ya2VySWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIG1lc3NhZ2VNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VNYW5hZ2VyLmxpc3QoKS50aGVuKGZ1bmN0aW9uKG1lc3NhZ2VzKXtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlcy5maWx0ZXIoZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgIHJldHVybiBTdHJpbmcobWVzc2FnZS5yZWNlaXZlcklkKSA9PT0gU3RyaW5nKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBmaWxlczogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBmaWxlQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGVDbGllbnQubGlzdCgpLnRoZW4oZnVuY3Rpb24oZmlsZXMpe1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmZpbHRlcihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhmaWxlLm93bmVyKSA9PT0gU3RyaW5nKCRzdGF0ZVBhcmFtcy53b3JrZXJJZCk7XG4gICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG1lbWJlcnNoaXA6IGZ1bmN0aW9uKG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VwczogZnVuY3Rpb24oZ3JvdXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtlci93b3JrZXItZGV0YWlsLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya2VyRGV0YWlsQ29udHJvbGxlciBhcyBjdHJsJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZXIuZWRpdCcsIHtcbiAgICAgIHVybDogJy93b3JrZXIvOndvcmtlcklkL2VkaXQnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3JrZXI6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgdXNlckNsaWVudCkge1xuICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50LnJlYWQoJHN0YXRlUGFyYW1zLndvcmtlcklkKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ3JvdXBzOiBmdW5jdGlvbihncm91cENsaWVudCkge1xuICAgICAgICAgIHJldHVybiBncm91cENsaWVudC5saXN0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lbWJlcnNoaXA6IGZ1bmN0aW9uKG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC5saXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2VyL3dvcmtlci1lZGl0LnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya2VyRm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtlci5uZXcnLCB7XG4gICAgICB1cmw6ICcvbmV3JyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgd29ya2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VwczogZnVuY3Rpb24oZ3JvdXBDbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gZ3JvdXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBtZW1iZXJzaGlwOiBmdW5jdGlvbihtZW1iZXJzaGlwQ2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQubGlzdCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtlci93b3JrZXItZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtlckZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59KVxuXG4ucnVuKGZ1bmN0aW9uKCRzdGF0ZSwgbWVkaWF0b3IpIHtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06d29ya2VyOnNlbGVjdGVkJywgZnVuY3Rpb24od29ya2VyKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya2VyLmRldGFpbCcsIHtcbiAgICAgIHdvcmtlcklkOiB3b3JrZXIuaWRcbiAgICB9KTtcbiAgfSk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtlcjpsaXN0JywgZnVuY3Rpb24od29ya2VyKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya2VyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZXJMaXN0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG1lZGlhdG9yLCB3b3JrZXJzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcbiAgJHNjb3BlLiRwYXJlbnQuc2VsZWN0ZWQgPSB7aWQ6IG51bGx9O1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtlckRldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJG1kRGlhbG9nLCBtZWRpYXRvciwgd29ya2VyLCB3b3Jrb3JkZXJzLCBtZXNzYWdlcywgZmlsZXMsIG1lbWJlcnNoaXAsIGdyb3VwcywgdXNlckNsaWVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYud29ya2VyID0gd29ya2VyO1xuICBzZWxmLndvcmtvcmRlcnMgPSB3b3Jrb3JkZXJzO1xuICBzZWxmLm1lc3NhZ2VzID0gIG1lc3NhZ2VzO1xuICBzZWxmLmZpbGVzID0gZmlsZXM7XG4gICRzY29wZS5zZWxlY3RlZC5pZCA9IHdvcmtlci5pZDtcblxuICB2YXIgdXNlck1lbWJlcnNoaXAgPSBtZW1iZXJzaGlwLmZpbHRlcihmdW5jdGlvbihfbWVtYmVyc2hpcCkge1xuICAgIHJldHVybiBfbWVtYmVyc2hpcC51c2VyID09IHdvcmtlci5pZFxuICB9KVswXTtcbiAgaWYodXNlck1lbWJlcnNoaXApe1xuICAgIHNlbGYuZ3JvdXAgPSBncm91cHMuZmlsdGVyKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgIHJldHVybiB1c2VyTWVtYmVyc2hpcC5ncm91cCA9PSBncm91cC5pZDtcbiAgICB9KVswXTtcbiAgfVxuXG4gIHNlbGYuZGVsZXRlID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtlcikge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXG4gICAgICAgICAgLnRpdGxlKCdXb3VsZCB5b3UgbGlrZSB0byBkZWxldGUgd29ya2VyICMnK3dvcmtlci5pZCsnPycpXG4gICAgICAgICAgLnRleHRDb250ZW50KHdvcmtlci5uYW1lKVxuICAgICAgICAgIC5hcmlhTGFiZWwoJ0RlbGV0ZSBXb3JrZXInKVxuICAgICAgICAgIC50YXJnZXRFdmVudChldmVudClcbiAgICAgICAgICAub2soJ1Byb2NlZWQnKVxuICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbCcpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICB1c2VyQ2xpZW50LmRlbGV0ZSh3b3JrZXIpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2VyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH0sXG4gIHNlbGYuc2VsZWN0V29ya29yZGVyID0gZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgJHN0YXRlLmdvKFxuICAgICAgJ2FwcC53b3Jrb3JkZXIuZGV0YWlsJyxcbiAgICAgIHsgd29ya29yZGVySWQ6IHdvcmtvcmRlci5pZCB8fCB3b3Jrb3JkZXIuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSxcbiAgc2VsZi5zZWxlY3RNZXNzYWdlID0gIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAkc3RhdGUuZ28oJ2FwcC5tZXNzYWdlLmRldGFpbCcsIHtcbiAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZS5pZCB8fCBtZXNzYWdlLl9sb2NhbHVpZCB9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gIH1cblxufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtlckZvcm1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzdGF0ZSwgJHNjb3BlLCBtZWRpYXRvciwgd29ya2VyLCBncm91cHMsIG1lbWJlcnNoaXAsIHVzZXJDbGllbnQsIG1lbWJlcnNoaXBDbGllbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtlciA9IHdvcmtlcjtcbiAgc2VsZi5ncm91cHMgPSBncm91cHM7XG4gIC8vaWYgd2UgYXJlIHVwZGF0aW5nIGxldCdzIGFzc2lnbiB0aGUgZ3JvdXBcbiAgaWYod29ya2VyLmlkIHx8IHdvcmtlci5pZCA9PT0gMCkge1xuICAgIHZhciB1c2VyTWVtYmVyc2hpcCA9IG1lbWJlcnNoaXAuZmlsdGVyKGZ1bmN0aW9uKF9tZW1iZXJzaGlwKSB7XG4gICAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB3b3JrZXIuaWRcbiAgICB9KVswXTtcbiAgICBpZih1c2VyTWVtYmVyc2hpcCl7XG4gICAgICBzZWxmLndvcmtlci5ncm91cCA9IGdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICByZXR1cm4gdXNlck1lbWJlcnNoaXAuZ3JvdXAgPT0gZ3JvdXAuaWQ7XG4gICAgICB9KVswXS5pZDtcbiAgICB9XG4gIH1cblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtlcjp1cGRhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3JrZXIpIHtcbiAgICByZXR1cm4gdXNlckNsaWVudC51cGRhdGUod29ya2VyKVxuICAgICAgICAudGhlbihmdW5jdGlvbih1cGRhdGVkV29ya2VyKSB7XG4gICAgICAgICAgLy9yZXRyaWV2ZSB0aGUgZXhpc3RpbmcgbWVtYmVyc2hpcFxuICAgICAgICAgIHZhciB1c2VyTWVtYmVyc2hpcCA9IG1lbWJlcnNoaXAuZmlsdGVyKGZ1bmN0aW9uKF9tZW1iZXJzaGlwKSB7XG4gICAgICAgICAgICByZXR1cm4gX21lbWJlcnNoaXAudXNlciA9PSB3b3JrZXIuaWRcbiAgICAgICAgICB9KVswXTtcbiAgICAgICAgICBpZih1c2VyTWVtYmVyc2hpcCl7XG4gICAgICAgICAgICB1c2VyTWVtYmVyc2hpcC5ncm91cCA9IHVwZGF0ZWRXb3JrZXIuZ3JvdXA7XG4gICAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC51cGRhdGUodXNlck1lbWJlcnNoaXApXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNZW1iZXJzaGlwKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2VyLmRldGFpbCcsIHt3b3JrZXJJZDogdXBkYXRlZE1lbWJlcnNoaXAudXNlcn0sIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1lbWJlcnNoaXBDbGllbnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgZ3JvdXAgOiB1cGRhdGVkV29ya2VyLmdyb3VwLFxuICAgICAgICAgICAgICB1c2VyOiB1cGRhdGVkV29ya2VyLmlkXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChjcmVhdGVkTWVtYmVyc2hpcCkge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7d29ya2VySWQ6IGNyZWF0ZWRNZW1iZXJzaGlwLnVzZXJ9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2VyOmNyZWF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtlcikge1xuICAgIHJldHVybiB1c2VyQ2xpZW50LmNyZWF0ZSh3b3JrZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNyZWF0ZWRXb3JrZXIpIHtcbiAgICAgICAgICByZXR1cm4gbWVtYmVyc2hpcENsaWVudC5jcmVhdGUoe1xuICAgICAgICAgICAgZ3JvdXAgOiBjcmVhdGVkV29ya2VyLmdyb3VwLFxuICAgICAgICAgICAgdXNlcjogY3JlYXRlZFdvcmtlci5pZFxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNyZWF0ZWRNZW1iZXJzaGlwKSB7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtlci5kZXRhaWwnLCB7d29ya2VySWQ6IGNyZWF0ZWRNZW1iZXJzaGlwLnVzZXJ9LCB7cmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pO1xufSlcblxuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAud29ya2Zsb3cnLCBbXG4gICd1aS5yb3V0ZXInXG4sICd3Zm0uY29yZS5tZWRpYXRvcidcbiwgJ25nTWVzc2FnZXMnXG4sIHJlcXVpcmUoJ25nLXNvcnRhYmxlJylcbl0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdycsIHtcbiAgICAgIHVybDogJy93b3JrZmxvd3MvbGlzdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICBjb2x1bW4yOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctbGlzdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93TGlzdENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3dzOiBmdW5jdGlvbih3b3JrZmxvd01hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5saXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZmxvdy9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3JrZmxvdy86d29ya2Zsb3dJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctZGV0YWlsLnRwbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnV29ya2Zsb3dEZXRhaWxDb250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93OiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtmbG93SWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1zOiBmdW5jdGlvbihhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmFkZCcsIHtcbiAgICAgIHVybDogJy93b3JrZmxvd3MvJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3JrZmxvdy93b3JrZmxvdy1hZGQudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrZmxvd0FkZENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLm5ldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtmbG93LmVkaXQnLCB7XG4gICAgICB1cmw6ICcvd29ya2Zsb3cvOndvcmtmbG93SWQvZWRpdCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGVudEBhcHAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvd29ya2Zsb3cvd29ya2Zsb3ctZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93Rm9ybUNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya2Zsb3c6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgd29ya2Zsb3dNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya2Zsb3dJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3JrZmxvdy5zdGVwJywge1xuICAgICAgdXJsOiAnL3dvcmtmbG93Lzp3b3JrZmxvd0lkL3N0ZXBzLzpjb2RlL2VkaXQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtmbG93L3dvcmtmbG93LXN0ZXAtZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtmbG93U3RlcEZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtmbG93OiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgICAgICByZXR1cm4gd29ya2Zsb3dNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtmbG93SWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1zOiBmdW5jdGlvbihhcHBmb3JtQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcHBmb3JtQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3JrZmxvdzpzZWxlY3RlZCcsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJywge1xuICAgICAgd29ya2Zsb3dJZDogd29ya2Zsb3cuaWQgfHwgd29ya2Zsb3cuX2xvY2FsdWlkIH0sXG4gICAgICB7IHJlbG9hZDogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG4gIG1lZGlhdG9yLnN1YnNjcmliZSgnd2ZtOndvcmtmbG93Omxpc3QnLCBmdW5jdGlvbih3b3JrZmxvdykge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93JywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0xpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVkaWF0b3IsIHdvcmtmbG93cywgJHN0YXRlUGFyYW1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZmxvd3MgPSB3b3JrZmxvd3M7XG4gIHNlbGYuc2VsZWN0ZWRXb3JrZmxvd0lkID0gJHN0YXRlUGFyYW1zLndvcmtmbG93SWQ7XG4gICRzY29wZS4kcGFyZW50LnNlbGVjdGVkID0ge2lkOiBudWxsfTtcbiAgc2VsZi5zZWxlY3RXb3JrZmxvdyA9IGZ1bmN0aW9uKGV2ZW50LCB3b3JrZmxvdykge1xuICAgIHNlbGYuc2VsZWN0ZWRXb3JrZmxvd0lkID0gd29ya2Zsb3cuaWQ7XG4gICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgd29ya2Zsb3cpO1xuICB9O1xuXG4gIHNlbGYuYXBwbHlGaWx0ZXIgPSBmdW5jdGlvbih0ZXJtKSB7XG4gICAgdGVybSA9IHRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cy5maWx0ZXIoZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICAgIHJldHVybiBTdHJpbmcod29ya2Zsb3cudGl0bGUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSAhPT0gLTFcbiAgICAgICAgfHwgU3RyaW5nKHdvcmtmbG93LmlkKS5pbmRleE9mKHRlcm0pICE9PSAtMTtcbiAgICB9KTtcbiAgfTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0RldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtmbG93TWFuYWdlciwgd29ya29yZGVyTWFuYWdlciwgd29ya2Zsb3csIGZvcm1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgJHNjb3BlLnNlbGVjdGVkLmlkID0gd29ya2Zsb3cuaWQ7XG4gICRzY29wZS5kcmFnQ29udHJvbExpc3RlbmVycyA9IHtcbiAgICBjb250YWlubWVudDogJyNzdGVwTGlzdCcsXG4gICAgb3JkZXJDaGFuZ2VkIDogIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICAgICk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBzZWxmLndvcmtmbG93ID0gd29ya2Zsb3c7XG4gIHNlbGYuZm9ybXMgPSBmb3JtcztcbiAgc2VsZi5kZWxldGUgPSBmdW5jdGlvbihldmVudCwgd29ya2Zsb3cpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpXG4gICAgICAudGhlbihmdW5jdGlvbih3b3Jrb3JkZXJzKXtcbiAgICAgICAgdmFyIHdvcmtvcmRlciA9IHdvcmtvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKHdvcmtvcmRlcikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcod29ya29yZGVyLndvcmtmbG93SWQpID09PSBTdHJpbmcod29ya2Zsb3cuaWQpO1xuICAgICAgICB9KVxuICAgICAgICB2YXIgdGl0bGUgPSAod29ya29yZGVyLmxlbmd0aClcbiAgICAgICAgICA/IFwiV29ya2Zsb3cgaXMgdXNlZCBhdCBsZWFzdCBieSBhdCBsZWFzdCAxIHdvcmtvcmRlciwgYXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB3b3JrZmxvdyAjJ1wiK3dvcmtmbG93LmlkK1wiP1wiXG4gICAgICAgICAgOiBcIldvdWxkIHlvdSBsaWtlIHRvIGRlbGV0ZSB3b3JrZmxvdyAjXCIrd29ya2Zsb3cuaWQrXCI/XCI7XG4gICAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSh0aXRsZSlcbiAgICAgICAgICAudGV4dENvbnRlbnQod29ya2Zsb3cudGl0bGUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIHdvcmtmbG93JylcbiAgICAgICAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXG4gICAgICAgICAgLm9rKCdQcm9jZWVkJylcbiAgICAgICAgICAuY2FuY2VsKCdDYW5jZWwnKTtcbiAgICAgICAgcmV0dXJuIGNvbmZpcm07XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oY29uZmlybSkge1xuICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3coY29uZmlybSlcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtmbG93TWFuYWdlci5kZWxldGUod29ya2Zsb3cpXG4gICAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3JrZmxvdycsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgc2VsZi5kZWxldGVTdGVwID0gZnVuY3Rpb24oZXZlbnQsIHN0ZXAsIHdvcmtmbG93KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcbiAgICAgICAgICAudGl0bGUoJ1dvdWxkIHlvdSBsaWtlIHRvIGRlbGV0ZSBzdGVwIDogJysgc3RlcC5uYW1lICsnID8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudChzdGVwLm5hbWUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIHN0ZXAnKVxuICAgICAgICAgIC50YXJnZXRFdmVudChldmVudClcbiAgICAgICAgICAub2soJ1Byb2NlZWQnKVxuICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbCcpO1xuICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICB3b3JrZmxvdy5zdGVwcyA9IHdvcmtmbG93LnN0ZXBzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmNvZGUgIT09IHN0ZXAuY29kZTtcbiAgICAgIH0pO1xuICAgICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICAgICk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KVxuICAgIH0pO1xuICB9O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIudXBkYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgICAge3dvcmtmbG93SWQ6IF93b3JrZmxvdy5pZH0sXG4gICAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICAgICApO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya2Zsb3dBZGRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgbWVkaWF0b3IsIHdvcmtmbG93TWFuYWdlciwgd29ya2Zsb3cgKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi53b3JrZmxvdyA9IHdvcmtmbG93O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6Y3JlYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIuY3JlYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtmbG93OnNlbGVjdGVkJywgX3dvcmtmbG93KTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd0Zvcm1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBtZWRpYXRvciwgd29ya2Zsb3csIHdvcmtmbG93TWFuYWdlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi53b3JrZmxvdyA9IHdvcmtmbG93O1xuXG4gIG1lZGlhdG9yLnN1YnNjcmliZUZvclNjb3BlKCd3Zm06d29ya2Zsb3c6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya2Zsb3cpIHtcbiAgICB3b3JrZmxvd01hbmFnZXIudXBkYXRlKHdvcmtmbG93KS50aGVuKGZ1bmN0aW9uKF93b3JrZmxvdykge1xuICAgICAgJHN0YXRlLmdvKCdhcHAud29ya2Zsb3cuZGV0YWlsJyxcbiAgICAgIHt3b3JrZmxvd0lkOiBfd29ya2Zsb3cuaWR9LFxuICAgICAgeyByZWxvYWQ6IHRydWUgfVxuICAgICk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3JrZmxvd1N0ZXBGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBtZWRpYXRvciwgd29ya2Zsb3csIHdvcmtmbG93TWFuYWdlciwgZm9ybXMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvdztcbiAgc2VsZi5mb3JtcyA9IGZvcm1zO1xuICBzZWxmLnN0ZXAgPSB3b3JrZmxvdy5zdGVwcy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmNvZGUgPT0gJHN0YXRlUGFyYW1zLmNvZGU7XG4gIH0pWzBdO1xuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtmbG93OnVwZGF0ZWQnLCAkc2NvcGUsIGZ1bmN0aW9uKHdvcmtmbG93KSB7XG4gICAgd29ya2Zsb3dNYW5hZ2VyLnVwZGF0ZSh3b3JrZmxvdykudGhlbihmdW5jdGlvbihfd29ya2Zsb3cpIHtcbiAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtmbG93LmRldGFpbCcsXG4gICAgICB7d29ya2Zsb3dJZDogX3dvcmtmbG93LmlkfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3JrZmxvdyc7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCdhbmd1bGFyLW1lc3NhZ2VzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAud29ya29yZGVyJywgW1xuICAndWkucm91dGVyJ1xuLCAnd2ZtLmNvcmUubWVkaWF0b3InXG4sICduZ01lc3NhZ2VzJ1xuXSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcicsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXJzL2xpc3QnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICB3b3Jrb3JkZXJzOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICB3b3JrZmxvd3M6IGZ1bmN0aW9uKHdvcmtmbG93TWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiB3b3JrZmxvd01hbmFnZXIubGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHRNYW5hZ2VyOiBmdW5jdGlvbihyZXN1bHRTeW5jKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFN5bmMubWFuYWdlclByb21pc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdE1hcDogZnVuY3Rpb24ocmVzdWx0TWFuYWdlcikge1xuICAgICAgICAgIHJldHVybiByZXN1bHRNYW5hZ2VyLmxpc3QoKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgbWFwW3Jlc3VsdC53b3Jrb3JkZXJJZF0gPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbHVtbjI6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLWxpc3QudHBsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3Jrb3JkZXJMaXN0Q29udHJvbGxlciBhcyB3b3Jrb3JkZXJMaXN0Q29udHJvbGxlcicsXG4gICAgICAgIH0sXG4gICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci9lbXB0eS50cGwuaHRtbCcsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlci5uZXcnLCB7XG4gICAgICB1cmw6ICcvbmV3JyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLW5ldy50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlck5ld0NvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya29yZGVyOiBmdW5jdGlvbih3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLm5ldygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdvcmtlcnM6IGZ1bmN0aW9uKHVzZXJDbGllbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVzZXJDbGllbnQubGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdhcHAud29ya29yZGVyLmRldGFpbCcsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXIvOndvcmtvcmRlcklkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250ZW50QGFwcCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC93b3Jrb3JkZXIvd29ya29yZGVyLWRldGFpbC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlckRldGFpbENvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgd29ya29yZGVyOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIGFwcGZvcm1DbGllbnQsIHdvcmtvcmRlck1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIucmVhZCgkc3RhdGVQYXJhbXMud29ya29yZGVySWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya2VyczogZnVuY3Rpb24odXNlckNsaWVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gdXNlckNsaWVudC5saXN0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdWx0OiBmdW5jdGlvbih3b3Jrb3JkZXIsIHJlc3VsdE1hcCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0TWFwW3dvcmtvcmRlci5pZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXIuZWRpdCcsIHtcbiAgICAgIHVybDogJy93b3Jrb3JkZXIvOndvcmtvcmRlcklkL2VkaXQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3dvcmtvcmRlci93b3Jrb3JkZXItZWRpdC50cGwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtvcmRlckZvcm1Db250cm9sbGVyIGFzIGN0cmwnLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHdvcmtvcmRlcjogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCB3b3Jrb3JkZXJNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLnJlYWQoJHN0YXRlUGFyYW1zLndvcmtvcmRlcklkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3b3JrZXJzOiBmdW5jdGlvbih1c2VyQ2xpZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB1c2VyQ2xpZW50Lmxpc3QoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uKHdvcmtvcmRlciwgcmVzdWx0TWFwKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRNYXBbd29ya29yZGVyLmlkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24oJHN0YXRlLCBtZWRpYXRvcikge1xuICBtZWRpYXRvci5zdWJzY3JpYmUoJ3dmbTp3b3Jrb3JkZXI6c2VsZWN0ZWQnLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICAkc3RhdGUuZ28oXG4gICAgICAnYXBwLndvcmtvcmRlci5kZXRhaWwnLFxuICAgICAgeyB3b3Jrb3JkZXJJZDogd29ya29yZGVyLmlkIHx8IHdvcmtvcmRlci5fbG9jYWx1aWQgfSxcbiAgICAgIHsgcmVsb2FkOiB0cnVlIH1cbiAgICApO1xuICB9KTtcbiAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd3Zm06d29ya29yZGVyOmxpc3QnLCBmdW5jdGlvbih3b3JrZmxvdykge1xuICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcicsIG51bGwsIHtyZWxvYWQ6IHRydWV9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignV29ya29yZGVyTGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB3b3Jrb3JkZXJzLCByZXN1bHRNYXApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLndvcmtvcmRlcnMgPSB3b3Jrb3JkZXJzO1xuICBzZWxmLnJlc3VsdE1hcCA9IHJlc3VsdE1hcDtcbiAgJHNjb3BlLiRwYXJlbnQuc2VsZWN0ZWQgPSB7aWQ6IG51bGx9O1xufSlcblxuLmNvbnRyb2xsZXIoJ1dvcmtvcmRlckRldGFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRtZERpYWxvZywgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtmbG93TWFuYWdlciwgd29ya2Zsb3dzLCB3b3Jrb3JkZXIsIHJlc3VsdCwgd29ya2Vycykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICRzY29wZS5zZWxlY3RlZC5pZCA9IHdvcmtvcmRlci5pZDtcblxuICBzZWxmLndvcmtvcmRlciA9IHdvcmtvcmRlcjtcbiAgdmFyIHdvcmtmbG93ID0gd29ya2Zsb3dzLmZpbHRlcihmdW5jdGlvbih3b3JrZmxvdykge1xuICAgIHJldHVybiBTdHJpbmcod29ya2Zsb3cuaWQpID09PSBTdHJpbmcod29ya29yZGVyLndvcmtmbG93SWQpO1xuICB9KTtcbiAgaWYgKHdvcmtmbG93Lmxlbmd0aCkge1xuICAgIHNlbGYud29ya2Zsb3cgPSB3b3JrZmxvd1swXTtcbiAgfVxuICBzZWxmLnJlc3VsdCA9IHJlc3VsdDtcbiAgdmFyIGFzc2lnbmVlID0gd29ya2Vycy5maWx0ZXIoZnVuY3Rpb24od29ya2VyKSB7XG4gICAgcmV0dXJuIFN0cmluZyh3b3JrZXIuaWQpID09PSBTdHJpbmcod29ya29yZGVyLmFzc2lnbmVlKTtcbiAgfSlcbiAgaWYgKGFzc2lnbmVlLmxlbmd0aCkge1xuICAgIHNlbGYuYXNzaWduZWUgPSBhc3NpZ25lZVswXTtcbiAgfVxuXG4gIHZhciBuZXh0U3RlcEluZGV4ID0gd29ya2Zsb3dNYW5hZ2VyLm5leHRTdGVwSW5kZXgoc2VsZi53b3JrZmxvdy5zdGVwcywgc2VsZi5yZXN1bHQpO1xuICB2YXIgbnVtU3RlcHMgPSBzZWxmLndvcmtmbG93LnN0ZXBzLmxlbmd0aDtcbiAgc2VsZi5wcm9ncmVzcyA9ICgxMDAgKiAobmV4dFN0ZXBJbmRleCArIDEpIC8gbnVtU3RlcHMpLnRvUHJlY2lzaW9uKDMpO1xuICBjb25zb2xlLmxvZyhuZXh0U3RlcEluZGV4LCBudW1TdGVwcywgc2VsZi5wcm9ncmVzcyk7XG5cbiAgc2VsZi5iZWdpbldvcmtmbG93ID0gZnVuY3Rpb24oZXZlbnQsIHdvcmtvcmRlcikge1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3dmbTp3b3JrZmxvdzpiZWdpbicsIHdvcmtvcmRlci5pZCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICBzZWxmLmRlbGV0ZSA9IGZ1bmN0aW9uKGV2ZW50LCB3b3Jrb3JkZXIpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxuICAgICAgICAgIC50aXRsZSgnV291bGQgeW91IGxpa2UgdG8gZGVsZXRlIHdvcmtvcmRlciAjJyt3b3Jrb3JkZXIuaWQrJz8nKVxuICAgICAgICAgIC50ZXh0Q29udGVudCh3b3Jrb3JkZXIudGl0bGUpXG4gICAgICAgICAgLmFyaWFMYWJlbCgnRGVsZXRlIFdvcmtvcmRlcicpXG4gICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxuICAgICAgICAgIC5vaygnUHJvY2VlZCcpXG4gICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsJyk7XG4gICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB3b3Jrb3JkZXJNYW5hZ2VyLmRlbGV0ZSh3b3Jrb3JkZXIpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVyJywgbnVsbCwge3JlbG9hZDogdHJ1ZX0pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cbn0pXG5cbi5jb250cm9sbGVyKCdXb3Jrb3JkZXJOZXdDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCB3b3Jrb3JkZXIsIHdvcmtmbG93cywgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtlcnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya29yZGVyID0gd29ya29yZGVyO1xuICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcblxuICBtZWRpYXRvci5zdWJzY3JpYmVGb3JTY29wZSgnd2ZtOndvcmtvcmRlcjpjcmVhdGVkJywgJHNjb3BlLCBmdW5jdGlvbih3b3Jrb3JkZXIpIHtcbiAgICB3b3Jrb3JkZXJNYW5hZ2VyLmNyZWF0ZSh3b3Jrb3JkZXIpLnRoZW4oZnVuY3Rpb24oX3dvcmtvcmRlcikge1xuICAgICAgbWVkaWF0b3IucHVibGlzaCgnd2ZtOndvcmtvcmRlcjpzZWxlY3RlZCcsIF93b3Jrb3JkZXIpO1xuICAgIH0pO1xuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdXb3Jrb3JkZXJGb3JtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgbWVkaWF0b3IsIHdvcmtvcmRlck1hbmFnZXIsIHdvcmtvcmRlciwgd29ya2Zsb3dzLCB3b3JrZXJzLCByZXN1bHQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYud29ya29yZGVyID0gd29ya29yZGVyO1xuICBzZWxmLndvcmtmbG93cyA9IHdvcmtmbG93cztcbiAgc2VsZi53b3JrZXJzID0gd29ya2VycztcbiAgc2VsZi5yZXN1bHQgPSByZXN1bHQ7XG5cbiAgbWVkaWF0b3Iuc3Vic2NyaWJlRm9yU2NvcGUoJ3dmbTp3b3Jrb3JkZXI6dXBkYXRlZCcsICRzY29wZSwgZnVuY3Rpb24od29ya29yZGVyKSB7XG4gICAgcmV0dXJuIHdvcmtvcmRlck1hbmFnZXIudXBkYXRlKHdvcmtvcmRlcikudGhlbihmdW5jdGlvbihfd29ya29yZGVyKSB7XG4gICAgICBtZWRpYXRvci5wdWJsaXNoKCd3Zm06d29ya29yZGVyOnNlbGVjdGVkJywgX3dvcmtvcmRlcik7XG4gICAgfSlcbiAgfSk7XG59KVxuXG47XG5cbm1vZHVsZS5leHBvcnRzID0gJ2FwcC53b3Jrb3JkZXInO1xuIl19
