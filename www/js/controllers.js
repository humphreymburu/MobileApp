//'use strict'
angular.module('starter.controllers', ['starter.utils', 'starter.auth', 'ngCordova', 'starter.services', 'starter.directives', 'angularGeoFire', 'ngStorage'])

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


.controller('LoginCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk, $localStorage,
    $sessionStorage, Auth, $state, fbutil, $firebaseAuth, $ionicLoading) {
    $scope.$parent.clearFabs();
     $timeout(function() {
         $scope.$parent.hideHeader();
     }, 0);
     ionicMaterialInk.displayEffect();
	
    	$scope.data = {
		"email" : null,
		"pass"  : null
		//"confirm" : null,
		//"createMode" : false
	}
	

    $scope.userLogin = function(email, pass) {
    $scope.errorCode
	$scope.errorMessage = null;

	     // $ionicLoading.show({
	        //template: 'Logging in progress'
	      //});
	
	
     var email = $scope.data.email;
     var pass = $scope.data.pass;
	  
	  
	  
  	 
    	
	  
	  firebase.auth().signInWithEmailAndPassword(email, pass).then(function(firebaseUser) {
  	       console.log("Signed in as:", firebaseUser.uid);
		   $scope.data.email ='';
		   $scope.data.pass = '';
		 
		 
		var credential = firebase.auth.EmailAuthProvider.credential(email, pass);
		 
		   
	   	  var previousUser = firebase.auth().currentUser;
	       console.log(previousUser);
		  // $scope.previousUser.link($scope.credential)
		   
		  var pendingCred = $localStorage.credential;
		   
		  // console.log("storage2", $localStorage.credential);
		   
		   if(pendingCred) {
			   
		      var pendingCredObj = firebase.auth.FacebookAuthProvider.credential(JSON.parse(pendingCred));
 		   
		      previousUser.link(pendingCredObj).then(function(user) {
 		          console.log("Facebook Account linking success", user);
 		      }, function(error) {
 		       console.log("Facebook Account linking error", error);
			   // Sign in user with another account
			     firebase.auth().signInWithCredential(pendingCredObj).then(function(user) {
			     console.log("Sign In Success", user);
			     var currentUser = user;
			     // Merge prevUser and currentUser accounts and data
				 previousUser = currentUser;

			   }, function(error) {
			      console.log("Sign In Error", error);
			   });
			   
			   
 		   });
			
		  } else if (credential) {
		  	
			 previousUser.link(credential).then(function(user) {
			    console.log(" email/ password account linking success", user);
			  }, function(error) {
			    console.log("email/ password account linking error", error);
				
				  firebase.auth().signInWithCredential(credential).then(function(user) {
				  console.log("Sign In Success", user);
				  var currentUser = user;
				  // Merge prevUser and currentUser accounts and data
				  // ...
				  
				  previousUser = currentUser;
				  
				}, function(error) {
				  console.log("Sign In Error", error);
				});
				
				
				
				
				
			  });
			
			
			
			
		  }
		  
		  
		  
		  
		  
		  firebase.auth().onAuthStateChanged(function(user) {
		    if (user) {
		      // User is signed in.
				$state.go('app.profile');
		
		 	   	 // var previousUser = firebase.auth().currentUser;
		 	       //console.log($scope.previousUser);
		 		  // $scope.previousUser.link($scope.credential)
  
		 		   //$localStorage.previousUser = JSON.stringify(previousUser);
		
		    } else {
		      // No user is signed in.
		    }
		  });
		  
		   
		   
		  
	
		 
  	    }).catch(function(error) {
  	       //$scope.error = errorMessage(error);
		   $scope.errorCode = error.code;
		   $scope.errorMessage = error.message;
		            // [START_EXCLUDE]
		
		     
			 
		  switch ($scope.errorCode) {
		          case 'auth/wrong-password':
		            $scope.errorMessage = 'Wrong password';
					
		            break;
		          case 'auth/user-not-found':
		            $scope.errorMessage = 'User not found';
		            break;
	              case 'auth/invalid-email':
	                $scope.errorMessage = 'Invalid email';
	                break;
                  case 'auth/user-disabled':
                    $scope.errorMessage = 'User Disabled';
                    break;
		
				  default:
		            $scope.errorMessage = 'Error: [' + error.code + ']';
		        }
			 
			 
			 
			 
			 
			        
  	    });
	
	
	 //$rootScope.hideLoading();
	 
	 $ionicLoading.hide();
     
   	
   
	
	

	
	
	
	  
    };
	

	
	

    
	
	
	
	
  })
  
  
  
  
  .controller('createAccountCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, $localStorage,
    $sessionStorage, Auth, $state, fbutil, $firebaseAuth, $ionicPopup, $ionicHistory) {
		
      // $scope.$parent.showHeader();
	  
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Ink
        ionicMaterialInk.displayEffect();
	

	   $scope.login = function() {
	      $state.go('app.createAccount');
	   };

	
	   $scope.back = function() {
		  $state.go('app.login'); 
	   };
		
	   	
       $scope.createAccount = function(email, pass, firstName, lastName) {
        // $rootScope.showLoading('Creating Account...');
   	   $scope.err = null;

	
	
   	Auth.$createUserWithEmailAndPassword(email, pass)        
	    .then(function() {
           // authenticate so we have permission to write to Firebase
           return Auth.$signInWithEmailAndPassword(email,pass);
         })
         .then(function(firebaseUser) {
               // create a user profile in our data store
							 var userNames = firstName + ' ' + lastName;
   			  var ref = firebase.database().ref('users/');
   			  ref.push({
				  email: email,
				  displayName: userNames
   		     });
		   
		   })         
	     .then(function(/* user */) {
               // redirect to the account page
               $state.go('app.profile');
         }).catch(function(error){
			  
   			  $scope.errorCode = error.code;
   			 $scope.Message = error.message;
			   
			  switch ($scope.errorCode) {
			          case 'auth/email-already-in-use':
			            $scope.errorMessage = 'Email already in use';
			            break;
			          case 'auth/invalid-email':
			            $scope.errorMessage = 'Invalid Email';
			            break;
		              case 'auth/weak-password':
		                $scope.errorMessage = 'Weak Password';
		                break;
	                  case 'auth/operation-not-allowed':
	                    $scope.errorMessage = 'Operation not Allowed';
	                    break;
		
					  default:
			            $scope.errorMessage = 'Error: [' + error.code + ']';
			        } 
	 		  
   			//$rootScope.hideLoading();
   			//$rootScope.alert('<b><i class="icon ion-person"></i> Login error</b>', err);
             });
		  
        
		 }
		
		
		
	})
  
  
    .controller('emailLoginCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, $localStorage,
      $sessionStorage, Auth, $state, fbutil, $firebaseAuth, $ionicPopup, $ionicHistory, $ionicModal, $ionicLoading) {
		
        // $scope.$parent.showHeader();
	  
          $scope.$parent.clearFabs();
          $scope.isExpanded = false;
          $scope.$parent.setExpanded(false);
          $scope.$parent.setHeaderFab(false);

          // Set Ink
          ionicMaterialInk.displayEffect();
	

  	   $scope.login = function() {
  	      $state.go('app.createAccount');
  	   };

	
  	   $scope.back = function() {
  		  $state.go('app.login'); 
  	   };

		
		
	   $ionicModal.fromTemplateUrl('templates/forgot_password.html', {
	       scope: $scope,
	       animation: 'slide-in-up'
	     }).then(function(modal) {
	       $scope.forgot_modal = modal;
	     });	
		
		
	   $scope.showForgotPassword = function() {
	       $scope.forgot_modal.show();
	   };
	   
	   $scope.hideForgotPassword = function() {
	       $scope.forgot_modal.hide();
	   };
		
 
		
  	})
	
	

  
  
  
  
  
  
  
  .controller('SignUpCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, $localStorage,
    $sessionStorage, Auth, $state, fbutil, $firebaseAuth, $ionicPopup) {
      
		$ionicSideMenuDelegate.canDragContent(false);
	  
	  
	  $scope.$parent.clearFabs();
       $timeout(function() {
           $scope.$parent.hideHeader();
       }, 0);
       ionicMaterialInk.displayEffect();
	
	
	
	
	
	   $scope.login = function() {
	       $state.go('app.login');
	   }
	
	
	
	
    $scope.facebook = function() {
		
		
		var fbLoginSuccess = function (userData) {
		  console.log("UserInfo: ", JSON.stringify(userData));
		  facebookConnectPlugin.getAccessToken(function(token) {
		    console.log("Token: " + token);
			
			signFb(token);
		    authDetails();
		
		  });
		           
		  
		}
		
	  function signFb(token) {
		  
	      var credential = firebase.auth.FacebookAuthProvider.credential(token);
			 console.log("UserInfo: ", JSON.stringify(credential));
		  
		  var prevUser = firebase.auth().currentUser;
		  
		  console.log("prevUser", JSON.stringify(prevUser));
		  
		  firebase.auth().signInWithCredential(credential).then(function(user) {
			  console.log(" Fb Sign In Success", user);
			  firebase.auth().onAuthStateChanged(function(user) {
			    if (user) {
			      // User is signed in.
				$state.go('app.profile');
				
				
				
					
		  	   	 // var previousUser = firebase.auth().currentUser;
		  	       //console.log($scope.previousUser);
		  		  // $scope.previousUser.link($scope.credential)
		   
		  		 $localStorage.previousUserz = JSON.stringify(prevUser);
				 
				 
				 
				 var email = user.email;
				         
				 console.log("Display", email);
				 console.log("user6", user);
				  
				 var ref = firebase.database().ref("users");
				  ref.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
				    console.log("papa", snapshot.key);
					
		            var displayName = user.displayName;
		            var email = user.email;
		            var photoURL = user.photoURL;
		            var uid = user.uid;
					
					
					if(!snapshot.key) {
						
						  firebase.database().ref('users/' + 'id').set({
						    username: displayName,
						    email: email,
						    profile_picture : user.photoURL
						  });
							
						  console.log("saved new user data");
							
						
					} else if (snapshot.key) {
						
						var userId = snapshot.key;
						
						
						  firebase.database().ref('users/' + userId).update({
						    username: displayName,
						    email: email,
						    profile_picture : user.photoURL
						  });
						
						  console.log("updated user details");
					} else {
						console.log("already added user details");
					}
					
					
					
					
					
					
				  });
				 
				 
				 
					
			    } else {
			      // No user is signed in.
					$state.go('app.login');
			    }
			  });
			  
		  }, function(error) {
		     
			  if (error.code === 'auth/account-exists-with-different-credential') {
			      
				  console.log("email already exists");
				  // Step 2.
			      // User's email already exists.
			      // The pending Facebook credential.
			      var pendingCred = error.credential;
				 
			      // The provider account's email address.
			      var email = error.email;
			      // Get registered providers for this email.
			     firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
					  console.log(providers);
			        // Step 3.
			        // If the user has several providers,
			        // the first provider in the list will be the "recommended" provider to use.
			        if (providers[0] === 'password') {
			          // Asks the user his password.
			          // In real scenario, you should handle this asynchronously.
			          //var password = promptUserForPassword(); // : implement promptUserForPassword.
					  //$state.go('app.login');
					   console.log("pn", email, credential);
					   
					   $localStorage.credential = JSON.stringify(credential);
					   $localStorage.email = JSON.stringify(email);
					  
					   var pendingCred = $localStorage.credential;
					   
					   console.log("storage", pendingCred);
					   
					  
					   
					   
					   
					 $scope.login();
			          //auth.signInWithEmailAndPassword(email, password).then(function(user) {
			            // Step 4a.
			          //  return user.link(pendingCred);
			          //}).then(function() {
			            // Facebook account successfully linked to the existing Firebase user.
			         
						  //});
			          return;
			        }
			        // All the other cases are external providers.
			        // Construct provider object for that provider.
			        // implement getProviderForProviderId.
			        //var provider = getProviderForProviderId(providers[0]);
			        // At this point, you should let the user know that he already has an account
			        // but with a different provider, and let him validate the fact he wants to
			        // sign in with this provider.
			        // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
			        // so in real scenario you should ask the user to click on a "continue" button
			        // that will trigger the signInWithPopup.
			        //auth.signInWithPopup(provider).then(function(result) {
			          // Remember that the user may have signed in with an account that has a different email
			          // address than the first one. This can happen as Firebase doesn't control the provider's
			          // sign in flow and the user is free to login using whichever account he owns.
			          // Step 4b.
			          // Link to Facebook credential.
			          // As we have access to the pending credential, we can directly call the link method.
			         // result.user.link(pendingCred).then(function() {
			            // Facebook account successfully linked to the existing Firebase user.
			           
			         // });
			        //});
			      });
			    }
		  });
		  
		  
          
	  }
	
	
	  
	
	
	
	
	
	
	
	  function authDetails() {
		
		facebookConnectPlugin.api("me?fields=id,email,name", ["user_birthday", "public_profile", "email" ],
		  function onSuccess (result) {
		    console.log("Resultzz: ", JSON.stringify(result));
			
			/*var userData = {
				id: result.id,
				name: result.name,
				email: result.email
			}*/
			
			        //Do what you wish to do with user data. Here we are just displaying it in the view
			      // $scope.fbData = JSON.stringify(userData, null, 4);
				   //console.log($scope.fbData);
				   
				   
				   
				   
				   
					
		  }, function onError (error) {
		    console.error("Failed: ", JSON.stringify(error));
		  }
		);
	  }
	

		facebookConnectPlugin.login(["public_profile"],
		    fbLoginSuccess,
		    function (error) { console.log("" + error) }
		);
	
	
	    
	
	
	
	
	    
	
	}




 
	  
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
  
  
  
  
  
  
  
  
  .controller('tabsCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {
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
      //ionicMaterialMotion.fadeSlideInRight();

      // Set Ink
      //ionicMaterialInk.displayEffect();
	  
	  
	
	  
  })
  
  .controller('ProfileCtrl', function($scope, Events, Auth, fbutil, $rootScope, $stateParams, $localStorage,
    $sessionStorage, $timeout, ionicMaterialMotion, $state, ionicMaterialInk, $firebaseAuth, $firebaseObject, Profiles) {
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
	  
	  
	  //$rootScope.firebaseUser = Auth.$getAuth();
	 // var userId = $rootScope.firebaseUser.uid;
	//  console.log("Signed in as:", userId);
	  
	
	  
	     // var unbind;
	      // create a 3-way binding with the user profile object in Firebase
		 /// var user = firebase.auth().currentUser;
	  
	  
		 // var uid = user.id;
	    // console.log(uid);
		 
		// var test = Profiles.getProfile(uid);
	      //console.log("testing",test)
	 
	  
	  
	  firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.
			console.log("Signed in as", user.uid);
			//console.log("user", JSON.stringify(user));

           
			
			$scope.photoUrl = user.photoURL;
			console.log("urlpic",$scope.photoUrl);
			
			
			
				
		 var email = user.email;
		         
		 console.log("Display", email);
		  
		 var ref = firebase.database().ref("users");
		  
		  ref.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
		    console.log("papa4", snapshot.key);
			
			
			$scope.id = snapshot.key;
			console.log("uid", $scope.id);
			
			var adaRef = ref.child($scope.id);
			var adaFirstNameRef = adaRef.child('profile_picture');
			console.log("pic", adaFirstNameRef);
			
			
			
			
		});

		//var picRef = firebase.database().ref("users").child($scope.id);
		var usersRef = firebase.database().ref('users');
		
		//console.log("uid2", $scope.uid);



	
	    } else {
	      // No user is signed in.
	    }
	  });
	  
	  
		 // var profile = $firebaseObject(fbutil.ref('users' + $scope.uid));
	  
	     
	  
	  
	  
	  
		  var profile = $firebaseObject(fbutil.ref('users' + 'id'));
	      profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

	      // expose logout function to scope
	      $scope.logout = function() {
	        if( unbind ) { unbind(); }
	        profile.$destroy();
	        Auth.$signOut();
	        $location.path('/login');
	      };

	      $scope.changePassword = function(pass, confirm, newPass) {
	        resetMessages();
	        if( !pass || !confirm || !newPass ) {
	          $scope.err = 'Please fill in all password fields';
	        }
	        else if( newPass !== confirm ) {
	          $scope.err = 'New pass and confirm do not match';
	        }
	        else {
	          Auth.$changePassword({email: profile.email, oldPassword: pass, newPassword: newPass})
	            .then(function() {
	              $scope.msg = 'Password changed';
	            }, function(err) {
	              $scope.err = err;
	            })
	        }
	      };

	      $scope.clear = resetMessages;

	      $scope.changeEmail = function(pass, newEmail) {
	        resetMessages();
			
	        var email = $scope.data.newEmail;
	        var pass = $scope.data.pass;
			
			
			
	        var oldEmail = profile.email;
	        Auth.$changeEmail({oldEmail: oldEmail, newEmail: email, password: pass})
	          .then(function() {
	            // store the new email address in the user's profile
	            return fbutil.handler(function(done) {
	              fbutil.ref('users', user.uid, 'email').set(newEmail, done);
	            });
	          })
	          .then(function() {
	            $scope.emailmsg = 'Email changed';
	          }, function(err) {
	            $scope.emailerr = err;
	          });
	      };

	      function resetMessages() {
	        $scope.err = null;
	        $scope.msg = null;
	        $scope.emailerr = null;
	        $scope.emailmsg = null;
	      }
	    
	  
	  
	  
		  $scope.settings = function() {
		                 $state.go('app.account');
		              };
	  
	 
	  
	  
	  
	  
	  
	  
	  
	  
  })



