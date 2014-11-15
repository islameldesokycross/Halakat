var homeCtrl = ['$scope', '$state', 'ringServices', '$rootScope',
    function ($scope, $state, ringServices, $rootScope) {

    window.home = $scope;
    $scope.vars = { rings: [], myRing: { Name: "إختر حلقتك" },mosques: [], myMosq: {Name: "اختر مسجدك"}};
    $scope.funs = {};
    $scope.$parent.$parent.selectedRing = null;
    $scope.getRings = true;
    
    $scope.getAllRings = function () {
        ringServices.getAllRingsByTeacherId($scope.userId,
        //ringServices.getAll(
            function (data) {
                $scope.getRings = false;
                if (typeof (data) != "undefined") {
                    $scope.vars.rings = data;
                    var id=localStorage.getItem('selectedRing');
                    if (id) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].ID == id) {
                                $scope.vars.myRing = data[i];
                                break;
                            }
                        }
                    }
                    else {
                        $scope.vars.myRing = $scope.vars.rings[0];
                        localStorage.setItem('selectedRing', $scope.vars.myRing.ID)
                        }
                    $scope.$parent.$parent.selectedRing = $scope.vars.myRing;
                   } else {
                    alert("خطأ أثناء استرجاع الحلقات من فضلك تحقق من الانترنت واضغط ok")
                    $scope.getAllRings()
                }

            },
            function(err) {
                $scope.getRings = false;
                console.log(err)

            });
    };

    $scope.getAllRings();

    $scope.funs.goto = function (s, sParams) {
        if (s == "aboutus" || s == "contactus" || s == "data") {
        $state.transitionTo(s, sParams);
        } else {
            if ($scope.selectedRing != null) {
                $state.transitionTo(s, sParams);
            } else {
                alert("عليك اخيار الحلقة اولا")
            }
    }
    };

    $scope.selectAction = function () {
        $scope.$parent.$parent.selectedRing = $scope.vars.myRing;
        localStorage.setItem('selectedRing', $scope.vars.myRing.ID)
        }
}];