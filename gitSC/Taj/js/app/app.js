// create the module and name it scotchApp
var tajApp = angular.module('tajApp', ['ngRoute', 'ui.bootstrap', 'hammer', 'tajApp.services', 'bgimageApp']);

// configure our routes
tajApp.config(function ($routeProvider) {
    $routeProvider

     //route for the home page
    .when('/', {
        templateUrl: 'pages/home/home.html',
        controller: 'homeController'
    })
    .when('/search', {
        templateUrl: 'pages/search/search.html',
        controller: 'searchController'
    })
    .when('/branch/:branchId', {
        templateUrl: 'pages/branch/branch.html',
        controller: 'branchController'
    })
    .when('/section?myParam1&myParam2', {
        templateUrl: 'pages/section/section.html',
        controller: 'sectionController'
    })

    .otherwise({
        redirectTo: '/'
    })
})

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

.run(function (CordovaService) {
    FastClick.attach(document.body);
})

.controller('mainController', function ($scope, $location, CordovaService, mainServices) {
    
    
    mainServices.getCategoryList(655);
    mainServices.getUpdatedcategorycount(null);
    mainServices.getUpdatedcategorycount(1400760840);
    mainServices.getUpdatedcategories(null, 100);
    mainServices.getUpdatedcategories(1400760840, 0);
    mainServices.getContentTypes();
    mainServices.getUpdatedcategories(32, 2);
    mainServices.getFullContent(841);

    $scope.branches = [];
    mainServices.getCategoryList(null, function (data) {
        var arr = [];
        for (var x in data) {
            arr.push(data[x]);
        }
        $scope.branches = arr;
    });

    CordovaService.ready.then(function () {
        Notification.alert('cordova ready', function () { }, 'Alert', 'OK');
        document.addEventListener("menubutton", function () { alert('menu button clicked'); }, false);
    });

    console.log('+_');
    $scope.menuOpened = false;


    $scope.menuHidden = false;
    $scope.searchHidden = false;


    $scope.openMenu = function () {
        console.log($scope.menuOpened);
        $scope.menuOpened = !$scope.menuOpened;
    }

    $scope.closeMenu = function () {
        if ($scope.menuOpened == true) $scope.menuOpened = false;
    }

    $scope.go = function (path) {
        $location.path(path);
    }
})

.controller('homeController', function ($scope, mainServices) {
    $scope.$parent.menuOpened = false;
    $scope.$parent.menuHidden = false;
    $scope.$parent.searchHidden = false;
    
    $scope.branches = [];
    mainServices.getCategoryList(null, function (data) {
        var arr = [];
        for (var x in data) {
            arr.push(data[x]);
        }
        $scope.branches = arr;
    });
})

.controller('searchController', function ($scope) {
    $scope.$parent.menuOpened = false;
    $scope.$parent.menuHidden = true;
    $scope.$parent.searchHidden = true;
})

.controller('branchController', function ($scope) {
    $scope.$parent.menuOpened = false;
    $scope.$parent.menuHidden = false;
    $scope.$parent.searchHidden = false;

    /* start */
    //for debug
    window.scope = $scope;
    $scope.oneAtATime = true;

    $scope.groups = [
    {
        title: "Dynamic Group Header - 1",
        content: "Dynamic Group Body - 1",
        subtree: [{
            title: "subDynamic Group Header - 1",
            content: "subDynamic Group Body - 2",
        }, {
            title: "subDynamic Group Header - 2",
            content: "Dynamic Group Body - 2",
        },
        {
            title: "subDynamic Group Header - 3",
            content: "Dynamic Group Body - 2",
        }]
    },
      {
          title: "Dynamic Group Header - 2",
          content: "Dynamic Group Body - 2",
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];


    $scope.vars = { dhTraslate: 0 };


    $scope.left = function ($index) {
        console.log('left', Math.abs($scope.vars.dhTraslate));
        var tt = "caresoule" + $index;
        var width = document.getElementById(tt).clientWidth;
        if (Math.abs($scope.vars.dhTraslate) > 2) {
            $scope.vars.dhTraslate += width / 5;
        }
    };

    $scope.right = function ($index) {
        var tt = "caresoule" + $index;
        var width = document.getElementById(tt).clientWidth;
        if (Math.abs($scope.vars.dhTraslate) < width) {
            $scope.vars.dhTraslate -= width / 5;
        }
    };

    $scope.handleGesture = function (ev, i) {
        switch (ev.type) {
            case 'swipeleft':
                $scope.right(i);
                ev.gesture.stopDetect();
                break;
            case 'swiperight':
                $scope.left(i);
                ev.gesture.stopDetect();
                break;
            case 'dragright':
                console.log(ev.gesture.deltaX);
                if (Math.abs(ev.gesture.deltaX) > 5) {
                    $scope.left(i);
                }
                break;
            case 'dragleft':
                console.log(ev.gesture.deltaX);

                if (Math.abs(ev.gesture.deltaX) > 5) {
                    $scope.right(i);
                }
                break;
        }

    };


    $scope.style = function () {
        return {
            "-webkit-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-moz-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-ms-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-o-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
        };
    };

    /* end */

})

.controller('sectionController', function ($scope) {
    $scope.$parent.menuOpened = false;
    $scope.$parent.menuHidden = false;
    $scope.$parent.searchHidden = false;

    $scope.activeSec = 'books';
    $scope.setActiveSec = function (secName) { $scope.activeSec = secName }

    /**/
    $scope.vars = { dhTraslate: 0 };


    $scope.left = function () {
        var tt = "caresoule" ;
        var width = document.getElementById(tt).clientWidth;
        if (Math.abs($scope.vars.dhTraslate) > 2) {
            $scope.vars.dhTraslate += width / 5;
        }
    };

    $scope.right = function () {
        var tt = "caresoule" ;
        var width = document.getElementById(tt).clientWidth;
        if (Math.abs($scope.vars.dhTraslate) < width) {
            $scope.vars.dhTraslate -= width / 5;
        }
    };

    $scope.handleGesture = function (ev) {
        switch (ev.type) {
            case 'swipeleft':
                $scope.right();
                ev.gesture.stopDetect();
                break;
            case 'swiperight':
                $scope.left();
                ev.gesture.stopDetect();
                break;
            case 'dragright':
                console.log(ev.gesture.deltaX);
                if (Math.abs(ev.gesture.deltaX) > 5) {
                    $scope.left();
                }
                break;
            case 'dragleft':
                console.log(ev.gesture.deltaX);

                if (Math.abs(ev.gesture.deltaX) > 5) {
                    $scope.right();
                }
                break;
        }

    };


    $scope.style = function () {
        return {
            "-webkit-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-moz-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-ms-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "-o-transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
            "transform": "translate3d(" + $scope.vars.dhTraslate + "px, 0, 0)",
        };
    };

    $scope.alert = function(){alert()}
    /**/
})