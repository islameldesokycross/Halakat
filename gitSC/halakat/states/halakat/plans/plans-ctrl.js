var plansCtrl = ['$scope', '$state', '$modal', 'planServices', 'studentServices', function ($scope, $state, $modal, planServices, studentServices) {

    window.plans = $scope;
    $scope.vars = {plan:{id:null,name:"",number:"",days:"",assignedStudents:[]},ringStudents:[],ringPlans:[],selectedRingPlan:""};
    $scope.funs = {};
    $scope.radio1Model = '0';
    $scope.$parent.vars.titleTxt = 'الخطط';

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
        //empty the assigned students if change plan
        $scope.vars.plan.assignedStudents = [];
        planServices.getAllPlansById(planId, function(data) {
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
            function(err) {

            });
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
                planDays.push("4");
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
            planServices.updatePlan($scope.vars.plan.Id, $scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
            function (data) {
                console.log("updated successfully --> " + data)
            },
            function (err) {
                console.log(err)
            });
        } else {
            planServices.createNewPlan($scope.vars.plan.name, $scope.vars.plan.number, $scope.vars.plan.days, $scope.selectedRing.ID,
            function (data) {
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
                function(data) {
                    $scope.vars.plan.assignedStudents = data;
                },
                function(err) {
                    console.log(err);
                });
        }
        
    };
    $scope.getStudentsByRingId = function(ringId) {
        studentServices.getAllStudentByRingId(ringId,
            function(data) {
                $scope.vars.ringStudents = data;
                $scope.getSssignedStudenttoAplan();
            },
            function(err) {
                console.log(err);
            })
    };
    $scope.isAssigned = function(id) {
        var assigned = _.indexOf($scope.vars.plan.assignedStudents, id);
        if (assigned != -1) {
            return true;
        }
        return false;
    };
    $scope.opentasme3 = function (id) {
        if ($scope.isAssigned(id)) {
            studentServices.unassignStudFromPlan(id, $scope.vars.selectedRingPlan,
                function (data) {
                    console.log("success" + data);
                },
                function(err) {
                    
                }
            );
        } else {
            var modalInstance = $modal.open({
                templateUrl: 'tasme3.html',
                controller: ['$scope', '$modalInstance', function (scope, $modalInstance) {



                    scope.ok = function () {
                        $modalInstance.close();
                    };

                    scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                resolve: {

                }
            });
        }
    };

    $scope.getStudentsByRingId($scope.selectedRing.ID);
    $scope.getRingPlans($scope.selectedRing.ID)
    
}];