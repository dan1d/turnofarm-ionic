angular.module('farmaturn.controllers', [])

.controller('AppCtrl', function($scope) {
  console.log("log!");
})

.controller('DashCtrl', function($scope, Report, Api, UserLocation, $state, ionicDatePicker, $ionicModal, $ionicSideMenuDelegate) {
  console.log("HUEHUE");
  var vm = this;
  vm.reportParams = {date: new Date()};
  vm.report = {};
  vm.openDatePicker = openDatePicker;
  vm.openCompany = openCompany;
  vm.request_sent = false;
  activate();
  console.log(vm.reportParams.date);

  function activate() {
    UserLocation.getLocation().then(function(userLocation) {
      vm.userLocation = userLocation;
      vm.reportParams["latitude"] = userLocation.latitude;
      vm.reportParams["longitude"] = userLocation.longitude;
      getData();
     });
   }

  function getData() {
    if (!vm.request_sent) {
      vm.request_sent = true;
      Report.get(vm.reportParams).then(function(data) {
        if (data && data.dashboard) {
          vm.addresses = data.dashboard.addresses;
        } else {
          vm.addresses = [];
        }
        vm.request_sent = false;
      }).catch(function(data) {
        vm.addresses = [];
        vm.request_sent = false;
      });
    }
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
    console.log(vm.reportParams.date);
    $state.go('tab.company', {id: companyId, date: vm.reportParams.date}, {reload: true});
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
      $scope.userLocation = userLocation;
      vm.reportParams["latitude"] = userLocation.latitude;
      vm.reportParams["longitude"] = userLocation.longitude;
      getReport();
    });

  }

  function getReport() {
    Report.get(vm.reportParams).then(function(data) {
      vm.addresses = data;
    });
  }

})

.controller('CompanyCtrl', function($scope, $stateParams, UserLocation, Report) {
  var vm = this;
  activate();

  function activate() {
    UserLocation.getLocation().then(function(userLocation) {
      $scope.userLocation = userLocation;
      vm.userLocation = userLocation;
      getData();
    });
  }

  function getData() {
    var params = {
      latitude: vm.userLocation.latitude,
      longitude: vm.userLocation.longitude,
      address_id: $stateParams.id
    };
    params.date = $stateParams.date ? new Date($stateParams.date) : new Date();

    Report.get(params).then(function(data) {
      vm.record = data.dashboard.selected;
      vm.addresses = data.dashboard.addresses;
    });
  };

  $scope.$on('company:selected', function(ev, data) {
    vm.record = data.address;
    $scope.$apply();
  });

})

;
