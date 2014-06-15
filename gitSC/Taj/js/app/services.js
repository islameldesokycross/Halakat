
var tajAppAppServices = angular.module('tajApp.services', []);

// service utils services 
tajAppAppServices.factory("serviceUtils", function ($http/*, log*/) {

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
            data: (ajaxStngs.method == 'POST' && ajaxStngs.data != null ) ?
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
});

tajAppAppServices.filter('replace2Json', function () {
    return function (text) {
        var json = text.replace(/'/g, '"');
        return json;
    }
});

// post services factory
tajAppAppServices.factory("mainServices", function (serviceUtils) {

    var updatedCategoryCount = function (lastupdate, successFn, errorFn) {

        serviceUtils.callService({
            method: 'GET',
            url: 'query=updatedcategorycount&lastupdate= ' + lastupdate,
            data: null,
            success: successFn,
            error: errorFn
        });
    }

    

    return {
        updatedCategoryCount: updatedCategoryCount
    };
});

