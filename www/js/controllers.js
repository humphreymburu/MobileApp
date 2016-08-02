'use strict'
angular.module('starter.controllers', ['starter.utils', 'starter.auth', 'ngCordova'])

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


.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk,  Auth, $state, fbutil, $firebaseAuth) {
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
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // The email of the user's account used.
	    var email = error.email;
	    // The firebase.auth.AuthCredential type that was used.
	    var credential = error.credential;
		if (errorCode === 'auth/account-exists-with-different-credential') {
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
    
	
     var email = $scope.data.email;
     var pass = $scope.data.pass;
	  
  	    Auth.$signInWithEmailAndPassword(email,pass)
  	   .then(function(firebaseUser) {
  	       console.log("Signed in as:", firebaseUser.uid);
  	     $state.go('app.profile');
  	    }).catch(function(error) {
  	       console.error("Authentication failed:", error);
  	    });
	
	
	

		
	  
    };

    $scope.createAccount = function(email,pass) {
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
          .then(function(user) {
            // create a user profile in our data store
			  var ref = firebase.database().ref('users/' + firebaseUse.uid);
			              return fbutil.handler(function(cb) {
			                ref.set({email: email, name: name||firstPartOfEmail(email)}, cb);
			              });
			            }) 
          .then(function(/* user */) {
            // redirect to the account page
            $state.go('app.profile');
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps() {
      if( !$scope.data.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.data.pass || !$scope.data.confirm ) {
        $scope.err = 'Please enter a password';
      }
      else if( $scope.data.createMode && $scope.data.pass !== $scope.data.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
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
  
  .controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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
  })

  .controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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
  })



  .controller('AddEventCtrl', function($scope, Auth, $rootScope, $firebaseArray, $firebaseObject, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaCamera, $firebaseAuth) {
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
	
	  
	  
	  
	  var firebaseUser = Auth.$getAuth();
	  
	  console.log("Signed in as:", firebaseUser.uid);
	  
	  if(firebaseUser) {
		  var eventsRef = new firebase.database().ref('users/' +  firebaseUser.uid + '/events');
		  var eventsInfo = $firebaseArray(eventsRef);
		  
          
		  $scope.addEvent =  function(nameEvent,desc,type,date,venue) {
			 
			  var nameEvent = $scope.data.nameEvent;
			  var desc  = $scope.data.desc;
			  var type = $scope.data.venue;
			  var date = $scope.data.date;
			  var venue= $scope.data.venue;
			 
			  eventsInfo.$add ({
				  nameEvent,desc,type,date,venue
		         
				  
			  }).then(function(ref) {
				  
				  $scope.data.nameEvent = '';
				  $scope.data.desc = '';
				  $scope.data.venue = '';
				  $scope.data.date = '';
				  $scope.data.venue = '';
				  
				  
				  
				  var id = ref.key;
				  console.log("added record with id " + id);
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
	
	  
	  
	  
	  
	  
	  
	  $scope.types = [
		  { id: 1, type: 'Appearance'},
		  { id: 2, type: 'Attraction'},
		  { id: 3, type: 'Camp'},
		  { id: 4, type: 'Concert'},
		  { id: 5, type: 'Conference'},
		  { id: 6, type: 'Convention'},
		  { id: 7, type: 'Demonstration'},
		  { id: 8, type: 'Dinner'},
		  { id: 9, type: 'Festival'},
		  { id: 10, type: 'Food Tasting'},
		  { id: 11, type: 'Game'},
		  { id: 12, type: 'Marathon'},
		  { id: 13, type: 'Meeting'},
		  { id: 14, type: 'Other'},
		  { id: 15, type: 'Party'},
		  { id: 16, type: 'Race'},
		  { id: 17, type: 'Rally'},
		  { id: 18, type: 'Screening'},
		  { id: 19, type: 'Seminar'},
		  { id: 20, type: 'Tour'},
		  { id: 21, type: 'Festival'},
		  { id: 22, type: 'Wine Tasting'}  	
	  ];
	  
    
	
	  
	  
	  
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
  
  
  
  .controller('eventCategoryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
      $scope.$parent.showHeader();
      //$scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
     // $scope.$parent.setHeaderFab(false);

      // Activate ink for controller
     // ionicMaterialInk.displayEffect();

      ionicMaterialMotion.pushDown({
          selector: '.push-down'
      });
      ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
      });

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