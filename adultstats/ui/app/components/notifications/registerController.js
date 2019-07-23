'use strict';
var app = angular.module('ada');
app.controller("registerController", ["$scope", "$route", "$location", "$timeout", "$uibModal", "$rootScope", "NoAuthService",
    function ($scope, $route, $location, $timeout, $uibModal, $rootScope, NoAuthService) {
        $scope.afterSuccess = false;
        $scope.alertMsg = function (type, msg) {
            $scope.alerts = [];
            $scope.alerts.push({type: type, msg: msg});
        }
        $scope.closeAlert = function (type, msg) {
            $scope.alerts = [];
        }
        $scope.registerToAda = function (registerdata)
        {
            if (registerdata.password != registerdata.confpassword)
            {
                $scope.alertMsg('danger', "Password and confirm password are not matching.");
                return false;
            }
            if (registerdata.agreement == false || angular.isUndefined(registerdata.agreement))
            {
                $scope.alertMsg('danger', "Please check agree terms.");
                return false;
            }
            NoAuthService.validateUser("dummy", registerdata.userName, function (data) {

                NoAuthService.createUser("dummy", registerdata, function (data1) {
                    $scope.afterSuccess = true;
                    $scope.alertMsg('success', "Thank you for registration, please go ahead and login .");
                }, function (error1) {
                    console.log(error1)
                    $scope.alertMsg('danger', "Email user already exist, please try other email.");
                })
                console.log(data)
            }, function (error) {
                $scope.alertMsg('danger', "Email user already exist, please try other email.");

                console.log(error)
            });
            console.log(registerdata)
        }

    }]
        );