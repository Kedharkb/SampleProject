agGrid.LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__25_August_2018__MTUzNTE1MTYwMDAwMA==53aedc27a9df43c4e4bd6c97d9e6f413');
agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module('nextGen', ['ui', 'ui.bootstrap', 'ui.select', 'ngRoute', 'ngAnimate', 'ngSanitize', 'agGrid', 'ngIdle','chart.js']);

app.config(['$routeProvider', '$locationProvider', 'KeepaliveProvider', 'IdleProvider',
    function ($routeProvider, $locationProvider, KeepaliveProvider, IdleProvider) {
        IdleProvider.idle(5 * 60); // min * sec
        IdleProvider.timeout(30); // allow for browser refresh

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider.when('/dashboard', {
            templateUrl: '/app/partials/dashboard.html',
            controller: 'dashBoardController'
        }).when('/recons', {
            templateUrl: '/app/partials/recons.html',
            controller: 'reconController'
        });
    }]);


app.run(['$rootScope', '$http', '$uibModal', '$location', '$timeout', '$routeParams', '$route', '$filter', '$window', 'Idle',
    function ($rootScope, $http, $uibModal, $location, $timeout, $$routeParams, $route, $filter, $window, Idle) {
        $http.get('/app/json/role_mapping.json').success(function (authData) {
            $http.get('/assets/text/us_en/strings.json').success(function (resources) {
                $rootScope.apiURLForS3 = '/api';
                $rootScope.loadingModal = null;
                $rootScope.path = $location.path()
                $rootScope.openModalPopupOpen = function () {
                    if ($rootScope.loadingModal == null) {
                        $rootScope.loadingMsg = 'Loading...';
                        $rootScope.loadingModal = $uibModal.open({
                            scope: false,
                            templateUrl: '/app/components/notifications/loading.html',
                            windowClass: 'modal show loaderModalPopup',
                            backdropClass: 'show',
                            backdrop: 'static'
                        });
                    }
                };

                Idle.watch();

                $rootScope.reset = function () {
                    Idle.watch();
                }


                $rootScope.tabs = {}

                $rootScope.openModalPopupClose = function () {
                    if ($rootScope.loadingModal != null) {
                        $rootScope.loadingModal.close();
                        $rootScope.loadingModal = null;
                        $rootScope.loadingMsg = '';
                    }
                };


                function init() {
                    $rootScope.isauthenticated = true;

                    $rootScope['tabs'] = {}
                    $rootScope.requestedPath = '/dashboard'
                    $location.url($rootScope.requestedPath);
                    $rootScope.path = $location.path()
                }

                $rootScope.displayMessage = function (msg, size, msgtype) {
                    var modalColor = '';
                    if (msgtype == 'success') {
                        modalColor = 'modal-success';
                    }
                    if (msgtype == 'error') {
                        modalColor = 'modal-error';
                    }
                    if (msgtype == 'warning') {
                        modalColor = 'modal-warning';
                    }
                    if (msgtype == 'info') {
                        modalColor = 'modal-info';
                    }
                    $uibModal.open({
                        templateUrl: '/app/components/notifications/message.html',
                        windowClass: 'modal show modalDialogCenter ' + modalColor,
                        backdrop: 'static',
                        backdropClass: 'show',
                        size: size,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.msgtype = msgtype;
                            $scope.message = msg;
                            $rootScope.clearInstance = $uibModalInstance;
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    });
                };





                init()


                $rootScope.getGraphData=function()
                {

            $http.get("/api/adults_data/dummy/getGraphData", {}).then(function (response) {


               $rootScope.sexGraph=response.data['msg']['sex']
               $rootScope.relationGraph=response.data['msg']['relation']
               $rootScope.raceGraph=response.data['msg']['race']
                console.log($rootScope.sexGraph)

            }, function (err) {

                $scope.msg = "User Creattion unsuccessful";

            });
                }


            $rootScope.getGraphData()

                $rootScope.loadingModal = null;

                $rootScope.refreshReconView = function (recon) {
                    // $rootScope.activeRecon = recon.name
                    // $rootScope.actions = recon.actions
                    $location.path('/recons')
                }



            })
        })
    }
]);