.controller('ResetCtrl', function($scope, $timeout, $rootScope, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, $localStorage,
    $sessionStorage, Auth, $state, fbutil, $firebaseAuth, $ionicPopup) { 
      
        
		$scope.reset = function(email) {
            var emailAddress = $scope.data.email;
			  console.log(emailAddress);

              var auth = firebase.auth();
              auth.sendPasswordResetEmail(emailAddress).then(function() {
               // Email sent.
              }).catch(function(error) {
              // An error happened.

             $scope.errorCode = error.code;
   			 $scope.Message = error.message;
			   
			  switch ($scope.errorCode) {
			          case 'auth/invalid-email':
			            $scope.errorMessage = 'Invalid Email';
			            break;
	                  case 'auth/operation-not-allowed':
	                    $scope.errorMessage = 'Operation not Allowed';
	                    break;
					  default:
			            $scope.errorMessage = 'Error: [' + error.code + ']';
			        } 

              });



             
		}
		
		 


	})





.controller('AccountCtrl', function($scope, Events, Auth, fbutil, $rootScope, $stateParams, $localStorage,
    $sessionStorage, $timeout, ionicMaterialMotion, $ionicModal, $ionicLoading, $ionicPopup,  ionicMaterialInk , $firebaseAuth, $ionicHistory, $firebaseObject, Profiles) {
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
	
	  
	  
	 
			

		    $ionicModal.fromTemplateUrl('templates/policy.html', {
		        scope: $scope,
		        animation: 'slide-in-up'
		    }).then(function(modal) {
		        $scope.modal = modal;
				console.log($scope.modal);
		    });


		    $ionicModal.fromTemplateUrl('templates/services.html', {
		        scope: $scope,
		        animation: 'slide-in-up'
		    }).then(function(modal) {
		        $scope.modal = modal;
				console.log($scope.modal);
		    });



		    $scope.openServices = function() {
		        $scope.modal.show();
		    };
			
		    $scope.closeServices= function() {
		        $scope.modal.hide();
		    };




		    $scope.openPrivacy = function() {
		        $scope.modal.show();
		    };
			
		    $scope.closePrivacy = function() {
		        $scope.modal.hide();
		    };
		    // Cleanup the modal when we're done with it
		    $scope.$on('$destroy', function() {
		        $scope.modal.remove();
		    });
           
			 
	    
	  
	  
	  
	  
	  
	 
	  
	  
	  
	  
	  
	  
	  
	  
  })
 
  .controller('editDetailsCtrl', function($scope, Events, Auth, fbutil, $rootScope, $stateParams, $localStorage,
    $sessionStorage, $timeout, ionicMaterialMotion, $ionicActionSheet,$q, $ionicModal, $cordovaCamera, $cordovaImagePicker, $cordovaFile, $ionicLoading, $ionicPopup,  ionicMaterialInk , $firebaseAuth, $ionicHistory, $firebaseObject, Profiles) {
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
	
	  var user = firebase.auth().currentUser;
    var firstName,lastName, photoUrl, emailVerified;
console.log(user.uid);
      if (user != null) {
		 console.log("who is", user.lastName, user);
          $scope.firstname = user.displayName.split(' ').slice(0, -1);
		      $scope.lastname = user.displayName.split(' ').slice(-1);
          $scope.email = user.email;
          $scope.photoUrl = user.photoURL;
          $scope.emailVerified = user.emailVerified;
          //uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.

				   if(user.provider!= null) {
					    user.providerData.forEach(function (profile) {
                        $scope.firstname = profile.displayName.split(' ').slice(0, -1);
						$scope.lastname = profile.displayName.split(' ').slice(-1);
                        $scope.email = profile.email;
                        $scope.photoURL = profile.photoURL;
					})
				   }
}
	  
	 
	 
	  var displayNamez = $scope.email;
	  console.log(displayNamez);
	  
	    $scope.updateProfile = function(email,firstname,lastname) {
			var displayName = firstname +' '+ lastname;
              user.updateProfile({
		      email: email,
		      displayName: displayName

        
           }).then(function() {
           // Update successful.
           }).catch(function(error) {
           // An error happened.
           });

		}
	  
	  
          









	
	
function saveStorage(_imageBlob) {
var user = firebase.auth().currentUser;

if (user) {
	 var userId = user.uid;
	 console.log("know", _imageBlob);

	 var storageRef = firebase.storage().ref('users').child(userId + '/profilePicture.jpeg');
	 var uploadTask = storageRef.putString(_imageBlob);
  // User is signed in.
} else {
  // No user is signed in.
	console.log("not signed");
}



// Upload file and metadata to the object 'images/mountains.jpg'
//var uploadTask = storageRef.child('images/' + _imageBlob.name).putString(_imageBlob);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
   console.log("uploaded");
  }, function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

 

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  var downloadURL = uploadTask.snapshot.downloadURL;
	 console.log("url download", downloadURL);
 
		
          // we have the information on the image we saved, now 
          // let's save it in the realtime database
						 
          //return saveReferenceInDatabase(_responseSnapshot);
					console.log("save ref db");
         
          var durl = $scope.pictureUrl();
          
    	



		
	

});

	}	

