
var halakatServices = angular.module('halakat.services', []);

// service utils services 
halakatServices.factory("serviceUtils", ['$http', '$log', function ($http, $log) {

    var utils = {};


    // main service URL
    utils.serviceURL = 'http://halaqat.gplanet-tech.com/';


    // default ajax obj
    utils.settings = {
        method: 'POST',
        url: utils.serviceURL,
        data: null,
        params: null,
        headers: null,
        timeout: 20000,
        cache: false,
        responseType: "",
        success: function (data, status, headers, config) {
            console.log(data.replace(/'/g, '"'));
        },
        error: function (data, status, headers, config) {
            console.log("http error > " + status + ": " + JSON.stringify(data));
        }
    };

    // generic method to be used across any http request
    // input : object of ajax params
    utils.callService = function (params) {
        //check if any of the params is undefined
        var ajaxStngs = angular.extend({}, utils.settings, params);
        if (ajaxStngs.success == undefined) ajaxStngs.success = utils.settings.success;
        if (ajaxStngs.error == undefined) ajaxStngs.error = utils.settings.error;
        $http({
            method: ajaxStngs.method,
            url: utils.serviceURL + ajaxStngs.url,
            data: (ajaxStngs.method == 'POST' && ajaxStngs.data != null) ?
                 JSON.stringify(ajaxStngs.data) : ajaxStngs.data,
            params: ajaxStngs.params,
            headers: ajaxStngs.headers,
            timeout: ajaxStngs.timeout,
            cache: ajaxStngs.cache,
            responseType: ajaxStngs.responseType,
        })
        .success(ajaxStngs.success)
        .error(ajaxStngs.error);
    };
    return utils;
}]);

halakatServices.factory("userServices", function (serviceUtils) {
    var baseurl = "api/User/";
    // get main or sub categories 
    // if categoryId == null ? Main : sub;
    var login = function(userName, pass, userType, successFn, errorFn) {  
        serviceUtils.callService({
            method: 'Post',
            url: baseurl+'CheckForAdminLogin',
            data: {
                "PassWord": pass,
                "UserName": userName,
                "UserTypeId": userType
            },
            success: successFn,
            error: errorFn
        });
    },
        creatNewUser = function(name, pass, userName, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl+'CheckForAdminLogin',
                data: {
                    "Name": name,
                    "PassWord": pass,
                    "UserName": userName,
                    "UserTypeId": "0"
                },
                success: successFn,
                error: errorFn
            });
        };
    return {
        login: login,
        creatNewUser: creatNewUser
        
    };
});

halakatServices.factory("studentServices", function(serviceUtils) {
    var baseurl = "api/Student/";
    var getAll = function(successFn, errorFn) {
        serviceUtils.callService({
            method: 'GET',
            url: baseurl + 'GetAllStudent',
            data: {},
            success: successFn,
            error: errorFn
        });
    },
        getAllStudentByRingId = function(ringId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetAllStudentByRingId?ringId=' + ringId,
                data: {},
                success: successFn,
                error: errorFn
            });
        };

    return {
        getAll: getAll,
        getAllStudentByRingId: getAllStudentByRingId
    };
});

halakatServices.factory("ringServices", function (serviceUtils) {
    var baseurl = "api/Ring/",
        selectedRing = null;

    var getAll = function(successFn, errorFn) {
        serviceUtils.callService({
            method: 'GET',
            url: baseurl + 'GetAllRings',
            data: {},
            success: successFn,
            error: errorFn
        });
    },
        getAllRingsByTeacherId = function(teacherId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetAllRingsByTeacherId?id=' + teacherId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
        createNewring = function(successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'CreateNewRing',
                data: {
                    "mosqueId": 1,
                    "TeacherId": 2,
                    "CreateDate": "12/12/2014",
                    "Name": "name1"
                },
                success: successFn,
                error: errorFn
            });
        },
        setSelectedRing = function(ring) {
            selectedRing = ring;
        };

    return {
        getAll: getAll,
        getAllRingsByTeacherId: getAllRingsByTeacherId,
        createNewring: createNewring,
        setSelectedRing: setSelectedRing,
        selectedRing: selectedRing
    };
});


