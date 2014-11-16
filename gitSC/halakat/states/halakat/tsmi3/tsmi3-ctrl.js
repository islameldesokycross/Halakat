var tsmi3Ctrl = ['$scope', '$state', 'studentServices', 'planServices', '$timeout', 'tsmi3AssignmentServices',
   '$modal', '$templateCache',
function ($scope, $state, studentServices, planServices, $timeout, tsmi3AssignmentServices, $modal,
   $templateCache) {

    $scope.vars = { ringStudents: [], studentPlans: [], tsme3Records: [] };
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.student = '';
    $scope.plan = "";
    $scope.startSura = "";
    $scope.date = { actualDate: '', scheduleDate: '', assig: {}, plan: '', type: '' };
    $scope.counter = 0;
    
    $scope.calcCounter = function () {
        $scope.counter = 0;
        for (var i = 0; i < $scope.vars.tsme3Records.RecitationPlanAssignments.length; i++) {
            if ($scope.vars.tsme3Records.RecitationPlanAssignments[i].ActualDate == null) {
                $scope.counter++;
            }
        }
    }

    $scope.$parent.vars.titleTxt = 'التسميع';
    $scope.spinning = false;

    // Converting date to hijri date
    // takes js date object 
    // returns hijri date object
    $scope.jsDateToHijri = function (jsDate) {

        var hd = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar")
        return hd.fromJSDate(jsDate);
    }

    $scope.opendate = function (assig, no, date) {
        $scope.date.assig = assig;
        $scope.date.plan = $scope.plan;
        $scope.date.type = no;

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

                if (date.type == 2) {
                    $scope.modalVars.selectedY = parseInt(date.assig.ScheduledDate.split('/')[2]);
                    $scope.getMonths($scope.modalVars.selectedY);
                    $scope.modalVars.selectedM = parseInt(date.assig.ScheduledDate.split('/')[1]);
                    $scope.getDays($scope.modalVars.selectedY, $scope.modalVars.selectedM);
                    $scope.modalVars.selectedD = parseInt(date.assig.ScheduledDate.split('/')[0]);
                }

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

                $scope.ok = function () {
                    console.log($scope.modalVars)
                    if (date.type == 2) {
                        date.actualDate = $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedY;
                        date.assig.ActualDate = date.actualDate;
                        date.assig.done = true;
                    }
                    else {
                        date.scheduleDate = $scope.modalVars.selectedD + '/' + $scope.modalVars.selectedM + '/' + $scope.modalVars.selectedY;
                        date.assig.ScheduledDate = date.scheduleDate;
                    }
                    var dateActual = date.assig.ActualDate.split('/')[1] + '/' + date.assig.ActualDate.split('/')[0] + '/' + date.assig.ActualDate.split('/')[2];
                    var dateSch = date.assig.ScheduledDate.split('/')[1] + '/' + date.assig.ScheduledDate.split('/')[0] + '/' + date.assig.ScheduledDate.split('/')[2];

                    date.assig.DayDifferent = $scope.daysBetween(new Date(dateActual), new Date(dateSch));

                    var d1 = '';
                    var x1 = $.calendars.newDate(parseInt(date.assig.ScheduledDate.split('/')[2]), parseInt(date.assig.ScheduledDate.split('/')[1]),
                        parseInt(date.assig.ScheduledDate.split('/')[0]), "Islamic", "ar");
                    var y1 = x1.toJSDate();

                    d1 = (y1.getMonth() + 1) + '/' + y1.getDate() + '/' + y1.getFullYear();

                    var d2 = '';
                    var x2 = $.calendars.newDate(parseInt(date.assig.ActualDate.split('/')[2]), parseInt(date.assig.ActualDate.split('/')[1]),
                        parseInt(date.assig.ActualDate.split('/')[0]), "Islamic", "ar");
                    var y2 = x2.toJSDate();

                    d2 = (y2.getMonth() + 1) + '/' + y2.getDate() + '/' + y2.getFullYear();

                    tsmi3AssignmentServices.updateRecitationsAssignment(date.assig.Id, date.plan, d1,
                    d2, date.assig.DayDifferent, date.assig.NumberOfFaults, date.assig.AssignmentPages, date.assig.EndAya,
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

        modalInstance.result.then(function () {
            $scope.calcCounter();
        }, function () {
            $scope.calcCounter();
        })

    };

    $scope.getStudentsByRingId = function (ringId) {
        $scope.spinning = true;
        studentServices.getAllStudentByRingId(ringId,
            function (data) {
                $scope.spinning = false;
                $scope.vars.ringStudents = data;
                $scope.student = $scope.vars.ringStudents[0].Id;
                $scope.getPlans();
            },
            function (err) {
                $scope.spinning = false;
                console.log(err);
            })
    };
    $scope.getStudentsByRingId($scope.selectedRing.ID);

    $scope.getPlans = function () {
        $scope.spinning = true;
        planServices.getAllPlansByStudentId($scope.student,
                        function (data) {
                            $scope.spinning = false;
                            $scope.vars.studentPlans = data;
                            $scope.plan = $scope.vars.studentPlans[0].Id;
                            $scope.getTsme3Data();
                            console.log('student plans')
                            console.log($scope.vars.studentPlans)
                        },
                        function (err) {
                            $scope.spinning = false;
                            console.log(err)
                            if (err.ErrorDes == "No available Saving Plan") {
                                $scope.vars.studentPlans = [];
                                $scope.spinning = false;
                            }
                        });
    };

    $scope.getTsme3Data = function () {
        $scope.spinning = true;
        tsmi3AssignmentServices.getRecitationPlanAndAssignmentsByStudentIdAndSavingPlanID($scope.plan,
            $scope.student, function myfunction(data) {
                $scope.spinning = false;
                $scope.vars.tsme3Records = data;
                if ($scope.vars.tsme3Records.RecitationPlan.SwraStart) {
                    $scope.startSura = "البداية" + ' ' + QuranData.suras.sura[$scope.vars.tsme3Records.RecitationPlan.SwraStart].name;
                    $scope.AyaStart = $scope.vars.tsme3Records.RecitationPlan.AyaStart;
                }
                for (var i in $scope.vars.tsme3Records.RecitationPlanAssignments) {
                    $scope.vars.tsme3Records.RecitationPlanAssignments[i].StartSura = QuranData.suras.sura[$scope.vars.tsme3Records.RecitationPlanAssignments[i].StartSura].name
                    var fullDate = new Date($scope.vars.tsme3Records.RecitationPlanAssignments[i].ScheduledDate);
                    var twoDigitMonth = fullDate.getMonth() + 1;
                    var currentSDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear();
                    var currentHijriSDate = $scope.jsDateToHijri(fullDate);
                    var sDateFormat = currentHijriSDate._day + "/" + currentHijriSDate._month + "/" + currentHijriSDate._year;
                    $scope.vars.tsme3Records.RecitationPlanAssignments[i].ScheduledDate = sDateFormat;

                    if ($scope.vars.tsme3Records.RecitationPlanAssignments[i].ActualDate != null) {
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].done = true;
                        var fullDate = new Date($scope.vars.tsme3Records.RecitationPlanAssignments[i].ActualDate);
                        var twoDigitMonth = fullDate.getMonth() + 1;
                        var currentADate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear();
                        var currentHijriADate = $scope.jsDateToHijri(fullDate);
                        var aDateFormat = currentHijriADate._day + "/" + currentHijriADate._month + "/" + currentHijriADate._year;
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].ActualDate = aDateFormat;
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].DayDifferent = $scope.daysBetween(new Date(currentSDate), new Date(currentADate));
                    }
                    else {
                        $scope.vars.tsme3Records.RecitationPlanAssignments[i].done = false;
                    }
               }
                $scope.calcCounter();
                console.log('tsmeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee3');
                console.log(data)
            }, function (error) {
                $scope.spinning = false;
                console.log(error);
            })
    }

    //$scope.update = function (assig) {
    //    if (assig.ActualDate != null && assig.ActualDate != undefined) {
    //        var dateActual = assig.ActualDate.split('/');

    //        var d1 = '';
    //        var x = $.calendars.newDate(parseInt(dateActual[2]), parseInt(dateActual[1]), parseInt(dateActual[0]), "Islamic", "ar");
    //        var y = x.toJSDate();
    //        d1 = y.getDate() + '/' + (y.getMonth() + 1) + '/' + y.getFullYear();
    //    } else {
    //        d1 = assig.ActualDate;
    //    }

    //    if (assig.ScheduledDate != null && assig.ScheduledDate != undefined) {
    //        var dateActual = assig.ScheduledDate.split('/');

    //        var d2 = '';
    //        var x = $.calendars.newDate(parseInt(dateActual[2]), parseInt(dateActual[1]), parseInt(dateActual[0]), "Islamic", "ar");
    //        var y = x.toJSDate();
    //        d2 = y.getDate() + '/' + (y.getMonth() + 1) + '/' + y.getFullYear();
    //    } else {
    //        d2 = assig.ScheduledDate;
    //    }
    //    $scope.spinning = true;
    //    tsmi3AssignmentServices.updateRecitationsAssignment(assig.Id, $scope.plan, d2,
    //        d1, assig.DayDifferent, assig.NumberOfFaults, assig.AssignmentPages, assig.EndAya,
    //        assig.StartAya, function (data) {
    //            $scope.spinning = false;
    //            console.log(data);
    //        }, function (error) {
    //            $scope.spinning = false;
    //            console.log(error);
    //        })
    //};

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
    }
}];