$scope.pictureUrl = function() {
	// Create a reference to the file we want to download
var user = firebase.auth().currentUser;
         var userId = user.uid;
         var storageRef = firebase.storage().ref('users').child(userId + '/profilePicture.jpeg');

// Get the download URL
storageRef.getDownloadURL().then(function(url) {
  // Insert url into an <img> tag to "download"

var dataSave = {
  pictureUrl: url
}
firebase.database().ref('users/' + userId).update(dataSave).then(function() {
  console.log("Update successful");
}).catch(function(error) {
  consorle.log(error);
});


	console.log(url);
	return url;
}).catch(function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object_not_found':
      // File doesn't exist
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;



    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});

}


$scope.takePicture = function() {
            

  var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
	  correctOrientation:true
    };

    $cordovaCamera.getPicture(options)
		.then(function(imageData) {
      var image2 = 'data:image/jpeg;base64,' + imageData;
      console.log(image2);
      return saveStorage(image2);

    }, function(err) {
      console.log(err);
			console.log("blimey");
    });	  
	
}



function saveTo(_imageBlob) {

      return $q(function (resolve, reject) {
        // Create a root reference to the firebase storage
        var storageRef = firebase.storage().ref();

        // pass in the _filename, and save the _imageBlob
        var uploadTask = storageRef.child('images/').put(_imageBlob);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function (error) {
          // Handle unsuccessful uploads, alert with error message
          alert(error.message)
          reject(error)
        }, function () {
          // Handle successful uploads on complete
          var downloadURL = uploadTask.snapshot.downloadURL;

          // when done, pass back information on the saved image
          resolve(uploadTask.snapshot)
        });
      });
    }








