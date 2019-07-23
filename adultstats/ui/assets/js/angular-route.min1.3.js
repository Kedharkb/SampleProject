/*
 AngularJS v1.3.1
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,e,B){'use strict';function u(q,h,f){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,b,c,g,x){function y(){k&&(f.cancel(k),k=null);l&&(l.$destroy(),l=null);m&&(k=f.leave(m),k.then(function(){k=null}),m=null)}function w(){var c=q.current&&q.current.locals;if(e.isDefined(c&&c.$template)){var c=a.$new(),g=q.current;m=x(c,function(c){f.enter(c,null,m||b).then(function(){!e.isDefined(s)||s&&!a.$eval(s)||h()});y()});l=g.scope=c;l.$emit("$viewContentLoaded");
l.$eval(v)}else y()}var l,m,k,s=c.autoscroll,v=c.onload||"";a.$on("$routeChangeSuccess",w);w()}}}function z(e,h,f){return{restrict:"ECA",priority:-400,link:function(a,b){var c=f.current,g=c.locals;b.html(g.$template);var x=e(b.contents());c.controller&&(g.$scope=a,g=h(c.controller,g),c.controllerAs&&(a[c.controllerAs]=g),b.data("$ngControllerController",g),b.children().data("$ngControllerController",g));x(a)}}}p=e.module("ngRoute",["ng"]).provider("$route",function(){function q(a,b){return e.extend(new (e.extend(function(){},
{prototype:a})),b)}function h(a,e){var c=e.caseInsensitiveMatch,g={originalPath:a,regexp:a},f=g.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,e,c,b){a="?"===b?b:null;b="*"===b?b:null;f.push({name:c,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(b&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");g.regexp=new RegExp("^"+a+"$",c?"i":"");return g}var f={};this.when=function(a,b){f[a]=e.extend({reloadOnSearch:!0},b,a&&h(a,b));if(a){var c=
"/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";f[c]=e.extend({redirectTo:a},h(c,b))}return this};this.otherwise=function(a){"string"===typeof a&&(a={redirectTo:a});this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce",function(a,b,c,g,h,p,w){function l(b){var d=r.current;(u=(n=k())&&d&&n.$$route===d.$$route&&e.equals(n.pathParams,d.pathParams)&&!n.reloadOnSearch&&!v)||!d&&!n||a.$broadcast("$routeChangeStart",n,d).defaultPrevented&&
b&&b.preventDefault()}function m(){var t=r.current,d=n;if(u)t.params=d.params,e.copy(t.params,c),a.$broadcast("$routeUpdate",t);else if(d||t)v=!1,(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?b.path(s(d.redirectTo,d.params)).search(d.params).replace():b.url(d.redirectTo(d.pathParams,b.path(),b.search())).replace()),g.when(d).then(function(){if(d){var a=e.extend({},d.resolve),b,c;e.forEach(a,function(d,b){a[b]=e.isString(d)?h.get(d):h.invoke(d,null,null,b)});e.isDefined(b=d.template)?e.isFunction(b)&&
(b=b(d.params)):e.isDefined(c=d.templateUrl)&&(e.isFunction(c)&&(c=c(d.params)),c=w.getTrustedResourceUrl(c),e.isDefined(c)&&(d.loadedTemplateUrl=c,b=p(c)));e.isDefined(b)&&(a.$template=b);return g.all(a)}}).then(function(b){d==r.current&&(d&&(d.locals=b,e.copy(d.params,c)),a.$broadcast("$routeChangeSuccess",d,t))},function(b){d==r.current&&a.$broadcast("$routeChangeError",d,t,b)})}function k(){var a,d;e.forEach(f,function(c,g){var f;if(f=!d){var h=b.path();f=c.keys;var l={};if(c.regexp)if(h=c.regexp.exec(h)){for(var k=
1,m=h.length;k<m;++k){var n=f[k-1],p=h[k];n&&p&&(l[n.name]=p)}f=l}else f=null;else f=null;f=a=f}f&&(d=q(c,{params:e.extend({},b.search(),a),pathParams:a}),d.$$route=c)});return d||f[null]&&q(f[null],{params:{},pathParams:{}})}function s(a,b){var c=[];e.forEach((a||"").split(":"),function(a,e){if(0===e)c.push(a);else{var f=a.match(/(\w+)(.*)/),g=f[1];c.push(b[g]);c.push(f[2]||"");delete b[g]}});return c.join("")}var v=!1,n,u,r={routes:f,reload:function(){v=!0;a.$evalAsync(function(){l();m()})},updateParams:function(a){if(this.current&&
this.current.$$route){var c={},f=this;e.forEach(Object.keys(a),function(b){f.current.pathParams[b]||(c[b]=a[b])});a=e.extend({},this.current.params,a);b.path(s(this.current.$$route.originalPath,a));b.search(e.extend({},b.search(),c))}else throw A("norout");}};a.$on("$locationChangeStart",l);a.$on("$locationChangeSuccess",m);return r}]});var A=e.$$minErr("ngRoute");p.provider("$routeParams",function(){this.$get=function(){return{}}});p.directive("ngView",u);p.directive("ngView",z);u.$inject=["$route",
"$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map
