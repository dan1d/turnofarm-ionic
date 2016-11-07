angular.module('farmaturn.controllers', [])

.controller('AppCtrl', function($scope) {
  console.log("log!");
})

.controller('DashCtrl', function($scope, Report, Api, UserLocation, $state, ionicDatePicker, $ionicModal, $ionicSideMenuDelegate) {
  var vm = this;
  vm.reportParams = {date: new Date()};
  vm.report = {};
  vm.openDatePicker = openDatePicker;
  vm.openMap = openMap
  vm.openCompany = openCompany
  activate();

  $ionicModal.fromTemplateUrl('templates/range.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function(modal) {
     vm.modal = modal;
   });
   vm.openModal = function() {
     vm.modal.show();
   };
   vm.closeModal = function() {
     vm.modal.hide();
   };
   // Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
     vm.modal.remove();
   });
   // Execute action on hide modal
   $scope.$on('modal.hidden', function() {
     // Execute action
   });
   // Execute action on remove modal
   $scope.$on('modal.removed', function() {
     // Execute action
   });

  function activate() {
    UserLocation.getLocation().then(function(userLocation) {
      vm.userLocation = userLocation;
      vm.reportParams["latitude"] = userLocation.latitude;
      vm.reportParams["longitude"] = userLocation.longitude;

      getData();
     });
   }

  function getData() {
    return Report.get(vm.reportParams).then(function(data) {
      vm.addresses = data;
    });
  }

  function openMap(report) {
    $state.go('tab.map', {reportId: report.id});
  }

  function openDatePicker(){
    var ipObj1 = {
      callback: function (val) {  //Mandatory
        vm.reportParams.date = new Date(val);
        activate();
      },
      disabledDates: [            //Optional
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: vm.reportParams.date,      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
    ionicDatePicker.openDatePicker(ipObj1);
  };

  function openCompany(companyId) {
    $state.go('tab.company', {id: companyId, date: vm.reportParams.date});
  }

})

.controller('MapCtrl', function($scope, Report, Api, $stateParams, UserLocation) {
  var vm = this;
  if ($stateParams.reportId) {
    vm.reportParams = {id: $stateParams.reportId};
  } else {
    vm.reportParams = {date: new Date()};
  }
  vm.report = {};
  vm.latLng = {};


  activate();

  function activate() {
    UserLocation.getLocation().then(function(userLocation) {
      vm.userLocation = userLocation;
      vm.googleUserMaplatLng = new google.maps.LatLng(vm.userLocation.latitude, vm.userLocation.longitude);
      vm.reportParams["latitude"] = userLocation.latitude;
      vm.reportParams["longitude"] = userLocation.longitude;
      getReport();
    });

  }

  function getReport() {
    Report.get(vm.reportParams).then(function(data) {
      vm.report = data;
    });
  }

})

.controller('CompanyCtrl', function($scope, $stateParams, UserLocation, Address) {
  var vm = this;
  activate();

  function activate() {
    UserLocation.getLocation().then(function(userLocation) {
      $scope.userLocation = userLocation;
      vm.userLocation = userLocation;
      getAddress();
    });
  }

  function getAddress() {
    var params = {location: vm.userLocation, date: $stateParams.date};
    Address.getAddress($stateParams.id, params).then(function(data) {
      vm.record = data;
      vm.addreses = [vm.record];
    });
  }

})

.controller('AccountCtrl', function($scope) {

  $scope.settings = {
    enableFriends: true
  };
});
