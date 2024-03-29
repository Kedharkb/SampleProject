(function(window, document) {

// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('ngCsv.config', []).
  value('ngCsv.config', {
      debug: true
  }).
  config(['$compileProvider', function($compileProvider){
    if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    } else {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    }
  }]);

// Modules
angular.module('ngCsv.directives', ['ngCsv.services']);
angular.module('ngCsv.services', []);
angular.module('ngCsv',
    [
        'ngCsv.config',
        'ngCsv.services',
        'ngCsv.directives',
        'ngSanitize'
    ]);
/**
 * Created by asafdav on 15/05/14.
 */
angular.module('ngCsv.services').
  service('CSV', ['$q', function($q)  {

    /**
     * Stringify one field
     * @param data
     * @param delimier
     * @returns {*}
     */
    this.stringifyField = function(data, delimier, quoteText) {
      if (typeof data === 'string') {
        data = data.replace(/"/g, '""'); // Escape double qoutes
        if (quoteText || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) data = delimier + data + delimier;
        return data;
      }

      if (typeof data === 'boolean') {
        return data ? 'TRUE' : 'FALSE';
      }

      return data;
    };

    /**
     * Creates a csv from a data array
     * @param data
     * @param options
     *  * header - Provide the first row (optional)
     *  * fieldSep - Field separator, default: ','
     * @param callback
     */
    this.stringify = function (data, options)
    {
      var def = $q.defer();

      var that = this;
      var csv;
      var csvContent;

      if(window.navigator.msSaveOrOpenBlob ||  (navigator.userAgent.indexOf("Chrome") !=-1 && navigator.appVersion.indexOf("Win")!=-1) || (navigator.userAgent.indexOf("Chromium") !=-1 && navigator.appVersion.indexOf("Linux")!=-1)) {
        csvContent = "";
      }else{
                csvContent = "data:text/csv;charset=utf-8,";
      }

      var dataPromise = $q.when(data).then(function (responseData)
      {
		  
        responseData = angular.copy(responseData);
        // Check if there's a provided header array
        if (angular.isDefined(options.header) && options.header)
        {
          var encodingArray, headerString;

          encodingArray = [];
          angular.forEach(options.header, function(title, key)
          {
            this.push(that.stringifyField(title, options.txtDelim, options.quoteStrings));
          }, encodingArray);

          headerString = encodingArray.join(options.fieldSep ? options.fieldSep : ",");
          csvContent += headerString + "\n";
		  //alert(csvContent);
        }

        var arrData;

        if (angular.isArray(responseData)) {
          arrData = responseData;
        }
        else {
          arrData = responseData();
        }

        angular.forEach(arrData, function(row, index)
        {
          var dataString, infoArray;

          infoArray = [];

          angular.forEach(row, function(field, key)
          {
            this.push(that.stringifyField(field, options.txtDelim, options.quoteStrings));
          }, infoArray);

          dataString = infoArray.join(options.fieldSep ? options.fieldSep : ",");
          csvContent += index < arrData.length ? dataString + "\n" : dataString;
        });

        if(window.navigator.msSaveOrOpenBlob ||  (navigator.userAgent.indexOf("Chrome") !=-1 && navigator.appVersion.indexOf("Win")!=-1) || (navigator.userAgent.indexOf("Chromium") !=-1 && navigator.appVersion.indexOf("Linux")!=-1)) {
          csv = csvContent;
        }else{
			
          csv = encodeURI(csvContent);
        }
        def.resolve(csv);
      });

      if (typeof dataPromise.catch === 'function') {
        dataPromise.catch(function(err) {
          def.reject(err);
        });
      }

      return def.promise;
    };
  }]);/**
 * ng-csv module
 * Export Javascript's arrays to csv files from the browser
 *
 * Author: asafdav - https://github.com/asafdav
 */
angular.module('ngCsv.directives').
  directive('ngCsv', ['$parse', '$q', 'CSV', '$document', '$timeout', function ($parse, $q, CSV, $document, $timeout) {
    return {
      restrict: 'AC',
      scope: {
        data:'&ngCsv',
        filename:'@filename',
        header: '&csvHeader',
        txtDelim: '@textDelimiter',
        quoteStrings: '@quoteStrings',
        fieldSep: '@fieldSeparator',
        lazyLoad: '@lazyLoad',
        ngClick: '&'
      },
      controller: [
        '$scope',
        '$element',
        '$attrs',
        '$transclude',
        function ($scope, $element, $attrs, $transclude) {
          $scope.csv = '';

          if (!angular.isDefined($scope.lazyLoad) || $scope.lazyLoad != "true")
          {
            if (angular.isArray($scope.data))
            {
              $scope.$watch("data", function (newValue) {
                $scope.buildCSV();
              }, true);
            }
          }

          $scope.getFilename = function ()
          {
            return $scope.filename || 'download.csv';
          };

          function getBuildCsvOptions() {
            var options = {
              txtDelim: $scope.txtDelim ? $scope.txtDelim : '"',
              quoteStrings: $scope.quoteStrings
            };
            if (angular.isDefined($attrs.csvHeader)) options.header = $scope.$eval($scope.header);
            options.fieldSep = $scope.fieldSep ? $scope.fieldSep : ",";

            return options;
          }
          $scope.browserCheck = function()
		  {
		    /*var userAgent = $window.navigator.userAgent;
            var browsers = {chrome: /chrome/i};
            angular.forEach(broswers, function(key, value) {

			   if (value.test(userAgent)) {
				  return true;
			  }
            });
	    	  return false;*/
			  var nAgt = navigator.userAgent;
              var browserName  = navigator.appName;
			  console.log(navigator.userAgent);
  			  console.log(navigator.appVersion);
			  if ((nAgt.indexOf("Chrome") !=-1 && navigator.appVersion.indexOf("Win") != -1) ||  (navigator.userAgent.indexOf("Chromium") !=-1 && navigator.appVersion.indexOf("Linux")!=-1)) {
				 return true;
				}
				return false;
		  }
          /**
           * Creates the CSV and updates the scope
           * @returns {*}
           */
          $scope.buildCSV = function() {
            var deferred = $q.defer();

            CSV.stringify($scope.data(), getBuildCsvOptions()).then(function(csv) {
			   $scope.csv = csv;
              deferred.resolve(csv);
            });
            $scope.$apply(); // Old angular support

            return deferred.promise;
          };
        }
      ],
      link: function (scope, element, attrs) {
        function doClick() {
          if(window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([scope.csv],{
                    type: "text/csv;charset=utf-8;"
                });
            navigator.msSaveBlob(blob, scope.getFilename());
          } else {
//alert(scope.browserCheck());
		   if(scope.browserCheck())
			  {
				var pom = document.createElement('a');
				var csvContent=scope.csv; //here we load our csv data 
				var blob = new Blob([scope.csv],{type: 'text/csv;charset=utf-8;'});
				var url = URL.createObjectURL(blob);
				pom.href = url;
				pom.setAttribute('download', scope.getFilename());
				pom.click();
			  }
			  else
			  {
				    var downloadLink = angular.element('<a></a>');
					downloadLink.attr('href',scope.csv);
					downloadLink.attr('download',scope.getFilename());

					$document.find('body').append(downloadLink);
					$timeout(function() {
					   try {
                          downloadLink[0].click();
                          downloadLink.remove(downloadLink);
                       } catch (err) {
                       }
					}, null);
			  }
          }

        }

        element.bind('click', function (e)
        {
          scope.buildCSV().then(function(csv) {
            doClick();
          });
          scope.$apply();
        });
      }
    };
  }]);
})(window, document);
