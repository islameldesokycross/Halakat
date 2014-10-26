var attendCtrl = ['$scope', '$state', 'studentServices', 'attendServices',
    function ($scope, $state, studentServices, attendServices) {

        $scope.vars = { ringStudents: [] };
        $scope.funs = {};
        $scope.selectedRing = $scope.$parent.$parent.selectedRing;
        $scope.checkModel = '0';
        $scope.selectedDays = [];
        $scope.seletedDate = [];
        //    {
        //    attend: 1,
        //    absent: 2,
        //    late: 3,
        //    execuse: 4,
        //    positive: 5,
        //    negative: 6,
        //    reminder: 7,
        //};
        $scope.comment = ''

        $scope.$parent.vars.titleTxt = 'شاشة التحضير والملاحظات';

        //console.log($scope.$parent.calendar.constructedDays, $scope.$parent.calendar.selectedMonth, $scope.$parent.calendar.selectedYear, $scope.checkModel);

        $scope.getPrevMonth = function () {
            if ($scope.$parent.calendar.selectedMonth == $scope.$parent.calendar.currentMonth) return;
            else $scope.$parent.calendar.nxtMonth()
        }

        $scope.selectDay = function (day, inx, pinx, event) {
            //console.log(day, inx, pinx, event.currentTarget);
            if (day === undefined) return;
            if (day > $scope.$parent.calendar.currentDay) return;
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

            $scope.selectedDays[pinx][inx].isSelected = true;
            //$scope.seletedDate = ($scope.$parent.calendar.selectedMonth + 1) + '/' + day + '/' + $scope.$parent.calendar.selectedYear;
            $scope.seletedDate = [day, ($scope.$parent.calendar.selectedMonth + 1), $scope.$parent.calendar.selectedYear];
            //console.log($.calendars.newDate($scope.seletedDate[2], $scope.seletedDate[1], $scope.seletedDate[0], "Islamic", "ar"));
            //console.log($scope.seletedDate);
        };

        $scope.selectAllStud = function () {
            //var allIsChecked = false;
            var studentsSelected = 0;
            angular.forEach($scope.vars.ringStudents, function (student) {
                if (student.selected) studentsSelected++;
            });
            if (studentsSelected === $scope.vars.ringStudents.length) {
                angular.forEach($scope.vars.ringStudents, function (student) {
                    student.selected = false;
                }, $scope.vars.ringStudents);
            }
            else {
                angular.forEach($scope.vars.ringStudents, function (student) {
                    student.selected = true;
                }, $scope.vars.ringStudents);
            }
        };

        $scope.getStudentsByRingId = function (ringId) {
            studentServices.getAllStudentByRingId(ringId,
                function (data) {
                    angular.forEach(data, function (i) { i.selected = false; }, data);
                    $scope.vars.ringStudents = data;
                },
                function (err) {
                    console.log(err);
                })
        };
        $scope.getStudentsByRingId($scope.selectedRing.ID);

        $scope.createNewAttendance = function () {
            var selectedStudents = '';
            angular.forEach($scope.vars.ringStudents, function (student) {
                if (student.selected) selectedStudents += ", " + student.Id;
            });
            selectedStudents = selectedStudents.substr(1);
            var d = '';
            var x = $.calendars.newDate(parseInt($scope.seletedDate[2]), parseInt($scope.seletedDate[1]),
                parseInt($scope.seletedDate[0]), "Islamic", "ar");
            var y = x.toJSDate();
            d = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear()

            attendServices.CreateNewAttendanceNote(selectedStudents, $scope.checkModel, d, $scope.comment, function (data) {
                console.log(data);
            }, function (error) {
                console.log(error);
            })
        };
        //('2, 3', '1', '10/14/2014', 'حاضر')//student ids comma seprated

    }];