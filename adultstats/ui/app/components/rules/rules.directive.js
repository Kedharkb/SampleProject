var app = angular.module("ada");
app.directive('rules', ['$compile', '$timeout', '$rootScope', '$filter', '$http', "$uibModal", "ConnectwiseDataService", "NoAuthService", "RulesService", "CiscoSparkBotService",
    function ($compile, $timeout, $rootScope, $filter, $http, $uibModal, ConnectwiseDataService, NoAuthService, RulesService, CiscoSparkBotService) {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: '/app/components/rules/rules.html',
            link: function ($scope, element, attrs) {
                $scope.boards = []
                $scope.rooms = []
                var queryParams = {};
                queryParams = {"partnerId": $rootScope.user.partnerId};
                $rootScope.openModalPopupOpen();
                
                $scope.ticketTemplates = [{ "name" : "Ticket Created", "id" : "Ticket Created","Template":
                                "### Ticket Created [{id} - {summary}]({ticketurl}) \n\n" +
                                                  ">**Priority** {priority.name} \n\n" +
                                                  ">**Company** {company.name} \n\n" +
                                                  ">>**Contact** {contactName} \n\n" +
                                                  ">>**Email** {contactEmailAddress} \n\n" +
                                                  ">>**Phone** {contactPhoneNumber} \\n"
                },{ "name" : "Ticket Updated", "id" : "Ticket Updated","Template":
                                "### Ticket Updated [{id} - {summary}]({ticketurl}) \n\n" +
                                                  ">**Priority** {priority.name} \n\n" +
                                                  ">**Company** {company.name} \n\n" +
                                                  ">>**Contact** {contactName} \n\n" +
                                                  ">>**Email** {contactEmailAddress} \n\n" +
                                                  ">>**Phone** {contactPhoneNumber} \n\n"
                },{ "name" : "Ticket Closed", "id" : "Ticket Closed","Template":
                                "### Ticket Closed [{id} - {summary}]({ticketurl}) \n\n" + 
                                                  ">**Priority** {priority.name} \n\n" +
                                                  ">**Company** {company.name} \n\n" +
                                                  ">>**Contact** {contactName} \n\n" +
                                                  ">>**Email** {contactEmailAddress} \n\n" +
                                                  ">>**Phone** {contactPhoneNumber} \n\n" 
                },{ "name" : "Activity Created", "id" : "Activity Created","Template":
                                "### Activity Created [{id} - {summary}]({acturl}) \n\n" +
                                                  ">**Start Date** : {dateStart} , **End Date** : {dataEnd} \n\n"
                                                  
                },{ "name" : "Activity Updated", "id" : "Activity Updated","Template":
                                "### Activity Updated [{id} - {summary}]({acturl}) \n\n" +
                                                  ">**Start Date** : {dateStart} , **End Date** : {dataEnd} \n\n"
                                                  
                },{ "name" : "Activity Closed", "id" : "Activity Closed","Template":
                                "### Activity Closed [{id} - {summary}]({acturl}) \n\n" +
                                                  ">**Start Date** : {dateStart} , **End Date** : {dataEnd} \n\n"
                },{ "name" : "Opportunity Created", "id" : "Opportunity Created","Template":
                                "### Opportunity Created as {name} \n\n" +
                                                   ">**Expected Close Date** : {expectedCloseDate} \n\n"
                                                  
                },{ "name" : "Opportunity Updated", "id" : "Opportunity Updated","Template":
                                "### Opportunity Updated : {name} \n\n" +
                                                   ">**Expected Close Date** : {expectedCloseDate} \n\n"
                                                  
                },{ "name" : "Opportunity Closed", "id" : "Opportunity Closed","Template":
                                "### Opportunity Closed : {name} \n\n" +
                                                  ">**Close Date** : {expectedCloseDate} \n\n"
                }]
                
     
                                
                                
                $scope.changeTemplate = function(templatename){
                    if($scope.isUpdateRule == false)
                    {
                        angular.forEach($scope.ticketTemplates, function (val, key) {
                            if(val.id == templatename)
                            {
                                $scope.rule.action.msg = val.Template;
                            }
                            
                        })
                        
                    }
                }
                
                ConnectwiseDataService.AddCallbackHook("dummy", function (data) {
                    

                }, function (error) {

                })
                ConnectwiseDataService.getBoards("dummy", function (data) {
                    $scope.boards = data;

                }, function (error) {

                })
                CiscoSparkBotService.get(undefined, queryParams, function (input) {
                    $rootScope.openModalPopupClose();
                    if (input.data.length > 0) {
                        $scope.sparkBot = input.data[0];
                        console.log($scope.sparkBot)
                        $http({
                            method: "GET",
                            params: {"type": "group", "max": 200},
                            url: "https://api.ciscospark.com/v1/rooms",
                            headers: {
                                'Authorization': 'Bearer ' + $scope.sparkBot['accesstoken'],
                                'Accept': 'application/json'
                            }
                        }).then(function (response) {
                            if (response.status == 200)
                            {
                                $scope.rooms = response.data.items;
                            }

                        })
                    }
                }, function (err) {
                    $rootScope.openModalPopupClose();
                })

                $scope.rules = true;
//    $scope.rulesData = [
//        {'source':"ConnectWise",'trigger':'Ticket Created', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Twitter",'trigger':'New Tweet', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Spark Room",'trigger':'New Message', 'action':{'name':'Send a Mail'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"Slake Space",'trigger':'New Message', 'action':{'name':'Send a SMS'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Ticket Closed', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Opportunity Created', 'action':{'name':'Send a Spark Message'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Activity Created', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' },
//        {'source':"ConnectWise",'trigger':'Activity Closed', 'action':{'name':'Execute API'},'lastrun':'Oct 6, 2017', 'status':'Success' }
//    ];
                $scope.rulesData = []
                $scope.getRulesData = function () {
                    var queryParams = {};
                    queryParams = {"partnerId": $rootScope.user.partnerId};
                    RulesService.get(undefined, {"query": queryParams}, function (data) {
                        if (data.data.length > 0) {
                            $rootScope.openModalPopupClose();
                            $scope.rulesData = data.data;
                        } else {

                        }
                    }, function (errorData) {
                        $rootScope.openModalPopupClose();
                        $rootScope.displayMessage(errorData.msg, "sm", "error");
                    });
                }

                $scope.getRulesData();
                $scope.isUpdateRule = false;
                $scope.updateActionRule = function (ruledata)
                {
                    $scope.rules = false;
//                    $scope.rule = {};
                    $scope.isUpdateRule = true;
                    $timeout(function(){
                        $scope.rule = ruledata;
                    },0)
                    
                }
                $scope.addRules = function () {
                    $scope.rules = false;
                    $scope.rule = {};
                    $scope.isUpdateRule = false;
                }
                $scope.removeRule = function(ruledata){
                    $scope.deleteData = ruledata;
                    $scope.deleteModel = $uibModal.open({
                        templateUrl: 'app/components/notifications/confirmation.html',
                        windowClass: 'modal show modalDialogCenter',
                        backdrop: 'static',
                        backdropClass: 'show',
                        scope: $scope,
                        keyboard: false,
                        size: "sm",
                        controller: function ($scope, $uibModalInstance) {
                            $scope.deleteTitle = "Delete Rule Confirmation"
                            $scope.deleteMsg = "Are you sure you want to delete '"+$scope.deleteData.source+"' rule?"
                            
                            $scope.submit = function () {
                                $rootScope.openModalPopupOpen();
                                RulesService.deleteData($scope.deleteData._id, function (data) {
                                        $rootScope.openModalPopupClose();
                                        $scope.getRulesData();
                                        $rootScope.displayMessage("Rule deleted successfully", 'sm', 'success');
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
                
                $scope.saveRules = function (rule) {
                    console.log(rule)
                    rule["status"] = "Success";
                    if ($scope.isUpdateRule == false)
                    {
                        RulesService.post(rule, function (object) {
                            $scope.getRulesData();
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        });
                    } else if ($scope.isUpdateRule == true)
                    {
                        $scope.updateNewRule = angular.copy(rule);
                        delete $scope.updateNewRule['_id']
                        RulesService.put(rule._id, $scope.updateNewRule, function (object) {
                            $scope.getRulesData();
                        }, function (errorData) {
                            $rootScope.openModalPopupClose();
                            if (angular.isDefined(errorData.msg)) {
                                $scope.alertMsg('danger', errorData.msg);
                            } else {
                                $scope.alertMsg('danger', errorData);
                            }
                        });
                    }

//            $scope.rulesData.push(rule);
                    $scope.rules = true;
                }
                $scope.cancel = function () {
                    $scope.rules = true;
                }


            }
        }
    }]
        );
