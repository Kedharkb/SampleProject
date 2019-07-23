var app = angular.module("ada");
app.directive('scheduledaction', ['$compile', '$timeout', '$rootScope', '$filter', '$http', "$uibModal", "ConnectwiseDataService", "NoAuthService", "ScheduleTasksService", "CiscoSparkBotService",
    function ($compile, $timeout, $rootScope, $filter, $http, $uibModal, ConnectwiseDataService, NoAuthService, ScheduleTasksService, CiscoSparkBotService) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: '/app/components/scheduledaction/scheduledaction.html',
            link: function ($scope, element, attrs) {
                $scope.boards = []
                $scope.rooms = []
                $scope.scheduleTypes = [{"id": 'Good Morning', "name": 'Good Morning'}];
                var queryParams = {};
                queryParams = {"partnerId": $rootScope.user.partnerId};
                $rootScope.openModalPopupOpen();



//                ConnectwiseDataService.getBoards("dummy", function (data) {
//                    $scope.boards = data;
//
//                }, function (error) {
//
//                })

                $scope.schedules = true;
//    $scope.schedulesData = [
//        {'source':"ConnectWise",'trigger':'Ticket Created', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Twitter",'trigger':'New Tweet', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Spark Room",'trigger':'New Message', 'action':{'name':'Send a Mail'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Slake Space",'trigger':'New Message', 'action':{'name':'Send a SMS'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Ticket Closed', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Opportunity Created', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Activity Created', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Activity Closed', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' }
//    ];
                $scope.schedulesData = []
                $scope.getSchedulesData = function () {
                    var queryParams = {};
                    queryParams = {"partnerId": $rootScope.user.partnerId};
                    ScheduleTasksService.get(undefined, {"query": queryParams}, function (data) {
                        $rootScope.openModalPopupClose();
                        if (data.data.length > 0) {
                            $rootScope.openModalPopupClose();
                            $timeout(function () {
                                $scope.schedulesData = data.data;
                            }, 0)

                        } else {

                        }
                    }, function (errorData) {
                        $rootScope.openModalPopupClose();
                        $rootScope.displayMessage(errorData.msg, "sm", "error");
                    });
                }

                $scope.getSchedulesData();
                $scope.isUpdateSchedule = false;
                $scope.updateActionSchedule = function (scheduledata)
                {
                    $scope.schedules = false;
//                    $scope.schedule = {};
                    $scope.isUpdateSchedule = true;
                    $timeout(function () {
                        $scope.schedule = scheduledata;
                    }, 0)

                }
                $scope.addSchedules = function () {
                    $scope.schedules = false;
                    $scope.schedule = {};
                    $scope.isUpdateSchedule = false;
                }
                $scope.removeSchedule = function (scheduledata) {
                    $scope.deleteData = scheduledata;
                    $scope.deleteModel = $uibModal.open({
                        templateUrl: 'app/components/notifications/confirmation.html',
                        windowClass: 'modal show modalDialogCenter',
                        backdrop: 'static',
                        backdropClass: 'show',
                        scope: $scope,
                        keyboard: false,
                        size: "sm",
                        controller: function ($scope, $uibModalInstance) {
                            $scope.deleteTitle = "Delete Schedule Confirmation"
                            $scope.deleteMsg = "Are you sure you want to delete '" + $scope.deleteData.name + "' schedule?"

                            $scope.submit = function () {
                                $rootScope.openModalPopupOpen();
                                ScheduleTasksService.deleteData($scope.deleteData._id, function (data) {
                                    $rootScope.openModalPopupClose();
                                    $scope.getSchedulesData();
                                    $rootScope.displayMessage("Schedule deleted successfully", 'sm', 'success');
                                    $uibModalInstance.dismiss('cancel');

                                }, function (errorData) {
                                    $rootScope.openModalPopupClose();
                                    if (angular.isDefined(errorData) && angular.isDefined(errorData.msg) && errorData.msg != "") {
                                        $rootScope.displayMessage(errorData.msg, 'sm', 'error');
                                    } else {
                                        $rootScope.displayMessage(errorData, 'sm', 'error');
                                    }
                                });

                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    });
                }

                $scope.saveSchedules = function (schedule) {
                    console.log(schedule)
                    schedule["status"] = "Success";
                    if ($scope.isUpdateSchedule == false)
                    {
                        ScheduleTasksService.post(schedule, function (object) {
                            $scope.getSchedulesData();
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        });
                    } else if ($scope.isUpdateSchedule == true)
                    {
                        $scope.updateNewSchedule = angular.copy(schedule);
                        delete $scope.updateNewSchedule['_id']
                        ScheduleTasksService.put(schedule._id, $scope.updateNewSchedule, function (object) {
                            $scope.getSchedulesData();
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        });
                    }

//            $scope.schedulesData.push(schedule);
                    $scope.schedules = true;
                }
                $scope.cancel = function () {
                    $scope.schedules = true;
                }


            }
        }
    }]
        );
