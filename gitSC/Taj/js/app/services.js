
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
            console.log(data);
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
        //var json = text.replace(/'/g, '"');
        //return json;
    }
});


tajAppAppServices.factory("mainServices", function (serviceUtils) {

    // get main or sub categories 
    // if categoryId == null ? Main : sub;
    var 
        getCategoryList = function (categoryId, successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=categorylist&categoryid=' + categoryId,
                data: null,
                success: successFn,
                error: errorFn
            });
        },

        // get number of updated categories cout
        // if lastUpdatedDate == null ? last 24 hour : since lastUpdatedDate;
        getUpdatedcategorycount = function (lastUpdatedDate, successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=updatedcategorycount&lastupdate=' + lastUpdatedDate,
                data: null,
                success: successFn,
                error: errorFn
            });
        },

        // get number of updated categories 
        // if lastUpdatedDate == null ? last 24 hour : since lastUpdatedDate;
        // 100 per call as max
        getUpdatedcategories = function (lastUpdatedDate, from, successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=updatedcategory&lastupdate=' + lastUpdatedDate + '&from=' + from,
                data: null,
                success: successFn,
                error: errorFn
            });
        },

        // get list of contents types
        getContentTypes = function ( successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=typelist',
                data: null,
                success: successFn,
                error: errorFn
            });
        },

        // get contents of a type inside category         
        getUpdatedcategories = function (categoryId, typeId, successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=contentlist&categoryid=' + categoryId + '&typeid=' + typeId,
                data: null,
                success: successFn,
                error: errorFn
            });
        },

        // get full content         
        getFullContent = function (contentId, successFn, errorFn) {

            serviceUtils.callService({
                method: 'GET',
                url: 'query=content&contentid=' + contentId ,
                data: null,
                success: successFn,
                error: errorFn
            });
        }


    

    return {
        getCategoryList: getCategoryList,
        getUpdatedcategorycount: getUpdatedcategorycount,
        getUpdatedcategories: getUpdatedcategories,
        getContentTypes: getContentTypes,
        getUpdatedcategories: getUpdatedcategories,
        getFullContent: getFullContent
    };
});

