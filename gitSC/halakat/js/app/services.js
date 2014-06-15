
var halakatServices = angular.module('halakat.services', []);

// service utils services 
halakatServices.factory("serviceUtils", ['$http', '$log', function ($http, $log) {

    var utils = {};


    // main service URL
    utils.serviceURL = 'http://tajalfhars.com/taj/index.php?op=smartphone&';


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

