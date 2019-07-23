/**
 * Created by root on 14/6/18.
 */
'use strict';
var app = angular.module("nextGen");

app.filter('capitalize', function () {
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});

app.filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 15;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }

    };
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=1; i<=total; i++) {
      input.push(i);
    }

    return input;
  };
});

app.filter('inrCurrencyFormat', function () {
    return function (input) {
        if (angular.isDefined(input) && input != null && input != undefined) {
            var frmtCurrency = ''
            frmtCurrency = input.toLocaleString('en-IN', {maximumFractionDigits: 2})
            frmtCurrency = frmtCurrency.indexOf('.') !== -1 ? frmtCurrency : frmtCurrency + '.00'
            return frmtCurrency
        } else {
            return '0.00'
        }
    }
});

