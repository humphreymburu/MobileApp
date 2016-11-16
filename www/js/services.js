angular.module('starter.services', ['starter.utils', 'starter.auth' , 'firebase'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('fireBaseUrl', function($firebase) {
  var ref = new Firebase("");
  return {
    ref: function () {
      return ref;
    },
  }
})


.factory('Loader', ['$ionicLoading', '$timeout','$rootScope','$ionicLoading', '$ionicPopup', function($ionicLoading, $ionicLoading, $ionicPopup, $timeout,$rootScope ) {
       var LOADERAPI = {
            showLoading: function(text) {
               text = text || 'Loading...';
               $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div><br>' + text
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












//current user profile events 

 .factory('Events', function($rootScope, $firebaseArray, $firebaseAuth, $firebaseObject) {
     
	 $rootScope.userObj = $firebaseAuth();
	  
	 var firebaseUser =  $rootScope.userObj.$getAuth();	 
	 
	 
	 console.log(firebaseUser);
	 
	 var eventsRef = new firebase.database().ref('events/');
	 var eventsType = new firebase.database().ref('events/ + eventId/ + type');
 	  //var eventsInfo = $firebaseArray(eventsRef);

    

     //var eventRef = new firebase.database().ref('users/' + '/events');
	

     return {
		 getEvents: getEvents,
		 getEvent: getEvent,
		 
     }
     function getEvents() {
         return $firebaseArray(eventsRef);        
     }
	 
	 function getEvent(eventId) {
		 return $firebaseObject(eventsRef.child(eventId)); 
		 
	 }
	 

	 
   })






   .service('Map', function() {
    
       this.initMap = function() {
         var mapOptions = {
         center: { lat: -1.312694, lng: 36.733400 },  
         zoom: 13,
         disableDefaultUI: true, // To remove default UI from the map view
         scrollwheel: false
       }

       this.map = new google.maps.Map(document.getElementById('map'),
                   mapOptions);

       this.input = /** @type {HTMLInputElement} */ (
                   document.getElementById('pac-input'));

               // Create the autocomplete helper, and associate it with
               // an HTML text input box.
       this.autocomplete = new google.maps.places.Autocomplete(input);
               autocomplete.bindTo('bounds', map);

               map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

       this.infowindow = new google.maps.InfoWindow();

       this.marker = new google.maps.Marker({
                   map: map
               });

   google.maps.event.addListener(marker, 'click', function() {
                   infowindow.open(map, marker);
               });

               // Get the full place details when the user selects a place from the
               // list of suggestions.
               google.maps.event.addListener(autocomplete, 'place_changed', function() {
                   infowindow.close();
                   var place = autocomplete.getPlace();
                   //var latitude = place.geometry.location.lat();
                   //var lontitude = place.geometry.location.lng();



                   if (!place.geometry) {
                        console.log("Autocomplete's returned place contains no geometry");
                       return;
                   }

                   if (place.geometry.viewport) {
                       map.fitBounds(place.geometry.viewport);
                   } else {
                       map.setCenter(place.geometry.location);
                       map.setZoom(17);
                   }

                   // Set the position of the marker using the place ID and location.
                   marker.setPlace( /** @type {!google.maps.Place} */ ({
                       placeId: place.place_id,
                       location: place.geometry.location,
                   }));

            

                   marker.setVisible(true);

                   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                       'Place ID: ' + place.name + '<br>' +
                         'location: ' + place.geometry.location + '<br>' +
                       place.formatted_address + '</div>');
                   infowindow.open(map, marker);
               });


     this.lat =  google.maps.event.addListener(autocomplete, 'place_changed', function() {
              
                   var place = autocomplete.getPlace();
              
                   var cords = {};
                   lat = place.geometry.location.lat();
                  console.log(lat);
               });


     this.lng =  google.maps.event.addListener(autocomplete, 'place_changed', function() {
              
                   var place = autocomplete.getPlace();
              
               
                   lng = place.geometry.location.lng();
                  console.log(lng);
               });


           }






        

           // Run the initialize function when the window has finished loading.
           google.maps.event.addDomListener(window, 'load', this.initMap);

   })






   ;

