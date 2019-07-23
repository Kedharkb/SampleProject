// 'use strict';
var app = angular.module('nextGen');
app.controller('reconController', ['$scope', '$filter', '$route', '$location',
    '$window', '$timeout', '$rootScope', '$uibModal',
    '$http',
    function ($scope, $filter, $route, $location, $window, $timeout, $rootScope,
              $uibModal, $http) {
        $scope.transactionData = []
        $scope.search = {};
        $scope.pageIndex = 1;
        $scope.customFilters={}


        console.log($scope.filterCondExpArray)

        $scope.initGrid = function () {
            $scope.gridOptions = {
                defaultColDef: {
                    // allow every column to be aggregated
                    enableValue: true,
                    // allow every column to be grouped
                    enableRowGroup: true,
                    // allow every column to be pivoted
                    enablePivot: false
                },
                columnDefs: [],
                enableSorting: true,
                showToolPanel: true,
                rowMultiSelectWithClick: true,
                enableFilter: true,
                enableColResize: true,
                groupSelectsChildren: true,
                groupSelectsFiltered: true,
                rowSelection: 'multiple',
                checkboxSelection: true,
                rowGroupPanelShow: 'always',
                floatingFilter: true,
                enableColResize: true,
                // suppressMenu:true,
                pagination: false,
                onSelectionChanged: selectionChangedFunc
            };
        }




        function selectionChangedFunc() {
            $scope.selectedRecords = $scope.matchGridOptions.api.getSelectedRows();
            $scope.disableFlag = false;
            $scope.$apply();
        }

        $scope.cols = [];

        $scope.initGrid()



        $scope.getValues=function(val,index)
        {   $scope.valModal={}
            if(val=='sex')
            {
                $scope.valModal['sex']=$scope.sexGraph['sex']
            }
            else if(val=='relationship')
            {
                $scope.valModal['relationship']=$scope.relationGraph['relationship']
            }
            else if(val=='race')
            {
                $scope.valModal['race']=$scope.raceGraph['race']
            }

            $scope.selIndex=index


        }

        $scope.getpageIndex = function (index) {
            $scope.pageIndex = index;
        };

        $scope.resetSelectParams = function () {
            // $scope.sourcePanel = !$scope.sourcePanel
            // $scope.filter = !$scope.filter
            // $scope.columnsBaseSearch = false
            $scope.pageIndex = 1
            $scope.search = {}
        }


         $scope.onChangeOfMdlField = function (val, index) {
            $scope.filterCondExpArray[index]['filterCondArray'] = $scope.filterConditionsMasterArray['str']
            //$scope.filterCondArray = $scope.filterConditionsMasterArray[val['selectedField']['dataType']]
        }

        $scope.onChangeOfFilterCond = function (val) {
        }





        $scope.filterConditionsMasterArray = {
            'str': ['notEqual', 'equals', 'startWith', 'notStartWith', 'endsWith', 'contains', 'notContains', 'notEndsWith', 'isIn', 'notIsIn', 'subString']
        }



        $scope.addFilterCond = function () {
            var options={"sex":$scope.sexGraph['sex'],"race":$scope.raceGraph['race'],"relationship":$scope.relationGraph['relationship']}
            $scope.filterCondExpArray.push({condValue: '',"options":options})

            console.log($scope.filterCondExpArray)
        };

        $scope.removeFilterCond = function (index) {
            $scope.filterCondExpArray.splice(index, 1)
            if ($scope.filterCondExpArray.length == 0) {
                $scope.showCustomFilterBox = false
            }
        }


        $scope.setCond = function (index) {
            var options={"sex":$scope.sexGraph['sex'],"race":$scope.raceGraph['race'],"relationship":$scope.relationGraph['relationship']}
            $scope.filterCondExpArray=[{condValue: '',"options":options}]
            $uibModal.open({
                templateUrl: 'addDeriveColumn.html',
                windowClass: 'modal show modalDialogCenter',
                backdrop: 'static',
                backdropClass: 'show',
                scope: $scope,
                keyboard: false,
                size: "lg",
                controller: function ($scope, $rootScope, $uibModalInstance) {

                    $scope.title = 'Filters'

                    $scope.buildFilters=function()
                    {
                        $scope.saveFilterCond()
                        $uibModalInstance.dismiss('cancel');
                    }



                    $scope.submit = function () {
                        $scope.redirect(recon)
                    }

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
        }


        $scope.saveFilterCond = function () {
                        $scope.customFilters={}
                        if ($scope.filterCondExpArray.length > 0) {

                            angular.forEach($scope.filterCondExpArray,function (val,key) {

                                $scope.customFilters[val['selectedField']]=val['condValue']

                            })
                            var options={"sex":$scope.sexGraph['sex'],"race":$scope.raceGraph['race'],"relationship":$scope.relationGraph['relationship']}
                            $scope.filterCondExpArray = [{condValue: '',"options":options}]
                        }


                        console.log($scope.customFilters)


                        $scope.pageIndex=1

                        $scope.getData()


                    }


        $scope.clearFilter=function () {
            $scope.customFilters={}
            $scope.getData()
        }


         function buildCustomStringCondition(value) {

            if (value['selectedCond'] == 'isIn' || value['selectedCond'] == 'notIsIn') {
                var condValue = ''
                var condValue = '[' + value['condValue'].replace("^", "'").replace('$', "'").replace(/,/g, "','") + ']'
                return stringExpressions[value['selectedCond']].replace('$colName', value['selectedField']).replace('$colValue', condValue)
            } else {
                return stringExpressions[value['selectedCond']].replace('$colName', value['selectedField']).replace('$colValue', value['condValue'] == undefined ? '' : value['condValue'])
            }
        }


        var stringExpressions = {
            'notEqual': "(df['$colName'].str.strip()!='$colValue')",
            'equals': "(df['$colName'].str.strip()=='$colValue')",
            'startWith': "(df['$colName'].str.strip().startswith('$colValue'))",
            'notStartWith': "(~df['$colName'].str.strip().str.startswith('$colValue'))",
            'endsWith': "(df['$colName'].str.strip().endswith('$colValue'))",
            'notEndsWith': "(~df['$colName'].str.strip().endswith('$colValue'))",
            'contains': "(df['$colName'].str.strip().str.contains('$colValue',case=False))",
            'notContains': "(~df['$colName'].str.strip().str.contains('$colValue'))",
            'isIn': "(df['$colName'].str.strip().isin('$colValue'))",
            'notIsIn': "(~df['$colName'].str.strip().isin('$colValue'))"
        }


        $scope.buildCustomExpression = function () {

                var str = "df = df[";
            for (i = 0; i < $scope.filterCondExpArray.length; i++) {

                    str += buildCustomStringCondition($scope.filterCondExpArray[i])
                    if('logicalOperator' in $scope.filterCondExpArray[i])
                    {
                        str =str + $scope.filterCondExpArray[i]['logicalOperator']
                    }

            }
            if ($scope.newcolumnName != undefined && $scope.newcolumnName != '') {
                str += ",'" + $scope.newcolumnName + "'" + "] = "
                str += $scope.valueOfColumn == undefined ? '' : $scope.valueOfColumn
            }
            else {
                str += "]"
            }
            return str;
        }







        $scope.getData = function () {

            var data={}
            data['index'] = $scope.pageIndex
            data['pageSize'] = 5000

            if(angular.isDefined($scope.customFilters))
            {

                data['filters']=$scope.customFilters
            }

            $scope.openModalPopupOpen()

            $http.post("/api/adults_data/dummy/getData", {"query":data}).then(function (response) {

                if (response.data)
                {
                     $scope.summary = false
                $scope.transactionData = response['data']['msg']
                $scope.columnDefs = []
                $scope.columnDefs = [
                    {
                        headerName: '',
                        'width': 30,
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
                        checkboxSelection: true,
                        suppressAggregation: true,
                        suppressSorting: true,
                        suppressMenu: true,//headerCellTemplate: headerCellRendererFunc,
                        pinned: true
                    }
                ]

                angular.forEach($scope.transactionData['columns'], function (k, v) {
                    $scope.columnDefs.push({'field': k, 'filter': 'agTextColumnFilter'})
                })
                $scope.maxPages = $scope.transactionData['maxPages']
                $scope.gridOptions.columnDefs = $scope.columnDefs;
                $scope.gridOptions.rowData = $scope.transactionData['data'];

                $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs)
                $scope.gridOptions.api.setRowData($scope.gridOptions.rowData)
                $rootScope.openModalPopupClose()
                }

            }, function (response) {

                $scope.msg = "User Creattion unsuccessful";

            });


        }

    $scope.getData()


        $scope.downloadFiles = function (index) {
            file = $scope.downloadReportsDict[index]['downloadPath']
            $window.open('app/files/' + file)

        }

    }

]);



