﻿var tsmi3Ctrl = ['$scope', '$state', 'studentServices', 'planServices', '$timeout', 'tsmi3AssignmentServices',
    '$modal', '$templateCache',
function ($scope, $state, studentServices, planServices, $timeout, tsmi3AssignmentServices, $modal,
    $templateCache) {

    $scope.vars = { ringStudents: [], studentPlans: [], tsme3Records: [] };
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.student = '';
    $scope.plan = "";
    $scope.startSura = "";
    $scope.date = { actualDate: '', assig: {}, plan: '' };

    $scope.$parent.vars.titleTxt = 'التسميع';

    $scope.opendate = function (assig, date) {
        $scope.date.assig = assig;
        $scope.date.plan = $scope.plan;

        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', 'date', 'tsmi3AssignmentServices',
            function ($scope, $modalInstance, date, tsmi3AssignmentServices) {

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
                    date.actualDate = $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedY;
                    $('#' + assig.Id).text(date.actualDate);
                    date.assig.ActualDate = date.actualDate;
                    date.assig.done = true;

                    //var d = '';
                    //var x = $.calendars.newDate($scope.modalVars.selectedY, $scope.modalVars.selectedM, $scope.modalVars.selectedD, "Islamic", "ar");
                    //var y = x.toJSDate();

                    //d = (y.getMonth() + 1) + '/' +y.getDate() + '/' +  y.getFullYear();

                    tsmi3AssignmentServices.updateRecitationsAssignment(date.assig.Id, date.plan, date.assig.ScheduledDate,
                    date.assig.ActualDate, date.assig.DayDifferent, date.assig.NumberOfFaults, date.assig.AssignmentPages, date.assig.EndAya,
                    date.assig.StartAya, function (data) {
                        console.log(data);
                    }, function (error) {
                        console.log(error);
                    })
                    $modalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            resolve: {
                date: function () {
                    return $scope.date;
                }
            }
        });


    };

    $scope.getStudentsByRingId = function (ringId) {
        studentServices.getAllStudentByRingId(ringId,
            function (data) {
                $scope.vars.ringStudents = data;
                $scope.student = $scope.vars.ringStudents[0].Id;
                $scope.getPlans();
            },
            function (err) {
                console.log(err);
            })
    };
    $scope.getStudentsByRingId($scope.selectedRing.ID);

    $scope.getPlans = function () {
        planServices.getAllPlansByStudentId($scope.student,
                        function (data) {
                            $scope.vars.studentPlans = data;
                            $scope.plan = $scope.vars.studentPlans[0].Id;
                            $scope.getTsme3Data();
                            console.log('student plans')
                            console.log($scope.vars.studentPlans)
                        },
                        function (err) {
                            console.log(err)
                            if (err.ErrorDes == "No available Saving Plan") {
                                $scope.vars.studentPlans = [];
                            }
                        });
    };

    $scope.getTsme3Data = function () {
        tsmi3AssignmentServices.getRecitationPlanAndAssignmentsByStudentIdAndSavingPlanID($scope.plan,
            $scope.student, function myfunction(data) {
                $scope.vars.tsme3Records = data;
                if ($scope.vars.tsme3Records.RecitationPlan.SwraStart) {
                    $scope.startSura = "البداية" + ' ' + QuranData.suras.sura[$scope.vars.tsme3Records.RecitationPlan.SwraStart].name;
                }
                for (var i in $scope.vars.tsme3Records.RecitationPlanAssignments) {
                    if ($scope.vars.tsme3Records.RecitationPlanAssignments[i].ActualDate != null){
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].done = true;
                    }
                    else {
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].done = false;
                    }
                    $scope.vars.tsme3Records.RecitationPlanAssignments[i].StartSura = QuranData.suras.sura[$scope.vars.tsme3Records.RecitationPlanAssignments[i].StartSura].name
                }
                console.log('tsmeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee3');
                console.log(data)
            }, function (error) {
                console.log(error);
            })
    }

    $scope.update = function (assig) {
        //if (assig.ActualDate != null && assig.ActualDate!= undefined) {
        //    var dateActual = assig.ActualDate.split('/');

        //    var d1 = '';
        //    var x = $.calendars.newDate(dateActual[2], dateActual[1], dateActual[0], "Islamic", "ar");
        //    var y = x.toJSDate();
        //    d1 = y.getDate() + '/' + (y.getMonth() + 1) + '/' + y.getFullYear();
        //}

        tsmi3AssignmentServices.updateRecitationsAssignment(assig.Id, $scope.plan, assig.ScheduledDate,
            assig.ActualDate, assig.DayDifferent, assig.NumberOfFaults, assig.AssignmentPages, assig.EndAya,
            assig.StartAya, function (data) {
                console.log(data);
            }, function (error) {
                console.log(error);
            })
    }
}];