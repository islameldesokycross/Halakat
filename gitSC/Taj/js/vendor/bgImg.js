var bgimageApp = angular.module('bgimageApp',[]);
bgimageApp.directive('bgImage', function () {
    return {
        link: function (scope, element, attr) {

            attr.$observe('bgImage', function () {
                if (typeof (scope.defaultImage) == 'undefined') {
                    scope.defaultImage = "images/male/Main_Avatar.png";
                }
                if (!attr.bgImage) {
                    // No attribute specified, so use default
                    element.css("background-image", "url(" + scope.defaultImage + ")");
                } else {
                    var image = new Image();
                    image.src = attr.bgImage;
                    image.onload = function () {
                        //Image loaded- set the background image to it
                        element.css("background-image", "url(" + attr.bgImage + ")");
                    };
                    image.onerror = function () {
                        //Image failed to load- use default
                        element.css("background-image", "url(" + scope.defaultImage + ")");
                    };
                }
            });
        }
    };
});