halakatServices.factory("planServices", function (serviceUtils) {
    var baseurl = "api/SavingPlan/";
    // get main or sub categories 
    // if categoryId == null ? Main : sub;
    var createNewPlan = function(planName, planNum, planDays, ringId, successFn, errorFn) {
        serviceUtils.callService({
            method: 'Post',
            url: baseurl + 'CreateNewSavingPlan',
            data: {
                "PlanName": planName,
                "PlanNumber": planNum,
                "PlanDays": planDays,
                "RingId": ringId
            },
            success: successFn,
            error: errorFn
        });
    },
        updatePlan = function(planId, planName, planNum, planDays, ringId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'UpdateSavingPlan',
                data: {
                    "Id": planId,
                    "PlanName": planName,
                    "PlanNumber": planNum,
                    "PlanDays": planDays,
                    "RingId": ringId
                },
                success: successFn,
                error: errorFn
            });
        },
        deletePlan = function(planId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'DeleteSavingPlan',
                data: {
                    "Id": planId
                },
                success: successFn,
                error: errorFn
            });
        },
        getAllPlansByRingId = function(ringId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetAllSavingPlanByRingId?ringId=' + ringId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
        getAllPlansById = function(planId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetSavingPlanByid?Id=' + planId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
        getAllPlansByStudentId = function(studentId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'getAllSavingPlansByStudentID?Id=' + studentId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
        unassignStudFromPlan = function(studentId, planId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'UnassignStudentFromTheSavingPlan',
                data: {
                    "StudentId": studentId,
                    "SavingPlanId": planId
                },
                success: successFn,
                error: errorFn
            });
        },
        getStudentsassignedtoplan = function(planId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'getAllStudentByAssignedSavingPlanID?Id=' + planId,
                data: {},
                success: successFn,
                error: errorFn
            });
        };
    return {
        createNewPlan: createNewPlan,
        updatePlan: updatePlan,
        deletePlan: deletePlan,
        getAllPlansByRingId: getAllPlansByRingId,
        getAllPlansById: getAllPlansById,
        getAllPlansByStudentId: getAllPlansByStudentId,
        unassignStudFromPlan: unassignStudFromPlan,
        getStudentsassignedtoplan: getStudentsassignedtoplan

    };
});

halakatServices.factory("tsmi3Services", function (serviceUtils) {
    var baseurl = "api/RecitationsPlan/";
    // get main or sub categories 
    // if categoryId == null ? Main : sub;
    var createNewPlan = function(studentId, swraStart, startDate, savingPlanId, recitationsAssignments, successFn, errorFn) {
        serviceUtils.callService({
            method: 'Post',
            url: baseurl + 'CreateNewRecitationsPlan',
            data: {
                "StudentId": studentId,
                "SwraStart": swraStart,
                "StartDate": startDate,
                "SavingPlanId": savingPlanId,
                "RecitationsAssignments": recitationsAssignments
            },
            success: successFn,
            error: errorFn
        });
    },
        updatetsmi3Plan = function(tsmi3PlanId, studentID, swraStartDate, startDate, savingPlanId, ringId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'UpdateRecitationsPlan',
                data: {
                    "Id": tsmi3PlanId,
                    "StudentId": studentID,
                    "SwraStartDate": swraStartDate,
                    "StartDate": startDate,
                    "SavingPlanId": savingPlanId
                },
                success: successFn,
                error: errorFn
            });
        },
        deletetsmi3Plan = function(tsmi3PlanId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'DELETE',
                url: baseurl + 'DeleteRecitationsPlan?id=' + tsmi3PlanId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
        getAllAssignmentByTsmi3PlanId = function(Tsmi3PlanId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetAllRecitationsAssignmentByRecitationsPlanId?recitationsPlanId=' + Tsmi3PlanId,
                data: {},
                success: successFn,
                error: errorFn
            });
        };
    return {
        createNewPlan: createNewPlan,
        updatetsmi3Plan: updatetsmi3Plan,
        deletetsmi3Plan: deletetsmi3Plan,
        getAllAssignmentByTsmi3PlanId: getAllAssignmentByTsmi3PlanId

    };
});

