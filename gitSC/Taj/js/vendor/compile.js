var compile = angular.module('compile', [], ['$compileProvider' , function($compileProvider) {
    // configure new 'compile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('compile', ['$compile' , '$parse' ,function ($compile, $parse) {
        return {
            link: function(scope, element, attr) {
                var parsed = $parse(attr.ngBindHtml);

                function getStringValue() { return (parsed(scope) || '').toString(); }

                //Recompile if the template changes
                scope.$watch(getStringValue, function() {
                    $compile(element, null, -9999)(scope); //The -9999 makes it skip directives so that we do not recompile ourselves
                });
            }
        };
    }]);
}]);