function dataURItoBlob(dataURI, type) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: type });
    return bb;
}


$scope.showz = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { 
				 text: 'Take new photo'
			
		   },
       { 
				 text: 'Choose existing photo' 
				
			 }
     ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
		 switch(index) {
			 case 0:
			       $scope.takePicture();
             return true;
			 case 1:
			 return true;
		 }
       
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 200000);

 };
	  


	 
	  
	  
	  
	  
	  
	  
	  
	  
  })
 
  .controller('introCtrl', function($scope, Events, Auth, fbutil, $rootScope, $state, $stateParams, $localStorage,
    $sessionStorage, $timeout, ionicMaterialMotion, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, $ionicSideMenuDelegate, $ionicPopup,  ionicMaterialInk , $firebaseAuth, $ionicHistory, $firebaseObject, Profiles) {
      // Set Header
		$ionicSideMenuDelegate.canDragContent(false);

	  
	  $scope.$parent.showHeader();
	  
   
	  
	  
      $scope.$parent.clearFabs();
      $scope.isExpanded = false;
      $scope.$parent.setExpanded(false);
      $scope.$parent.setHeaderFab(false);
      $timeout(function() {
          $scope.$parent.hideHeader();
      }, 0);





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
	
	  
	    
	  $scope.options = {
	    loop: false,
	    effect: 'fade',
	    speed: 500,
	  }

	  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	    // data.slider is the instance of Swiper
	    $scope.slider = data.slider;
	  });

	  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	    console.log('Slide change is beginning');
	  });

	  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
	    // note: the indexes are 0-based
	    $scope.activeIndex = data.slider.activeIndex;
	    $scope.previousIndex = data.slider.previousIndex;
	  });
	  
	  
	  $scope.skip = function() {
		                 $state.go('app.login');
		              };
	  
	 
	  
	  
	  
	  
	  
	  
	  
	  
  })
 
 
 

  .controller('DetailCtrl', function($scope, $cordovaSocialSharing, Events, Auth, $firebaseArray, $firebaseObject, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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
	
	  var ref = firebase.database().ref('event');
	      var name, descriptions;
	      $scope.event_infos = [];

		  $rootScope.firebaseUser = Auth.$getAuth(); 
		   var userId = $rootScope.firebaseUser.uid;


	      ref.on('value' ,function(snapshot){
	          var userId = firebase.auth().currentUser.uid;
	         // $scope.event_infos = [];

	          snapshot.forEach(function(childSnapshot){

	              var marked = firebase.database().ref('favorites/'+ eventId + childSnapshot.key);
	              marked.on('value', function(snapshot_user){
	              var obj = { 
	                  "id":           childSnapshot.key,
	                  "title":        childSnapshot.val().nameEvent,
	                  "description":  childSnapshot.val().desc,
	                  "marked":       snapshot_user.child("marked").val()
	              };
	              $scope.events_infos.push(obj);
	          })
	      });
	  });

	     
		 
	// function likesCount(likes) {
	
				 //return like;
	//}
	 
  
  
	
	    var countRef = firebase.database().ref('favorites/' + eventId);
	   // countRef.child('likes');
	    countRef.on('value', function(snapshot) {
	     var favs = snapshot.child("likes").val();
		 console.log(favs);
		 
		  $scope.likeCounts = favs;
	    });
		

  
  
  
  
	 
	 
	      $scope.isFavorite = function(){
			 // $rootScope.firebaseUser = Auth.$getAuth(); 
			  // var userId = $rootScope.firebaseUser.uid;
			 var event = Events.getEvent(eventId);
	         var userRef = firebase.database().ref('favorites/'+ eventId);
			 userRef.child(userId).set( true ); 
			
		  
	 
		 	
			 
			 
			 userRef.once('value', function(snapshot) {
	 //        event.marked = true;
	
			 
			 var likes = snapshot.child("likes").val() ? snapshot.child("likes").val() : 0; 
			 
			 var marked = snapshot.child("marked").val() ? snapshot.child("marked").val() : false;      
			// var likes = $scope.likeCounts;
			console.log(likes);
		   
		    
	          userRef.transaction(function () {
				 // $scope.likes = likes + 1;
				   
	 	  			 
			 
			console.log(marked);
	   		 //likesRef.child('likes');		
			 //var marked = false;
			 if (!marked) { 
				 $scope.likes = likes += 1;
				$scope.marked = true;
			 } else {
				 $scope.likes = likes -= 1;
				 $scope.marked = false;
				
			 }
			
			});
			
			
			console.log($scope.marked);
		
			
			 userRef.set({
	            marked: $scope.marked,
				userId: userId,
				 likes: $scope.likes
	         }).then(function(result){
				 //event.marked = true;
	      });
		});
	  }
	 
	  
      
	  $scope.share = function () {
	      console.log('Share Native');
         var shareRef = firebase.database().ref('events/'+ eventId);
		 shareRef.once('value', function(snapshot) {
 	     		$scope.title = snapshot.child("nameEvent").val();
	     })
 		 console.log($scope.title);
		 $cordovaSocialSharing
		 //var event = Events.getEvent(eventId);
       
		  		
			.share('Hi there, I found this intresting event', $scope.title , null, 'The link')
	        .then(function(result) {
	          console.log(result);
	        }, function(err) {
	          console.log('Error: ' + JSON.stringify(err));
	        });
	    };
    
	
		    
	  
  })

 


  .controller('AddEventCtrl', function($scope, Auth, Events, Geos, Loader, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, $cordovaFile, $ionicPopup, $rootScope, $firebaseArray, $firebaseObject, $stateParams, $q, $timeout, ionicMaterialMotion, ionicMaterialInk,  $firebaseAuth) {
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
	  
	  
	  
	  $scope.processForm = function() {
	          console.log('awesome!');
	      };  
	  
	  
	  
		  $scope.disableTap = function() {
		                  var container = document.getElementsByClassName('pac-container');
		                  angular.element(container).attr('data-tap-disabled', 'true');
		                  var backdrop = document.getElementsByClassName('backdrop');
		                  angular.element(backdrop).attr('data-tap-disabled', 'true');
		                  angular.element(container).on("click", function() {
		                      document.getElementById('pac-input').blur();
		                  });
		              };
  
  
			
			
					 /** var vm = this;
					    $scope.placeChanged = function() {
					      vm.place = this.getPlace();
						  
						  $scope.data.location = vm.place.geometry.location;
					      console.log('location', vm.place.geometry.location);
					    } 	**/		
					  
  
  
  
					
  
  
			        
				 
  
  
  
  
     
  
  
	  
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
	  
	 
			 
			
			 $scope.disableSwipe = function() {
			     $ionicSlideBoxDelegate.enableSlide(false);
			   };

	  
	  
		  //if($rootScope.firebaseUser) {
			  

			  
			  var eventsRef = new firebase.database().ref('events/');
			  var eventsInfo = $firebaseArray(eventsRef);
	  
	
			  var user = $rootScope.firebaseUser.uid;
			  console.log("Signed in as:", user);
	
	  
	     
		    
		  /** 
		      *  from documentation:
		      *  https://firebase.google.com/docs/storage/web/upload-files
		      * 
		      * This function returns a promise now to better process the
		      * image data.
		      */
		     function saveToFirebase(_imageBlob, _filename) {

		       return $q(function (resolve, reject) {
		         // Create a root reference to the firebase storage
		         var storageRef = firebase.storage().ref();

		         // pass in the _filename, and save the _imageBlob
		         var uploadTask = storageRef.child('images/' + _filename).put(_imageBlob);

		         // Register three observers:
		         // 1. 'state_changed' observer, called any time the state changes
		         // 2. Error observer, called on failure
		         // 3. Completion observer, called on successful completion
		         uploadTask.on('state_changed', function (snapshot) {
		           // Observe state change events such as progress, pause, and resume
		           // See below for more detail
		         }, function (error) {
		           // Handle unsuccessful uploads,  with error message
		           alert(error.message)
		           reject(error)
		         }, function () {
		           // Handle successful uploads on complete
		           var downloadURL = uploadTask.snapshot.downloadURL;

		           // when done, pass back information on the saved image
		           resolve(uploadTask.snapshot)
		         });
		       });
		     }


		     function saveReferenceInDatabase(_snapshot) {
		      
			  var dataToSave =_snapshot.downloadURL;
			  console.log("url", dataToSave);
			  
		
		
		
		
			  $rootScope.getUrl = _snapshot.downloadURL;
			  console.log("tes",  $rootScope.getUrl);
			  
			  return dataToSave;
				 	
			  
		       // see information in firebase documentation on storage snapshot and metaData
		        // url to access file
		     }

		     /** 
		      * copied directly from documentation
		      * http://ngcordova.com/docs/plugins/imagePicker/
		      */
		     $scope.doGetImage = function () {
		       var options = {
		         maximumImagesCount: 1, // only pick one image
		         width: 800,
		         height: 800,
		         quality: 80
		       };

		       var fileName, path;

		       $cordovaImagePicker.getPictures(options)
		         .then(function (results) {
		           console.log('Image URI: ' + results[0]);

		           // lets read the image into an array buffer..
		           // see documentation:
		           // http://ngcordova.com/docs/plugins/file/
		           fileName = results[0].replace(/^.*[\\\/]/, '');

		           // modify the image path when on Android
		           if ($ionicPlatform.is("android")) {
		             path = cordova.file.cacheDirectory
		           } else {
		             path = cordova.file.tempDirectory
		           }

		           return $cordovaFile.readAsArrayBuffer(path, fileName);
		         }).then(function (success) {
		           // success - get blob data
		           var imageBlob = new Blob([success], { type: "image/jpeg" });

		           // missed some params... NOW it is a promise!!
		           return saveToFirebase(imageBlob, fileName);
		         }).then(function (_responseSnapshot) {
		           // we have the information on the image we saved, now 
		           // let's save it in the realtime database
		           return saveReferenceInDatabase(_responseSnapshot)
		         }).then(function (_response) {
					 
					 //$ionicLoading.show({
					      // template: 'Uploading...'
					    // });
					 
		           alert("Saved Successfully!!")
		         }, function (error) {
		           // error
		           console.log(error)
		         });
		     }
			  
			  
			 
				
				
			
			  
			
			
			  
			  
			  
			  
		    
	
			  
	  
			  //console.log("testo", $scope.fileUrl);
	  
			  $scope.addEvent =  function() {
				 //Loader.showLoading('Adding new event...');
				 //$rootScope.showLoading('Adding Event ...')
				 //console.log("Signed in as:", firebaseUser.uid);
				  console.log("Signed in as:", user);
				  //$scope.data = {};
				  //if(stepOne.$valid) {
				 
				   //var nameEvent = $scope.data.nameEvent;
				  // var desc  = $scope.data.desc;
				   //var type = $scope.data.type;
				   //var date = $scope.data.date;
				  // var venue = $scope.data.venue;
				   //var user = $scope.user;
		            
					
				   
				
					
				 
				  
				   var url = $rootScope.getUrl;
				
				console.log("tesp", url);
				
		        //var geoRef = Geos.geoFire;
				//console.log(geoRef);
		 
				 eventsInfo.$add ({
					  nameEvent: $scope.data.nameEvent,
					  desc: $scope.data.desc,
					  type: $scope.data.type,
					  date: $scope.data.date.getTime(),
					  venue: $scope.data.venue,
					  user: $rootScope.firebaseUser.uid,
				      lat : $scope.data.latitude,
				      lng: $scope.data.longitude
					// fileUrl: $rootScope.getUrl
					 

	
				 }).then(function(ref) {
			  
					  $scope.data.nameEvent = '';
					  $scope.data.desc = '';
					  $scope.data.venue = '';
					  $scope.data.date = '';
					  $scope.data.venue = '';
					  $scope.user = '';
					  
					 // $rootScope.getUrl = '';
			  
			  
					  var eventId = ref.key;
					  console.log("added record with id " + eventId);
					 
					 
   				     // var firebaseRef = firebase.database().ref('_geofire').child(id);
   				      //var geoFire = new GeoFire(firebaseRef);
				
					 
					 
					  var lat = $scope.data.latitude;
					  var lng = $scope.data.longitude;
				
					  var ref = new Firebase("https://events-app-363cb.firebaseio.com/");
					  var geoFire = new GeoFire(ref.child("_geofire"));

					 
					    //var location = snapshot.val();
                        console.log(eventId);
						
					    geoFire.set(eventId, [lat,lng]).then(function() {
					      console.log(eventId + " has been added to GeoFire");
					    }).catch(function(error) {
					      console.log("Error adding " + eventId + " to GeoFire: " + error);
					    });
					
					  
					
			  
					  //$rootScope.hideLoading();
				  });
				//}; 
			  };
		  // }//user authenticated
  
	  
		 $scope.next = function() {
		     $ionicSlideBoxDelegate.next();
		   };
		   $scope.previous = function() {
		     $ionicSlideBoxDelegate.previous();
		   };
 
	  
  })




  .controller('AddPhotoCtrl', function($scope, $timeout, ionicMaterialMotion, $rootScope, $firebaseArray, $firebaseObject, $stateParams, $q, $timeout, ionicMaterialMotion, ionicMaterialInk, $firebaseAuth) {
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
  
 
  

  .controller('locationCtrl', function($scope, $timeout, Auth, ionicMaterialMotion, $rootScope,$firebaseArray, $firebaseObject, $stateParams, $q, $timeout,ionicMaterialMotion, ionicMaterialInk, $firebaseAuth, $ionicLoading, $state, $cordovaGeolocation, $ionicPopup) {
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
	  
	  $scope.useGeolocation = function() {
	    $ionicLoading.show();
 
	    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
		.then(function (position) {
		  $ionicLoading.hide();	
	      $scope.lat  = position.coords.latitude;
	      $scope.lng = position.coords.longitude;
		  //$scope.coords = position.coords;
		  console.log('lat', $scope.lat);
		  console.log('long', $scope.lng);
		  addLocations($scope.lat,$scope.lng);
		  
	     }, function(err){
	     	console.log('getCurrentPosition error: ' + angular.toJson(err));
  	        $ionicLoading.hide();
  	        $ionicPopup.alert({
  	          title: 'Unable to get location',
  	          template: 'Please try again or move to another location.'
  	        });	 
		   
			var watchOptions = {
			    timeout : 5000,
			    enableHighAccuracy: false // may cause errors if true
			  };

			  var watch = $cordovaGeolocation.watchPosition(watchOptions);
			  watch.then(
			    null,
			    function(err) {
			      // error
			    },
			    function(position) {
					$scope.lat  = position.coords.latitude;
					$scope.lng = position.coords.longitude;
					//$scope.coords = position.coords;
					addLocations($scope.lat,$scope.lng);
			  });    
	    });
	  };
	  
	  console.log($scope.lat);
	  
	  
	  
	  
	  $rootScope.firebaseUser = Auth.$getAuth();
	  var userId = $rootScope.firebaseUser.uid;
	  			  console.log("Signed in as:", userId);
	  
	  
				  var firebaseRef = firebase.database().ref('user_locations').child(userId);
				  var geoFire = new GeoFire(firebaseRef);
	  
				  
				  
				  function addLocations(latitude,longitude) {
				  	
					  geoFire.set("userId", [$scope.lat, $scope.lng]).then(function() {
					    console.log("User Provided key and location has been added to GeoFire");
					  }, function(error) {
					    console.log("Error: " + error);
					  });
					
					
					
				  }
	  
	  
	  
	  
	  
	  
	  
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
  
  
  
  .controller('eventCategoryCtrl', function($scope, $rootScope, Events, Auth, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $location, $window,
$timeout) {
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
	  
	  $scope.tabs = [
	    {"text" : "Upcoming"},
	    {"text" : "Nearby"},
	    {"text" : "Trending"},
	    {"text" : "Live"}
	  ];
	  
	  $scope.onSlideMove = function(data){
	  //alert("You have selected " + data.index + " tab");
	  };
	  
	  
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
  
  
  
  
  
  .controller('eventNearCtrl', function($scope, $cordovaGeolocation, $firebaseArray, $firebaseObject, $geofire, $log, $rootScope, Events, Auth, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $location, $window,
$timeout) {
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
	  
	  $scope.tabs = [
	    {"text" : "Upcoming"},
	    {"text" : "Nearby"},
	    {"text" : "Trending"},
	    {"text" : "Live"}
	  ];
	  
	  $scope.onSlideMove = function(data){
	  //alert("You have selected " + data.index + " tab");
	  };
	  
	  
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
	  
  
  
	
	    //$ionicLoading.show();
 
 
		
 
 
 
 
 
 
 
 
 
	    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
		.then(function (position) {
		  //$ionicLoading.hide();	
	      var lat  = position.coords.latitude;
	      var lng = position.coords.longitude;
		  //$scope.coords = position.coords;
		  console.log('lat', lat);
		  console.log('long', lng);
		  
		  $rootScope.firebaseUser = Auth.$getAuth();
		  var userId = $rootScope.firebaseUser.uid;
		  console.log("Signed in as:", userId);
	  
		  	
			var radiusInKm = 15;
			
			
			//var $geo = $geofire(new Firebase('https://<<your-firebase>>.firebaseio.com/'));
			var eventsRef = new Firebase("https://events-app-363cb.firebaseio.com/");
			
			var geoFire = new GeoFire(eventsRef.child("_geofire"));
		
			
		    var geoQuery = geoFire.query({
				center: [lat,lng],
				radius: radiusInKm
		    })
			
			
			
			
			
			
			
			var center = geoQuery.center();
			var location1 = [-1.2920658999999999,36.8219462];
			var location2 = [-1.2264188, 36.8810883];

			var distance = GeoFire.distance(location1, location2);  
			
			
			console.log(distance);
			$scope.filteredEvents = [];
			
			
			
		    geoQuery.on("key_entered", function(key, location, distance) {
		        // Do something interesting with object
		       
			   console.log(key + " entered query at " + location + " (" + distance + " km from center)");
			   
			   
				
			  //  $scope.filteredEvents.push({key});
				console.log($scope.filteredEvents);
				
			  // Use the "key" to look up the corresponding restaurant
			    eventsRef.child("events").child(key).once("value", function(snapshot) {
			      $scope.events = snapshot.val();
				  console.log($scope.events);
				  
			      console.log("Found a event: " + $scope.events.name);
				  console.log(JSON.stringify($scope.filteredEvents));
				  
				  $scope.filteredEvents.push($scope.events);
				  console.log($scope.filteredEvents);
				  $scope.$apply();
			    });
				
				
				
				
				//$scope.filterEvents = [];
                  
				//firebaseRef.child("events").child(key).once("value", function(snapshot) {
				    // Get the vehicle data from the Open Data Set
				//    $scope.events = snapshot.val();
					
				///	console.log($scope.events);
				//	console.log(JSON.stringify($scope.filteredEvents));
					
					
					//$scope.filteredEvents.push('$scope.events');
					//console.log($scope.filteredEvents);
				  
					//});
		    });
			
			geoQuery.on("ready", function() {
			  geoQuery.cancel();
			  console.log($scope.filteredEvents);
			});
					
			
					
				
				
					
					
					 //var firebaseRef= $geofire(new Firebase("https://events-app-363cb.firebaseio.com/locations"));	
                    // var firebaseRef = firebase.database().ref();
				     //var  $geo = new GeoFire(firebaseRef.child("locations"));
					//var geoFire = new GeoFire(firebaseRef.child("locations"));
					//var geoFire = firebaseRef.child("locations");
                    
					//var geoFire = new GeoFire(transitFirebaseRef.child("_geofire"));
					
					//var firebaseRef = firebase.database().ref('locations');
							   //var geoFire = new GeoFire(firebaseRef);
							   

							   // Create a new GeoFire instance, pulling data from the public transit data
							   
							 // var firebaseRef = firebase.database().ref('locations');
							  
							  // var geoFire = new GeoFire(firebaseRef);

							 //  var geo = geoFire.ref("locations"); 
							    // ref === firebaseRef   
							   
							   
							
				
		        
				
				// Setup a GeoQuery
				    
					   		      
								  // Look up the events data in the Transit Open Data Set
					   		      //eventsRef.child(key).once("value", function(dataSnapshot) {
					   		      // Get the vehicle data from the Open Data Set
					   		      //var event = dataSnapshot.val();
					   		      
								  
								  
								 // $scope.ting = $firebaseObject(eventsRef)
								 // $scope.filteredEvents.push($scope.ting);
					
								 
				  
					 
		
				
				
		  
		  
				// Keep track of the locations which meet our criteria
			   
				  
						  
						  
						  
		  
	     }, function(err){
	     	console.log('getCurrentPosition error: ' + angular.toJson(err));
  	        //$ionicLoading.hide();
  	      //  $ionicPopup.alert({
  	          //title: 'Unable to get location',
  	          //template: 'Please try again or move to another location.'
  	        //});	 
		   
			   
	    });
	  
  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
   

	  //var firebaseRef = firebase.database().ref('user_locations').child(userId);
	  //var geoFire = new GeoFire(firebaseRef);
	  

	//var latitude = location[Object.keys(location)[0]];
	//var longitude = location[Object.keys(location)[1]];

	  // Query radius
		  
		  // Cancel the query once all data has loaded

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