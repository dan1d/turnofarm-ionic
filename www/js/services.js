angular.module('farmaturn.services', [])

.factory("Api", function() {
  var host_url = "http://api.turnofarm.dev:3000";
  var version = "v1";
  var api_path = "/" + version + "/";
  var api_url = host_url + api_path;
  return {
    host_url: host_url,
    api_path: api_path,
    url: api_url
  };
})

.factory('Report', function($http, Api) {
  return {
    get: make_request
  }

  function make_request(params) {
    var url = Api.url + "dashboard";
    return $http.get(url, {params: params}).then(gerReportCompleted).catch(getReportFailed);
  };

  function gerReportCompleted(response) {
    return response.data;
  }

  function getReportFailed(response) {
    console.log(response);
  }
})

.factory('UserLocation', function($cordovaGeolocation) {
  var location = {};

  return {
    location: location,
    getLocation: getLocation
  }

  function getLocation() {
    var options = {timeout: 10000, enableHighAccuracy: true};
    return $cordovaGeolocation.getCurrentPosition(options).then(successLocationGet).catch(errorLocationGet);
  }

  function successLocationGet(position) {
    location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    return location;
  }

  function errorLocationGet(error) {
    console.log("Could not get location", error);
  }
})

.factory('Address', function(Api, $http) {
  var address = {};
  return {
    address: function() {
      return address;
    },
    getAddress: getAddress
  }

  function getAddress(id, params) {
    var url = Api.url + "address/" + id;
    return $http.get(url, {params: params}).then(gerReportCompleted).catch(getReportFailed);
  };

  function gerReportCompleted(response) {
    return response.data.address;
  }

  function getReportFailed(response) {
    console.log(response);
  }
})

.factory("MapMarker", function() {
  var google_map_image = "img/loc.png";

  function generateContent(address) {
    var string = '<ul>' +
      '<li>' + address.company.name + '</li>' +
      '<li>' + address.address + '</li>';
    if (address.number) {
      string = string + '<li>' +  + '</li>';
    }
    string = string + '</ul>';
    return string;
  }

  function addMarkerToMap(address, map, scope) {
    var latLng = new google.maps.LatLng(address.latitude, address.longitude);
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: latLng
        // icon: {
        //   url: google_map_image
        // }
    });


    var infoWindow = new google.maps.InfoWindow({
      content: generateContent(address)
    });

    address.marker = marker;
    marker.iaddress = address;
    google.maps.event.addListener(marker, 'click', function () {
      if (marker.iaddress) {
        scope.$emit('company:selected', {address: marker.iaddress});
      }
      infoWindow.open(map, marker);
    });

  }

  return {
    addMarkerToMap: function(address, map, scope) {
      return addMarkerToMap(address, map, scope);
    },
    addUserMarker: function(userLatLong, map, vm) {
      var marker = new google.maps.Marker({
         map: map,
         animation: google.maps.Animation.DROP,
         position: userLatLong,
         icon: "img/blue-dot.png"
      });

      var infoWindow = new google.maps.InfoWindow({
       content: "you!"
      });

      console.log("map icon you label!");
      google.maps.event.addListener(marker, 'click', function () {
       infoWindow.open(vm.map, marker);
      });

      return marker;
    }
  }
})

.directive('myMap', ["MapMarker", function(MapMarker) {
  return {
    restrict: 'E',
    template: '<div id="my-map" data-tap-disabled="true"></div>',
    scope: {
      addresses: '=',
      userLocation: '=',
      selected: "="
    },
    link: function($scope) {
      var vm = $scope;
      vm.userMarker = {marker: {}};
      vm.dropoffMarker;
      vm.mapInitialized = false;

      $scope.$watch("userLocation", function(newv, oldv) {
        if (newv && newv !== oldv) {
          vm.googleUserMaplatLng = new google.maps.LatLng(newv.latitude, newv.longitude);
          initMap();
        }
      });

      $scope.$watch("addresses", function(newv, oldv) {
        if (newv && vm.map) {
          addMarkersFor(newv);
        }
      });

      $scope.$watch("selected", function(newv) {
        if (newv && vm.googleUserMaplatLng) {
          calcRoute(newv);
        };
      });

      function initMap() {
        var mapOptions = {
          center: vm.googleUserMaplatLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var element = document.getElementById("my-map");
        vm.map = new google.maps.Map(element, mapOptions);
        vm.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        vm.directionsService = new google.maps.DirectionsService();
        vm.directionsDisplay.setMap(vm.map);
        vm.mapInitialized = true;
        vm.userMarker = MapMarker.addUserMarker(vm.googleUserMaplatLng, vm.map, vm);

        google.maps.event.addListener(vm.map, "idle", function(){
          console.log("iddddle?");
          google.maps.event.trigger(vm.map, 'resize');
        });
      }

      function addMarkersFor(addresses) {
        angular.forEach(addresses, function(address) {
          if (address && address.latitude && address.longitude) {
            MapMarker.addMarkerToMap(address, vm.map, $scope);
          }
        });
      }

      function calcRoute(address) {
        var start = vm.googleUserMaplatLng;
        var end = new google.maps.LatLng(address.latitude, address.longitude);
        var request = {
          origin: start,
          destination: end,
          travelMode: 'DRIVING'
        };
        vm.directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            vm.directionsDisplay.setDirections(result);
          }
        });
      }

    }
  }
}])




;
