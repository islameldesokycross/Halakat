var homeCtrl = ['$scope', '$state', 'ringServices', function ($scope, $state, ringServices) {

    window.home = $scope;
    $scope.vars = { rings: [],myRing:{Name:"إختر حلقتك"} };
    $scope.funs = {};
    $scope.$parent.$parent.selectedRing = null;
    $scope.getAllRings = function() {
        ringServices.getAll(
            function(data) {
                if (typeof (data) != "undefined") {
                    $scope.vars.rings = data;
                    $scope.vars.myRing = $scope.vars.rings[0];
                    $scope.$parent.$parent.selectedRing = $scope.vars.myRing;
                } else {
                    alert("خطأ أثناء استرجاع الحلقات من فضلك تحقق من الانترنت واضغط ok")
                    $scope.getAllRings()
                }
                
            },
            function(err) {
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

    

}];