var attendreportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices', 'attendServices',
    function ($scope, $state, $modal, $templateCache, studentServices, attendServices) {

        $scope.vars = { ringStudents: [] };
        $scope.funs = {};
        $scope.radioModel = "0";
        $scope.radioModel1 = undefined;
        $scope.$parent.vars.titleTxt = 'تقرير الحضور';
        $scope.selectedRing = $scope.$parent.$parent.selectedRing;
        $scope.AttendanceCount = {
            attend: 0, //1
            absent: 0, //2
            late: 0, //3
            execuse: 0, //4
            positive: 0, //5
            negative: 0, //6
            reminder: 0 //7
        }
        $scope.dates = { fromDate: '', toDate: '', index: 1 }
        $scope.studentId = '';
        $scope.selectedDays = [];
        $scope.groupedArr = [];
        //$scope.selectedMonth = $scope.$parent.calendar.selectedMonth;

        $scope.updateCounters = function (attendanceDays) {
            for (var i in attendanceDays) {
                var day = attendanceDays[i];
                switch (attendanceDays[i].AttendanceTypeId) {
                    case 1:
                        $scope.AttendanceCount.attend++;
                        break;
                    case 2:
                        $scope.AttendanceCount.absent++;
                        break;
                    case 3:
                        $scope.AttendanceCount.late++;
                        break;
                    case 4:
                        $scope.AttendanceCount.execuse++;
                        break;
                    case 5:
                        $scope.AttendanceCount.positive++;
                        break;
                    case 6:
                        $scope.AttendanceCount.negative++;
                        break;
                    case 7:
                        $scope.AttendanceCount.reminder++;
                        break;
                    default:
                        break;
                }
            }
        }

        if ($scope.userType == "teacher") {
            $scope.getStudentsByRingId = function (ringId) {
                studentServices.getAllStudentByRingId(ringId,
                    function (data) {
                        console.log(data);
                        $scope.vars.ringStudents = data;
                        $scope.studentId = data[0].Id;
                    },
                    function (err) {
                        console.log(err);
                    })
            };
            $scope.getStudentsByRingId($scope.selectedRing.ID);
        }
        else {//student
            $scope.studentId = $scope.$parent.$parent.userId;
        }

        $scope.getPrevMonth = function () {
            //if ($scope.$parent.calendar.selectedMonth == $scope.$parent.calendar.currentMonth) return;
            //else
            $scope.selectedDays = [];
            $scope.$parent.calendar.prevMonth();

        }
        $scope.getNxtMonth = function () {
            $scope.selectedDays = [];
            if ($scope.$parent.calendar.selectedMonth == $scope.$parent.calendar.currentMonth) return;
            else $scope.$parent.calendar.nxtMonth()
        }

        $scope.removeSelected = function () {
            for (var i = 0; i < 5; i++) {
                $scope.selectedDays[i] = [];
                for (var j = 0; j < 7; j++) {
                    $scope.selectedDays[i][j] = {}
                }
            }
            angular.forEach($scope.selectedDays, function (item) {
                angular.forEach(item, function (i) {
                    i.isSelected = false;
                }, item)
            }, $scope.selectedDays);
        }

        $scope.selectDays = function (days) {

            for (var s = 0; s < days.length; s++) {

                for (var i = 0; i < 5; i++) {
                    if ($scope.selectedDays[i] == undefined) $scope.selectedDays[i] = [];
                    for (var j = 0; j < 7; j++) {
                        if ($scope.$parent.calendar.constructedDays[i][j] == days[s]) {
                            if ($scope.selectedDays[i][j] == undefined) $scope.selectedDays[i][j] = {};
                            $scope.selectedDays[i][j].isSelected = true;
                            break;
                        }
                    }
                }
            }


        };

        //$scope.removeSelected();
        //$scope.selectDays([2, 4]);

        $scope.getAttendance = function () {
            var studentId = $scope.studentId;
            if ($scope.radioModel == "0") {
                var startDate = ($scope.dates.fromDate).split('/');
                var endDate = ($scope.dates.toDate).split('/');
                var x = $.calendars.newDate(parseInt(startDate[2], 10), parseInt(startDate[0], 10), parseInt(startDate[1], 10), "Islamic", "ar");
                var y = $.calendars.newDate(parseInt(endDate[2], 10), parseInt(endDate[0], 10), parseInt(endDate[1], 10), "Islamic", "ar");
                if (x > y) return;


                var x1 = x.toJSDate();
                var y1 = y.toJSDate();

                var sd = (x1.getMonth() + 1) + '/' + x1.getDate() + '/' + x1.getFullYear();
                var ed = (y1.getMonth() + 1) + '/' + y1.getDate() + '/' + y1.getFullYear();
                console.log(startDate, endDate);
            }
            attendServices.GetStudentAttendance(studentId, sd, ed, function (data) {
                console.log(data);
                $scope.groupedArr = $scope.groupTypes(data);
                //console.log($scope.groupTypes(data))
                $scope.updateCounters(data);
            }, function (error) {
                console.log(error);
            })
        }
        //('2', '03/10/2014', '10/10/2014');

        $scope.fireEvent = function () {
            if ($scope.dates.fromDate != '' && $scope.dates.toDate != '') {
                $scope.getAttendance();
            }
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
                                dates.fromDate = $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedY;
                            }
                            else {
                                dates.toDate = $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedY;
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
                    $scope.getAttendance();
                }
            }, function () {
                if ($scope.dates.fromDate != '' && $scope.dates.toDate != '' && $scope.studentId != '') {
                    $scope.getAttendance();
                }
            })
        };

        $scope.groupTypes = function (a) {
            return _.groupBy(a, function (obj) { return obj.AttendanceTypeId; });
        }

        $scope.$watch('radioModel1', function (newV) {
            var dd = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");
            if (newV != undefined && $scope.groupedArr) {
                $scope.selectedDays = [];
                var days = [];
                for (var i in $scope.groupedArr[newV]) {
                    days.push($scope.groupedArr[newV][i].AttendanceDate)
                }

                for (var i in days) {
                    days[i] = dd.fromJSDate(new Date(days[i]));
                    if (days[i]._year == $scope.$parent.calendar.selectedYear && (days[i]._month) - 1 == $scope.$parent.calendar.selectedMonth) {
                        $scope.selectDays([days[i]._day]);
                    }
                }
            }
        });

    }];