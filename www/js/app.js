// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.config', 'ionMdInput', 'starter.controllers', 'starter.services', 'starter.utils', 'starter.config', 'starter.auth', 'ionic-material' , 'ngCordova'])
.run(function($ionicPlatform, $rootScope, $state, $timeout, $ionicLoading, $ionicPopup) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
 		
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
		
	   // $rootScope.showLoading = function(text) {
	      //  $ionicLoading.show({
	            //template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner><br/>' + msg
	           // template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div><br>' + text
	       // });
	    //};

	   // $rootScope.hideLoading = function() {
	      //  $ionicLoading.hide();
	    //};

	    //  $rootScope.showLoading("Loading the app...");
		
    });
})



.run(function($rootScope, Auth, $firebaseObject) {
	Auth.$onAuthStateChanged(function(firebaseUser) {
		//$rootScope.loggedIn = !!firebaseUser;
		if (firebaseUser) {
		
		 $rootScope.loggedIn = !!firebaseUser;
	    }  else {
	     $rootScope.loggedIn = '';
	    }	
		
    });
})



.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  



  $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
  })

  
  
  
  .state('app.activity', {
      url: '/activity',
      views: {
          'menuContent': {
              templateUrl: 'templates/activity.html',
              controller: 'ActivityCtrl'
          },
          'fabContent': {
              template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-calendar"></i></button>',
              controller: function ($timeout) {
                  $timeout(function () {
                      document.getElementById('fab-activity').classList.toggle('on');
                  }, 200);
              }
          }
      }
  })

  .state('app.friends', {
      url: '/friends',
      views: {
          'menuContent': {
              templateUrl: 'templates/friends.html',
              controller: 'FriendsCtrl'
          },
          'fabContent': {
              template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
              controller: function ($timeout) {
                  $timeout(function () {
                      document.getElementById('fab-friends').classList.toggle('on');
                  }, 900);
              }
          }
      }
  })

  .state('app.gallery', {
      url: '/gallery',
      views: {
          'menuContent': {
              templateUrl: 'templates/gallery.html',
              controller: 'GalleryCtrl'
          },
          'fabContent': {
              template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
              controller: function ($timeout) {
                  $timeout(function () {
                      document.getElementById('fab-gallery').classList.toggle('on');
                  }, 600);
              }
          }
      }
  })

  .state('app.login', {
      url: '/login',
      views: {
          'menuContent': {
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl'
          },
          'fabContent': {
              template: ''
          }
      }
  })



  .state('app.profile', {
      url: '/profile',
      views: {
          'menuContent': {
              templateUrl: 'templates/profile.html',
              controller: 'ProfileCtrl'
          },
          'fabContent': {
              templateUrl: 'templates/profileFabButtonAdd.html',
              controller: 'ProfileCtrlFabButton'
          }
      }
  })

  .state('app.eventCat', {
        url: '/eventCat/:eventType',
        views: {
          'menuContent' :{
            templateUrl: 'templates/eventCat.html',
            controller: 'eventCategoryCtrl'
          },
          'fabContent': {
              templateUrl: '',
              controller: ''
          }
        }
      })



	  .state('app.addEvent', {
	        url: '/addEvent',
	        views: {
	          'menuContent' :{
	            templateUrl: 'templates/addEvent.html',
	            controller: 'AddEventCtrl'
	          },
	          'fabContent': {
	              templateUrl: '',
	              controller: ''
	          }
	        }
	      })



	  
	  .state('app.detail', {
	        url: '/detail/:eventId',
	        views: {
	          'menuContent' :{
	            templateUrl: 'templates/detail.html',
	            controller: 'DetailCtrl'
	          },
	          'fabContent': {
	              templateUrl: '',
	              controller: ''
	          }
	        }
	      })

		  


	  .state('app.categories', {
	        url: '/categories',
	        views: {
	          'menuContent' :{
	            templateUrl: 'templates/categories.html',
	            controller: 'categoriesCtrl'
	          },
	          'fabContent': {
	              templateUrl: '',
	              controller: ''
	          }
	        }
	      })





  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
  

});

