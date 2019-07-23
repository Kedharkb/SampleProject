var app = angular.module("ada");
app.directive('notifications', ['$compile', '$timeout', '$rootScope', '$filter', '$http', '$window', '$routeParams', "ConnectwiseDataService", "NoAuthService", "NotificationSettingsService", "CiscoSparkBotService",
    function ($compile, $timeout, $rootScope, $filter, $http, $window, $routeParams, ConnectwiseDataService, NoAuthService, NotificationSettingsService, CiscoSparkBotService) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: '/app/components/notifications/notification.html',
            link: function ($scope, element, attrs) {
                $scope.times = []
                var j = 0;
                for (var i = 1; i < 10; i++) {
                    j = (5 * i)
                    $scope.times.push({"id": j, "title": j + " minutes"})
                }

                $scope.hours = []
                var j = 0;
                for (var i = 0; i <= 23; i++) {
                    $scope.hours.push({"id": i, "name": i})
                }

                $scope.minutes = []
                var j = 0;
                for (var i = 0; i <= 59; i++) {
                    $scope.minutes.push({"id": i, "name": i})
                }

                $scope.oncalldays = [{"day": 1, "dayname": "Sunday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 2, "dayname": "Monday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 3, "dayname": "Tuesday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 4, "dayname": "Wednesday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 5, "dayname": "Thursday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 6, "dayname": "Friday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""},
                    {"day": 7, "dayname": "Saturday", "startHour": 0, "startMinute": 0, "endHour": 23, "endMinute": 59, resources: ""}]

                $scope.slaNotifications = [{"slapercentage": 70, member: ""},
                    {"slapercentage": 80, member: ""},
                    {"slapercentage": 90, member: ""},
                    {"slapercentage": 100, member: ""}
                ]
                $scope.addSlaNotifyBoard = function ()
                {
                    if (angular.isDefined($scope.activity.slaBoards)) {
                        $scope.activity.slaBoards.push({"iddummy": "new"})
                    } else
                    {
                        $scope.activity.slaBoards = []
                        $scope.activity.slaBoards.push({"iddummy": "new"})
                    }

                }
                $scope.removeSlaNotifyBoard = function (index, slaboards)
                {
                    $scope.activity.slaBoard.splice(index, 1);
                }

                $scope.boards = []
                $scope.rooms = []
                $scope.members = []
                ConnectwiseDataService.getMembers("dummy", function (data) {
                    $scope.members = data;
                    console.log($scope.members.length)
                    angular.forEach($scope.members, function (val, key) {
                        val.firstnlastname = val.firstName + " " + val.lastName;
                    })

                }, function (error) {

                })
                ConnectwiseDataService.getBoards("dummy", function (data) {
                    $scope.boards = data;

                }, function (error) {

                })
                var queryParams = {};
                queryParams = {"partnerId": $rootScope.user.partnerId};
                $rootScope.openModalPopupOpen();
//                CiscoSparkBotService.get(undefined, queryParams, function (input) {
//                    $rootScope.openModalPopupClose();
//                    if (input.data.length > 0) {
//                        $scope.sparkBot = input.data[0];
//                        console.log($scope.sparkBot)
//                        $http({
//                            method: "GET",
//                            data: {"type": "group"},
//                            url: "https://api.ciscospark.com/v1/rooms",
//                            headers: {
//                                'Authorization': 'Bearer ' + $scope.sparkBot['accesstoken'],
//                                'Accept': 'application/json'
//                            }
//                        }).then(function (response) {
//                            if (response.status == 200)
//                            {
//                                $scope.rooms = response.data.items;
//                            }
//
//                        })
//                    }
//                }, function (err) {
//                    $rootScope.openModalPopupClose();
//                })

                var queryParams = {};
                $scope.activity = {}
                queryParams = {"partnerId": $rootScope.user.partnerId, };

                $rootScope.openModalPopupOpen();
                var query_params = {};
                query_params.perColConditions = {"partnerId": $rootScope.user.partnerId, "type": "activity"};
                NotificationSettingsService.get(undefined, {query: query_params}, function (input) {
                    $rootScope.openModalPopupClose();
                    if (input.total > 0) {
                        $scope.activity = input.data[0];
                        if (angular.isUndefined($scope.activity.oncalldays))
                        {
                            $scope.activity.oncalldays = $scope.oncalldays;
                        }
                        if (angular.isUndefined($scope.activity.slaNotifications))
                        {
                            $scope.activity.slaNotifications = $scope.slaNotifications;
                        }

                    } else
                    {
                        $scope.activity = [];
                        $scope.activity.oncalldays = $scope.oncalldays;
                        $scope.activity.slaNotifications = $scope.slaNotifications;
                    }
                }, function (err) {
                    $rootScope.openModalPopupClose();
                })

                $scope.saveActivityNotifications = function (notification) {
                    $rootScope.openModalPopupOpen();

                    if (angular.isDefined($scope.activity['_id'])) {
                        // update status
                        if (!angular.isDefined(notification['enableEndNotify'])) {
                            notification['enableEndNotify'] = false
                        }
                        if (!angular.isDefined(notification['enableStartNotify'])) {
                            notification['enableStartNotify'] = false
                        }

                        NotificationSettingsService.put($scope.activity['_id'], notification, function (data) {
                            $rootScope.openModalPopupClose();
                            $scope.alertMsg('success', 'Notification updated successfully.');
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        })
                    } else {
                        // update notification type
                        notification['type'] = 'activity'
                        NotificationSettingsService.post(notification, function (object) {
                            $rootScope.openModalPopupClose();
                            $scope.alertMsg('success', 'Notification added successfully.');
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        })
                    }
                }

                $scope.alertMsg = function (type, msg) {
                    $scope.alerts = [];
                    $scope.alerts.push({type: type, msg: msg});
                }
                $scope.closeAlert = function (type, msg) {
                    $scope.alerts = [];
                }

            }
        }
    }]);