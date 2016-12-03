angular.module('farmaturn.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('DashCtrl', function($scope, Report, Api,$state, ionicDatePicker, $ionicModal, $ionicTabsDelegate, $rootScope, $ionicPlatform, $cordovaGeolocation, $ionicNavBarDelegate, $timeout, $ionicDeploy) {
  var vm = this;
  vm.reportParams = {date: new Date()};
  vm.report = {};
  vm.openDatePicker = openDatePicker;
  vm.openCompany = openCompany;
  vm.request_sent = false;

  $ionicPlatform.ready(activate);

  $scope.$on('$ionicView.enter', function() {
    $timeout(function(){
      $ionicNavBarDelegate.align('center');
    });
  });

  $ionicDeploy.check().then(function(snapshotAvailable) {
    if (snapshotAvailable) {
     $ionicDeploy.download().then(function() {
       return $ionicDeploy.extract().then(function() {
        $ionicDeploy.load();
       });
     });
    }
  });

  function activate() {
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      vm.position = position.coords;
      vm.reportParams["latitude"] = position.coords.latitude;
      vm.reportParams["longitude"] = position.coords.longitude;
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
      to: new Date(2017, 12, 31), //Optional
      inputDate: vm.reportParams.date,      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
    ionicDatePicker.openDatePicker(ipObj1);
  };

  function openCompany(address) {
    var data = {
      selected: address,
      companies: vm.addresses,
      date: vm.reportParams.date
    };

    $rootScope.$broadcast('map:refresh', data);
    $ionicTabsDelegate.select(1);
  }

})

.controller('CompanyCtrl', function($scope, $stateParams, $cordovaGeolocation, Report, $ionicPlatform, $timeout, $ionicNavBarDelegate, $ionicDeploy) {
  var vm = this;
  $ionicPlatform.ready(activate);

  $scope.$on('$ionicView.enter', function() {
    $timeout(function(){
      $ionicNavBarDelegate.align('center');
    });
  });

  function activate() {
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      $scope.position = position.coords;
      vm.position = position.coords;
      getData();
    });
  }

  function getData() {
    var params = {
      latitude: vm.position.latitude,
      longitude: vm.position.longitude,
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

  $scope.$on("map:refresh", function(ev, data) {
    vm.record = data.selected;
    vm.addresses = data.addresses;
    console.log("xaxa", data);
  });

})

;
