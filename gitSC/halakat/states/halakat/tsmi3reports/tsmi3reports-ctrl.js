var tsmi3reportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices',
    function ($scope, $state, $modal, $templateCache, studentServices) {

    $scope.vars = { ringStudents: [] };
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.dates = { fromDate: '', toDate: '', index: 1 };
    $scope.studentId = "";
    
    $scope.$parent.vars.titleTxt = 'تقرير التسميع';

    $scope.getReport = function () {
        var fromDate = $scope.dates.fromDate.split('/');
        var x = $.calendars.newDate(fromDate[2], fromDate[1], fromDate[0], "Islamic", "ar");
        var y = x.toJSDate();
        d = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear();

        var toDate = $scope.dates.toDate.split('/');
        var x = $.calendars.newDate(toDate[2], toDate[1], toDate[0], "Islamic", "ar");
        var y = x.toJSDate();
        d1 = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear();

        studentServices.getStudentSavingPlansReport($scope.studentId, d, $scope.dates.toDate, function (data) {
            console.log(data);
        }, function (error) {
            console.log(error)
        })
    }

    $scope.opendate = function (index, dates) {
        $scope.dates.index = index;
        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', 'dates',
                function ($scope, $modalInstance, dates) {

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
                            $scope.getRange(1, ($scope.picker.currentMonth + 1)) :
                        $scope.getRange($scope.picker.currentMonth, 13);

                    }

                    $scope.getDays = function (selY, selM) {
                        $scope.days =
                          $scope.getRange(1, $scope.picker.getDaysInMonth(selY, selM));
                        if (selY == $scope.picker.currentYear && selM == $scope.picker.currentMonth) {
                            $scope.days =
                          $scope.getRange(1, ($scope.picker.currentDay + 1));
                        }
                    }
                    $scope.ok = function () {
                        console.log($scope.modalVars)
                        if (dates.index == 1) {
                            dates.fromDate = $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedY;
                        }
                        else {
                            dates.toDate = $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedY;
                        }
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
            resolve: {
                dates: function () {
                    return $scope.dates;
                }
            }
        });

        modalInstance.result.then(function () {
            if ($scope.dates.fromDate != '' && $scope.dates.toDate != '' && $scope.studentId != '') {
                $scope.getReport();
            }
        }, function () {
            if ($scope.dates.fromDate != '' && $scope.dates.toDate != '' && $scope.studentId != '') {
                $scope.getReport();
            }
        })
    };

    $scope.getStudentsByRingId = function (ringId) {
        studentServices.getAllStudentByRingId(ringId,
            function (data) {
                $scope.vars.ringStudents = data;
                $scope.studentId = $scope.vars.ringStudents[0].Id;
            },
            function (err) {
                console.log(err);
            })
    };
    $scope.getStudentsByRingId($scope.selectedRing.ID);


}];