halakatServices.factory("Mos7afNoteServices", function (serviceUtils) {
    var baseurl = "api/Mos7afNote/";
    // get main or sub categories 
    // if categoryId == null ? Main : sub;
    var createNewNote = function (studentId, pageNumber, lineNumber, startLocation, endLocation,currentWordNote, successFn, errorFn) {
        serviceUtils.callService({
            method: 'Post',
            url: baseurl + 'CreateNewMos7afNote',
            data: {
                "StudentId": studentId,
                "PageNumber": pageNumber,
                "LineNumber": lineNumber,
                "StartLocation": startLocation,
                "EndLocation": endLocation,
                "CurrentWordNote": currentWordNote
            },
            success: successFn,
            error: errorFn
        });
    },
        updateNote = function (noteID, studentID, pageNumber, lineNumber, startLocation, endLocation, currentWordNote, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'UpdateMos7afNote',
                data: {
                    "Id": noteID,
                    "StudentId": studentID,
                    "PageNumber": pageNumber,
                    "LineNumber": lineNumber,
                    "StartLocation": startLocation,
                    "EndLocation": endLocation,
                    "CurrentWordNote": currentWordNote
                },
                success: successFn,
                error: errorFn
            });
        },
        deleteNote = function (noteId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'Post',
                url: baseurl + 'DeleteMos7afNote',
                data: { "ID": noteId },
                success: successFn,
                error: errorFn
            });
        },
        getNotesByStudentId = function (studentId, successFn, errorFn) {
            serviceUtils.callService({
                method: 'GET',
                url: baseurl + 'GetMos7afNoteByStudentId?StudentId=' + studentId,
                data: {},
                success: successFn,
                error: errorFn
            });
        },
         getNotesById = function (noteId, successFn, errorFn) {
             serviceUtils.callService({
                 method: 'GET',
                 url: baseurl + 'GetMos7afNoteById?id=' + noteId,
                 data: {},
                 success: successFn,
                 error: errorFn
             });
         };
    return {
        createNewNote: createNewNote,
        updateNote: updateNote,
        deleteNote: deleteNote,
        getNotesByStudentId: getNotesByStudentId,
        getNotesById: getNotesById

    };
});

halakatServices.factory("Mos7afData", function() {
    //QuranData is the variable of quraan data in quran-data.js
    var getSuraData = function (suraNumber, property) {
        return QuranData.suras.sura[suraNumber - 1][property];
    };
    //properities -- >"index","sura","aya","ayasNum"
    var getJuzData = function (juzNumber, property) {
        return QuranData.juzs.juz[juzNumber - 1][property];
    };
    var getJuzNumberOfAyas = function(juzNum) {
        return getJuzData(juzNum, "ayasNum");
    };
    var getJuzStartPage = function (juzNum) {
        var startPage = "";
        if (juzNum == "1" || juzNum == "7" || juzNum == "11") {
            switch (juzNum) {
                case "1":
                    startPage = "1";
                    break;
                case "7":
                    startPage = "121";
                    break;
                case "11":
                    startPage = "201";
                    break;
                default:
            }
        } else {
            startPage = ((juzNum - 1) * 20) + 2;
        }
        return startPage;
    };
    var getJuzSuraStart = function(juzNum) {
        var sura = { index: "", name: "", startAya: "",startPage:"" };
        sura.index = getJuzData(juzNum, "sura");
        sura.name = getSuraData(sura.index, "name");
        sura.startAya = getJuzData(juzNum, "aya");
        sura.startPage = getJuzStartPage(juzNum);

        return sura;
    };
    var getJuzNumOfPages = function(juzNum) {
        return getJuzStartPage(juzNum + 1) - getJuzStartPage(juzNum);
    };
    var getQuraanSuras = function() {
        return QuranData.sura;
    };
    return {
        getSuraData: getSuraData,
        getJuzData: getJuzData,
        getJuzNumberOfAyas: getJuzNumberOfAyas,
        getJuzSuraStart: getJuzSuraStart,
        getJuzStartPage: getJuzStartPage,
        getJuzNumOfPages: getJuzNumOfPages,
        getQuraanSuras: getQuraanSuras
    };
});

halakatServices.factory("AyatData", function(parameters) {
    //ayatData is the variable of ayat data in ayat-data.js
    
})
