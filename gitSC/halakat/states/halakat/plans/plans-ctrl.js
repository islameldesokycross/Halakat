﻿var plansCtrl = ['$scope', '$state', '$modal', 'planServices', 'studentServices',
    function ($scope, $state, $modal, planServices, studentServices, Mos7afData) {

        window.plans = $scope;
        $scope.vars = { plan: { id: null, name: "", number: "", days: "", assignedStudents: [] }, ringStudents: [], ringPlans: [], selectedRingPlan: null };
        $scope.funs = {};
        $scope.radio1Model = '0';
        $scope.$parent.vars.titleTxt = 'الخطط';
        $scope.selectedRing = $scope.$parent.$parent.selectedRing;
        $scope.getting = true;
        $scope.newPlan = true;

        $scope.checkModel = {
            saturday: false,
            sunday: false,
            monday: false,
            tuesday: false,
            wensday: false,
            thursday: false,
            friday: false,
        };

        $scope.getRingPlans = function (ringId) {
            $scope.getting = true;
            planServices.getAllPlansByRingId(ringId,
                function (data) {
                    $scope.getting = false;
                    console.log(data)
                    $scope.vars.ringPlans = data;
                },
                function (err) {
                    $scope.getting = false;
                    console.log(err)
                });
        };
        $scope.loadPlanData = function (planId) {
            if ($scope.vars.selectedRingPlan == null) {
                $scope.vars.plan = { id: null, name: "", number: "", days: "", assignedStudents: [] };
                $scope.checkModel = {
                    saturday: false,
                    sunday: false,
                    monday: false,
                    tuesday: false,
                    wensday: false,
                    thursday: false,
                    friday: false,
                };
            } else {
                $scope.newPlan = true;
                //empty the assigned students if change plan
                $scope.vars.plan.assignedStudents = [];
                $scope.getting = true;
                planServices.getAllPlansById(planId, function (data) {
                    $scope.getting = false;
                    $scope.vars.plan.Id = data.Id;
                    $scope.vars.plan.name = data.Name;
                    $scope.vars.plan.number = data.NumberOfDaysReq;

                    //retrieve the assignrd students for the new plan
                    $scope.getAssignedStudenttoAplan();

                    var planDays = data.PlanDayWeeks.split(",");
                    $scope.checkModel.saturday = $scope.checkModel.sunday = $scope.checkModel.monday = $scope.checkModel.tuesday = $scope.checkModel.wensday = $scope.checkModel.thursday = $scope.checkModel.friday = false;
                    for (var i = 0; i < planDays.length; i++) {
                        switch (planDays[i]) {
                            case "1":
                                $scope.checkModel.saturday = true;
                                break;
                            case "2":
                                $scope.checkModel.sunday = true;
                                break;
                            case "3":
                                $scope.checkModel.monday = true;
                                break;
                            case "4":
                                $scope.checkModel.tuesday = true;
                                break;
                            case "5":
                                $scope.checkModel.wensday = true;
                                break;
                            case "6":
                                $scope.checkModel.thursday = true;
                                break;
                            case "7":
                                $scope.checkModel.friday = true;
                                break;
                            default:
                        }
                    }
                },
                    function (err) {
                        $scope.getting = false;
                        console.log(err)
                    });
            }

        };
        $scope.savePlan = function () {
            if ($scope.vars.plan.name.length == 0 || $scope.vars.plan.number.length == 0) {
                alert("من فضلك ادخل اسم و رقم الخطة");
                return;
            }
            if ($scope.checkModel.saturday || $scope.checkModel.sunday || $scope.checkModel.monday || $scope.checkModel.tuesday || $scope.checkModel.wensday || $scope.checkModel.thursday || $scope.checkModel.friday) {
                var planDays = [];
                if ($scope.checkModel.saturday) {
                    planDays.push("1");
                }
                if ($scope.checkModel.sunday) {
                    planDays.push("2");
                }
                if ($scope.checkModel.monday) {
                    planDays.push("3");
                }
                if ($scope.checkModel.tuesday) {
                    planDays.push("4");
                }
                if ($scope.checkModel.wensday) {
                    planDays.push("5");
                }
                if ($scope.checkModel.thursday) {
                    planDays.push("6");
                }
                if ($scope.checkModel.friday) {
                    planDays.push("7");
                }
                $scope.vars.plan.days = planDays.join(",");
            } else {
                alert("من فضلك اختر ايام التسميع");
                return;
            }

            if ($scope.vars.plan.Id != null) {
                $scope.getting = true;
                planServices.updatePlan($scope.vars.plan.Id, $scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
                function (data) {
                    $scope.getting = false;
                    $scope.newPlan = true;
                    $scope.getRingPlans($scope.selectedRing.ID);
                    $scope.vars.selectedRingPlan = data;
                    $scope.vars.selectedRingPlan.PlanDayWeeks = $scope.vars.plan.days;
                    console.log("updated successfully --> " + data)
                },
                function (err) {
                    $scope.getting = false;
                    console.log(err);
                    alert(err.ErrorDes);
                });
            } else {
                //TODO change parameters
                $scope.getting = true;
                planServices.createNewPlan($scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
                function (data) {
                    $scope.getting = false;
                    $scope.newPlan = true;
                    $scope.vars.selectedRingPlan = data;
                    $scope.vars.selectedRingPlan.PlanDayWeeks = $scope.vars.plan.days;
                    $scope.getRingPlans($scope.selectedRing.ID);
                    console.log("created successfully --> " + data)
                },
                function (err) {
                    console.log(err)
                });
            }

        };

        $scope.getAssignedStudenttoAplan = function () {
            if ($scope.vars.plan.Id != null) {
                $scope.spinning = true;
                planServices.getStudentsassignedtoplan($scope.vars.plan.Id,
                    function (data) {
                        console.log('here are students')
                        console.log(data);
                        $scope.vars.plan.assignedStudents = data;
                        for (var i in $scope.vars.ringStudents) {
                            var student = $scope.vars.ringStudents[i];
                            for (var j in $scope.vars.plan.assignedStudents) {
                                var assiggned = $scope.vars.plan.assignedStudents[j];
                                if (student.Id == assiggned.StudentId) {
                                    $scope.vars.ringStudents[i].isAssigned = true;
                                    break;
                                }
                                else {
                                    $scope.vars.ringStudents[i].isAssigned = false;
                                }
                            }
                        }
                        $scope.spinning = false;
                    },
                    function (err) {
                        $scope.spinning = false;
                        console.log(err);
                        if (err.ErrorDes == "No student has been found ") {
                            for (var i in $scope.vars.ringStudents) {
                                $scope.vars.ringStudents[i].isAssigned = false;
                            }
                        }
                    });
            }

        };
        $scope.getStudentsByRingId = function (ringId) {
            studentServices.getAllStudentByRingId(ringId,
                function (data) {
                    $scope.getting = false;
                    $scope.vars.ringStudents = data;
                    $scope.getAssignedStudenttoAplan();
                },
                function (err) {
                    $scope.getting = false;
                    console.log(err);
                })
        };

        //handel the student click
        $scope.opentasme3 = function (student) {
            var id = student.Id;
            $scope.student = student;

            if ($scope.vars.selectedRingPlan == null) {
                alert("يجب اختيار خطة أولا");
                return;
            }

            $scope.StuId = id;
            //open pop of student
            var modalInstance = $modal.open({
                templateUrl: 'tasme3.html',
                controller: ['$scope', '$modalInstance', 'Mos7afData', 'planServices', 'studentId', 'tsmi3Services',
                    'selectedPlan', 'student', 'tsmi3AssignmentServices',
                    function (scope, $modalInstance, Mos7afData, planServices, studentId, tsmi3Services,
                        selectedPlan, student, tsmi3AssignmentServices) {
                        scope.studentplans = [];
                        scope.spinning = true;

                        planServices.getAllPlansByStudentId(studentId,
                            function (data) {
                                scope.spinning = false;
                                scope.studentplans = data;
                                console.log(scope.studentplans)
                            },
                            function (err) {
                                scope.spinning = false;
                                console.log(err)
                                if (err.ErrorDes == "No available Saving Plan") {
                                    scope.studentplans = [];
                                }
                            });

                        scope.getColor = function (id) {
                            if (id == selectedPlan.Id) {
                                return "bgredy";
                            }
                            else {
                                return "bggreeny";
                            }
                        }

                        scope.RecPlan = {
                            selectedSura: null,
                            selectedAya: null,
                            ayat: [],
                            selectedY: null,
                            selectedM: null,
                            selectedD: null
                        };

                        scope.RecPlan.suras = Mos7afData.getQuraanSuras();

                        scope.jsDateToHijri = function (jsDate) {
                            var hd = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar")
                            return hd.fromJSDate(jsDate);
                        }

                        scope.spinning = true;
                        tsmi3AssignmentServices.getRecitationPlanByStudentIdAndSavingPlanID(selectedPlan.Id, student.Id,
                            function (data) {
                                scope.spinning = false;
                                console.log(data);
                                var sura = scope.RecPlan.suras[data.SwraStart];
                                var start = scope.jsDateToHijri(new Date(data.StartDate));
                                var aya = data.AyaStart;
                                scope.RecPlan.selectedSura = sura;
                                scope.setSuraAyat();
                                scope.RecPlan.selectedAya = scope.RecPlan.ayat[parseInt(aya) - 1];
                                scope.RecPlan.selectedY = start._year;
                                scope.getMonths(scope.RecPlan.selectedY);
                                scope.RecPlan.selectedM = start._month;
                                scope.getDays(scope.RecPlan.selectedY, scope.RecPlan.selectedM);
                                scope.RecPlan.selectedD = start._day;
                            }, function (err) {
                                scope.spinning = false;
                                console.log(err);
                            })

                        scope.checkMonthes = function () {
                            if (scope.RecPlan.selectedY == null) {
                                alert("إختر السنة أولا");
                                return false;
                            }
                        };

                        scope.checkDays = function () {
                            if (scope.RecPlan.selectedM == null) {
                                alert("إختر الشهر أولا");
                                return false;
                            }
                        };

                        scope.checkAyat = function () {
                            if (scope.RecPlan.selectedSura == null) {
                                alert("إختر السورة أولا");
                                return false;
                            }
                        };

                        scope.setSuraAyat = function () {
                            if (scope.RecPlan.selectedSura == null) {
                                scope.RecPlan.ayat = ["إختر السورة أولا"];
                            } else {
                                scope.RecPlan.ayat = [];
                                for (var i = 0; i < scope.RecPlan.selectedSura.ayas; i++) {
                                    scope.RecPlan.ayat.push({ name: i + 1 });
                                }
                            }

                        };

                        scope.getRange = function (n, m) {
                            return _.range(n, m);
                        };
                        scope.picker = {};
                        scope.picker.currentDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");
                        scope.picker.currentYear = scope.picker.currentDate._year;
                        scope.picker.currentMonth = scope.picker.currentDate._month;
                        scope.picker.currentDay = scope.picker.currentDate._day;
                        scope.picker.monthCount = 12;
                        scope.picker.remainingMonths = 12 - scope.picker.currentMonth;
                        scope.picker.getRemainMonths = function (curM) {
                            return 12 - curM;
                        }
                        scope.picker.getDaysInMonth = function (y, m) {
                            var xDate = $.calendars.newDate(y, m, 1, "Islamic", "ar");
                            return xDate.daysInMonth();
                        }
                        scope.picker.getRemainDaysInMonth = function (y, m, curD) {
                            var DIM = scope.picker.getDaysInMonth(y, m);
                            return DIM - curD;
                        }

                        scope.monthes = [];
                        scope.days = [];

                        scope.getMonths = function (selY) {
                            if (selY == null) {
                                scope.days = [];
                                scope.monthes = [];
                                scope.RecPlan.selectedD = scope.RecPlan.selectedM = null;
                                return;
                            }
                            //var monthes = [];
                            //scope.monthes = (selY == scope.picker.currentYear) ?
                            //    scope.getRange(scope.picker.currentMonth, 13)
                            //  : scope.getRange(1, scope.picker.currentMonth);
                            scope.monthes = scope.getRange(1, 13);
                        }

                        scope.getDays = function (selY, selM) {
                            if (selY == null || selM == null) {
                                scope.days = [];
                                scope.RecPlan.selectedD = null;
                                return;
                            }
                            //scope.days = (selM == scope.picker.currentMonth) ?
                            //    scope.getRange(scope.picker.currentDay, scope.picker.getDaysInMonth(selY, selM) + 1)
                            //  : scope.getRange(1, scope.picker.getDaysInMonth(selY, selM));
                            scope.days = scope.getRange(1, scope.picker.getDaysInMonth(selY, selM));
                        }

                        scope.delete = function (plan) {
                            var date = scope.jsDateToHijri(new Date(plan.StartDate));
                            var startDate=date._day+'/'+date._month+'/'+date._year;
                            var sura=QuranData.suras.sura[plan.StartSwra].name;
                            var msg = 'هل تريد حذف الطالب من هذه الخطة؟' + '\n' + ' تبدأ في ' + startDate + ' من سورة ' + sura + ' الآية ' + plan.startAya;
                            var confirm = window.confirm(msg);
                            if (confirm) {
                                $('#' + plan.Id).remove();
                                scope.spinning = true;
                                planServices.unassignStudFromPlan(studentId, plan.Id, function () {
                                    scope.spinning = false;
                                    console.log('deleted successfully');
                                }, function (error) {
                                    scope.spinning = false;
                                    console.log(error)
                                })
                            }
                            else {
                                return;
                            }
                        }

                        scope.ok = function () {
                            if (scope.RecPlan.selectedSura == null || scope.RecPlan.selectedAya == null) {
                                alert("من فضلك اختر السورة والاية اولا")
                                return;
                            }
                            if (scope.RecPlan.selectedY == null || scope.RecPlan.selectedM == null || scope.RecPlan.selectedD == null) {
                                alert("من فضلك اختر تاريخ البداية اولا")
                                return;
                            }

                            var d = '';
                            var x = $.calendars.newDate(parseInt(scope.RecPlan.selectedY), parseInt(scope.RecPlan.selectedM),
                                parseInt(scope.RecPlan.selectedD), "Islamic", "ar");
                            var y = x.toJSDate();
                            d = (y.getMonth() + 1) + '/' + y.getDate() + '/' + y.getFullYear();

                            if (student.isAssigned) {
                                scope.spinning = true;
                                tsmi3Services.updatetsmi3Plan(
                                                        studentId,
                                                        parseInt(scope.RecPlan.selectedSura.index),
                                                        parseInt(scope.RecPlan.selectedAya.name),
                                                        d, //hijiri date
                                                        selectedPlan.Id || selectedPlan.id,//plan id in prev or new plan
                                                        function (data) {
                                                            scope.spinning = false;
                                                            console.log(data)
                                                            $modalInstance.close();

                                                        },
                                                        function (err) {
                                                            scope.spinning = false;
                                                            console.log(err)
                                                            $modalInstance.close();


                                                        });
                            } else {
                                scope.spinning = true;
                                tsmi3Services.createNewPlan(
                                                       studentId,
                                                       parseInt(scope.RecPlan.selectedSura.index),
                                                       parseInt(scope.RecPlan.selectedAya.name),
                                                       d, //hijiri date
                                                       selectedPlan.Id || selectedPlan.id,//plan id in prev or new plan
                                                       function (data) {
                                                           scope.spinning = false;
                                                           student.isAssigned = true;
                                                           console.log(data)
                                                           $modalInstance.close();

                                                       },
                                                       function (err) {
                                                           scope.spinning = false;
                                                           console.log(err)
                                                           if (err.ErrorName == "DateError") {
                                                               alert('يجب اختيار يوم من الأيام المقررة للخطة')
                                                           }
                                                           $modalInstance.close();
                                                       });
                            }
                        };

                        scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                resolve: {
                    studentId: function () {
                        return $scope.StuId;
                    },
                    selectedPlan: function () {
                        return $scope.vars.selectedRingPlan;
                    },
                    student: function () {
                        return $scope.student;
                    }
                }
            });

        };

        $scope.getStudentsByRingId($scope.selectedRing.ID);
        $scope.getRingPlans($scope.selectedRing.ID);

        $scope.unAssign = function (student) {
            if (student.isAssigned == false) {
                var confirm = window.confirm('هل تريد حذف الطالب من هذه الخطة؟')
                if (confirm) {
                    planServices.unassignStudFromPlan(student.Id, $scope.vars.selectedRingPlan.Id, function (data) {
                        console.log(data);
                        student.isAssigned = false;
                    }, function (error) {
                        console.log(error);
                    })
                }
                else {
                    student.isAssigned = true;
                    return;
                }
            }
            else {
                student.isAssigned = false;
                $scope.opentasme3(student);
            }
        }

        $scope.changed = function () {
            console.log('changed')
            $scope.newPlan = false;
        }
    }];