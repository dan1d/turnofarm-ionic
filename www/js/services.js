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

.directive('myMap', function() {
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


      $scope.init = function() {

      };

      $scope.$watch("userLocation", function(newv, oldv) {
        if (newv && newv !== oldv) {
          vm.googleUserMaplatLng = new google.maps.LatLng(newv.latitude, newv.longitude);
          google.maps.event.addDomListener(window, 'load', initMap);
        }
      });

      $scope.$watch("addresses", function(newv, oldv) {
        if (newv && vm.googleUserMaplatLng) {
          addMarkersFor(newv);
        }
      });

      $scope.$watch("selected", function(newv) {
        if (newv) {
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
        vm.userMarker = addMarkerToMap('you!', vm.googleUserMaplatLng);
        vm.mapInitialized = true;
        console.log(vm.mapInitialized, "trueueueueueueu");
      }

      function addMarkerToMap(content, latLng) {
        var marker = new google.maps.Marker({
            map: vm.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            map_icon_label: '<i class="ion-medkit icon"></i>'
        });


        var infoWindow = new google.maps.InfoWindow({
          content: content
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(vm.map, marker);
        });

        marker.addListener('click', function(e,b) {
          $scope.$emit('company:selected', {address: this.iaddress});
       });
        return marker;
      }

      function addMarkersFor(addresses) {
        angular.forEach(addresses, function(address) {
          if (address && address.latitude && address.longitude) {
            var latLng = new google.maps.LatLng(address.latitude, address.longitude);
            createMarkerString(address);
            var marker = addMarkerToMap(address.string, latLng);
            address.marker = marker;
            marker.iaddress = address;
          }
        });
      }

      function createMarkerString(address) {
        var string = '<ul>' +
          '<li>' + address.company.name + '</li>' +
          '<li>' + address.address + '</li>';
        if (address.number) {
          string = string + '<li>' +  + '</li>';
        }
        string = string + '</ul>';
        address.string = string;
      }

      function calcRoute(address) {

        // var start = vm.googleUserMaplatLng;
        // var end = new google.maps.LatLng(address.latitude, address.longitude);
        // var request = {
        //   origin: start,
        //   destination: end,
        //   travelMode: 'DRIVING'
        // };
        // vm.directionsService.route(request, function(result, status) {
        //   if (status == 'OK') {
        //     vm.directionsDisplay.setDirections(result);
        //   }
        // });
      }

    }
  }
})




;
