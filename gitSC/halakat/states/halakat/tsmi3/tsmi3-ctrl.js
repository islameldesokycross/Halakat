var tsmi3Ctrl = ['$scope', '$state', function ($scope, $state) {

    $scope.vars = {};
    $scope.funs = {};

    $scope.$parent.vars.titleTxt = 'التسميع';

    $scope.opendate = function (size) {

        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {


                $scope.modalVars = {
                    selectedD: 0,
                    selectedM: 0,
                    selectedY: 0
                };


                $scope.getRange = function (n, m) {
                    return _.range(n, m);
                }

                $scope.picker = {};
                $scope.picker.currentDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");
                $scope.picker.currentYear = $scope.picker.currentDate._year;
                $scope.picker.currentMonth = $scope.picker.currentDate._month;
                $scope.picker.currentDay = $scope.picker.currentDate._day;
                $scope.picker.monthCount = 12;
                $scope.picker.remainingMonths = 12 - $scope.picker.currentMonth;
                $scope.picker.getRemainMonths = function (curM) {
                    return 12 - curM;
                }
                $scope.picker.getDaysInMonth = function (y, m) {
                    var xDate = $.calendars.newDate(y, m, 1, "Islamic", "ar");
                    return xDate.daysInMonth();
                }
                $scope.picker.getRemainDaysInMonth = function (y, m, curD) {
                    var DIM = $scope.picker.getDaysInMonth(y, m);
                    return DIM - curD;
                }

                $scope.monthes = [];
                $scope.days = [];

                $scope.getMonths = function (selY) {
                    //var monthes = [];
                    $scope.monthes = (selY == $scope.picker.currentYear) ?
                        $scope.getRange($scope.picker.currentMonth, 13)
                      : $scope.getRange(1, 13);

                }

                $scope.getDays = function (selY, selM) {
                    $scope.days =
                      //  (selM == $scope.picker.currentMonth) ?
                      //  $scope.getRange($scope.picker.currentDay, $scope.picker.getDaysInMonth(selY, selM) + 1)
                      //:
                      $scope.getRange(1, $scope.picker.getDaysInMonth(selY, selM));

                    alert($scope.modalVars.selectedD + $scope.modalVars.selectedM + $scope.modalVars.selectedY);
                }


                $scope.ok = function () {

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

}];