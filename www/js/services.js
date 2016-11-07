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
  var reports = [];
    return {
    reports: reports,
    get: make_request
  }

  function make_request(params) {
    var url = Api.url + "reports";
    return $http.get(url, {params: params}).then(gerReportCompleted).catch(getReportFailed);
  };

  function gerReportCompleted(response) {
    return response.data.addresses;
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
      userLocation: '='
    },
    link: function($scope) {
      var vm = $scope;

      $scope.$watch("userLocation", function(newv, oldv) {
        if (newv) {
          vm.googleUserMaplatLng = new google.maps.LatLng(newv.latitude, newv.longitude);
          initMap();
        }
      });

      $scope.$watch("addresses", function(newv, oldv) {
        if (newv && vm.googleUserMaplatLng) {
          addMarkers();
        }
      });


      function initMap() {
        var mapOptions = {
          center: vm.googleUserMaplatLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var element = document.getElementById("my-map");
        vm.map = new google.maps.Map(element, mapOptions);
        google.maps.event.addListenerOnce(vm.map, 'idle', addDefaultMarker);
      }

      function addDefaultMarker() {
        addMarkerToMap('you!', vm.googleUserMaplatLng);
      }

      function addMarkerToMap(content, latLng) {
        var marker = new google.maps.Marker({
            map: vm.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });

        var infoWindow = new google.maps.InfoWindow({
          content: content
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(vm.map, marker);
        });
      }

      function addMarkers() {
        console.log("vm.addresses", vm.addresses);
        angular.forEach(vm.addresses, function(address) {
          console.log("ASDF", address);
          if (!address.latitude || !address.longitude) {
            return;
          }
          var latLng = new google.maps.LatLng(address.latitude, address.longitude);
          createMarkerString(address);
          addMarkerToMap(address.string, latLng);
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

     /* function addCompanyMarkers() {
        angular.forEach(vm.report.results, function(object) {
          if (!object.is_city) {
            var addr = object.address
            if (addr && addr.latitude && addr.longitude) {
              var latLng = new google.maps.LatLng(addr.latitude, addr.longitude);
              var string = '<ul>' +
                '<li>' + object.company.name + '</li>' +
                '<li>' + addr.address + '</li>';
              if (addr.address.number) {
                string = string + '<li>' +  + '</li>';
              }

              string = string + '</ul>';
              addMarkerToMap(string, latLng);
            }
          }
        });
      }*/

    }
  }
})




;
