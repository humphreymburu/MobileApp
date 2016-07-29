angular.module('starter.factory', ['starter.utils'])

.factory('events', function() {
	
}

.factory('Loader', ['$ionicLoading', '$timeout',
   function($ionicLoading, $timeout) {
       var LOADERAPI = {
           showLoading: function(text) {
               text = text || 'Loading...';
               $ionicLoading.show({
                   template: text
               });
},
           hideLoading: function() {
               $ionicLoading.hide();
},
           toggleLoadingWithMessage: function(text, timeout) {
               $rootScope.showLoading(text);
               $timeout(function() {
                   $rootScope.hideLoading();
               }, timeout || 3000);
           }
};
       return LOADERAPI;
   }])
