'use strict'
angular.module('starter.controllers', ['starter.utils', 'starter.auth', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    //$scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})


.controller('LoginCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk,  Auth, $state, fbutil, $firebaseAuth) {
    $scope.$parent.clearFabs();
     $timeout(function() {
         $scope.$parent.hideHeader();
     }, 0);
     ionicMaterialInk.displayEffect();
	
	
  $scope.faceSign = function() {


	var provider = new firebase.auth.FacebookAuthProvider();
	   provider.addScope('email');
	
	  firebase.auth().signInWithRedirect(provider).then(function() {
		 
	    // Never called because of page redirect
	  }).catch(function(error) {
	    console.error("Authentication failed:", error);
	  });
	
	
	  firebase.auth().getRedirectResult().then(function(result) {
	 // Auth.$getRedirectResult().then(function(result) {
	    if (result.credential) {
	      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
	      var token = result.credential.accessToken;
	      // ...
	    }
	    // The signed-in user info.
	    var user = result.user;
	  }).catch(function(error) {
	    // Handle Errors here.
	    $scope.errorCode = error.code;
	    $scope.errorMessage = error.message;
	    // The email of the user's account used.
	    $scope.email = error.email;
	    // The firebase.auth.AuthCredential type that was used.
	    $scope.credential = error.credential;
		if ($scope.errorCode === 'auth/account-exists-with-different-credential') {
		          alert('You have already signed up with a different auth provider for that email.');
		          // If you are using multiple auth providers on your app you should handle linking
		          // the user's accounts here.
		        } else {
		          console.error(error);
		        }
	    // ...
	  });
	
	
	 $state.go('app.profile');
	 
	
  }
  
  
  
  
   $scope.twitterSign = function() {
	  
	    var provider = new firebase.auth.TwitterAuthProvider();
   	
	 firebase.auth().signInWithRedirect(provider).then(function() {
		 //$ionicLoading.hide(); 

	    // Never called because of page redirect
	  }).catch(function(error) {
	    console.error("Authentication failed:", error);
	  });
	
	
	  firebase.auth().getRedirectResult().then(function(result) {
	    if (result.credential) {
	      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
	      // You can use these server side with your app's credentials to access the Twitter API.
	      var token = result.credential.accessToken;
	      var secret = result.credential.secret;
	      // ...
	    }
	    // The signed-in user info.
	    var user = result.user;
	  }).catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // The email of the user's account used.
	    var email = error.email;
	    // The firebase.auth.AuthCredential type that was used.
	    var credential = error.credential;
	    // ...
	  });
	
	  $state.go('app.profile');
	
	
   }
  
  


	$scope.data = {
		"email" : null,
		"pass"  : null,
		"confirm" : null,
		"createMode" : false
	}
	

    $scope.login = function(email, pass) {
      $scope.err = null;
    //$rootScope.showLoading('Logging you in...');
	
     var email = $scope.data.email;
     var pass = $scope.data.pass;
	  
  	    Auth.$signInWithEmailAndPassword(email,pass)
  	   .then(function(firebaseUser) {
  	       console.log("Signed in as:", firebaseUser.uid);
		   $scope.data.email ='';
		   $scope.data.pass = '';
		   
		 $state.go('app.profile');
		
		 
  	    }).catch(function(error) {
  	       //$scope.error = errorMessage(error);
		   $scope.errorCode = error.code;
		   $scope.errorMessage = error.message;
		            // [START_EXCLUDE]
		  if ($scope.errorCode === 'auth/wrong-password') {
		              console.log('Wrong password.');
		            } else {
		              console.log($scope.errorMessage);
		            }
  	    });
	
	
	 //$rootScope.hideLoading();
     
		
	  
    };

    $scope.createAccount = function(email,pass) {
     // $rootScope.showLoading('Creating Account...');
	  $scope.err = null;
      if( assertValidAccountProps() ) {
        var email = $scope.data.email;
        var pass = $scope.data.pass;
        // create user credentials in Firebase auth system
		Auth.$createUserWithEmailAndPassword(email,pass)        
		.then(function() {
            // authenticate so we have permission to write to Firebase
            return Auth.$signInWithEmailAndPassword(email,pass);
          })
          .then(function(firebaseUser) {
            // create a user profile in our data store
			  var ref = firebase.database().ref('users/' + firebaseUser.uid);
			              return fbutil.handler(function(cb) {
			                ref.set({email: email, name: name||firstPartOfEmail(email)}, cb);
			              });
			            }) 
          .then(function(/* user */) {
            // redirect to the account page
            $state.go('app.profile');
			
			
          }).catch(function(error){
            $scope.error = errorMessage(error);
			//$rootScope.hideLoading();
			//$rootScope.alert('<b><i class="icon ion-person"></i> Login error</b>', err);
          });
		  
      }
	 
	 
    };

    function assertValidAccountProps() {
      if( !$scope.data.email ) {
        $scope.error = 'Please enter an email address';
      }
      else if( !$scope.data.pass || !$scope.data.confirm ) {
        $scope.error = 'Please enter a password';
      }
      else if( $scope.data.createMode && $scope.data.pass !== $scope.data.confirm ) {
        $scope.error = 'Passwords do not match';
      }
      return !$scope.error;
	  
    }

    function errorMessage(error) {
      return angular.isObject(error) && error.code? error.code : error + '';
    }

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }
	 //$rootScope.hideLoading();
  })
  
  
  .controller('categoriesCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab(false);
	  
      // Delay expansion
      $timeout(function() {
          $scope.isExpanded = true;
          $scope.$parent.setExpanded(true);
      }, 300);
	   
	  //$rootScope.hideLoading();
	  
      ionicMaterialInk.displayEffect();

      ionicMaterialMotion.pushDown({
          selector: '.push-down'
      });
      ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
      });
	  
       
	  $scope.colors = ['bismark','wild', 'green', 'bismark', 'turquoise' , 'helio' , 'milan'];
	



	  
  })
  
  
  
  
  
  
  
  
  .controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.$parent.setHeaderFab('left');

      // Delay expansion
      $timeout(function() {
          $scope.isExpanded = true;
          $scope.$parent.setExpanded(true);
      }, 300);

      // Set Motion
      ionicMaterialMotion.fadeSlideInRight();

      // Set Ink
      ionicMaterialInk.displayEffect();
  })
  
  .controller('ProfileCtrl', function($scope, Events, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = false;
      $scope.$parent.setExpanded(false);
      $scope.$parent.setHeaderFab(false);

      // Set Motion
      $timeout(function() {
          ionicMaterialMotion.slideUp({
              selector: '.slide-up'
          });
      }, 300);

      $timeout(function() {
          ionicMaterialMotion.fadeSlideInRight({
              startVelocity: 3000
          });
      }, 700);

      // Set Ink
      ionicMaterialInk.displayEffect();
	 // $rootScope.hideLoading();
	  
	 // $scope.events = Events.getEvents();
	  //console.log($scope.events);
	  $scope.limit = 15;
	  
	  $scope.events = Events.getEvents();
	  console.log($scope.events);
	  
	  
	  
  })

  
  
  .controller('ProfileCtrl', function($scope, Events, Auth,  $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = false;
      $scope.$parent.setExpanded(false);
      $scope.$parent.setHeaderFab(false);

      // Set Motion
      $timeout(function() {
          ionicMaterialMotion.slideUp({
              selector: '.slide-up'
          });
      }, 300);

      $timeout(function() {
          ionicMaterialMotion.fadeSlideInRight({
              startVelocity: 3000
          });
      }, 700);

      // Set Ink
      ionicMaterialInk.displayEffect();
	  //$rootScope.hideLoading();
	  
	 // $scope.events = Events.getEvents();
	  //console.log($scope.events);
	  $scope.limit = 15;
	  
	  $scope.events = Events.getEvents();
	 
	 
	  $rootScope.firebaseUser = Auth.$getAuth();
	  $scope.userId = $rootScope.firebaseUser.uid;
	  
	 
	  
	  
  })
  
  

  .controller('DetailCtrl', function($scope, Events, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab('right');

      $timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
              selector: '.animate-fade-slide-in .item'
          });
      }, 200);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();
	  
		
		
	  var eventId = $stateParams.eventId;
	  console.log(eventId);
	  $scope.event = Events.getEvent(eventId);
	  console.log($scope.event);
	
      
	 
	  
	  
	  
  })



  .controller('AddEventCtrl', function($scope, Auth, Events, Loader, $ionicPopup, $rootScope, $firebaseArray, $firebaseObject, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaCamera, $firebaseAuth) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab('right');
	  
	  

      $timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
              selector: '.animate-fade-slide-in .item'
          });
      }, 200);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();
	  
	  
  	$scope.data = {
  		"nameEvent" : null,
  		"desc"  : null,
  	     "type" : null,
  		"date" : null,
		"venue" : null
  	}
	
	  
	
	  
	  $rootScope.firebaseUser = Auth.$getAuth();
	  
	  console.log("Signed in as:", $rootScope.firebaseUser.uid);
	  
	  $scope.types = [
		  { id: 1, type: 'Meetings & Conference'},
		  { id: 2, type: 'Music'},
		  { id: 3, type: 'Sports & Fitness'},
		  { id: 4, type: 'Food & Lifestyle'},
		  { id: 5, type: 'Fashion'},
		  { id: 6, type: 'Other'},
		  { id: 7, type: 'Science & Tech'}, 
		  { id: 8, type: 'Parties'}, 
		  { id: 9, type: 'Art'}, 
		  { id: 10, type: 'Education'}, 
		  { id: 12, type: 'Travel & Outdoor'}, 
		  { id: 13, type: 'Education'}, 
		  { id: 14, type: 'Training & Seminars'},
		  { id: 15, type: 'Film & Media'} 
	  ];
	  
	  
	  
	  
	  
	  if($rootScope.firebaseUser) {
		  var eventsRef = new firebase.database().ref('events/');
		  var eventsInfo = $firebaseArray(eventsRef);
		  
		
		  var user = $rootScope.firebaseUser.uid;
		  console.log("Signed in as:", user);
		  
		  $scope.addEvent =  function(nameEvent,desc,type,date,venue) {
			 //Loader.showLoading('Adding new event...');
			 //$rootScope.showLoading('Adding Event ...')
			 //console.log("Signed in as:", firebaseUser.uid);
			  console.log("Signed in as:", user);
			  var nameEvent = $scope.data.nameEvent;
			  var desc  = $scope.data.desc;
			  var type = $scope.data.type;
			  var date = $scope.data.date.getTime();
			  var venue = $scope.data.venue;
			  var userId = $scope.user;
			 
			  eventsInfo.$add ({
				  nameEvent,desc,type,date,venue,user
		         
				  
			  }).then(function(ref) {
				  
				  $scope.data.nameEvent = '';
				  $scope.data.desc = '';
				  $scope.data.venue = '';
				  $scope.data.date = '';
				  $scope.data.venue = '';
				  $scope.user = '';
				  
				  
				  var id = ref.key;
				  console.log("added record with id " + id);
				  
				  $rootScope.hideLoading();
			  });
		  };
	   }//user authenticated
	  
	  
	  
	  
	  
   	document.addEventListener("deviceready", function () {
   	  $scope.upload = function() {
   	          var options = {
   	              quality : 75,
   	              destinationType : Camera.DestinationType.FILE_URI,
   	              sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
   	              allowEdit : true,
   	              encodingType: Camera.EncodingType.JPEG,
   	              popoverOptions: CameraPopoverOptions,
   	              targetWidth: 500,
   	              targetHeight: 500,
   	              saveToPhotoAlbum: false
   	          };
	          
   			  $cordovaCamera.getPicture(options).then(function(imageData) {
   			        //var image = document.getElementById('myImage');
   			        $scope.pic= "data:image/jpeg;base64," + imageData;
   			        
					//savePic(imageData);
				  
				  
				  }, function(err) {
   			        // error
					  console.error(err);
   			      });	  
   	      }	  
   	  }, false);
	
	  
	  
	  
	  
	  
	  
	 
	  
    
	
	  
	  
	  
  })



  .controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab(false);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();

      ionicMaterialMotion.pushDown({
          selector: '.push-down'
      });
      ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
      });

  })
  
  
  
  .controller('eventCategoryCtrl', function($scope, Events, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
     $scope.$parent.setHeaderFab(false);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();

      ionicMaterialMotion.pushDown({
          selector: '.push-down'
      });
      ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
      });
	  
	  
	  
	  
	  var type = $stateParams.eventType;
	//  console.log(type);
	  $scope.type = type;
	  console.log($scope.type);
	
	  
	  $scope.type = { };
	  $scope.type = $stateParams.eventType;
	
	  
	  $scope.filters = { };
	  $scope.events = Events.getEvents();
	  
	  $scope.types = [
		  { id: 1, type: 'Meetings & Conference'},
		  { id: 2, type: 'Music'},
		  { id: 3, type: 'Sports & Fitness'},
		  { id: 4, type: 'Food & Lifestyle'},
		  { id: 5, type: 'Fashion'},
		  { id: 6, type: 'Other'},
		  { id: 7, type: 'Science & Tech'}, 
		  { id: 8, type: 'Parties'}, 
		  { id: 9, type: 'Art'}, 
		  { id: 10, type: 'Education'}, 
		  { id: 11, type: 'Travel & Outdoor'}, 
		  { id: 12, type: 'Education'}, 
		  { id: 13, type: 'Training & Seminars'},
		  { id: 14, type: 'Film & Media'} 
	  ];
	  
	  
	  
	  
	  

  })
  
  
  
  .controller('ProfileCtrlFabButton', function($scope, $stateParams, $timeout, ionicMaterialInk, $state, ionicMaterialMotion, $ionicPopup, $rootScope) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.$parent.setHeaderFab('left');

      $timeout(function () {
          $scope.showFabButton = true;
      }, 900);


	  $scope.create = function() {
	      $state.go('app.addEvent');
	  };







    

  })
 ;