// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('farmaturn', ['ionic', 'farmaturn.controllers', 'farmaturn.services', 'ngCordova', 'ionic-datepicker', 'ionic.cloud'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, $ionicCloudProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    cache: true,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html'
      }
    }
  })
  .state('tab.map', {
      url: '/map?:id:date',
      views: {
        'tab-map': {
          templateUrl: 'templates/company.html'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');


   var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Fecha',
      setLabel: 'Aceptar',
      todayLabel: 'Hoy',
      closeLabel: 'Cerrar',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    $ionicCloudProvider.init({
     "core": {
       "app_id": "6ea3e29d"
     }
   });

});
