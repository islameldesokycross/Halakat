var tsmi3reportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices',
    function ($scope, $state, $modal, $templateCache, studentServices) {

    $scope.vars = { ringStudents: [] };
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.dates = { fromDate: '', toDate: '', index: 1 };
    $scope.studentId = "";
    $scope.reports = [];
    $scope.getting = true;
    $scope.radioModel = '0';
    $scope.dayDifference = 0;

    $scope.$parent.vars.titleTxt = 'تقرير التسميع';

    var todaysHijriDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar")
    , todaysDate = new Date()
    , fromMonthDate = new Date(new Date().setDate(new Date().getDate() - 30));

    $scope.getReport = function (flag) {
        if (flag == true) {
            $scope.radioModel = "1";
        }
        if (flag) {
            var d = (fromMonthDate.getMonth() + 1) + '/' + fromMonthDate.getDate() + '/' + fromMonthDate.getFullYear();
            var d1 = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();
        }
        else {
            var fromDate = $scope.dates.fromDate.split('/');
            var x = $.calendars.newDate(parseInt(fromDate[2]), parseInt(fromDate[1]), parseInt(fromDate[0]), "Islamic", "ar");
            var y = x.toJSDate();
            d = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear();

            var toDate = $scope.dates.toDate.split('/');
            var x = $.calendars.newDate(parseInt(toDate[2]), parseInt(toDate[1]), parseInt(toDate[0]), "Islamic", "ar");
            var y = x.toJSDate();
            d1 = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear();
        }
        $scope.dayDifference = $scope.daysBetween(new Date(d), new Date(d1));
        $scope.getting = true;
        studentServices.getStudentSavingPlansReport(
            $scope.studentId, d, d1, function (data) {
                $scope.getting = false;
                console.log(data);
                $scope.reports = data;
                for (var i in $scope.reports) {
                    $scope.reports[i].SuraStart = QuranData.suras.sura[$scope.reports[i].SuraStart].name
                    $scope.reports[i].SuraEnd = QuranData.suras.sura[$scope.reports[i].SuraEnd].name
                }
            }, function (error) {
                $scope.getting = false;
                console.log(error)
            })
    };

    $scope.opendate = function (index, dates) {
        $scope.dates.index = index;
        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', 'dates',
                function ($scope, $modalInstance, dates) {

                    $scope.modalVars = {
                        selectedD: null,
                        selectedM: null,
                        selectedY: null
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
                $scope.getting = false;
                $scope.vars.ringStudents = data;
                $scope.studentId = $scope.vars.ringStudents[0].Id;
            },
            function (err) {
                $scope.getting = false;
                console.log(err);
            })
    };
    $scope.getStudentsByRingId($scope.selectedRing.ID);

    $scope.daysBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    };

}];