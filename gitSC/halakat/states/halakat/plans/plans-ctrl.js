var plansCtrl = ['$scope', '$state', '$modal', 'planServices', 'studentServices',
    function ($scope, $state, $modal, planServices, studentServices, Mos7afData) {

    window.plans = $scope;
    $scope.vars = {plan:{id:null,name:"",number:"",days:"",assignedStudents:[]},ringStudents:[],ringPlans:[],selectedRingPlan:null};
    $scope.funs = {};
    $scope.radio1Model = '0';
    $scope.$parent.vars.titleTxt = 'الخطط';
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.getting = true;

    $scope.checkModel = {
        saturday: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wensday: false,
        thursday: false,
        friday: false,
    };

    $scope.getRingPlans = function(ringId) {
        planServices.getAllPlansByRingId(ringId,
            function(data) {
                console.log(data)
                $scope.vars.ringPlans = data;
            },
            function(err) {
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
        }else{
        //empty the assigned students if change plan
            $scope.vars.plan.assignedStudents = [];
            planServices.getAllPlansById(planId, function (data) {
                $scope.vars.plan.Id = data.Id;
                $scope.vars.plan.name = data.Name;
                $scope.vars.plan.number = data.NumberOfDaysReq;

                //retrieve the assignrd students for the new plan
                $scope.getSssignedStudenttoAplan();

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

                });
        }
        
    };
    $scope.savePlan = function () {
        if ($scope.vars.plan.name.length == 0 || $scope.vars.plan.number.length == 0) {
            alert("من فضلك ادخل اسم و رقم الخطة");
            return;
        }
        if ($scope.checkModel.saturday || $scope.checkModel.sunday || $scope.checkModel.monday || $scope.checkModel.tuesday || $scope.checkModel.wensday || $scope.checkModel.thursday || $scope.checkModel.friday ) {
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
            //TODO change parameters
            planServices.updatePlan($scope.vars.plan.Id, $scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
            function (data) {
                $scope.vars.selectedRingPlan = data;
                $scope.vars.selectedRingPlan.PlanDayWeeks = $scope.vars.plan.days;
                console.log("updated successfully --> " + data)
            },
            function (err) {
                console.log(err);
                alert(err.ErrorDes);
            });
        } else {
            //TODO change parameters
            planServices.createNewPlan($scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
            function (data) {
                $scope.vars.selectedRingPlan = data;
                $scope.vars.selectedRingPlan.PlanDayWeeks = $scope.vars.plan.days;
                console.log("created successfully --> " + data)
            },
            function (err) {
                console.log(err)
            });
        }
        
    };

    $scope.getSssignedStudenttoAplan = function () {
        if ($scope.vars.plan.Id != null) {
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
                },
                function(err) {
                    console.log(err);
                    if (err.ErrorDes == "No student has been found ") {
                        $scope.vars.plan.assignedStudents = [];
                    }
                });
        }
        
    };
    $scope.getStudentsByRingId = function(ringId) {
        studentServices.getAllStudentByRingId(ringId,
            function(data) {
                $scope.getting = false;
                $scope.vars.ringStudents = data;
                $scope.getSssignedStudenttoAplan();
            },
            function(err) {
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

        if (student.isAssigned) {
            planServices.unassignStudFromPlan(student.Id, $scope.vars.selectedRingPlan.Id, function (data) {
                console.log(data);
                student.isAssigned = false;
            }, function (error) {
                console.log(error);
            })
            return;
        }
        
            $scope.StuId = id;
            //open pop of student
            var modalInstance = $modal.open({
                templateUrl: 'tasme3.html',
                controller: ['$scope', '$modalInstance', 'Mos7afData', 'planServices', 'studentId', 'tsmi3Services',
                    'selectedPlan','student',
                    function (scope, $modalInstance, Mos7afData, planServices, studentId, tsmi3Services,
                        selectedPlan, student) {
                    scope.studentplans = [];
                    planServices.getAllPlansByStudentId(studentId,
                        function(data) {
                            scope.studentplans = data;
                            console.log(scope.studentplans)
                        },
                        function(err) {
                            console.log(err)
                            if (err.ErrorDes == "No available Saving Plan") {
                                scope.studentplans = [];
                            }
                        });

                    scope.RecPlan = {
                        selectedSura: null,
                        selectedAya: null,
                        ayat: [],
                        selectedY: null,
                        selectedM: null,
                        selectedD:null
                    };
                    scope.RecPlan.suras = Mos7afData.getQuraanSuras();
                    scope.setSuraAyat = function() {
                        if (scope.RecPlan.selectedSura == null) {
                            scope.RecPlan.ayat = [];
                        } else {
                            scope.RecPlan.ayat = [];
                            for (var i = 0; i < scope.RecPlan.selectedSura.ayas; i++) {
                                scope.RecPlan.ayat.push({ name: i + 1 });
                            }
                        }

                    };
                    
                    

                    scope.getRange = function(n, m) {
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
                            scope.RecPlan.selectedD = scope.RecPlan.selectedM=null;
                            return;
                        }
                        //var monthes = [];
                        scope.monthes = (selY == scope.picker.currentYear) ?
                            scope.getRange(scope.picker.currentMonth, 13)
                          : scope.getRange(1, scope.picker.currentMonth);

                    }

                    scope.getDays = function (selY, selM) {
                        if (selY == null || selM == null) {
                            scope.days = [];
                            scope.RecPlan.selectedD = null;
                            return;
                        }
                        scope.days = (selM == scope.picker.currentMonth) ?
                            scope.getRange(scope.picker.currentDay, scope.picker.getDaysInMonth(selY, selM) + 1)
                          : scope.getRange(1, scope.picker.getDaysInMonth(selY, selM));
                    }

                    scope.delete = function (plan) {
                        $('#' + plan.Id).remove();
                        planServices.unassignStudFromPlan(studentId, plan.Id, function () {
                            console.log('deleted successfully');
                        }, function (error) {
                            console.log(error)
                        })
                        
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
                            tsmi3Services.updatetsmi3Plan(
                                                    studentId,
                                                    parseInt(scope.RecPlan.selectedSura.ayastartindex) + scope.RecPlan.selectedAya.name - 1,//aya index in quraan
                                                    d, //hijiri date
                                                    selectedPlan.Id || selectedPlan.id,//plan id in prev or new plan
                                                    function (data) {
                                                        console.log(data)
                                                        $modalInstance.close();

                                                    },
                                                    function (err) {
                                                        console.log(err)
                                                        $modalInstance.close();


                                                    });
                        } else {
                            tsmi3Services.createNewPlan(
                                                   studentId,
                                                   parseInt(scope.RecPlan.selectedSura.ayastartindex) + scope.RecPlan.selectedAya.name - 1,//aya index in quraan
                                                   d, //hijiri date
                                                   selectedPlan.Id || selectedPlan.id,//plan id in prev or new plan
                                                   function (data) {
                                                       student.isAssigned = true;
                                                       console.log(data)
                                                       $modalInstance.close();

                                                   },
                                                   function (err) {
                                                       console.log(err)
                                                       if (ErrorName == "DateError") {
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
                    studentId : function() {
                        return $scope.StuId;
                    },
                    selectedPlan: function() {
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
            planServices.unassignStudFromPlan(student.Id, $scope.vars.selectedRingPlan.Id, function (data) {
                console.log(data);
                student.isAssigned = false;
            }, function (error) {
                console.log(error);
            })
    }
    
}];