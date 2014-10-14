var attendreportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices', 'attendServices',
    function ($scope, $state, $modal, $templateCache, studentServices, attendServices) {

    $scope.vars = {ringStudents:[]};
    $scope.funs = {};
    $scope.radioModel = "0";
    $scope.$parent.vars.titleTxt = 'تقرير الحضور';
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.AttendanceCount={
        attend: 0, //1
        absent: 0, //2
        late: 0, //3
        execuse: 0, //4
        positive: 0, //5
        negative: 0, //6
        reminder: 0 //7
    }
    $scope.fromDate = '';//TODO today's date
    $scope.toDate = '';//TODO after month
    $scope.studentId = '';
    $scope.index = 1;

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
    else {//TODO student
        //$scope.studentId = '';
    }

    $scope.getAttendance = function () {
        var studentId= $scope.studentId;
        var startDate=$scope.fromDate;
        var endDate = $scope.toDate;
        attendServices.GetStudentAttendance(studentId, startDate, endDate, function (data) {
            console.log(data);
            $scope.updateCounters(data)
        }, function (error) {
            console.log(error);
        })
    }
    //('2', '03/10/2014', '10/10/2014');

    $scope.opendate = function (index, fromDate, toDate) {
        $scope.index = index;
        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', 'index', 'fromDate', 'toDate',
                function ($scope, $modalInstance, index, fromDate, toDate) {
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

                }

                $scope.ok = function () {
                    console.log($scope.modalVars)
                    if (index==1) {
                        fromDate = $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedY;
                    }
                    else {
                        toDate = $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedY;
                    }
                    console.log(fromDate)
                    console.log(toDate)
                    $modalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            resolve: {
                index: function () {
                    return $scope.index;
                },
                fromDate: function () {
                    return $scope.fromDate;
                },
                toDate: function () {
                    return $scope.toDate;
                }
            }
        });
        //modalInstance.result.then(function () {
        //    if ($scope.fromDate != '' && $scope.toDate != '') {
        //        $scope.getAttendance($scope.studentId, $scope.fromDate, $scope.toDate)
        //    }
        //    console.log($scope.fromDate)
        //    console.log($scope.toDate)
        //}, function () {
        //    $scope.fromDate = fromDate;
        //    $scope.toDate = toDate;
        //})
    };
    
}];