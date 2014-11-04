// create the module and name it scotchApp
var halakatApp = angular.module('halakatApp', ['ui.router', 'ui.bootstrap', 'hammer', 'halakat.services',
    'ngAnimate', 'angular-carousel','angularSpinner']);


// configure our routes
halakatApp.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/login');


    $urlRouterProvider.otherwise("/login");

    var out = {
        name: 'out',
        url: '/',
        templateUrl: 'states/out/out-temp.html',
        controller: outCtrl
        //,
        //abstract: true
    },
        welcome = {
            name: 'welcome',
            url: 'welcome',
            templateUrl: 'states/out/welcome/welcome-temp.html',
            controller: welcomeCtrl,
            parent: out
        },
        login = {
            name: 'login',
            url: 'login',
            templateUrl: 'states/out/login/login-temp.html',
            controller: loginCtrl,
            parent: out
        },
        signup = {
            name: 'signup',
            url: 'signup',
            templateUrl: 'states/out/signup/signup-temp.html',
            controller: signupCtrl,
            parent: out
        },
        home = {
            name: 'home',
            url: '/home',
            templateUrl: 'states/home/home-temp.html',
            controller: homeCtrl
        },
        halakat = {
            name: 'halakat',
            url: '',
            templateUrl: 'states/halakat/halakat-temp.html',
            controller: halakatCtrl
        },
        tsmi3 = {
            name: 'tsmi3',
            url: '/tsmi3',
            templateUrl: 'states/halakat/tsmi3/tsmi3-temp.html',
            controller: tsmi3Ctrl,
            parent: halakat
        },
        tsmi3reports = {
            name: 'tsmi3reports',
            url: '/tsmi3reports',
            templateUrl: 'states/halakat/tsmi3reports/tsmi3reports-temp.html',
            controller: tsmi3reportsCtrl,
            parent: halakat
        },
        plans = {
            name: 'plans',
            url: '/plans',
            templateUrl: 'states/halakat/plans/plans-temp.html',
            controller: plansCtrl,
            parent: halakat
        },
        data = {
            name: 'data',
            url: '/data',
            templateUrl: 'states/halakat/data/data-temp.html',
            controller: dataCtrl,
            parent: halakat
        },
        attend = {
            name: 'attend',
            url: '/attend',
            templateUrl: 'states/halakat/attend/attend-temp.html',
            controller: attendCtrl,
            parent: halakat
        },
        attendreports = {
            name: 'attendreports',
            url: '/attendreports',
            templateUrl: 'states/halakat/attendreports/attendreports-temp.html',
            controller: attendreportsCtrl,
            parent: halakat
        },
        contactus = {
            name: 'contactus',
            url: '/contactus',
            templateUrl: 'states/halakat/contactus/contactus-temp.html',
            controller: contactUsCtrl,
            parent: halakat
        },
        aboutus = {
            name: 'aboutus',
            url: '/aboutus',
            templateUrl: 'states/halakat/aboutus/aboutus-temp.html',
            controller: abouusCtrl,
            parent: halakat
        },        
        elmoshaf = {
            name: 'elmoshaf',
            url: '/elmoshaf',
            templateUrl: 'states/halakat/elmoshaf/elmoshaf-temp.html',
            controller: elmoshafCtrl,
            parent: halakat
        };


    $stateProvider.state(out);
    $stateProvider.state(welcome);
    $stateProvider.state(login);
    $stateProvider.state(signup);


    $stateProvider.state(home);


    $stateProvider.state(halakat);
    $stateProvider.state(tsmi3);
    $stateProvider.state(tsmi3reports);
    $stateProvider.state(plans);
    $stateProvider.state(data);
    $stateProvider.state(attend);
    $stateProvider.state(attendreports);
    $stateProvider.state(contactus);
    $stateProvider.state(aboutus);
    $stateProvider.state(elmoshaf);

}])

.controller('mainController', ['$scope', '$location', 'CordovaService', '$modal', function ($scope, $location, CordovaService, $modal) {

    window.main = $scope;
    $scope.radioModel = "0";
    $scope.radio1Model = "0";
    $scope.radioModel1 = "0";
    $scope.radioModel2 = "0";

    $scope.openaddnote = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'addnote.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {



                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {

            }
        });
    };

    $scope.opennoteview = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'noteview.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {



                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {

            }
        });
    };

    

    $scope.opentasme3 = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'tasme3.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {



                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {

            }
        });
    };
}])

.run(['$rootScope', 'CordovaService', '$state', '$templateCache', function ($rootScope, CordovaService, $state, $templateCache) {
    FastClick.attach(document.body);
    $rootScope.previousState = {};
    $rootScope.currState = {};

    $templateCache.put('date.html',
        '<div class="modal-header greeny">' +
            '<h3 class="modal-title">أختر التاريخ</h3>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="datecontaner"><select class="datedropdown" ng-click="checkDays()" ng-model="modalVars.selectedD">' +
                '<option value="0" disabled selected>اليوم</option> ' +
                '<option ng-repeat="n in days" value="{{n}}">{{n}}</option>' +
            '</select>'+
            '</div>'+
            '<div class="datecontaner middle"><select class="datedropdown" ng-click="checkMonthes()" ng-model="modalVars.selectedM" ng-change="getDays(modalVars.selectedY, modalVars.selectedM)">' +
                '<option value="0" disabled selected>الشهر</option>' +
                '<option  ng-repeat="n in monthes" value="{{n}}">{{n}}</option>' +
            '</select>'+
            '</div>'+
            '<div class="datecontaner"><select class="datedropdown"  ng-model="modalVars.selectedY" ng-change="getMonths(modalVars.selectedY)">' +
                '<option  value="0" disabled selected>السنة</option>' +
                '<option ng-repeat="n in getRange(picker.currentYear - 1, picker.currentYear + 1)" value="{{n}}">{{n}}</option>' +
            '</select>'+
            '</div>'+ 
        '</div>' +
        '<div class="modal-footer">' +
            '<button class="btn smallbtn modal-btn modal-btn-greeny bggreeny whitey" style="margin-left:5px !important" ng-click="ok()">حفظ</button>' +
            '<button class="btn smallbtn modal-btn modal-btn-redy bgredy whitey" ng-click="cancel()">إلغاء</button>' +
        '</div>');


    $rootScope.$on("$stateChangeStart", function (event, curr, currParams, prev, prevParams) {

    });


    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {



        // store previous state in $rootScope
        $rootScope.previousState.name = fromState.name;
        $rootScope.previousState.params = fromParams;

        // store current state in $rootScope
        $rootScope.currState.name = toState.name;
        $rootScope.currState.params = toParams;


    })

    //back button function called from back button's ng-click="back()"
    $rootScope.back2PreState = function () {
        $state.go($rootScope.previousState_name, $rootScope.previousState_params);
    };
}])

.service('CordovaService', ['$document', '$q',
  function ($document, $q) {

      var d = $q.defer(),
          resolved = false;

      var self = this;
      this.ready = d.promise;

      document.addEventListener('deviceready', function () {
          resolved = true;
          d.resolve(window.cordova);
      });

      setTimeout(function () {
          if (!resolved) {
              if (window.cordova) d.resolve(window.cordova);
          }
      }, 3000);
  }])

.factory('Notification', function ($q, $window, CordovaService) {
    return {
        alert: function (message, alertCallback, title, buttonName) {
            CordovaService.ready().then(function () {
                $window.navigator.notification.alert(message, alertCallback, title, buttonName);
            });
        }
    };
})




