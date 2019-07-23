/**
 * Created by swami on 1/6/17.
 */
!function () {
    !function (root, factory) {
        "function" == typeof define && define.amd ? define(factory) : root.AppcuesWidget = factory()
    }(this, function () {
        var requirejs, require, define;
        return function (undef) {
            function hasProp(obj, prop) {
                return hasOwn.call(obj, prop)
            }

            function normalize(name, baseName) {
                var nameParts, nameSegment, mapValue, foundMap, foundI, foundStarMap, starI, i, j, part,
                    baseParts = baseName && baseName.split("/"), map = config.map, starMap = map && map["*"] || {};
                if (name && "." === name.charAt(0))if (baseName) {
                    for (baseParts = baseParts.slice(0, baseParts.length - 1), name = baseParts.concat(name.split("/")), i = 0; i < name.length; i += 1)if ("." === (part = name[i])) name.splice(i, 1), i -= 1; else if (".." === part) {
                        if (1 === i && (".." === name[2] || ".." === name[0]))break;
                        i > 0 && (name.splice(i - 1, 2), i -= 2)
                    }
                    name = name.join("/")
                } else 0 === name.indexOf("./") && (name = name.substring(2));
                if ((baseParts || starMap) && map) {
                    for (nameParts = name.split("/"), i = nameParts.length; i > 0; i -= 1) {
                        if (nameSegment = nameParts.slice(0, i).join("/"), baseParts)for (j = baseParts.length; j > 0; j -= 1)if ((mapValue = map[baseParts.slice(0, j).join("/")]) && (mapValue = mapValue[nameSegment])) {
                            foundMap = mapValue, foundI = i;
                            break
                        }
                        if (foundMap)break;
                        !foundStarMap && starMap && starMap[nameSegment] && (foundStarMap = starMap[nameSegment], starI = i)
                    }
                    !foundMap && foundStarMap && (foundMap = foundStarMap, foundI = starI), foundMap && (nameParts.splice(0, foundI, foundMap), name = nameParts.join("/"))
                }
                return name
            }

            function makeRequire(relName, forceSync) {
                return function () {
                    return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]))
                }
            }

            function makeNormalize(relName) {
                return function (name) {
                    return normalize(name, relName)
                }
            }

            function makeLoad(depName) {
                return function (value) {
                    defined[depName] = value
                }
            }

            function callDep(name) {
                if (hasProp(waiting, name)) {
                    var args = waiting[name];
                    delete waiting[name], defining[name] = !0, main.apply(undef, args)
                }
                if (!hasProp(defined, name) && !hasProp(defining, name))throw new Error("No " + name);
                return defined[name]
            }

            function splitPrefix(name) {
                var prefix, index = name ? name.indexOf("!") : -1;
                return index > -1 && (prefix = name.substring(0, index), name = name.substring(index + 1, name.length)), [prefix, name]
            }

            function makeConfig(name) {
                return function () {
                    return config && config.config && config.config[name] || {}
                }
            }

            var main, req, makeMap, handlers, defined = {}, waiting = {}, config = {}, defining = {},
                hasOwn = Object.prototype.hasOwnProperty, aps = [].slice;
            makeMap = function (name, relName) {
                var plugin, parts = splitPrefix(name), prefix = parts[0];
                return name = parts[1], prefix && (prefix = normalize(prefix, relName), plugin = callDep(prefix)), prefix ? name = plugin && plugin.normalize ? plugin.normalize(name, makeNormalize(relName)) : normalize(name, relName) : (name = normalize(name, relName), parts = splitPrefix(name), prefix = parts[0], name = parts[1], prefix && (plugin = callDep(prefix))), {
                    f: prefix ? prefix + "!" + name : name,
                    n: name,
                    pr: prefix,
                    p: plugin
                }
            }, handlers = {
                require: function (name) {
                    return makeRequire(name)
                }, exports: function (name) {
                    var e = defined[name];
                    return void 0 !== e ? e : defined[name] = {}
                }, module: function (name) {
                    return {id: name, uri: "", exports: defined[name], config: makeConfig(name)}
                }
            }, main = function (name, deps, callback, relName) {
                var cjsModule, depName, ret, map, i, usingExports, args = [];
                if (relName = relName || name, "function" == typeof callback) {
                    for (deps = !deps.length && callback.length ? ["require", "exports", "module"] : deps, i = 0; i < deps.length; i += 1)if (map = makeMap(deps[i], relName), "require" === (depName = map.f)) args[i] = handlers.require(name); else if ("exports" === depName) args[i] = handlers.exports(name), usingExports = !0; else if ("module" === depName) cjsModule = args[i] = handlers.module(name); else if (hasProp(defined, depName) || hasProp(waiting, depName) || hasProp(defining, depName)) args[i] = callDep(depName); else {
                        if (!map.p)throw new Error(name + " missing " + depName);
                        map.p.load(map.n, makeRequire(relName, !0), makeLoad(depName), {}), args[i] = defined[depName]
                    }
                    ret = callback.apply(defined[name], args), name && (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name] ? defined[name] = cjsModule.exports : ret === undef && usingExports || (defined[name] = ret))
                } else name && (defined[name] = callback)
            }, requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
                return "string" == typeof deps ? handlers[deps] ? handlers[deps](callback) : callDep(makeMap(deps, callback).f) : (deps.splice || (config = deps, callback.splice ? (deps = callback, callback = relName, relName = null) : deps = undef), callback = callback || function () {
                    }, "function" == typeof relName && (relName = forceSync, forceSync = alt), forceSync ? main(undef, deps, callback, relName) : setTimeout(function () {
                    main(undef, deps, callback, relName)
                }, 4), req)
            }, req.config = function (cfg) {
                return config = cfg, config.deps && req(config.deps, config.callback), req
            }, requirejs._defined = defined, define = function (name, deps, callback) {
                deps.splice || (callback = deps, deps = []), hasProp(defined, name) || hasProp(waiting, name) || (waiting[name] = [name, deps, callback])
            }, define.amd = {jQuery: !0}
        }(), define("../../../almond", function () {
        }), function () {
            define("env", [], function () {
                var env, isFile, isHttp, isModernXHR, xhr;
                env = {
                    firebase: "https://appcues.firebaseio.com",
                    keenUrl: "https://vulpix.appcues.com",
                    keenProjectId: "53cd4a95ce5e43684c00000d",
                    keenWriteKey: "11f809081e4b3f0c2fb04d2c5ed3334dd8374fd3c621523bdb8503158595f52ce37a7cce91be086ad99cfb8ea9d71e14966ea7d264c24d6b16cbc9a80c5da5cdcbd921246fa1714ed1cfb078a4fa4ae27f5976c37a091f53181d9d336c5c04ec7b30b767a05cb72865a36cdfab1bf2e1",
                    segmentUrl: "https://api.segment.io/v1/pixel/track?data=",
                    segmentWriteKey: "JBJahvq064yXNL27f0HunKBRhDx4pkxP",
                    VERSION: "2.17.20",
                    sentryUrl: "https://31aabb624cbe410790e56a0a2dd1b660@app.getsentry.com/20245",
                    RELEASE_ID: "6c73160575bf6dd1ee35848352d51ea6e801fe4a",
                    APPCUES_CSS: "https://fast.appcues.com/appcues.css",
                    APPCUES_SANDBOX_CSS: "https://fast.appcues.com/appcues-sandboxed.css",
                    TOOLTIP_CSS: "https://fast.appcues.com/tooltip.css",
                    COACHMARK_CSS: "https://fast.appcues.com/coachmark.css",
                    TOOLTIP_FRAME_SRC: "https://my.appcues.com/tooltip",
                    BUS_FRAME_SRC: "https://my.appcues.com/frame",
                    BEACON_CURSOR: "//my.appcues.com/images/hotspot-cursor.png",
                    POWERED_BY_UTM_LINK: "http://appcues.com/?utm_medium=embed-script&utm_campaign=powered-by-appcues",
                    CDN_DOMAIN: "fast.appcues.com",
                    GA_TIMING_ACCOUNT_ID: "UA-42463600-4",
                    API_URL: "https://api.appcues.net/v1"
                };
                try {
                    isHttp = "http:" === window.location.protocol, isFile = "file:" === window.location.protocol, isModernXHR = null != window.XMLHttpRequest && (xhr = new XMLHttpRequest) && "withCredentials" in xhr, !isHttp && !isFile || isModernXHR || null != window.XDomainRequest && (env.firebase = "http://proxy.appcues.com")
                } catch (_error) {
                }
                return env
            })
        }.call(this), function () {
            var root = this, previousUnderscore = root._, breaker = {}, ArrayProto = Array.prototype,
                ObjProto = Object.prototype, FuncProto = Function.prototype, push = ArrayProto.push,
                slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString,
                hasOwnProperty = ObjProto.hasOwnProperty, nativeForEach = ArrayProto.forEach,
                nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce,
                nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter,
                nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf,
                nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys,
                nativeBind = FuncProto.bind, _ = function (obj) {
                    return obj instanceof _ ? obj : this instanceof _ ? void(this._wrapped = obj) : new _(obj)
                };
            "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), exports._ = _) : root._ = _, _.VERSION = "1.6.0";
            var each = _.each = _.forEach = function (obj, iterator, context) {
                if (null == obj)return obj;
                if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context); else if (obj.length === +obj.length) {
                    for (var i = 0,
                             length = obj.length; i < length; i++)if (iterator.call(context, obj[i], i, obj) === breaker)return
                } else for (var keys = _.keys(obj), i = 0,
                                length = keys.length; i < length; i++)if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker)return;
                return obj
            };
            _.map = _.collect = function (obj, iterator, context) {
                var results = [];
                return null == obj ? results : nativeMap && obj.map === nativeMap ? obj.map(iterator, context) : (each(obj, function (value, index, list) {
                    results.push(iterator.call(context, value, index, list))
                }), results)
            };
            var reduceError = "Reduce of empty array with no initial value";
            _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduce && obj.reduce === nativeReduce)return context && (iterator = _.bind(iterator, context)), initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                if (each(obj, function (value, index, list) {
                        initial ? memo = iterator.call(context, memo, value, index, list) : (memo = value, initial = !0)
                    }), !initial)throw new TypeError(reduceError);
                return memo
            }, _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduceRight && obj.reduceRight === nativeReduceRight)return context && (iterator = _.bind(iterator, context)), initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                var length = obj.length;
                if (length !== +length) {
                    var keys = _.keys(obj);
                    length = keys.length
                }
                if (each(obj, function (value, index, list) {
                        index = keys ? keys[--length] : --length, initial ? memo = iterator.call(context, memo, obj[index], index, list) : (memo = obj[index], initial = !0)
                    }), !initial)throw new TypeError(reduceError);
                return memo
            }, _.find = _.detect = function (obj, predicate, context) {
                var result;
                return any(obj, function (value, index, list) {
                    if (predicate.call(context, value, index, list))return result = value, !0
                }), result
            }, _.filter = _.select = function (obj, predicate, context) {
                var results = [];
                return null == obj ? results : nativeFilter && obj.filter === nativeFilter ? obj.filter(predicate, context) : (each(obj, function (value, index, list) {
                    predicate.call(context, value, index, list) && results.push(value)
                }), results)
            }, _.reject = function (obj, predicate, context) {
                return _.filter(obj, function (value, index, list) {
                    return !predicate.call(context, value, index, list)
                }, context)
            }, _.every = _.all = function (obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !0;
                return null == obj ? result : nativeEvery && obj.every === nativeEvery ? obj.every(predicate, context) : (each(obj, function (value, index, list) {
                    if (!(result = result && predicate.call(context, value, index, list)))return breaker
                }), !!result)
            };
            var any = _.some = _.any = function (obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !1;
                return null == obj ? result : nativeSome && obj.some === nativeSome ? obj.some(predicate, context) : (each(obj, function (value, index, list) {
                    if (result || (result = predicate.call(context, value, index, list)))return breaker
                }), !!result)
            };
            _.contains = _.include = function (obj, target) {
                return null != obj && (nativeIndexOf && obj.indexOf === nativeIndexOf ? -1 != obj.indexOf(target) : any(obj, function (value) {
                        return value === target
                    }))
            }, _.invoke = function (obj, method) {
                var args = slice.call(arguments, 2), isFunc = _.isFunction(method);
                return _.map(obj, function (value) {
                    return (isFunc ? method : value[method]).apply(value, args)
                })
            }, _.pluck = function (obj, key) {
                return _.map(obj, _.property(key))
            }, _.where = function (obj, attrs) {
                return _.filter(obj, _.matches(attrs))
            }, _.findWhere = function (obj, attrs) {
                return _.find(obj, _.matches(attrs))
            }, _.max = function (obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535)return Math.max.apply(Math, obj);
                var result = -1 / 0, lastComputed = -1 / 0;
                return each(obj, function (value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed > lastComputed && (result = value, lastComputed = computed)
                }), result
            }, _.min = function (obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535)return Math.min.apply(Math, obj);
                var result = 1 / 0, lastComputed = 1 / 0;
                return each(obj, function (value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed < lastComputed && (result = value, lastComputed = computed)
                }), result
            }, _.shuffle = function (obj) {
                var rand, index = 0, shuffled = [];
                return each(obj, function (value) {
                    rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value
                }), shuffled
            }, _.sample = function (obj, n, guard) {
                return null == n || guard ? (obj.length !== +obj.length && (obj = _.values(obj)), obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n))
            };
            var lookupIterator = function (value) {
                return null == value ? _.identity : _.isFunction(value) ? value : _.property(value)
            };
            _.sortBy = function (obj, iterator, context) {
                return iterator = lookupIterator(iterator), _.pluck(_.map(obj, function (value, index, list) {
                    return {value: value, index: index, criteria: iterator.call(context, value, index, list)}
                }).sort(function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    if (a !== b) {
                        if (a > b || void 0 === a)return 1;
                        if (a < b || void 0 === b)return -1
                    }
                    return left.index - right.index
                }), "value")
            };
            var group = function (behavior) {
                return function (obj, iterator, context) {
                    var result = {};
                    return iterator = lookupIterator(iterator), each(obj, function (value, index) {
                        var key = iterator.call(context, value, index, obj);
                        behavior(result, key, value)
                    }), result
                }
            };
            _.groupBy = group(function (result, key, value) {
                _.has(result, key) ? result[key].push(value) : result[key] = [value]
            }), _.indexBy = group(function (result, key, value) {
                result[key] = value
            }), _.countBy = group(function (result, key) {
                _.has(result, key) ? result[key]++ : result[key] = 1
            }), _.sortedIndex = function (array, obj, iterator, context) {
                iterator = lookupIterator(iterator);
                for (var value = iterator.call(context, obj), low = 0, high = array.length; low < high;) {
                    var mid = low + high >>> 1;
                    iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid
                }
                return low
            }, _.toArray = function (obj) {
                return obj ? _.isArray(obj) ? slice.call(obj) : obj.length === +obj.length ? _.map(obj, _.identity) : _.values(obj) : []
            }, _.size = function (obj) {
                return null == obj ? 0 : obj.length === +obj.length ? obj.length : _.keys(obj).length
            }, _.first = _.head = _.take = function (array, n, guard) {
                if (null != array)return null == n || guard ? array[0] : n < 0 ? [] : slice.call(array, 0, n)
            }, _.initial = function (array, n, guard) {
                return slice.call(array, 0, array.length - (null == n || guard ? 1 : n))
            }, _.last = function (array, n, guard) {
                if (null != array)return null == n || guard ? array[array.length - 1] : slice.call(array, Math.max(array.length - n, 0))
            }, _.rest = _.tail = _.drop = function (array, n, guard) {
                return slice.call(array, null == n || guard ? 1 : n)
            }, _.compact = function (array) {
                return _.filter(array, _.identity)
            };
            var flatten = function (input, shallow, output) {
                return shallow && _.every(input, _.isArray) ? concat.apply(output, input) : (each(input, function (value) {
                    _.isArray(value) || _.isArguments(value) ? shallow ? push.apply(output, value) : flatten(value, shallow, output) : output.push(value)
                }), output)
            };
            _.flatten = function (array, shallow) {
                return flatten(array, shallow, [])
            }, _.without = function (array) {
                return _.difference(array, slice.call(arguments, 1))
            }, _.partition = function (array, predicate) {
                var pass = [], fail = [];
                return each(array, function (elem) {
                    (predicate(elem) ? pass : fail).push(elem)
                }), [pass, fail]
            }, _.uniq = _.unique = function (array, isSorted, iterator, context) {
                _.isFunction(isSorted) && (context = iterator, iterator = isSorted, isSorted = !1);
                var initial = iterator ? _.map(array, iterator, context) : array, results = [], seen = [];
                return each(initial, function (value, index) {
                    (isSorted ? index && seen[seen.length - 1] === value : _.contains(seen, value)) || (seen.push(value), results.push(array[index]))
                }), results
            }, _.union = function () {
                return _.uniq(_.flatten(arguments, !0))
            }, _.intersection = function (array) {
                var rest = slice.call(arguments, 1);
                return _.filter(_.uniq(array), function (item) {
                    return _.every(rest, function (other) {
                        return _.contains(other, item)
                    })
                })
            }, _.difference = function (array) {
                var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
                return _.filter(array, function (value) {
                    return !_.contains(rest, value)
                })
            }, _.zip = function () {
                for (var length = _.max(_.pluck(arguments, "length").concat(0)), results = new Array(length),
                         i = 0; i < length; i++)results[i] = _.pluck(arguments, "" + i);
                return results
            }, _.object = function (list, values) {
                if (null == list)return {};
                for (var result = {}, i = 0,
                         length = list.length; i < length; i++)values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
                return result
            }, _.indexOf = function (array, item, isSorted) {
                if (null == array)return -1;
                var i = 0, length = array.length;
                if (isSorted) {
                    if ("number" != typeof isSorted)return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
                    i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf)return array.indexOf(item, isSorted);
                for (; i < length; i++)if (array[i] === item)return i;
                return -1
            }, _.lastIndexOf = function (array, item, from) {
                if (null == array)return -1;
                var hasIndex = null != from;
                if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf)return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
                for (var i = hasIndex ? from : array.length; i--;)if (array[i] === item)return i;
                return -1
            }, _.range = function (start, stop, step) {
                arguments.length <= 1 && (stop = start || 0, start = 0), step = arguments[2] || 1;
                for (var length = Math.max(Math.ceil((stop - start) / step), 0), idx = 0,
                         range = new Array(length); idx < length;)range[idx++] = start, start += step;
                return range
            };
            var ctor = function () {
            };
            _.bind = function (func, context) {
                var args, bound;
                if (nativeBind && func.bind === nativeBind)return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func))throw new TypeError;
                return args = slice.call(arguments, 2), bound = function () {
                    if (!(this instanceof bound))return func.apply(context, args.concat(slice.call(arguments)));
                    ctor.prototype = func.prototype;
                    var self = new ctor;
                    ctor.prototype = null;
                    var result = func.apply(self, args.concat(slice.call(arguments)));
                    return Object(result) === result ? result : self
                }
            }, _.partial = function (func) {
                var boundArgs = slice.call(arguments, 1);
                return function () {
                    for (var position = 0, args = boundArgs.slice(), i = 0,
                             length = args.length; i < length; i++)args[i] === _ && (args[i] = arguments[position++]);
                    for (; position < arguments.length;)args.push(arguments[position++]);
                    return func.apply(this, args)
                }
            }, _.bindAll = function (obj) {
                var funcs = slice.call(arguments, 1);
                if (0 === funcs.length)throw new Error("bindAll must be passed function names");
                return each(funcs, function (f) {
                    obj[f] = _.bind(obj[f], obj)
                }), obj
            }, _.memoize = function (func, hasher) {
                var memo = {};
                return hasher || (hasher = _.identity), function () {
                    var key = hasher.apply(this, arguments);
                    return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments)
                }
            }, _.delay = function (func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function () {
                    return func.apply(null, args)
                }, wait)
            }, _.defer = function (func) {
                return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)))
            }, _.throttle = function (func, wait, options) {
                var context, args, result, timeout = null, previous = 0;
                options || (options = {});
                var later = function () {
                    previous = !1 === options.leading ? 0 : _.now(), timeout = null, result = func.apply(context, args), context = args = null
                };
                return function () {
                    var now = _.now();
                    previous || !1 !== options.leading || (previous = now);
                    var remaining = wait - (now - previous);
                    return context = this, args = arguments, remaining <= 0 ? (clearTimeout(timeout), timeout = null, previous = now, result = func.apply(context, args), context = args = null) : timeout || !1 === options.trailing || (timeout = setTimeout(later, remaining)), result
                }
            }, _.debounce = function (func, wait, immediate) {
                var timeout, args, context, timestamp, result, later = function () {
                    var last = _.now() - timestamp;
                    last < wait ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), context = args = null))
                };
                return function () {
                    context = this, args = arguments, timestamp = _.now();
                    var callNow = immediate && !timeout;
                    return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), context = args = null), result
                }
            }, _.once = function (func) {
                var memo, ran = !1;
                return function () {
                    return ran ? memo : (ran = !0, memo = func.apply(this, arguments), func = null, memo)
                }
            }, _.wrap = function (func, wrapper) {
                return _.partial(wrapper, func)
            }, _.compose = function () {
                var funcs = arguments;
                return function () {
                    for (var args = arguments, i = funcs.length - 1; i >= 0; i--)args = [funcs[i].apply(this, args)];
                    return args[0]
                }
            }, _.after = function (times, func) {
                return function () {
                    if (--times < 1)return func.apply(this, arguments)
                }
            }, _.keys = function (obj) {
                if (!_.isObject(obj))return [];
                if (nativeKeys)return nativeKeys(obj);
                var keys = [];
                for (var key in obj)_.has(obj, key) && keys.push(key);
                return keys
            }, _.values = function (obj) {
                for (var keys = _.keys(obj), length = keys.length, values = new Array(length),
                         i = 0; i < length; i++)values[i] = obj[keys[i]];
                return values
            }, _.pairs = function (obj) {
                for (var keys = _.keys(obj), length = keys.length, pairs = new Array(length),
                         i = 0; i < length; i++)pairs[i] = [keys[i], obj[keys[i]]];
                return pairs
            }, _.invert = function (obj) {
                for (var result = {}, keys = _.keys(obj), i = 0,
                         length = keys.length; i < length; i++)result[obj[keys[i]]] = keys[i];
                return result
            }, _.functions = _.methods = function (obj) {
                var names = [];
                for (var key in obj)_.isFunction(obj[key]) && names.push(key);
                return names.sort()
            }, _.extend = function (obj) {
                return each(slice.call(arguments, 1), function (source) {
                    if (source)for (var prop in source)obj[prop] = source[prop]
                }), obj
            }, _.pick = function (obj) {
                var copy = {}, keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                return each(keys, function (key) {
                    key in obj && (copy[key] = obj[key])
                }), copy
            }, _.omit = function (obj) {
                var copy = {}, keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                for (var key in obj)_.contains(keys, key) || (copy[key] = obj[key]);
                return copy
            }, _.defaults = function (obj) {
                return each(slice.call(arguments, 1), function (source) {
                    if (source)for (var prop in source)void 0 === obj[prop] && (obj[prop] = source[prop])
                }), obj
            }, _.clone = function (obj) {
                return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj
            }, _.tap = function (obj, interceptor) {
                return interceptor(obj), obj
            };
            var eq = function (a, b, aStack, bStack) {
                if (a === b)return 0 !== a || 1 / a == 1 / b;
                if (null == a || null == b)return a === b;
                a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
                var className = toString.call(a);
                if (className != toString.call(b))return !1;
                switch (className) {
                    case"[object String]":
                        return a == String(b);
                    case"[object Number]":
                        return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
                    case"[object Date]":
                    case"[object Boolean]":
                        return +a == +b;
                    case"[object RegExp]":
                        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
                }
                if ("object" != typeof a || "object" != typeof b)return !1;
                for (var length = aStack.length; length--;)if (aStack[length] == a)return bStack[length] == b;
                var aCtor = a.constructor, bCtor = b.constructor;
                if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b)return !1;
                aStack.push(a), bStack.push(b);
                var size = 0, result = !0;
                if ("[object Array]" == className) {
                    if (size = a.length, result = size == b.length)for (; size-- && (result = eq(a[size], b[size], aStack, bStack)););
                } else {
                    for (var key in a)if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))))break;
                    if (result) {
                        for (key in b)if (_.has(b, key) && !size--)break;
                        result = !size
                    }
                }
                return aStack.pop(), bStack.pop(), result
            };
            _.isEqual = function (a, b) {
                return eq(a, b, [], [])
            }, _.isEmpty = function (obj) {
                if (null == obj)return !0;
                if (_.isArray(obj) || _.isString(obj))return 0 === obj.length;
                for (var key in obj)if (_.has(obj, key))return !1;
                return !0
            }, _.isElement = function (obj) {
                return !(!obj || 1 !== obj.nodeType)
            }, _.isArray = nativeIsArray || function (obj) {
                    return "[object Array]" == toString.call(obj)
                }, _.isObject = function (obj) {
                return obj === Object(obj)
            }, each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (name) {
                _["is" + name] = function (obj) {
                    return toString.call(obj) == "[object " + name + "]"
                }
            }), _.isArguments(arguments) || (_.isArguments = function (obj) {
                return !(!obj || !_.has(obj, "callee"))
            }), "function" != typeof/./ && (_.isFunction = function (obj) {
                return "function" == typeof obj
            }), _.isFinite = function (obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj))
            }, _.isNaN = function (obj) {
                return _.isNumber(obj) && obj != +obj
            }, _.isBoolean = function (obj) {
                return !0 === obj || !1 === obj || "[object Boolean]" == toString.call(obj)
            }, _.isNull = function (obj) {
                return null === obj
            }, _.isUndefined = function (obj) {
                return void 0 === obj
            }, _.has = function (obj, key) {
                return hasOwnProperty.call(obj, key)
            }, _.noConflict = function () {
                return root._ = previousUnderscore, this
            }, _.identity = function (value) {
                return value
            }, _.constant = function (value) {
                return function () {
                    return value
                }
            }, _.property = function (key) {
                return function (obj) {
                    return obj[key]
                }
            }, _.matches = function (attrs) {
                return function (obj) {
                    if (obj === attrs)return !0;
                    for (var key in attrs)if (attrs[key] !== obj[key])return !1;
                    return !0
                }
            }, _.times = function (n, iterator, context) {
                for (var accum = Array(Math.max(0, n)), i = 0; i < n; i++)accum[i] = iterator.call(context, i);
                return accum
            }, _.random = function (min, max) {
                return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1))
            }, _.now = Date.now || function () {
                    return (new Date).getTime()
                };
            var entityMap = {escape: {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;"}};
            entityMap.unescape = _.invert(entityMap.escape);
            var entityRegexes = {
                escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
            };
            _.each(["escape", "unescape"], function (method) {
                _[method] = function (string) {
                    return null == string ? "" : ("" + string).replace(entityRegexes[method], function (match) {
                        return entityMap[method][match]
                    })
                }
            }), _.result = function (object, property) {
                if (null != object) {
                    var value = object[property];
                    return _.isFunction(value) ? value.call(object) : value
                }
            }, _.mixin = function (obj) {
                each(_.functions(obj), function (name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function () {
                        var args = [this._wrapped];
                        return push.apply(args, arguments), result.call(this, func.apply(_, args))
                    }
                })
            };
            var idCounter = 0;
            _.uniqueId = function (prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id
            }, _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/,
                escapes = {"'": "'", "\\": "\\", "\r": "r", "\n": "n", "\t": "t", "\u2028": "u2028", "\u2029": "u2029"},
                escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            _.template = function (text, data, settings) {
                var render;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g"),
                    index = 0, source = "__p+='";
                text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                    return source += text.slice(index, offset).replace(escaper, function (match) {
                        return "\\" + escapes[match]
                    }), escape && (source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"), interpolate && (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"), evaluate && (source += "';\n" + evaluate + "\n__p+='"), index = offset + match.length, match
                }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    render = new Function(settings.variable || "obj", "_", source)
                } catch (e) {
                    throw e.source = source, e
                }
                if (data)return render(data, _);
                var template = function (data) {
                    return render.call(this, data, _)
                };
                return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", template
            }, _.chain = function (obj) {
                return _(obj).chain()
            };
            var result = function (obj) {
                return this._chain ? _(obj).chain() : obj
            };
            _.mixin(_), each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                    var obj = this._wrapped;
                    return method.apply(obj, arguments), "shift" != name && "splice" != name || 0 !== obj.length || delete obj[0], result.call(this, obj)
                }
            }), each(["concat", "join", "slice"], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                    return result.call(this, method.apply(this._wrapped, arguments))
                }
            }), _.extend(_.prototype, {
                chain: function () {
                    return this._chain = !0, this
                }, value: function () {
                    return this._wrapped
                }
            }), "function" == typeof define && define.amd && define("underscore", [], function () {
                return _.noConflict()
            })
        }.call(this), function () {
            var slice = [].slice;
            define("utils/dollar", ["underscore"], function (_) {
                var ArrayProto, ElementProto, dollar, elementAddEventListener, elementRemoveEventListener;
                return ArrayProto = Array.prototype, ElementProto = "undefined" != typeof Element && Element.prototype || {}, dollar = function (obj) {
                    return obj instanceof dollar ? obj : this instanceof dollar ? void(this._wrapped = obj) : new dollar(obj)
                }, dollar.find = function (el, selector) {
                    var els;
                    return els = el.querySelectorAll(selector), _.map(els, dollar)
                }, dollar.findOne = function (el, selector) {
                    var result;
                    return result = el.querySelector(selector), result && (result = dollar(result)), result
                }, dollar.createElement = function (el, tagName) {
                    return dollar(el.createElement(tagName))
                }, dollar.remove = function (el) {
                    return el.parentNode.removeChild(el), dollar(el)
                }, dollar.append = function (el, childEl) {
                    var _childEl;
                    return _childEl = childEl, childEl instanceof dollar && (_childEl = childEl._wrapped), el.appendChild(_childEl), dollar(el)
                }, dollar.prepend = function (el, childEl) {
                    var _childEl;
                    return _childEl = childEl, childEl instanceof dollar && (_childEl = childEl._wrapped), el.insertBefore(_childEl, el.firstChild), dollar(el)
                }, elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
                        return this.attachEvent("on" + eventName, listener)
                    }, elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
                        return this.detachEvent("on" + eventName, listener)
                    }, dollar.addEventListener = function () {
                    var args, el;
                    return el = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [], elementAddEventListener.apply(el, args)
                }, dollar.removeEventListener = function () {
                    var args, el;
                    return el = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [], elementRemoveEventListener.apply(el, args)
                }, dollar.addClass = function (el, classStr) {
                    var cl, i, len, ref;
                    if (el.classList)for (ref = classStr.split(" "), i = 0, len = ref.length; i < len; i++)cl = ref[i], el.classList.add.apply(el.classList, [cl]); else el.className += " " + classStr;
                    return dollar(el)
                }, dollar.removeClass = function (el, classStr) {
                    var regexp;
                    return el.classList ? el.classList.remove(classStr) : (regexp = new RegExp("(^|\\b)" + classStr.split(" ").join("|") + "(\\b|$)", "gi"), el.className = el.className.replace(regexp, " ")), dollar(el)
                }, dollar.hasClass = function (el, classStr) {
                    return el.classList ? el.classList.contains(classStr) : new RegExp("(^| )" + classStr + "( |$)", "gi").test(el.className)
                }, dollar.attr = function (el, attr, value) {
                    return null == value ? el.getAttribute(attr) : (el.setAttribute(attr, value), dollar(el))
                }, dollar.removeAttr = function (el, attr) {
                    return el.removeAttr(attr), dollar(el)
                }, dollar.width = function (el) {
                    return el.offsetWidth
                }, dollar.height = function (el) {
                    return el.offsetHeight
                }, dollar.absoluteOffset = function (el) {
                    var left, top;
                    if (left = top = 0, el.offsetParent)for (; ;)if (left += el.offsetLeft, top += el.offsetTop, !(el = el.offsetParent))break;
                    return {left: left, top: top}
                }, dollar.html = function (el, str) {
                    return null != str ? (el.innerHTML = str, dollar(el)) : el.innerHTML
                }, dollar.text = function (el, str) {
                    return null != str ? (el.textContent = str, dollar(el)) : el.textContent
                }, dollar.mixin = function (obj) {
                    _.each(_.functions(obj), function (name) {
                        var func;
                        return func = dollar[name] = obj[name], dollar.prototype[name] = function () {
                            var args;
                            return args = [this._wrapped], ArrayProto.push.apply(args, arguments), func.apply(dollar, args)
                        }
                    })
                }, dollar.mixin(dollar), dollar
            })
        }.call(this), function () {
            define("utils/string", [], function () {
                return {
                    contains: function (str, needle) {
                        if (null != str && null != needle)return -1 !== String(str).indexOf(needle)
                    }, startsWith: function (str, needle) {
                        return 0 === str.lastIndexOf(needle, 0)
                    }, endsWith: function (str, needle) {
                        var lastIndex, pos;
                        return pos = str.length - needle.length, -1 !== (lastIndex = str.indexOf(needle, pos)) && lastIndex === pos
                    }
                }
            })
        }.call(this), function () {
            define("utils/date", [], function () {
                var DAY_MS, HOUR_MS, MIN_MS, WEEK_MS, computeMilliseconds;
                return MIN_MS = 6e4, HOUR_MS = 60 * MIN_MS, DAY_MS = 24 * HOUR_MS, WEEK_MS = 7 * DAY_MS, computeMilliseconds = function (amount, unit) {
                    switch (unit) {
                        case"week":
                            return amount * WEEK_MS;
                        case"day":
                            return amount * DAY_MS;
                        case"hour":
                            return amount * HOUR_MS;
                        case"minute":
                            return amount * MIN_MS;
                        default:
                            return amount * DAY_MS
                    }
                }, {
                    now: function () {
                        return Date.now ? Date.now() : (new Date).getTime()
                    }, subtract: function (date, amount, unit) {
                        return new Date(date.getTime() - computeMilliseconds(amount, unit))
                    }, add: function (date, amount, unit) {
                        return new Date(date.getTime() + computeMilliseconds(amount, unit))
                    }
                }
            })
        }.call(this), function () {
            var indexOf = [].indexOf || function (item) {
                    for (var i = 0, l = this.length; i < l; i++)if (i in this && this[i] === item)return i;
                    return -1
                };
            define("utils/utils", ["utils/string", "underscore", "utils/date"], function (strUtils, _, date) {
                var _castToType, _coerceDate, _contains, _correctArgumentTypes, _parseNumber, _stringToBool, deepClone,
                    isValidNumber;
                return _stringToBool = function (str) {
                    if ("string" != typeof str)return str;
                    switch (str.toLowerCase()) {
                        case"true":
                            return !0;
                        case"false":
                            return !1;
                        default:
                            return str
                    }
                }, _parseNumber = function (val) {
                    var res;
                    return /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(val) ? (res = Number(val), isNaN(res) ? val : res) : val
                }, _coerceDate = function (val) {
                    switch (typeof(val = _parseNumber(val))) {
                        case"string":
                            return new Date(Date.parse(val));
                        case"number":
                            return String(val).length <= 10 ? new Date(1e3 * val) : new Date(val);
                        default:
                            return new Date(val)
                    }
                }, isValidNumber = function (num) {
                    return "number" == typeof num && !isNaN(num)
                }, _castToType = function (value, targetType) {
                    if (null == value)return value;
                    if (!targetType)return value;
                    switch (targetType) {
                        case"number":
                            return _parseNumber(value);
                        case"string":
                            return String(value);
                        case"boolean":
                            return _stringToBool(value);
                        default:
                            return value
                    }
                }, _correctArgumentTypes = function (a, b) {
                    var aBool, aNum, bBool, bDateStr, bNum;
                    if (null == a && null == b && "" === a && "" === b)return [_castToType(a, "string"), _castToType(b, "string")];
                    if (a instanceof Date)try {
                        return bDateStr = new Date(_castToType(b, "string")).toISOString(), [a.toISOString(), bDateStr]
                    } catch (_error) {
                    }
                    return aNum = _castToType(a, "number"), bNum = _castToType(b, "number"), isValidNumber(aNum) && isValidNumber(bNum) ? [aNum, bNum] : (aBool = _castToType(a, "boolean"), bBool = _castToType(b, "boolean"), "boolean" == typeof aBool && "boolean" == typeof bBool ? [aBool, bBool] : [_castToType(a, "string"), _castToType(b, "string")])
                }, _contains = function (sequence, needle) {
                    return sequence instanceof Array ? (sequence = _.map(sequence, _.partial(_castToType, _, typeof needle)), indexOf.call(sequence, needle) >= 0) : strUtils.contains(sequence, needle)
                }, deepClone = function (obj) {
                    return _.isArray(obj) ? _.map(obj, deepClone) : _.isObject(obj) && !_.isFunction(obj) ? _.reduce(obj, function (memo, val, key) {
                        return memo[key] = deepClone(val), memo
                    }, {}) : obj
                }, {
                    getPageDimensions: function () {
                        var body, html;
                        return body = document.body, html = document.documentElement, {
                            width: Math.max.apply(Math, [body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth]),
                            height: Math.max.apply(Math, [body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight])
                        }
                    },
                    upgradeEvent: function (eventName) {
                        return eventName
                    },
                    operators: {
                        ">": function (a, b) {
                            var ref;
                            return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a > b
                        }, "<": function (a, b) {
                            var ref;
                            return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a < b
                        }, "==": function (a, b) {
                            var ref;
                            return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a === b
                        }, "!=": function (a, b) {
                            var ref;
                            return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a !== b
                        }, "*": function (a, b) {
                            return _contains(a, b)
                        }, "!*": function (a, b) {
                            return !_contains(a, b)
                        }, "^": function (a, b) {
                            return strUtils.startsWith("" + a, "" + b)
                        }, $: function (a, b) {
                            return strUtils.endsWith("" + a, "" + b)
                        }, "?": function (a) {
                            return null != a
                        }, "!?": function (a) {
                            return null == a
                        }, in: function (a, b) {
                            return null == b && (b = ""), indexOf.call(_.map(b.split("\n"), _.partial(_castToType, _, typeof a)), a) >= 0
                        }, "not in": function (a, b) {
                            return null == b && (b = ""), indexOf.call(_.map(b.split("\n"), _.partial(_castToType, _, typeof a)), a) < 0
                        }, "> ago": function (a, b, options) {
                            var ref, unit, userVal;
                            return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && userVal < date.subtract(new Date, _castToType(b, "number"), unit)
                        }, "< ago": function (a, b, options) {
                            var ref, unit, userVal;
                            return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && (userVal > date.subtract(new Date, _castToType(b, "number"), unit) && userVal <= new Date)
                        }, within: function (a, b, options) {
                            var ref, unit, userVal;
                            return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && (userVal >= new Date && userVal <= date.add(new Date, _castToType(b, "number"), unit))
                        }
                    },
                    castToType: _castToType,
                    stringToBool: _stringToBool,
                    correctArgumentTypes: _correctArgumentTypes,
                    deepClone: deepClone
                }
            })
        }.call(this), function (name, context, definition) {
            "undefined" != typeof module && module.exports ? module.exports = definition() : "function" == typeof define && define.amd ? define("reqwest", definition) : context[name] = definition()
        }("reqwest", this, function () {
            function succeed(r) {
                var protocol = protocolRe.exec(r.url);
                return protocol = protocol && protocol[1] || window.location.protocol, httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response
            }

            function handleReadyState(r, success, error) {
                return function () {
                    return r._aborted ? error(r.request) : r._timedOut ? error(r.request, "Request is aborted: timeout") : void(r.request && 4 == r.request[readyState] && (r.request.onreadystatechange = noop, succeed(r) ? success(r.request) : error(r.request)))
                }
            }

            function setHeaders(http, o) {
                var h, headers = o.headers || {};
                headers.Accept = headers.Accept || defaultHeaders.accept[o.type] || defaultHeaders.accept["*"];
                var isAFormData = "function" == typeof FormData && o.data instanceof FormData;
                o.crossOrigin || headers[requestedWith] || (headers[requestedWith] = defaultHeaders.requestedWith), headers[contentType] || isAFormData || (headers[contentType] = o.contentType || defaultHeaders.contentType);
                for (h in headers)headers.hasOwnProperty(h) && "setRequestHeader" in http && http.setRequestHeader(h, headers[h])
            }

            function setCredentials(http, o) {
                void 0 !== o.withCredentials && void 0 !== http.withCredentials && (http.withCredentials = !!o.withCredentials)
            }

            function generalCallback(data) {
                lastValue = data
            }

            function urlappend(url, s) {
                return url + (/\?/.test(url) ? "&" : "?") + s
            }

            function handleJsonp(o, fn, err, url) {
                var reqId = uniqid++, cbkey = o.jsonpCallback || "callback",
                    cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId),
                    cbreg = new RegExp("((^|\\?|&)" + cbkey + ")=([^&]+)"), match = url.match(cbreg),
                    script = doc.createElement("script"), loaded = 0,
                    isIE10 = -1 !== navigator.userAgent.indexOf("MSIE 10.0");
                return match ? "?" === match[3] ? url = url.replace(cbreg, "$1=" + cbval) : cbval = match[3] : url = urlappend(url, cbkey + "=" + cbval), win[cbval] = generalCallback, script.type = "text/javascript", script.src = url, script.async = !0, void 0 === script.onreadystatechange || isIE10 || (script.htmlFor = script.id = "_reqwest_" + reqId), script.onload = script.onreadystatechange = function () {
                    if (script[readyState] && "complete" !== script[readyState] && "loaded" !== script[readyState] || loaded)return !1;
                    script.onload = script.onreadystatechange = null, script.onclick && script.onclick(), fn(lastValue), lastValue = void 0, head.removeChild(script), loaded = 1
                }, head.appendChild(script), {
                    abort: function () {
                        script.onload = script.onreadystatechange = null, err({}, "Request is aborted: timeout", {}), lastValue = void 0, head.removeChild(script), loaded = 1
                    }
                }
            }

            function getRequest(fn, err) {
                var http, o = this.o, method = (o.method || "GET").toUpperCase(),
                    url = "string" == typeof o ? o : o.url,
                    data = !1 !== o.processData && o.data && "string" != typeof o.data ? reqwest.toQueryString(o.data) : o.data || null,
                    sendWait = !1;
                return "jsonp" != o.type && "GET" != method || !data || (url = urlappend(url, data), data = null), "jsonp" == o.type ? handleJsonp(o, fn, err, url) : (http = o.xhr && o.xhr(o) || xhr(o), http.open(method, url, !1 !== o.async), setHeaders(http, o), setCredentials(http, o), win[xDomainRequest] && http instanceof win[xDomainRequest] ? (http.onload = fn, http.onerror = err, http.onprogress = function () {
                }, sendWait = !0) : http.onreadystatechange = handleReadyState(this, fn, err), o.before && o.before(http), sendWait ? setTimeout(function () {
                    http.send(data)
                }, 200) : http.send(data), http)
            }

            function Reqwest(o, fn) {
                this.o = o, this.fn = fn, init.apply(this, arguments)
            }

            function setType(header) {
                return header.match("json") ? "json" : header.match("javascript") ? "js" : header.match("text") ? "html" : header.match("xml") ? "xml" : void 0
            }

            function init(o, fn) {
                function complete(resp) {
                    for (o.timeout && clearTimeout(self.timeout), self.timeout = null; self._completeHandlers.length > 0;)self._completeHandlers.shift()(resp)
                }

                function success(resp) {
                    var type = o.type || resp && setType(resp.getResponseHeader("Content-Type"));
                    resp = "jsonp" !== type ? self.request : resp;
                    var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type), r = filteredResponse;
                    try {
                        resp.responseText = r
                    } catch (e) {
                    }
                    if (r)switch (type) {
                        case"json":
                            try {
                                resp = win.JSON ? win.JSON.parse(r) : eval("(" + r + ")")
                            } catch (err) {
                                return error(resp, "Could not parse JSON in response", err)
                            }
                            break;
                        case"js":
                            resp = eval(r);
                            break;
                        case"html":
                            resp = r;
                            break;
                        case"xml":
                            resp = resp.responseXML && resp.responseXML.parseError && resp.responseXML.parseError.errorCode && resp.responseXML.parseError.reason ? null : resp.responseXML
                    }
                    for (self._responseArgs.resp = resp, self._fulfilled = !0, fn(resp), self._successHandler(resp); self._fulfillmentHandlers.length > 0;)resp = self._fulfillmentHandlers.shift()(resp);
                    complete(resp)
                }

                function timedOut() {
                    self._timedOut = !0, self.request.abort()
                }

                function error(resp, msg, t) {
                    for (resp = self.request, self._responseArgs.resp = resp, self._responseArgs.msg = msg, self._responseArgs.t = t, self._erred = !0; self._errorHandlers.length > 0;)self._errorHandlers.shift()(resp, msg, t);
                    complete(resp)
                }

                this.url = "string" == typeof o ? o : o.url, this.timeout = null, this._fulfilled = !1, this._successHandler = function () {
                }, this._fulfillmentHandlers = [], this._errorHandlers = [], this._completeHandlers = [], this._erred = !1, this._responseArgs = {};
                var self = this;
                fn = fn || function () {
                    }, o.timeout && (this.timeout = setTimeout(function () {
                    timedOut()
                }, o.timeout)), o.success && (this._successHandler = function () {
                    o.success.apply(o, arguments)
                }), o.error && this._errorHandlers.push(function () {
                    o.error.apply(o, arguments)
                }), o.complete && this._completeHandlers.push(function () {
                    o.complete.apply(o, arguments)
                }), this.request = getRequest.call(this, success, error)
            }

            function reqwest(o, fn) {
                return new Reqwest(o, fn)
            }

            function buildParams(prefix, obj, traditional, add) {
                var name, i, v, rbracket = /\[\]$/;
                if (isArray(obj))for (i = 0; obj && i < obj.length; i++)v = obj[i], traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add); else if (obj && "[object Object]" === obj.toString())for (name in obj)buildParams(prefix + "[" + name + "]", obj[name], traditional, add); else add(prefix, obj)
            }

            var win = window, doc = document, httpsRe = /^http/, protocolRe = /(^\w+):\/\//, twoHundo = /^(20\d|1223)$/,
                byTag = "getElementsByTagName", readyState = "readyState", contentType = "Content-Type",
                requestedWith = "X-Requested-With", head = doc[byTag]("head")[0], uniqid = 0,
                callbackPrefix = "reqwest_" + +new Date, lastValue, xmlHttpRequest = "XMLHttpRequest",
                xDomainRequest = "XDomainRequest", noop = function () {
                }, isArray = "function" == typeof Array.isArray ? Array.isArray : function (a) {
                    return a instanceof Array
                }, defaultHeaders = {
                    contentType: "application/x-www-form-urlencoded",
                    requestedWith: xmlHttpRequest,
                    accept: {
                        "*": "text/javascript, text/html, application/xml, text/xml, */*",
                        xml: "application/xml, text/xml",
                        html: "text/html",
                        text: "text/plain",
                        json: "application/json, text/javascript",
                        js: "application/javascript, text/javascript"
                    }
                }, xhr = function (o) {
                    if (!0 === o.crossOrigin) {
                        var xhr = win[xmlHttpRequest] ? new XMLHttpRequest : null;
                        if (xhr && "withCredentials" in xhr)return xhr;
                        if (win[xDomainRequest])return new XDomainRequest;
                        throw new Error("Browser does not support cross-origin requests")
                    }
                    return win[xmlHttpRequest] ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
                }, globalSetupOptions = {
                    dataFilter: function (data) {
                        return data
                    }
                };
            return Reqwest.prototype = {
                abort: function () {
                    this._aborted = !0, this.request.abort()
                }, retry: function () {
                    init.call(this, this.o, this.fn)
                }, then: function (success, fail) {
                    return success = success || function () {
                        }, fail = fail || function () {
                        }, this._fulfilled ? this._responseArgs.resp = success(this._responseArgs.resp) : this._erred ? fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : (this._fulfillmentHandlers.push(success), this._errorHandlers.push(fail)), this
                }, always: function (fn) {
                    return this._fulfilled || this._erred ? fn(this._responseArgs.resp) : this._completeHandlers.push(fn), this
                }, finally: function (fn) {
                    return this.always(fn)
                }, fail: function (fn) {
                    return this._erred ? fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : this._errorHandlers.push(fn), this
                }, catch: function (fn) {
                    return this.fail(fn)
                }
            }, reqwest.toQueryString = function (o, trad) {
                var prefix, i, traditional = trad || !1, s = [], enc = encodeURIComponent, add = function (key, value) {
                    value = "function" == typeof value ? value() : null == value ? "" : value, s[s.length] = enc(key) + "=" + enc(value)
                };
                if (isArray(o))for (i = 0; o && i < o.length; i++)add(o[i].name, o[i].value); else for (prefix in o)o.hasOwnProperty(prefix) && buildParams(prefix, o[prefix], traditional, add);
                return s.join("&").replace(/%20/g, "+")
            }, reqwest.getcallbackPrefix = function () {
                return callbackPrefix
            }, reqwest
        }), function () {
            define("utils/bind-all", ["underscore"], function (_) {
                return function (obj) {
                    return _.each(obj, function (fn, name) {
                        if (_.isFunction(fn))return obj[name] = _.bind(obj, obj[name])
                    }), obj
                }
            })
        }.call(this), function (document, undefined) {
            var cookie = function () {
                return cookie.get.apply(cookie, arguments)
            }, utils = cookie.utils = {
                isArray: Array.isArray || function (value) {
                    return "[object Array]" === Object.prototype.toString.call(value)
                }, isPlainObject: function (value) {
                    return !!value && "[object Object]" === Object.prototype.toString.call(value)
                }, toArray: function (value) {
                    return Array.prototype.slice.call(value)
                }, getKeys: Object.keys || function (obj) {
                    var keys = [], key = "";
                    for (key in obj)obj.hasOwnProperty(key) && keys.push(key);
                    return keys
                }, encode: function (value) {
                    return String(value).replace(/[,;"\\=\s%]/g, function (character) {
                        return encodeURIComponent(character)
                    })
                }, decode: function (value) {
                    try {
                        return decodeURIComponent(value)
                    } catch (e) {
                        return null
                    }
                }, retrieve: function (value, fallback) {
                    return null == value ? fallback : value
                }
            };
            cookie.defaults = {}, cookie.expiresMultiplier = 86400, cookie.set = function (key, value, options) {
                if (utils.isPlainObject(key))for (var k in key)key.hasOwnProperty(k) && this.set(k, key[k], value); else {
                    options = utils.isPlainObject(options) ? options : {expires: options};
                    var expires = options.expires !== undefined ? options.expires : this.defaults.expires || "",
                        expiresType = typeof expires;
                    "string" === expiresType && "" !== expires ? expires = new Date(expires) : "number" === expiresType && (expires = new Date(+new Date + 1e3 * this.expiresMultiplier * expires)), "" !== expires && "toGMTString" in expires && (expires = ";expires=" + expires.toGMTString());
                    var path = options.path || this.defaults.path;
                    path = path ? ";path=" + path : "";
                    var domain = options.domain || this.defaults.domain;
                    domain = domain ? ";domain=" + domain : "";
                    var secure = options.secure || this.defaults.secure ? ";secure" : "";
                    !1 === options.secure && (secure = ""), document.cookie = utils.encode(key) + "=" + utils.encode(value) + expires + path + domain + secure
                }
                return this
            }, cookie.setDefault = function (key, value, options) {
                if (utils.isPlainObject(key)) {
                    for (var k in key)this.get(k) === undefined && this.set(k, key[k], value);
                    return cookie
                }
                if (this.get(key) === undefined)return this.set.apply(this, arguments)
            }, cookie.remove = function (keys, options) {
                keys = utils.isArray(keys) ? keys : utils.toArray(arguments), options = utils.isPlainObject(options) ? options : {}, options.expires = -1;
                for (var i = 0, l = keys.length; i < l; i++)this.set(keys[i], "", options);
                return this
            }, cookie.empty = function () {
                return this.remove(utils.getKeys(this.all()))
            }, cookie.get = function (keys, fallback) {
                var cookies = this.all();
                if (utils.isArray(keys)) {
                    for (var result = {}, i = 0, l = keys.length; i < l; i++) {
                        var value = keys[i];
                        result[value] = utils.retrieve(cookies[value], fallback)
                    }
                    return result
                }
                return utils.retrieve(cookies[keys], fallback)
            }, cookie.all = function () {
                if ("" === document.cookie)return {};
                for (var cookies = document.cookie.split("; "), result = {}, i = 0, l = cookies.length; i < l; i++) {
                    var item = cookies[i].split("="), key = utils.decode(item.shift()),
                        value = utils.decode(item.join("="));
                    null != key && null != value && (result[key] = value)
                }
                return result
            }, cookie.enabled = function () {
                if (navigator.cookieEnabled)return !0;
                var ret = "_" === cookie.set("_", "_").get("_");
                return cookie.remove("_"), ret
            }, "function" == typeof define && define.amd ? define("cookie", [], function () {
                return cookie
            }) : "undefined" != typeof exports ? exports.cookie = cookie : window.cookie = cookie
        }("undefined" == typeof document ? null : document), function (factory) {
            if ("object" == typeof exports) module.exports = factory(); else if ("function" == typeof define && define.amd) define("md5", factory); else {
                var glob;
                try {
                    glob = window
                } catch (e) {
                    glob = self
                }
                glob.SparkMD5 = factory()
            }
        }(function (undefined) {
            "use strict";
            var add32 = function (a, b) {
                    return a + b & 4294967295
                }, cmn = function (q, a, b, x, s, t) {
                    return a = add32(add32(a, q), add32(x, t)), add32(a << s | a >>> 32 - s, b)
                }, ff = function (a, b, c, d, x, s, t) {
                    return cmn(b & c | ~b & d, a, b, x, s, t)
                }, gg = function (a, b, c, d, x, s, t) {
                    return cmn(b & d | c & ~d, a, b, x, s, t)
                }, hh = function (a, b, c, d, x, s, t) {
                    return cmn(b ^ c ^ d, a, b, x, s, t)
                }, ii = function (a, b, c, d, x, s, t) {
                    return cmn(c ^ (b | ~d), a, b, x, s, t)
                }, md5cycle = function (x, k) {
                    var a = x[0], b = x[1], c = x[2], d = x[3];
                    a = ff(a, b, c, d, k[0], 7, -680876936), d = ff(d, a, b, c, k[1], 12, -389564586), c = ff(c, d, a, b, k[2], 17, 606105819), b = ff(b, c, d, a, k[3], 22, -1044525330), a = ff(a, b, c, d, k[4], 7, -176418897), d = ff(d, a, b, c, k[5], 12, 1200080426), c = ff(c, d, a, b, k[6], 17, -1473231341), b = ff(b, c, d, a, k[7], 22, -45705983), a = ff(a, b, c, d, k[8], 7, 1770035416), d = ff(d, a, b, c, k[9], 12, -1958414417), c = ff(c, d, a, b, k[10], 17, -42063), b = ff(b, c, d, a, k[11], 22, -1990404162), a = ff(a, b, c, d, k[12], 7, 1804603682), d = ff(d, a, b, c, k[13], 12, -40341101), c = ff(c, d, a, b, k[14], 17, -1502002290), b = ff(b, c, d, a, k[15], 22, 1236535329), a = gg(a, b, c, d, k[1], 5, -165796510), d = gg(d, a, b, c, k[6], 9, -1069501632), c = gg(c, d, a, b, k[11], 14, 643717713), b = gg(b, c, d, a, k[0], 20, -373897302), a = gg(a, b, c, d, k[5], 5, -701558691), d = gg(d, a, b, c, k[10], 9, 38016083), c = gg(c, d, a, b, k[15], 14, -660478335), b = gg(b, c, d, a, k[4], 20, -405537848), a = gg(a, b, c, d, k[9], 5, 568446438), d = gg(d, a, b, c, k[14], 9, -1019803690), c = gg(c, d, a, b, k[3], 14, -187363961), b = gg(b, c, d, a, k[8], 20, 1163531501), a = gg(a, b, c, d, k[13], 5, -1444681467), d = gg(d, a, b, c, k[2], 9, -51403784), c = gg(c, d, a, b, k[7], 14, 1735328473), b = gg(b, c, d, a, k[12], 20, -1926607734), a = hh(a, b, c, d, k[5], 4, -378558), d = hh(d, a, b, c, k[8], 11, -2022574463), c = hh(c, d, a, b, k[11], 16, 1839030562), b = hh(b, c, d, a, k[14], 23, -35309556), a = hh(a, b, c, d, k[1], 4, -1530992060), d = hh(d, a, b, c, k[4], 11, 1272893353), c = hh(c, d, a, b, k[7], 16, -155497632), b = hh(b, c, d, a, k[10], 23, -1094730640), a = hh(a, b, c, d, k[13], 4, 681279174), d = hh(d, a, b, c, k[0], 11, -358537222), c = hh(c, d, a, b, k[3], 16, -722521979), b = hh(b, c, d, a, k[6], 23, 76029189), a = hh(a, b, c, d, k[9], 4, -640364487), d = hh(d, a, b, c, k[12], 11, -421815835), c = hh(c, d, a, b, k[15], 16, 530742520), b = hh(b, c, d, a, k[2], 23, -995338651), a = ii(a, b, c, d, k[0], 6, -198630844), d = ii(d, a, b, c, k[7], 10, 1126891415), c = ii(c, d, a, b, k[14], 15, -1416354905), b = ii(b, c, d, a, k[5], 21, -57434055), a = ii(a, b, c, d, k[12], 6, 1700485571), d = ii(d, a, b, c, k[3], 10, -1894986606), c = ii(c, d, a, b, k[10], 15, -1051523), b = ii(b, c, d, a, k[1], 21, -2054922799), a = ii(a, b, c, d, k[8], 6, 1873313359), d = ii(d, a, b, c, k[15], 10, -30611744), c = ii(c, d, a, b, k[6], 15, -1560198380), b = ii(b, c, d, a, k[13], 21, 1309151649), a = ii(a, b, c, d, k[4], 6, -145523070), d = ii(d, a, b, c, k[11], 10, -1120210379), c = ii(c, d, a, b, k[2], 15, 718787259), b = ii(b, c, d, a, k[9], 21, -343485551), x[0] = add32(a, x[0]), x[1] = add32(b, x[1]), x[2] = add32(c, x[2]), x[3] = add32(d, x[3])
                }, md5blk = function (s) {
                    var i, md5blks = [];
                    for (i = 0; i < 64; i += 4)md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
                    return md5blks
                }, md5blk_array = function (a) {
                    var i, md5blks = [];
                    for (i = 0; i < 64; i += 4)md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
                    return md5blks
                }, md51 = function (s) {
                    var i, length, tail, tmp, lo, hi, n = s.length,
                        state = [1732584193, -271733879, -1732584194, 271733878];
                    for (i = 64; i <= n; i += 64)md5cycle(state, md5blk(s.substring(i - 64, i)));
                    for (s = s.substring(i - 64), length = s.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0; i < length; i += 1)tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
                    if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)for (md5cycle(state, tail), i = 0; i < 16; i += 1)tail[i] = 0;
                    return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), state
                }, md51_array = function (a) {
                    var i, length, tail, tmp, lo, hi, n = a.length,
                        state = [1732584193, -271733879, -1732584194, 271733878];
                    for (i = 64; i <= n; i += 64)md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
                    for (a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0), length = a.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0; i < length; i += 1)tail[i >> 2] |= a[i] << (i % 4 << 3);
                    if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)for (md5cycle(state, tail), i = 0; i < 16; i += 1)tail[i] = 0;
                    return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), state
                }, hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
                rhex = function (n) {
                    var j, s = "";
                    for (j = 0; j < 4; j += 1)s += hex_chr[n >> 8 * j + 4 & 15] + hex_chr[n >> 8 * j & 15];
                    return s
                }, hex = function (x) {
                    var i;
                    for (i = 0; i < x.length; i += 1)x[i] = rhex(x[i]);
                    return x.join("")
                }, md5 = function (s) {
                    return hex(md51(s))
                }, SparkMD5 = function () {
                    this.reset()
                };
            return "5d41402abc4b2a76b9719d911017c592" !== md5("hello") && (add32 = function (x, y) {
                var lsw = (65535 & x) + (65535 & y);
                return (x >> 16) + (y >> 16) + (lsw >> 16) << 16 | 65535 & lsw
            }), SparkMD5.prototype.append = function (str) {
                return /[\u0080-\uFFFF]/.test(str) && (str = unescape(encodeURIComponent(str))), this.appendBinary(str), this
            }, SparkMD5.prototype.appendBinary = function (contents) {
                this._buff += contents, this._length += contents.length;
                var i, length = this._buff.length;
                for (i = 64; i <= length; i += 64)md5cycle(this._state, md5blk(this._buff.substring(i - 64, i)));
                return this._buff = this._buff.substr(i - 64), this
            }, SparkMD5.prototype.end = function (raw) {
                var i, ret, buff = this._buff, length = buff.length,
                    tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < length; i += 1)tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
                return this._finish(tail, length), ret = raw ? this._state : hex(this._state), this.reset(), ret
            }, SparkMD5.prototype._finish = function (tail, length) {
                var tmp, lo, hi, i = length;
                if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)for (md5cycle(this._state, tail), i = 0; i < 16; i += 1)tail[i] = 0;
                tmp = 8 * this._length, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(this._state, tail)
            }, SparkMD5.prototype.reset = function () {
                return this._buff = "", this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
            }, SparkMD5.prototype.destroy = function () {
                delete this._state, delete this._buff, delete this._length
            }, SparkMD5.hash = function (str, raw) {
                /[\u0080-\uFFFF]/.test(str) && (str = unescape(encodeURIComponent(str)));
                var hash = md51(str);
                return raw ? hash : hex(hash)
            }, SparkMD5.hashBinary = function (content, raw) {
                var hash = md51(content);
                return raw ? hash : hex(hash)
            }, SparkMD5.ArrayBuffer = function () {
                this.reset()
            }, SparkMD5.ArrayBuffer.prototype.append = function (arr) {
                var i, buff = this._concatArrayBuffer(this._buff, arr), length = buff.length;
                for (this._length += arr.byteLength, i = 64; i <= length; i += 64)md5cycle(this._state, md5blk_array(buff.subarray(i - 64, i)));
                return this._buff = i - 64 < length ? buff.subarray(i - 64) : new Uint8Array(0), this
            }, SparkMD5.ArrayBuffer.prototype.end = function (raw) {
                var i, ret, buff = this._buff, length = buff.length,
                    tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < length; i += 1)tail[i >> 2] |= buff[i] << (i % 4 << 3);
                return this._finish(tail, length), ret = raw ? this._state : hex(this._state), this.reset(), ret
            }, SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish, SparkMD5.ArrayBuffer.prototype.reset = function () {
                return this._buff = new Uint8Array(0), this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
            }, SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy, SparkMD5.ArrayBuffer.prototype._concatArrayBuffer = function (first, second) {
                var firstLength = first.length, result = new Uint8Array(firstLength + second.byteLength);
                return result.set(first), result.set(new Uint8Array(second), firstLength), result
            }, SparkMD5.ArrayBuffer.hash = function (arr, raw) {
                var hash = md51_array(new Uint8Array(arr));
                return raw ? hash : hex(hash)
            }, SparkMD5
        }), function () {
            define("utils/numeric-hash", [], function () {
                return function (str) {
                    var chr, hash, i;
                    if (0 === str.length)return str;
                    for (hash = 0, i = 0; i < str.length;)chr = str.charCodeAt(i), hash = (hash << 5) - hash + chr, hash |= 0, i++;
                    return hash
                }
            })
        }.call(this), function () {
            var slice = [].slice;
            define("utils/events", ["underscore"], function (_) {
                var Events, eventSplitter, eventsApi, triggerEvents;
                return Events = {
                    on: function (name, callback, context) {
                        var events;
                        return eventsApi(this, "on", name, [callback, context]) && callback ? (null == this._events && (this._events = {}), events = this._events[name] || (this._events[name] = []), events.push({
                            callback: callback,
                            context: context,
                            ctx: context || this
                        }), this) : this
                    }, off: function (name, callback, context) {
                        var ev, events, j, k, len, len1, names, retain;
                        if (!this._events || !eventsApi(this, "off", name, [callback, context]))return this;
                        if (!name && !callback && !context)return this._events = {}, this;
                        for (0, names = name ? [name] : _.keys(this._events), j = 0, len = names.length; j < len; j++)if (name = names[j], events = this._events[name]) {
                            if (this._events[name] = retain = [], callback || context)for (k = 0, len1 = events.length; k < len1; k++)ev = events[k], (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                            retain.length || delete this._events[name]
                        }
                        return this
                    }, trigger: function () {
                        var allEvents, args, events, name;
                        return name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [], this._events && eventsApi(this, "trigger", name, args) ? (events = this._events[name], allEvents = this._events.all, events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), this) : this
                    }
                }, eventSplitter = /\s+/, eventsApi = function (obj, action, name, rest) {
                    var j, key, len, names;
                    if (!name)return !0;
                    if ("object" == typeof name) {
                        for (key in name)obj[action].apply(obj, [key, name[key]].concat(rest));
                        return !1
                    }
                    if (eventSplitter.test(name)) {
                        for (names = name.split(eventSplitter), j = 0, len = names.length; j < len; j++)name = names[j], obj[action].apply(obj, [name].concat(rest));
                        return !1
                    }
                    return !0
                }, triggerEvents = function (events, args) {
                    var a1, a2, a3, ev, i, l, results;
                    switch (i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2], args.length) {
                        case 0:
                            for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx);
                            break;
                        case 1:
                            for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1);
                            break;
                        case 2:
                            for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                            break;
                        case 3:
                            for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                            break;
                        default:
                            for (results = []; ++i < l;)results.push((ev = events[i]).callback.apply(ev.ctx, args));
                            return results
                    }
                }, Events
            })
        }.call(this), function () {
            define("utils/logger", ["underscore"], function (_) {
                var fn1, hasConsole, hasStorage, i, len, logger, m, ref, storage, testKey;
                hasConsole = !!window.console, hasStorage = !1;
                try {
                    testKey = "__ss-check__", storage = window.sessionStorage, storage.setItem(testKey, testKey), storage.getItem(testKey) === testKey && (hasStorage = !0), storage.removeItem(testKey)
                } catch (_error) {
                    _error, hasStorage = !1
                }
                for (logger = {
                    isEnabled: !1,
                    storageKey: "logging_enabled",
                    _methods: ["log", "warn", "error"],
                    enable: function () {
                        return this.isEnabled = !0, hasStorage ? storage.setItem(this.storageKey, !0) : this.log("Your browser does not support sessionStorage, so the debug state will not be preserved upon navigation"), this.isEnabled
                    },
                    disable: function () {
                        return this.isEnabled = !1, hasStorage && storage.removeItem(this.storageKey), this.isEnabled
                    }
                }, hasStorage && (logger.isEnabled = null != storage.getItem(logger.storageKey)), ref = logger._methods, fn1 = function (m) {
                    var fn;
                    return hasConsole && logger.isEnabled && (fn = window.console[m]) ? _.isFunction(fn) && (fn = _.bind(fn, window.console)) : fn = function () {
                    }, logger[m] = fn
                }, i = 0, len = ref.length; i < len; i++)m = ref[i], fn1(m);
                return logger
            })
        }.call(this), function () {
            define("utils/diff", ["underscore"], function (_) {
                return function (a, b) {
                    var attrs, isEqual, k, val;
                    isEqual = !0, attrs = {};
                    for (k in b)val = b[k], _.isEqual(b[k], a[k]) || (isEqual = !1, attrs[k] = val);
                    return !isEqual && attrs
                }
            })
        }.call(this), function () {
            define("models/settings", ["underscore", "utils/events", "utils/logger", "utils/diff"], function (_, Events, logger, diff) {
                var Settings, settings;
                return Settings = function () {
                    function Settings() {
                        this.attributes = {disableHooks: !1}
                    }

                    return Settings.prototype.get = function (key) {
                        var data;
                        return data = _.clone(this.attributes), key ? data[key] : data
                    }, Settings.prototype.set = function (data, options) {
                        if (null == options && (options = {}), _.clone(this.attributes), _.isObject(data) && !_.isArray(data))return options.replace ? this.attributes = data : _.extend(this.attributes, data)
                    }, Settings.prototype.isValid = function (attrs) {
                        return null == attrs && (attrs = _.clone(this.attributes)), !(!_.isObject(attrs) || !attrs.appcuesId)
                    }, Settings
                }(), _.extend(Settings.prototype, Events), settings = new Settings, settings.Settings = Settings, settings
            })
        }.call(this), define("store", [], function () {
            function isLocalStorageNameSupported() {
                try {
                    return localStorageName in win && win[localStorageName]
                } catch (err) {
                    return !1
                }
            }

            function withIEStorage(storeFunction) {
                return function () {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args.unshift(storage), storageOwner.appendChild(storage), storage.addBehavior("#default#userData"), storage.load(localStorageName);
                    var result = storeFunction.apply(store, args);
                    return storageOwner.removeChild(storage), result
                }
            }

            function ieKeyFix(key) {
                return key.replace(forbiddenCharsRegex, "___")
            }

            var storage, store = {}, win = window, doc = win.document, localStorageName = "localStorage",
                scriptTag = "script";
            if (store.disabled = !1, store.set = function (key, value) {
                }, store.get = function (key) {
                }, store.remove = function (key) {
                }, store.clear = function () {
                }, store.transact = function (key, defaultVal, transactionFn) {
                    var val = store.get(key);
                    null == transactionFn && (transactionFn = defaultVal, defaultVal = null), void 0 === val && (val = defaultVal || {}), transactionFn(val), store.set(key, val)
                }, store.getAll = function () {
                }, store.forEach = function () {
                }, store.serialize = function (value) {
                    return JSON.stringify(value)
                }, store.deserialize = function (value) {
                    if ("string" == typeof value)try {
                        return JSON.parse(value)
                    } catch (e) {
                        return value || void 0
                    }
                }, isLocalStorageNameSupported()) storage = win[localStorageName], sessionStorage = win.sessionStorage, store.set = function (key, val, session) {
                return void 0 === val ? store.remove(key, session) : ((session ? sessionStorage : storage).setItem(key, store.serialize(val)), val)
            }, store.get = function (key, session) {
                var _storage = session ? sessionStorage : storage;
                return store.deserialize(_storage.getItem(key))
            }, store.remove = function (key, session) {
                (session ? sessionStorage : storage).removeItem(key)
            }, store.clear = function () {
                storage.clear()
            }, store.getAll = function () {
                var ret = {};
                return store.forEach(function (key, val) {
                    ret[key] = val
                }), ret
            }, store.forEach = function (callback) {
                for (var i = 0; i < storage.length; i++) {
                    var key = storage.key(i);
                    callback(key, store.get(key))
                }
            }; else if (doc.documentElement.addBehavior) {
                var storageOwner, storageContainer;
                try {
                    storageContainer = new ActiveXObject("htmlfile"), storageContainer.open(), storageContainer.write("<" + scriptTag + ">document.w=window</" + scriptTag + '><iframe src="/favicon.ico"></iframe>'), storageContainer.close(), storageOwner = storageContainer.w.frames[0].document, storage = storageOwner.createElement("div")
                } catch (e) {
                    storage = doc.createElement("div"), storageOwner = doc.body
                }
                var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
                store.set = withIEStorage(function (storage, key, val) {
                    return key = ieKeyFix(key), void 0 === val ? store.remove(key) : (storage.setAttribute(key, store.serialize(val)), storage.save(localStorageName), val)
                }), store.get = withIEStorage(function (storage, key) {
                    return key = ieKeyFix(key), store.deserialize(storage.getAttribute(key))
                }), store.remove = withIEStorage(function (storage, key) {
                    key = ieKeyFix(key), storage.removeAttribute(key), storage.save(localStorageName)
                }), store.clear = withIEStorage(function (storage) {
                    var attributes = storage.XMLDocument.documentElement.attributes;
                    storage.load(localStorageName);
                    for (var attr, i = 0; attr = attributes[i]; i++)storage.removeAttribute(attr.name);
                    storage.save(localStorageName)
                }), store.getAll = function (storage) {
                    var ret = {};
                    return store.forEach(function (key, val) {
                        ret[key] = val
                    }), ret
                }, store.forEach = withIEStorage(function (storage, callback) {
                    for (var attr, attributes = storage.XMLDocument.documentElement.attributes,
                             i = 0; attr = attributes[i]; ++i)callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
                })
            }
            try {
                var testKey = "__storejs__";
                store.set(testKey, testKey), store.get(testKey) != testKey && (store.disabled = !0), store.remove(testKey)
            } catch (e) {
                store.disabled = !0
            }
            return store.enabled = !store.disabled, store
        }), function () {
            define("utils/store", ["underscore", "utils/bind-all", "store"], function (_, bindAll, store) {
                var Store, result;
                return Store = function () {
                    function Store(options) {
                        this.options(options)
                    }

                    return Store.prototype.options = function (options) {
                        if (null == options && (options = {}), 0 === arguments.length)return this._options;
                        options = _.defaults(options, {enabled: !0}), this.enabled = options.enabled && store.enabled, this._options = options
                    }, Store.prototype.get = function (key, session) {
                        return this.enabled ? store.get(key, session) : null
                    }, Store.prototype.set = function (key, val, session) {
                        return !!this.enabled && store.set(key, val, session)
                    }, Store.prototype.remove = function (key, session) {
                        return !!this.enabled && store.remove(key, session)
                    }, Store
                }(), result = bindAll(new Store), result.Store = Store, result
            })
        }.call(this), function () {
            define("models/entity", ["underscore", "utils/logger", "utils/diff", "utils/events", "utils/store"], function (_, logger, diff, Events, store) {
                var Entity;
                return Entity = function () {
                    function Entity() {
                        this.attributes = {}, this._storageKey = "apc_entity"
                    }

                    return Entity.prototype.get = function (key) {
                        var data;
                        return data = _.clone(this.attributes), key ? data[key] : data
                    }, Entity.prototype.set = function (data, options) {
                        var changed, prev;
                        if (null == options && (options = {}), prev = _.clone(this.attributes), _.isObject(data) && !_.isArray(data) && (options.replace ? this.attributes = data : _.extend(this.attributes, data)), (changed = diff(prev, data)) && (_.defer(_.bind(this.save, this)), !options.silent))return this.trigger("change", changed)
                    }, Entity.prototype.save = function () {
                        var data;
                        return data = this.get(), logger.log("User properties persisted to localStorage.", data), store.set(this._storageKey, data)
                    }, Entity.prototype.load = function () {
                        var data;
                        return data = store.get(this._storageKey) || {}, logger.log("User properties loaded from localStorage.", data), data
                    }, Entity
                }(), _.extend(Entity.prototype, Events), Entity
            })
        }.call(this), function () {
            "use strict";
            function lib$es6$promise$utils$$objectOrFunction(x) {
                return "function" == typeof x || "object" == typeof x && null !== x
            }

            function lib$es6$promise$utils$$isFunction(x) {
                return "function" == typeof x
            }

            function lib$es6$promise$utils$$isMaybeThenable(x) {
                return "object" == typeof x && null !== x
            }

            function lib$es6$promise$asap$$asap(callback, arg) {
                lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback, lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg, 2 === (lib$es6$promise$asap$$len += 2) && (lib$es6$promise$asap$$customSchedulerFn ? lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush) : lib$es6$promise$asap$$scheduleFlush())
            }

            function lib$es6$promise$asap$$setScheduler(scheduleFn) {
                lib$es6$promise$asap$$customSchedulerFn = scheduleFn
            }

            function lib$es6$promise$asap$$useNextTick() {
                var nextTick = process.nextTick,
                    version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
                return Array.isArray(version) && "0" === version[1] && "10" === version[2] && (nextTick = setImmediate), function () {
                    nextTick(lib$es6$promise$asap$$flush)
                }
            }

            function lib$es6$promise$asap$$useVertxTimer() {
                return function () {
                    lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush)
                }
            }

            function lib$es6$promise$asap$$useMutationObserver() {
                var iterations = 0,
                    observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush),
                    node = document.createTextNode("");
                return observer.observe(node, {characterData: !0}), function () {
                    node.data = iterations = ++iterations % 2
                }
            }

            function lib$es6$promise$asap$$useMessageChannel() {
                var channel = new MessageChannel;
                return channel.port1.onmessage = lib$es6$promise$asap$$flush, function () {
                    channel.port2.postMessage(0)
                }
            }

            function lib$es6$promise$asap$$useSetTimeout() {
                return function () {
                    setTimeout(lib$es6$promise$asap$$flush, 1)
                }
            }

            function lib$es6$promise$asap$$flush() {
                for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
                    (0, lib$es6$promise$asap$$queue[i])(lib$es6$promise$asap$$queue[i + 1]), lib$es6$promise$asap$$queue[i] = void 0, lib$es6$promise$asap$$queue[i + 1] = void 0
                }
                lib$es6$promise$asap$$len = 0
            }

            function lib$es6$promise$asap$$attemptVertex() {
                try {
                    var r = require, vertx = r("vertx");
                    return lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext, lib$es6$promise$asap$$useVertxTimer()
                } catch (e) {
                    return lib$es6$promise$asap$$useSetTimeout()
                }
            }

            function lib$es6$promise$$internal$$noop() {
            }

            function lib$es6$promise$$internal$$selfFullfillment() {
                return new TypeError("You cannot resolve a promise with itself")
            }

            function lib$es6$promise$$internal$$cannotReturnOwn() {
                return new TypeError("A promises callback cannot return that same promise.")
            }

            function lib$es6$promise$$internal$$getThen(promise) {
                try {
                    return promise.then
                } catch (error) {
                    return lib$es6$promise$$internal$$GET_THEN_ERROR.error = error, lib$es6$promise$$internal$$GET_THEN_ERROR
                }
            }

            function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                try {
                    then.call(value, fulfillmentHandler, rejectionHandler)
                } catch (e) {
                    return e
                }
            }

            function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
                lib$es6$promise$asap$$default(function (promise) {
                    var sealed = !1, error = lib$es6$promise$$internal$$tryThen(then, thenable, function (value) {
                        sealed || (sealed = !0, thenable !== value ? lib$es6$promise$$internal$$resolve(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value))
                    }, function (reason) {
                        sealed || (sealed = !0, lib$es6$promise$$internal$$reject(promise, reason))
                    }, "Settle: " + (promise._label || " unknown promise"));
                    !sealed && error && (sealed = !0, lib$es6$promise$$internal$$reject(promise, error))
                }, promise)
            }

            function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
                thenable._state === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, thenable._result) : thenable._state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, thenable._result) : lib$es6$promise$$internal$$subscribe(thenable, void 0, function (value) {
                    lib$es6$promise$$internal$$resolve(promise, value)
                }, function (reason) {
                    lib$es6$promise$$internal$$reject(promise, reason)
                })
            }

            function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
                if (maybeThenable.constructor === promise.constructor) lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable); else {
                    var then = lib$es6$promise$$internal$$getThen(maybeThenable);
                    then === lib$es6$promise$$internal$$GET_THEN_ERROR ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error) : void 0 === then ? lib$es6$promise$$internal$$fulfill(promise, maybeThenable) : lib$es6$promise$utils$$isFunction(then) ? lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then) : lib$es6$promise$$internal$$fulfill(promise, maybeThenable)
                }
            }

            function lib$es6$promise$$internal$$resolve(promise, value) {
                promise === value ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment()) : lib$es6$promise$utils$$objectOrFunction(value) ? lib$es6$promise$$internal$$handleMaybeThenable(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value)
            }

            function lib$es6$promise$$internal$$publishRejection(promise) {
                promise._onerror && promise._onerror(promise._result), lib$es6$promise$$internal$$publish(promise)
            }

            function lib$es6$promise$$internal$$fulfill(promise, value) {
                promise._state === lib$es6$promise$$internal$$PENDING && (promise._result = value, promise._state = lib$es6$promise$$internal$$FULFILLED, 0 !== promise._subscribers.length && lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise))
            }

            function lib$es6$promise$$internal$$reject(promise, reason) {
                promise._state === lib$es6$promise$$internal$$PENDING && (promise._state = lib$es6$promise$$internal$$REJECTED, promise._result = reason, lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise))
            }

            function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
                var subscribers = parent._subscribers, length = subscribers.length;
                parent._onerror = null, subscribers[length] = child, subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment, subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection, 0 === length && parent._state && lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent)
            }

            function lib$es6$promise$$internal$$publish(promise) {
                var subscribers = promise._subscribers, settled = promise._state;
                if (0 !== subscribers.length) {
                    for (var child, callback, detail = promise._result,
                             i = 0; i < subscribers.length; i += 3)child = subscribers[i], callback = subscribers[i + settled], child ? lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail) : callback(detail);
                    promise._subscribers.length = 0
                }
            }

            function lib$es6$promise$$internal$$ErrorObject() {
                this.error = null
            }

            function lib$es6$promise$$internal$$tryCatch(callback, detail) {
                try {
                    return callback(detail)
                } catch (e) {
                    return lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e, lib$es6$promise$$internal$$TRY_CATCH_ERROR
                }
            }

            function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
                var value, error, succeeded, failed, hasCallback = lib$es6$promise$utils$$isFunction(callback);
                if (hasCallback) {
                    if (value = lib$es6$promise$$internal$$tryCatch(callback, detail), value === lib$es6$promise$$internal$$TRY_CATCH_ERROR ? (failed = !0, error = value.error, value = null) : succeeded = !0, promise === value)return void lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn())
                } else value = detail, succeeded = !0;
                promise._state !== lib$es6$promise$$internal$$PENDING || (hasCallback && succeeded ? lib$es6$promise$$internal$$resolve(promise, value) : failed ? lib$es6$promise$$internal$$reject(promise, error) : settled === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, value) : settled === lib$es6$promise$$internal$$REJECTED && lib$es6$promise$$internal$$reject(promise, value))
            }

            function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
                try {
                    resolver(function (value) {
                        lib$es6$promise$$internal$$resolve(promise, value)
                    }, function (reason) {
                        lib$es6$promise$$internal$$reject(promise, reason)
                    })
                } catch (e) {
                    lib$es6$promise$$internal$$reject(promise, e)
                }
            }

            function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
                var enumerator = this;
                enumerator._instanceConstructor = Constructor, enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop), enumerator._validateInput(input) ? (enumerator._input = input, enumerator.length = input.length, enumerator._remaining = input.length, enumerator._init(), 0 === enumerator.length ? lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result) : (enumerator.length = enumerator.length || 0, enumerator._enumerate(), 0 === enumerator._remaining && lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result))) : lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError())
            }

            function lib$es6$promise$promise$all$$all(entries) {
                return new lib$es6$promise$enumerator$$default(this, entries).promise
            }

            function lib$es6$promise$promise$race$$race(entries) {
                function onFulfillment(value) {
                    lib$es6$promise$$internal$$resolve(promise, value)
                }

                function onRejection(reason) {
                    lib$es6$promise$$internal$$reject(promise, reason)
                }

                var Constructor = this, promise = new Constructor(lib$es6$promise$$internal$$noop);
                if (!lib$es6$promise$utils$$isArray(entries))return lib$es6$promise$$internal$$reject(promise, new TypeError("You must pass an array to race.")), promise;
                for (var length = entries.length,
                         i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++)lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), void 0, onFulfillment, onRejection);
                return promise
            }

            function lib$es6$promise$promise$resolve$$resolve(object) {
                var Constructor = this;
                if (object && "object" == typeof object && object.constructor === Constructor)return object;
                var promise = new Constructor(lib$es6$promise$$internal$$noop);
                return lib$es6$promise$$internal$$resolve(promise, object), promise
            }

            function lib$es6$promise$promise$reject$$reject(reason) {
                var Constructor = this, promise = new Constructor(lib$es6$promise$$internal$$noop);
                return lib$es6$promise$$internal$$reject(promise, reason), promise
            }

            function lib$es6$promise$promise$$needsResolver() {
                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
            }

            function lib$es6$promise$promise$$needsNew() {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
            }

            function lib$es6$promise$promise$$Promise(resolver) {
                this._id = lib$es6$promise$promise$$counter++, this._state = void 0, this._result = void 0, this._subscribers = [], lib$es6$promise$$internal$$noop !== resolver && (lib$es6$promise$utils$$isFunction(resolver) || lib$es6$promise$promise$$needsResolver(), this instanceof lib$es6$promise$promise$$Promise || lib$es6$promise$promise$$needsNew(), lib$es6$promise$$internal$$initializePromise(this, resolver))
            }

            var lib$es6$promise$utils$$_isArray;
            lib$es6$promise$utils$$_isArray = Array.isArray ? Array.isArray : function (x) {
                return "[object Array]" === Object.prototype.toString.call(x)
            };
            var lib$es6$promise$asap$$vertxNext, lib$es6$promise$asap$$customSchedulerFn,
                lib$es6$promise$asap$$scheduleFlush, lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray,
                lib$es6$promise$asap$$len = 0,
                lib$es6$promise$asap$$default = ({}.toString, lib$es6$promise$asap$$asap),
                lib$es6$promise$asap$$browserWindow = "undefined" != typeof window ? window : void 0,
                lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {},
                lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver,
                lib$es6$promise$asap$$isNode = "undefined" != typeof process && "[object process]" === {}.toString.call(process),
                lib$es6$promise$asap$$isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                lib$es6$promise$asap$$queue = new Array(1e3);
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$isNode ? lib$es6$promise$asap$$useNextTick() : lib$es6$promise$asap$$BrowserMutationObserver ? lib$es6$promise$asap$$useMutationObserver() : lib$es6$promise$asap$$isWorker ? lib$es6$promise$asap$$useMessageChannel() : void 0 === lib$es6$promise$asap$$browserWindow && "function" == typeof require ? lib$es6$promise$asap$$attemptVertex() : lib$es6$promise$asap$$useSetTimeout();
            var lib$es6$promise$$internal$$PENDING = void 0, lib$es6$promise$$internal$$FULFILLED = 1,
                lib$es6$promise$$internal$$REJECTED = 2,
                lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject,
                lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject;
            lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function (input) {
                return lib$es6$promise$utils$$isArray(input)
            }, lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function () {
                return new Error("Array Methods must be provided an Array")
            }, lib$es6$promise$enumerator$$Enumerator.prototype._init = function () {
                this._result = new Array(this.length)
            };
            var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
            lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function () {
                for (var enumerator = this, length = enumerator.length, promise = enumerator.promise,
                         input = enumerator._input,
                         i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++)enumerator._eachEntry(input[i], i)
            }, lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function (entry, i) {
                var enumerator = this, c = enumerator._instanceConstructor;
                lib$es6$promise$utils$$isMaybeThenable(entry) ? entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING ? (entry._onerror = null, enumerator._settledAt(entry._state, i, entry._result)) : enumerator._willSettleAt(c.resolve(entry), i) : (enumerator._remaining--, enumerator._result[i] = entry)
            }, lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function (state, i, value) {
                var enumerator = this, promise = enumerator.promise;
                promise._state === lib$es6$promise$$internal$$PENDING && (enumerator._remaining--, state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, value) : enumerator._result[i] = value), 0 === enumerator._remaining && lib$es6$promise$$internal$$fulfill(promise, enumerator._result)
            }, lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function (promise, i) {
                var enumerator = this;
                lib$es6$promise$$internal$$subscribe(promise, void 0, function (value) {
                    enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value)
                }, function (reason) {
                    enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason)
                })
            };
            var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all,
                lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race,
                lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve,
                lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject,
                lib$es6$promise$promise$$counter = 0,
                lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
            lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default, lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default, lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default, lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default, lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler, lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$default, lib$es6$promise$promise$$Promise.prototype = {
                constructor: lib$es6$promise$promise$$Promise,
                then: function (onFulfillment, onRejection) {
                    var parent = this, state = parent._state;
                    if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection)return this;
                    var child = new this.constructor(lib$es6$promise$$internal$$noop), result = parent._result;
                    if (state) {
                        var callback = arguments[state - 1];
                        lib$es6$promise$asap$$default(function () {
                            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result)
                        })
                    } else lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
                    return child
                },
                catch: function (onRejection) {
                    return this.then(null, onRejection)
                }
            };
            var lib$es6$promise$umd$$ES6Promise = {Promise: lib$es6$promise$promise$$default};
            "function" == typeof define && define.amd ? define("es6-promise", [], function () {
                return lib$es6$promise$umd$$ES6Promise
            }) : "undefined" != typeof module && module.exports ? module.exports = lib$es6$promise$umd$$ES6Promise : void 0 !== this && (this.ES6Promise = lib$es6$promise$umd$$ES6Promise)
        }.call(this), function () {
            var extend = function (child, parent) {
                function ctor() {
                    this.constructor = child
                }

                for (var key in parent)hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
            }, hasProp = {}.hasOwnProperty;
            define("models/user", ["underscore", "env", "reqwest", "utils/bind-all", "cookie", "utils/date", "md5", "utils/numeric-hash", "models/settings", "models/entity", "es6-promise", "utils/logger", "utils/store"], function (_, env, request, bindAll, cookie, date, md5, numericHash, settings, Entity, ES6Promise, logger, store) {
                var User, getVariantGroup, user;
                return getVariantGroup = function (id, numGroups) {
                    var group, numericId;
                    if (numGroups = numGroups || 2, group = Math.ceil(999 * Math.random()) % numGroups, null != id) {
                        numericId = id;
                        try {
                            numericId = parseInt(id, 10)
                        } catch (_error) {
                        }
                        _.isString(numericId) && (numericId = numericHash(numericId)), _.isFinite(numericId) && (group = numericId % numGroups)
                    }
                    return group + 1
                }, User = function (superClass) {
                    function User() {
                        var existing, profile, ref, ref1;
                        this.attributes = {}, this._storageKey = "apc_user", this._sessionStorageKey = "apc_session_attrs", existing = this.load(), profile = this.buildPassiveAttrs(), profile.uuid = this._uuid(profile.userId), profile._ABGroup = null != (ref = existing._ABGroup) ? ref : getVariantGroup(profile.userId, 2), profile._variantGroup = null != (ref1 = existing._variantGroup) ? ref1 : getVariantGroup(profile.userId, 12), this.set(profile, {silent: !0}), this.on("change", this.update)
                    }

                    return extend(User, superClass), User.prototype.buildPassiveAttrs = function () {
                        var attrs, currentPageUrl, pageviews, profile, ref, ref1, referrer;
                        if (attrs = null != (ref = store.get(this._sessionStorageKey, !0)) ? ref : {}, pageviews = null != (ref1 = attrs._sessionPageviews) ? ref1 : 0, !_.isFinite(pageviews))try {
                            pageviews = parseInt(pageviews, 10)
                        } catch (_error) {
                            _error, pageviews = 0
                        }
                        return referrer = document.referrer, currentPageUrl = window.location.href, (!referrer || referrer && referrer === attrs._lastPageUrl) && (referrer = attrs._currentPageUrl || ""), pageviews++, profile = {
                            _hostname: window.location.hostname,
                            _lastPageUrl: referrer,
                            _lastPageTitle: document.title,
                            _updatedAt: date.now(),
                            _userAgent: navigator.userAgent,
                            _sessionPageviews: pageviews,
                            _lastUrl: currentPageUrl,
                            _currentPageUrl: currentPageUrl
                        }, store.set(this._sessionStorageKey, {
                            _sessionPageviews: pageviews,
                            _lastUrl: currentPageUrl,
                            _currentPageUrl: currentPageUrl,
                            _lastPageUrl: referrer
                        }, !0), profile
                    }, User.prototype._uuid = function (userId) {
                        var result, userIdStr;
                        return result = null, null != userId && (userIdStr = "" + userId, result = md5.hash(userIdStr)), result
                    }, User.prototype.toUUID = function () {
                        return "md5-userid:" + this.get("uuid")
                    }, User.prototype.isAnonymous = function () {
                        return !this.get("uuid")
                    }, User.prototype.update = function (changed) {
                        if (_.isObject(changed) && (_.has(changed, "userId") && this.updateUUID(changed.userId), _.has(changed, "_lastPageUrl")))return this.incrementPageviews()
                    }, User.prototype.updateUUID = function (userId) {
                        logger.log("userId property changed. Updating uuid to match."), this.set({uuid: this._uuid(userId)})
                    }, User.prototype.incrementPageviews = function () {
                        var attrs, pageviews;
                        if (pageviews = this.get("_sessionPageviews"), !_.isFinite(pageviews))try {
                            pageviews = parseInt(pageviews, 10)
                        } catch (_error) {
                            _error, pageviews = 0
                        }
                        return pageviews++, this.set({_sessionPageviews: pageviews}, {silent: !0}), attrs = store.get(this._sessionStorageKey, !0), store.set(this._sessionStorageKey, _.extend({}, attrs, {_sessionPageviews: pageviews}), !0)
                    }, User.prototype.pageView = function () {
                        var attrs;
                        return this.set({
                            _hostname: window.location.hostname,
                            _lastPageUrl: document.referrer,
                            _lastPageTitle: document.title
                        }), attrs = store.get(this._sessionStorageKey, !0), null != (null != attrs ? attrs._lastUrl : void 0) && window.location.href !== attrs._lastUrl && (attrs = _.extend({}, attrs, {
                            _lastUrl: window.location.href,
                            _currentPageUrl: window.location.href
                        }), store.set(this._sessionStorageKey, attrs, !0), this.incrementPageviews(), !0)
                    }, User.prototype.send = function (options) {
                        return null == this._sendCallCount && (this._sendCallCount = cookie.get(this.SEND_COUNT_KEY)), (!this._sendCallCount || ++this._sendCallCount > this.SEND_INTERVAL) && (this._sendCallCount = 1, this._send(options)), cookie.set(this.SEND_COUNT_KEY, this._sendCallCount, {path: "/"})
                    }, User.prototype.SEND_INTERVAL = 10, User.prototype.SEND_COUNT_KEY = "apc_user_call_count", User.prototype._send = function (options) {
                        var appcuesId, getUserData;
                        return getUserData = _.bind(this.get, this), appcuesId = settings.get("appcuesId"), new ES6Promise.Promise(function (resolve, reject) {
                            var data, url;
                            appcuesId ? (data = getUserData(), logger.log("Sending user traits to server.", data), data && !_.isEmpty(data) ? (data._updatedAt = {".sv": "timestamp"}, url = env.firebase + "/accounts/" + appcuesId + "/properties.json?x-http-method-override=PATCH&print=silent", request({
                                url: url,
                                method: "post",
                                type: "json",
                                crossOrigin: !0,
                                data: JSON.stringify(data)
                            }).then(resolve, reject)) : reject(new Error("User properties are not valid for sending to server."))) : reject(new Error("No Appcues ID given."))
                        })
                    }, User
                }(Entity), user = new User, user.User = User, user
            })
        }.call(this), function () {
            define("eventbus", ["underscore", "utils/events"], function (_, Events) {
                return _.extend({
                    emit: function (eventId, eventData) {
                        return this.trigger(eventId, eventData, this.getUser())
                    }, getUser: function () {
                        return {}
                    }
                }, Events)
            })
        }.call(this), function () {
            define("utils/aeon", [], function () {
                return {
                    locale: "en",
                    _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
                    month: function (date) {
                        return this._months[date.getMonth()]
                    },
                    _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
                    monthShort: function (date) {
                        return this._monthsShort[date.getMonth()]
                    },
                    _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
                    weekday: function (date) {
                        return this._weekdays[date.getDate()]
                    },
                    _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
                    weekdayShort: function (date) {
                        return this._weekdaysShort[date.getDate()]
                    },
                    _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
                    weekdayMin: function (date) {
                        return this._weekdaysMin[date.getDate()]
                    },
                    getShortDate: function (date) {
                        var currentLocale;
                        return currentLocale = window.navigator.userLanguage || window.navigator.language, new RegExp("^" + this.locale).test(currentLocale) ? this.monthShort(date) + " " + date.getDate() : date.toLocaleDateString()
                    }
                }
            })
        }.call(this), function () {
            define("utils/urls", [], function () {
                var matchOperatorsRe, urlRegEx;
                return matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g, urlRegEx = /(https?:\/\/)?([a-zA-Z0-9-\.]+)?(:[0-9]+)?(\/?.+)?/, {
                    getHostname: function (link) {
                        return link ? urlRegEx.exec(link)[2] || null : window.location.hostname
                    }, getPath: function (link) {
                        var path, splitter;
                        return link ? null == (path = urlRegEx.exec(link)[4]) && (path = "") : (splitter = "file:" === window.location.protocol ? location.origin : location.host, path = location.href.split(splitter)[1]), this.removeAppcueQuery(path)
                    }, removeAppcueQuery: function (link) {
                        return link ? link.replace(/appcue=[^&#]+&?/, "").replace(/\?#/, "#").replace(/#$/, "").replace(/&$/, "").replace(/\?$/, "") : link
                    }, getAppcueQuery: function (link) {
                        var queries;
                        return queries = this.queryStrToObj(link), queries.appcue
                    }, domainMatches: function (domain) {
                        return !domain || domain === this.getHostname()
                    }, domainsMatch: function (domainsStr) {
                        var domain, domainRe, hostname, i, len, ref, sanitizedStr, wildcardRegex;
                        if (domainsStr && "[object String]" === Object.prototype.toString.call(domainsStr)) {
                            for (sanitizedStr = domainsStr.replace(/\s/g, "").replace(/,$/, ""), hostname = this.getHostname(), ref = sanitizedStr.split(","), i = 0, len = ref.length; i < len; i++) {
                                if ((domain = ref[i]) === hostname)return !0;
                                if (wildcardRegex = /^\*\./, wildcardRegex.test(domain) && (domainRe = domain.replace(wildcardRegex, "").replace(matchOperatorsRe, "\\$&"), new RegExp(domainRe).test(hostname)))return !0
                            }
                            return !1
                        }
                        return !0
                    }, regexPathMatches: function (regexStr, path) {
                        return null != regexStr && null != path && RegExp(regexStr, "i").test(path)
                    }, queryStrToObj: function (str) {
                        var i, len, obj, param, params, parts;
                        if (null == str && (str = window.location.search), obj = {}, null == str)return obj;
                        for (params = str.replace(/^\?/, "").split("&"), i = 0, len = params.length; i < len; i++)param = params[i], parts = param.split("="), obj[parts[0]] = decodeURIComponent(parts[1]);
                        return obj
                    }
                }
            })
        }.call(this), function () {
            define("utils/browser", ["underscore"], function (_) {
                var languageMatchesBrowser;
                return languageMatchesBrowser = function (languagesStr, browserLanguage) {
                    var languageMatch, languages;
                    return languageMatch = !1, !languagesStr || (languages = languagesStr.split(","), !browserLanguage || (_.each(languages, function (language) {
                        if (0 === browserLanguage.toLowerCase().indexOf(language.toLowerCase()))return languageMatch = !0
                    }), languageMatch))
                }, {
                    languageMatches: function (languagesStr) {
                        var browserLanguage;
                        return browserLanguage = navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage, languageMatchesBrowser(languagesStr, browserLanguage)
                    }, languageMatchesBrowser: languageMatchesBrowser
                }
            })
        }.call(this), function (root, undefined) {
            "use strict";
            function _x86Multiply(m, n) {
                return (65535 & m) * n + (((m >>> 16) * n & 65535) << 16)
            }

            function _x86Rotl(m, n) {
                return m << n | m >>> 32 - n
            }

            function _x86Fmix(h) {
                return h ^= h >>> 16, h = _x86Multiply(h, 2246822507), h ^= h >>> 13, h = _x86Multiply(h, 3266489909), h ^= h >>> 16
            }

            function _x64Add(m, n) {
                m = [m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1]], n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
                var o = [0, 0, 0, 0];
                return o[3] += m[3] + n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] + n[2], o[1] += o[2] >>> 16, o[2] &= 65535, o[1] += m[1] + n[1], o[0] += o[1] >>> 16, o[1] &= 65535, o[0] += m[0] + n[0], o[0] &= 65535, [o[0] << 16 | o[1], o[2] << 16 | o[3]]
            }

            function _x64Multiply(m, n) {
                m = [m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1]], n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
                var o = [0, 0, 0, 0];
                return o[3] += m[3] * n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] * n[3], o[1] += o[2] >>> 16, o[2] &= 65535, o[2] += m[3] * n[2], o[1] += o[2] >>> 16, o[2] &= 65535, o[1] += m[1] * n[3], o[0] += o[1] >>> 16, o[1] &= 65535, o[1] += m[2] * n[2], o[0] += o[1] >>> 16, o[1] &= 65535, o[1] += m[3] * n[1], o[0] += o[1] >>> 16, o[1] &= 65535, o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0], o[0] &= 65535, [o[0] << 16 | o[1], o[2] << 16 | o[3]]
            }

            function _x64Rotl(m, n) {
                return n %= 64, 32 === n ? [m[1], m[0]] : n < 32 ? [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n] : (n -= 32, [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n])
            }

            function _x64LeftShift(m, n) {
                return n %= 64, 0 === n ? m : n < 32 ? [m[0] << n | m[1] >>> 32 - n, m[1] << n] : [m[1] << n - 32, 0]
            }

            function _x64Xor(m, n) {
                return [m[0] ^ n[0], m[1] ^ n[1]]
            }

            function _x64Fmix(h) {
                return h = _x64Xor(h, [0, h[0] >>> 1]), h = _x64Multiply(h, [4283543511, 3981806797]), h = _x64Xor(h, [0, h[0] >>> 1]), h = _x64Multiply(h, [3301882366, 444984403]), h = _x64Xor(h, [0, h[0] >>> 1])
            }

            var library = {version: "3.0.1", x86: {}, x64: {}};
            library.x86.hash32 = function (key, seed) {
                key = key || "", seed = seed || 0;
                for (var remainder = key.length % 4, bytes = key.length - remainder, h1 = seed, k1 = 0, c1 = 3432918353,
                         c2 = 461845907,
                         i = 0; i < bytes; i += 4)k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1, h1 = _x86Rotl(h1, 13), h1 = _x86Multiply(h1, 5) + 3864292196;
                switch (k1 = 0, remainder) {
                    case 3:
                        k1 ^= (255 & key.charCodeAt(i + 2)) << 16;
                    case 2:
                        k1 ^= (255 & key.charCodeAt(i + 1)) << 8;
                    case 1:
                        k1 ^= 255 & key.charCodeAt(i), k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1
                }
                return h1 ^= key.length, (h1 = _x86Fmix(h1)) >>> 0
            }, library.x86.hash128 = function (key, seed) {
                key = key || "", seed = seed || 0;
                for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = seed, h2 = seed, h3 = seed,
                         h4 = seed, k1 = 0, k2 = 0, k3 = 0, k4 = 0, c1 = 597399067, c2 = 2869860233, c3 = 951274213,
                         c4 = 2716044179,
                         i = 0; i < bytes; i += 16)k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, k2 = 255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, k3 = 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24, k4 = 255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1, h1 = _x86Rotl(h1, 19), h1 += h2, h1 = _x86Multiply(h1, 5) + 1444728091, k2 = _x86Multiply(k2, c2), k2 = _x86Rotl(k2, 16), k2 = _x86Multiply(k2, c3), h2 ^= k2, h2 = _x86Rotl(h2, 17), h2 += h3, h2 = _x86Multiply(h2, 5) + 197830471, k3 = _x86Multiply(k3, c3), k3 = _x86Rotl(k3, 17), k3 = _x86Multiply(k3, c4), h3 ^= k3, h3 = _x86Rotl(h3, 15), h3 += h4, h3 = _x86Multiply(h3, 5) + 2530024501, k4 = _x86Multiply(k4, c4), k4 = _x86Rotl(k4, 18), k4 = _x86Multiply(k4, c1), h4 ^= k4, h4 = _x86Rotl(h4, 13), h4 += h1, h4 = _x86Multiply(h4, 5) + 850148119;
                switch (k1 = 0, k2 = 0, k3 = 0, k4 = 0, remainder) {
                    case 15:
                        k4 ^= key.charCodeAt(i + 14) << 16;
                    case 14:
                        k4 ^= key.charCodeAt(i + 13) << 8;
                    case 13:
                        k4 ^= key.charCodeAt(i + 12), k4 = _x86Multiply(k4, c4), k4 = _x86Rotl(k4, 18), k4 = _x86Multiply(k4, c1), h4 ^= k4;
                    case 12:
                        k3 ^= key.charCodeAt(i + 11) << 24;
                    case 11:
                        k3 ^= key.charCodeAt(i + 10) << 16;
                    case 10:
                        k3 ^= key.charCodeAt(i + 9) << 8;
                    case 9:
                        k3 ^= key.charCodeAt(i + 8), k3 = _x86Multiply(k3, c3), k3 = _x86Rotl(k3, 17), k3 = _x86Multiply(k3, c4), h3 ^= k3;
                    case 8:
                        k2 ^= key.charCodeAt(i + 7) << 24;
                    case 7:
                        k2 ^= key.charCodeAt(i + 6) << 16;
                    case 6:
                        k2 ^= key.charCodeAt(i + 5) << 8;
                    case 5:
                        k2 ^= key.charCodeAt(i + 4), k2 = _x86Multiply(k2, c2), k2 = _x86Rotl(k2, 16), k2 = _x86Multiply(k2, c3), h2 ^= k2;
                    case 4:
                        k1 ^= key.charCodeAt(i + 3) << 24;
                    case 3:
                        k1 ^= key.charCodeAt(i + 2) << 16;
                    case 2:
                        k1 ^= key.charCodeAt(i + 1) << 8;
                    case 1:
                        k1 ^= key.charCodeAt(i), k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1
                }
                return h1 ^= key.length, h2 ^= key.length, h3 ^= key.length, h4 ^= key.length, h1 += h2, h1 += h3, h1 += h4, h2 += h1, h3 += h1, h4 += h1, h1 = _x86Fmix(h1), h2 = _x86Fmix(h2), h3 = _x86Fmix(h3), h4 = _x86Fmix(h4), h1 += h2, h1 += h3, h1 += h4, h2 += h1, h3 += h1, h4 += h1, ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8)
            }, library.x64.hash128 = function (key, seed) {
                key = key || "", seed = seed || 0;
                for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = [0, seed], h2 = [0, seed],
                         k1 = [0, 0], k2 = [0, 0], c1 = [2277735313, 289559509], c2 = [1291169091, 658871167],
                         i = 0; i < bytes; i += 16)k1 = [255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24], k2 = [255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24], k1 = _x64Multiply(k1, c1), k1 = _x64Rotl(k1, 31), k1 = _x64Multiply(k1, c2), h1 = _x64Xor(h1, k1), h1 = _x64Rotl(h1, 27), h1 = _x64Add(h1, h2), h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809]), k2 = _x64Multiply(k2, c2), k2 = _x64Rotl(k2, 33), k2 = _x64Multiply(k2, c1), h2 = _x64Xor(h2, k2), h2 = _x64Rotl(h2, 31), h2 = _x64Add(h2, h1), h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445]);
                switch (k1 = [0, 0], k2 = [0, 0], remainder) {
                    case 15:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                    case 14:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                    case 13:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                    case 12:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                    case 11:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                    case 10:
                        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                    case 9:
                        k2 = _x64Xor(k2, [0, key.charCodeAt(i + 8)]), k2 = _x64Multiply(k2, c2), k2 = _x64Rotl(k2, 33), k2 = _x64Multiply(k2, c1), h2 = _x64Xor(h2, k2);
                    case 8:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                    case 7:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                    case 6:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                    case 5:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                    case 4:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                    case 3:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                    case 2:
                        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                    case 1:
                        k1 = _x64Xor(k1, [0, key.charCodeAt(i)]), k1 = _x64Multiply(k1, c1), k1 = _x64Rotl(k1, 31), k1 = _x64Multiply(k1, c2), h1 = _x64Xor(h1, k1)
                }
                return h1 = _x64Xor(h1, [0, key.length]), h2 = _x64Xor(h2, [0, key.length]), h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), h1 = _x64Fmix(h1), h2 = _x64Fmix(h2), h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8)
            }, "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = library), exports.murmurHash3 = library) : "function" == typeof define && define.amd ? define("murmurHash3js", [], function () {
                return library
            }) : (library._murmurHash3 = root.murmurHash3, library.noConflict = function () {
                return root.murmurHash3 = library._murmurHash3, library._murmurHash3 = undefined, library.noConflict = undefined, library
            }, root.murmurHash3 = library)
        }(this), function () {
            define("utils/rule-checker", ["underscore", "utils/urls", "utils/utils", "utils/date", "utils/browser", "md5", "murmurHash3js"], function (_, urls, utils, date, browser, md5, murmurHash3) {
                var pathMatches;
                return pathMatches = function (rule, path, hashedPath) {
                    var regex;
                    return null == hashedPath && (hashedPath = md5.hash(path)), rule.whereHash === hashedPath || !(!rule.isRegex && !rule.whereRegex) && (regex = rule.isRegex ? rule.where : rule.whereRegex, urls.regexPathMatches(regex, path))
                }, {
                    checkUrl: function (rule, path, hashedPath) {
                        return urls.domainMatches(rule.domain) && urls.domainsMatch(rule.domains) && pathMatches(rule, path, hashedPath)
                    }, checkLanguage: function (rule) {
                        return browser.languageMatches(rule.languages)
                    }, checkUserProperties: function (rule, userData) {
                        var matchedAll, operator, operatorFn, propDef, propName, props, ref, userValue, value;
                        if (null != (props = null != rule ? rule.properties : void 0) && _.isObject(props)) {
                            if (!_.isObject(userData))return !1;
                            matchedAll = !0;
                            for (propName in props)if (propDef = props[propName], userValue = userData[propName], _.isObject(propDef)) {
                                if (value = propDef.value, operator = propDef.operator, operatorFn = utils.operators[operator], "in" !== operator && "not in" !== operator || (value = propDef.valuesList, propDef.isSensitive && _.isString(userValue) && (userValue = murmurHash3.x86.hash32(md5.hash(userValue)))), operatorFn && !operatorFn(userValue, value)) {
                                    matchedAll = !1;
                                    break
                                }
                            } else if (ref = utils.correctArgumentTypes(propDef, userValue), propDef = ref[0], userValue = ref[1], userValue !== propDef) {
                                matchedAll = !1;
                                break
                            }
                            return matchedAll
                        }
                        return !0
                    }, checkUserHistory: function (rule) {
                        switch (rule.frequency) {
                            case"every_time":
                                return !0;
                            case"once":
                            default:
                                return !rule.shown
                        }
                    }, checkTimeframe: function (rule) {
                        var now, withinTimeframe;
                        return now = date.now(), withinTimeframe = !0, null != rule.startDate && (withinTimeframe = new Date(rule.startDate).getTime() < now), null != rule.endDate && (withinTimeframe = withinTimeframe && new Date(rule.endDate).getTime() > now), withinTimeframe
                    }
                }
            })
        }.call(this), function () {
            define("taco/widget", ["env", "underscore", "utils/dollar", "utils/utils", "utils/aeon", "eventbus", "utils/logger", "utils/urls", "md5", "utils/rule-checker"], function (env, _, $, utils, aeon, Eventbus, Logger, urls, md5, ruleChecker) {
                return function () {
                    function WidgetView(el, options) {
                        var $backdrop;
                        null == options && (options = {}), el && (this.$el = $(el), this.$el.addClass(this.WIDGET_CLASS), this.selector = options.selector, this.options = options, this.isOpen = !1, this.items = [], this.$container = this.insertContainer(), $backdrop = this.injectBackdropToContainer(), $backdrop.addEventListener("click", function (_this) {
                            return function () {
                                return _this.close()
                            }
                        }(this)))
                    }

                    return WidgetView.prototype.WIDGET_CLASS = "appcues-widget", WidgetView.prototype.ACTIVE_CLASS = "appcues-active", WidgetView.prototype.POSITIONS = {
                        left: "appcues-widget-left",
                        right: "appcues-widget-right",
                        center: "appcues-widget-center",
                        bottom: "appcues-widget-bottom",
                        "bottom-left": "appcues-widget-bottom-left",
                        "bottom-right": "appcues-widget-bottom-right",
                        "bottom-center": "appcues-widget-bottom-center",
                        top: "appcues-widget-top",
                        "top-left": "appcues-widget-top-left",
                        "top-right": "appcues-widget-top-right",
                        "top-center": "appcues-widget-top-center",
                        default: "appcues-widget-center"
                    }, WidgetView.prototype.init = function () {
                        return this.render(), this.bind()
                    }, WidgetView.prototype.bind = function () {
                        if (this.$el)return this.$el.findOne(".appcues-widget-icon").addEventListener("click", function (_this) {
                            return function () {
                                return _this.toggle()
                            }
                        }(this))
                    }, WidgetView.prototype.replaceItems = function (items) {
                        return this.items = items, this.render()
                    }, WidgetView.prototype.render = function () {
                        return this.$el && this.items ? (this.renderIcon(), this.renderDropdown()) : void Logger.warn("Cannot render view becuse it was not successfully initialized.")
                    }, WidgetView.prototype.renderIcon = function () {
                        var $el, $icon, count, i, item, len, ref;
                        if (this.$el) {
                            if ($el = this.$el, $icon = $el.findOne(".appcues-widget-icon"), $icon || ($icon = $(document).createElement("i"), $icon.addClass("appcues-widget-icon appcues-icon appcues-icon-bell"), $el.prepend($icon)), null == (count = this.options.count))for (count = 0, ref = this.items, i = 0, len = ref.length; i < len; i++)item = ref[i], item.shown || count++;
                            return $icon.attr("data-appcues-count", count), count ? ($icon.addClass("appcues-in"), window.setTimeout(function () {
                                return $icon.addClass("appcues-slide")
                            }, 200)) : $icon.removeClass("appcues-in"), $icon
                        }
                    }, WidgetView.prototype.renderDropdown = function () {
                        var $content, $dropdown, $footer, $header, CONTENT_CLASS, DROPDOWN_CLASS, FOOTER_CLASS,
                            HEADER_CLASS, footerContent, headerContent, pos, posClass;
                        return DROPDOWN_CLASS = "appcues-widget-dropdown", CONTENT_CLASS = "appcues-widget-content", HEADER_CLASS = "appcues-widget-header", FOOTER_CLASS = "appcues-widget-footer", $dropdown = $(document).createElement("div"), $dropdown.addClass(DROPDOWN_CLASS), (headerContent = this.options.header) && !$dropdown.findOne("." + HEADER_CLASS) && ($header = $(document).createElement("div"), $header.addClass(HEADER_CLASS).html(headerContent), $dropdown.append($header)), ($content = $dropdown.findOne("." + CONTENT_CLASS)) && $content.remove(), $content = $(document).createElement("div"), $content.addClass(CONTENT_CLASS).html(this.renderList()), $content = this.setListEventListeners($content), $dropdown.append($content), (footerContent = this.options.footer) && !$dropdown.findOne("." + FOOTER_CLASS) && ($footer = $(document).createElement("div"), $footer.addClass(FOOTER_CLASS).html(footerContent), $dropdown.append($footer)), pos = this.options.position || "default", posClass = this.POSITIONS[pos], posClass && $dropdown.addClass(posClass), this.$dropdown = $dropdown
                    }, WidgetView.prototype.renderList = function () {
                        var readItems, readList, sortedItems, unreadItems, unreadList;
                        return sortedItems = _.sortBy(this.items, "version_id").reverse(), sortedItems = _.groupBy(sortedItems, "shown"), unreadList = "", readList = "", unreadItems = sortedItems.false, readItems = sortedItems.true, unreadItems && (unreadList += _.map(unreadItems, function (_this) {
                            return function (item) {
                                return _this.buildListItem(item, !1)
                            }
                        }(this)).join("")), unreadList || (unreadList += "<li class='appcues-nothing-new'>There's nothing new to see here!</li>"), readItems && (readList += _.map(readItems, function (_this) {
                            return function (item) {
                                return _this.buildListItem(item, !0)
                            }
                        }(this)).join("")), "<ul class='appcues-widget-list'>" + unreadList + "</ul><ul class='appcues-widget-list'>" + readList + "</ul>"
                    }, WidgetView.prototype.buildListItem = function (item, isRead) {
                        var date, dateStr;
                        return date = new Date(item.version_id), dateStr = aeon.getShortDate(date), "<li class='" + (isRead ? "" : "appcues-unread") + "'>\n    <a data-itemid='" + item.id + "', data-isread=" + isRead + ">\n    " + item.name + " <time>" + dateStr + "</time>\n    </a>\n</li>"
                    }, WidgetView.prototype.setListEventListeners = function ($list) {
                        var $link, _this, i, len, ref;
                        for (_this = this, ref = $list.find("a"), i = 0, len = ref.length; i < len; i++)$link = ref[i], $link.addEventListener("click", function (e) {
                            var eventData, isSeenItem, itemId;
                            _this.close(), e.preventDefault(), e.stopPropagation(), itemId = $(this).attr("data-itemid"), isSeenItem = $(this).attr("data-isread"), isSeenItem = "true" === isSeenItem || !0 === isSeenItem;
                            try {
                                return window.Appcues.show(itemId), eventData = {
                                    targetType: "flow",
                                    itemId: itemId,
                                    isSeenItem: isSeenItem
                                }, Eventbus.emit("widget_content_interaction", itemId), _this.triggerAnalytics("widget_content_interaction", eventData)
                            } catch (_error) {
                                throw e = _error
                            }
                        });
                        return $list
                    }, WidgetView.prototype.toggle = function () {
                        return this.isOpen ? this.close() : this.$el.hasClass(this.ACTIVE_CLASS) ? this.close() : this.open()
                    }, WidgetView.prototype.close = function () {
                        return this.$container.removeClass(this.ACTIVE_CLASS), this.$el.removeClass(this.ACTIVE_CLASS), this.isOpen = !1, this.triggerAnalytics("widget_closed")
                    }, WidgetView.prototype.open = function () {
                        return this.setContainerHeight(), this.injectContentToContainer(), this.$container.addClass(this.ACTIVE_CLASS), this.$el.addClass(this.ACTIVE_CLASS), this.isOpen = !0, this.triggerAnalytics("widget_opened")
                    }, WidgetView.prototype.injectContentToContainer = function () {
                        var $dropdown, $oldDropdown, offset, pos;
                        return ($oldDropdown = this.$container.findOne(".appcues-widget-dropdown")) && $oldDropdown.remove(), pos = this.options.position || "default", offset = this.calculateAbsolutePositioning(pos), $dropdown = $(this.$dropdown), $dropdown.attr("style", "top:" + offset.top + "px; left:" + offset.left + "px;"), this.$container.append($dropdown)
                    }, WidgetView.prototype.calculateAbsolutePositioning = function (position) {
                        var $el, isLeft, isRight, isTop, leftOffset, offset, topOffset;
                        return $el = this.$el, isTop = position.indexOf("top") > -1, isLeft = position.indexOf("left") > -1, isRight = position.indexOf("right") > -1, leftOffset = 0, isLeft && (leftOffset -= 135), isRight && (leftOffset += 135), isTop && (leftOffset -= 5), topOffset = 0, isTop && (topOffset -= 70), offset = $el.absoluteOffset(), offset = {
                            left: offset.left + $el.width() / 2 + leftOffset,
                            top: offset.top + $el.height() + 10 + topOffset
                        }
                    }, WidgetView.prototype.insertContainer = function () {
                        var $container, sel, selector;
                        return this.$container ? this.$container : (selector = this.selector.replace(/(\.|#|:)/g, "_"), sel = "appcues-widget-container-for-" + selector, $container = $(document.body).findOne("." + sel), $container || ($container = $(document).createElement("div"), $container.addClass("appcues-widget-container"), $container.addClass(sel), $(document.body).append($container)), $container)
                    }, WidgetView.prototype.injectBackdropToContainer = function () {
                        var $backdrop, backdropClass;
                        if (this.$container)return backdropClass = "appcues-widget-backdrop", $backdrop = this.$container.findOne("." + backdropClass), $backdrop || ($backdrop = $(document).createElement("div"), $backdrop.addClass("appcues-widget-backdrop"), this.$container.append($backdrop)), $backdrop
                    }, WidgetView.prototype.setContainerHeight = function () {
                        var bodyHeight;
                        if (this.$container)return bodyHeight = utils.getPageDimensions().height, this.$container.attr("style", "height: " + bodyHeight + "px")
                    }, WidgetView.prototype.triggerAnalytics = function (actionId, data) {
                        var eventData;
                        return eventData = _.extend({}, data, {
                            actionId: actionId,
                            selector: this.selector
                        }), Eventbus.emit("widget_analytics", eventData)
                    }, WidgetView
                }()
            })
        }.call(this), define("base64", [], function () {
            return {
                map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (n) {
                    "use strict";
                    var i1, i2, i3, e1, e2, e3, e4, o = "", i = 0, m = this.map;
                    for (n = this.utf8.encode(n); i < n.length;)i1 = n.charCodeAt(i++), i2 = n.charCodeAt(i++), i3 = n.charCodeAt(i++), e1 = i1 >> 2, e2 = (3 & i1) << 4 | i2 >> 4, e3 = isNaN(i2) ? 64 : (15 & i2) << 2 | i3 >> 6, e4 = isNaN(i2) || isNaN(i3) ? 64 : 63 & i3, o = o + m.charAt(e1) + m.charAt(e2) + m.charAt(e3) + m.charAt(e4);
                    return o
                }, utf8: {
                    encode: function (n) {
                        "use strict";
                        for (var c, o = "", i = 0,
                                 cc = String.fromCharCode; i < n.length;)c = n.charCodeAt(i++), o += c < 128 ? cc(c) : c > 127 && c < 2048 ? cc(c >> 6 | 192) + cc(63 & c | 128) : cc(c >> 12 | 224) + cc(c >> 6 & 63 | 128) + cc(63 & c | 128);
                        return o
                    }
                }
            }
        }), function () {
            define("utils/reporter", [], function () {
                return function (obj, options) {
                }
            })
        }.call(this), function () {
            define("bootstrap", [], function () {
            })
        }.call(this), function () {
            define("analytics", ["underscore", "env", "models/user", "models/settings", "base64", "utils/reporter", "bootstrap"], function (_, env, user, settings, base64, report, bootstrap) {
                var AnalyticsClient, client, projectId, ref, writeKey;
                return projectId = env.keenProjectId, writeKey = null != bootstrap && null != (ref = bootstrap.account) ? ref.keenScopedKeyWrite : void 0, writeKey || (writeKey = env.keenWriteKey), AnalyticsClient = function () {
                    function AnalyticsClient(projectId1, writeKey1) {
                        this.projectId = projectId1, this.writeKey = writeKey1
                    }

                    return AnalyticsClient.prototype.baseKeenUrl = env.keenUrl + "/3.0/projects", AnalyticsClient.prototype.segmentTrack = function (eventName, eventProperties) {
                        var data, properties, url;
                        return null == eventProperties && (eventProperties = {}), properties = _.extend(eventProperties, {accountId: settings.get("appcuesId")}), data = {
                            writeKey: env.segmentWriteKey,
                            userId: user.get("userId"),
                            event: eventName,
                            properties: properties
                        }, url = this.url(env.segmentUrl, data), this.createPixel(url, null, null, "Segment analytics tracking failed.")
                    }, AnalyticsClient.prototype.track = function (collectionId, attrs, callback) {
                        var appcuesId;
                        return null == attrs && (attrs = {}), appcuesId = settings.get("appcuesId"), this.singleTrack(collectionId, attrs, callback), this.singleTrack("account-" + appcuesId, attrs, callback)
                    }, AnalyticsClient.prototype.singleTrack = function (collectionId, attrs, callback) {
                        var data, url;
                        return null == attrs && (attrs = {}), data = this.parse(attrs), url = this.keenUrl(collectionId, data), this.createPixel(url, data, callback, "Analytics tracking failed.")
                    }, AnalyticsClient.prototype.createPixel = function (url, data, callback, errorMessage) {
                        var img;
                        return img = new Image, _.isFunction(callback) || (callback = function () {
                        }), img.onload = function () {
                            return callback(null, {data: data, url: url})
                        }, img.onerror = img.onabort = function () {
                            var e;
                            return e = new Error(errorMessage), report(e, {
                                extra: data,
                                tags: {url: url}
                            }), callback(e, {data: data, url: url})
                        }, img.src = url, img
                    }, AnalyticsClient.prototype.parse = function (attrs) {
                        return _.extend({}, attrs, {
                            VERSION: env.VERSION,
                            identity: _.extend({_ip: "${keen.ip}"}, user.get()),
                            appcuesId: settings.get("appcuesId")
                        })
                    }, AnalyticsClient.prototype.keenUrl = function (collectionId, data) {
                        return this.url(this.baseKeenUrl + "/" + this.projectId + "/events/" + collectionId + "?api_key=" + this.writeKey + "&data=", data)
                    }, AnalyticsClient.prototype.url = function (baseUrl, data) {
                        var base64Data, encodedData;
                        return base64Data = base64.encode(JSON.stringify(data)), encodedData = encodeURIComponent(base64Data), "" + baseUrl + encodedData
                    }, AnalyticsClient.prototype.createRedirectUrl = function (collectionId, attrs, redirect) {
                        var data;
                        return data = this.parse(attrs), this.keenUrl(collectionId, data) + "&redirect=" + redirect
                    }, AnalyticsClient
                }(), client = new AnalyticsClient(projectId, writeKey), client.AnalyticsClient = AnalyticsClient, client
            })
        }.call(this), function () {
            define("taco/widget-analytics", ["underscore", "utils/numeric-hash", "analytics", "models/user", "models/settings"], function (_, numericHash, analytics, user, settings) {
                return function () {
                    function WidgetAnalytics() {
                    }

                    return WidgetAnalytics.prototype.track = function (actionId, selector, eventData) {
                        var data;
                        return null == eventData && (eventData = {}), data = _.extend({}, eventData, {actionId: actionId}), this._track(this._buildWidgetId(selector), data)
                    }, WidgetAnalytics.prototype._track = function (collectionId, data) {
                        return analytics.singleTrack(collectionId, data)
                    }, WidgetAnalytics.prototype._buildWidgetId = function (selector) {
                        var appcuesId, hashedSelector;
                        return appcuesId = settings.get("appcuesId"), appcuesId && selector ? (hashedSelector = numericHash(selector), "WIDGET-" + appcuesId + "-" + hashedSelector) : console.warn("Couldn't collect widget analytics. Undefined appcuesId or CSS selector.")
                    }, WidgetAnalytics
                }()
            })
        }.call(this), function () {
            define("client", ["underscore", "env", "models/settings", "reqwest", "utils/date", "utils/logger", "utils/reporter"], function (_, env, settings, request, date, logger, report) {
                return function () {
                    function APIClient(options) {
                        this.options(options)
                    }

                    return APIClient.prototype.options = function (options) {
                        if (0 === arguments.length)return this._options;
                        this._options = _.clone(options)
                    }, APIClient.prototype.urlRoot = function () {
                        var appcuesId;
                        return appcuesId = settings.get("appcuesId"), env.firebase + "/public/users/" + appcuesId
                    }, APIClient.prototype.url = function (resource) {
                        return this.urlRoot() + resource
                    }, APIClient.prototype.request = function (options) {
                        var req, start, url;
                        return start = date.now(), url = options.url, /^\//.test(url) && (options.url = this.url(url)), _.defaults(options, {
                            crossOrigin: !0,
                            type: "json"
                        }), req = request(options), req.catch(function (e) {
                            var data, msg, props;
                            if (msg = "API request failed.", props = ["response", "responseText", "responseType", "responseURL", "statusText", "status", "readyState"], data = _.extend({requestTime: date.now() - start}, _.pick(e, props), options), logger.log(msg, data), 100 * Math.random() <= 10)return report(msg, {extra: data})
                        }), req
                    }, APIClient
                }()
            })
        }.call(this), function () {
            var extend = function (child, parent) {
                function ctor() {
                    this.constructor = child
                }

                for (var key in parent)hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
            }, hasProp = {}.hasOwnProperty;
            define("collections/user-history", ["client", "utils/logger", "models/user", "underscore", "models/settings", "env"], function (APIClient, logger, user, _, settings, env) {
                return function (superClass) {
                    function UserHistory(options) {
                        null == options && (options = {}), this.options(options), this.history = {}
                    }

                    return extend(UserHistory, superClass), UserHistory.prototype.urlRoot = function () {
                        return UserHistory.__super__.urlRoot.call(this) + "/userhistory"
                    }, UserHistory.prototype.fetchFlows = function () {
                        var uuid;
                        return logger.log("Fetching user history for flows"), uuid = user.toUUID(), this.request({
                            method: "get",
                            url: "/" + uuid + "/flows.json"
                        })
                    }, UserHistory.prototype.fetchHotspotGroups = function () {
                        var uuid;
                        return logger.log("Fetching user history for hotspot groups"), uuid = user.toUUID(), this.request({
                            method: "get",
                            url: "/" + uuid + "/hotspot-groups.json"
                        })
                    }, UserHistory.prototype.fetchCoachmarkGroups = function () {
                        var uuid;
                        return logger.log("Fetching user history for coachmark groups"), uuid = user.toUUID(), this.request({
                            method: "get",
                            url: "/" + uuid + "/coachmark-groups.json"
                        })
                    }, UserHistory.prototype.fromApi = function () {
                        var appcuesId, userId;
                        return appcuesId = settings.get("appcuesId"), userId = user.get("userId"), this.request({
                            method: "get",
                            url: env.API_URL + "/accounts/" + appcuesId + "/users/" + userId + "/history"
                        })
                    }, UserHistory.prototype.markFlowsViewed = function (flows) {
                        var uuid;
                        return logger.log("Marking additional flows as viewed"), uuid = user.toUUID(), this.request({
                            url: "/" + uuid + "/flows.json?x-http-method-override=PATCH&print=silent",
                            method: "post",
                            data: JSON.stringify(flows)
                        })
                    }, UserHistory.prototype.updateHotspotGroupState = function (hotspotGroupId, state) {
                        var uuid;
                        return "started" !== state && "completed" !== state && logger.warn("Tried to update hotspot-group state with unknown state value: " + state + "."), logger.log("Updating hotspot-group state -- " + hotspotGroupId + ": " + state + "."), uuid = user.toUUID(), this.request({
                            url: "/" + uuid + "/hotspot-groups/" + hotspotGroupId + ".json?x-http-method-override=PATCH&print=silent",
                            method: "post",
                            data: JSON.stringify({state: state})
                        })
                    }, UserHistory.prototype.markHotspotsViewed = function (hotspotGroupId, hotspots) {
                        var uuid;
                        return logger.log("Marking hotspots as viewed -- groupId: " + hotspotGroupId + ". hotspotIds: " + _.keys(hotspots) + "."), uuid = user.toUUID(), this.request({
                            url: "/" + uuid + "/hotspot-groups/" + hotspotGroupId + "/hotspots.json?x-http-method-override=PATCH&print=silent",
                            method: "post",
                            data: JSON.stringify(hotspots)
                        })
                    }, UserHistory.prototype.updateCoachmarkGroupState = function (coachmarkGroupId, state) {
                        var uuid;
                        return "started" !== state && "completed" !== state && logger.warn("Tried to update coachmark-group state with unknown state value: " + state + "."), logger.log("Marking coachmark-group " + coachmarkGroupId + " as " + state + "."), uuid = user.toUUID(), this.request({
                            url: "/" + uuid + "/coachmark-groups/" + coachmarkGroupId + ".json?x-http-method-override=PATCH&print=silent",
                            method: "post",
                            data: JSON.stringify({state: state})
                        })
                    }, UserHistory.prototype.markCoachmarksViewed = function (coachmarkGroupId, hotspots) {
                        var uuid;
                        return logger.log("Marking coachmarks in " + coachmarkGroupId + " as viewed: " + _.keys(hotspots) + "."), uuid = user.toUUID(), this.request({
                            url: "/" + uuid + "/coachmark-groups/" + coachmarkGroupId + "/hotspots.json?x-http-method-override=PATCH&print=silent",
                            method: "post",
                            data: JSON.stringify(hotspots)
                        })
                    }, UserHistory
                }(APIClient)
            })
        }.call(this), function () {
            var extend = function (child, parent) {
                function ctor() {
                    this.constructor = child
                }

                for (var key in parent)hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
            }, hasProp = {}.hasOwnProperty, indexOf = [].indexOf || function (item) {
                    for (var i = 0, l = this.length; i < l; i++)if (i in this && this[i] === item)return i;
                    return -1
                };
            define("collections/rules", ["env", "underscore", "client", "utils/date", "md5", "utils/logger", "utils/urls", "es6-promise", "cookie", "models/user", "collections/user-history", "bootstrap", "utils/reporter", "utils/rule-checker", "utils/utils"], function (env, _, APIClient, date, md5, logger, urls, ES6Promise, cookie, user, UserHistoryClient, bootstrap, report, ruleChecker, utils) {
                return function (superClass) {
                    function Rules(options) {
                        this.options(options), this.data = {}, this.history = new UserHistoryClient(this._options), this._cookieKey = "apc_rule_queue"
                    }

                    return extend(Rules, superClass), Rules.prototype.urlRoot = function () {
                        return Rules.__super__.urlRoot.call(this) + "/rules"
                    }, Rules.prototype.fetch = function () {
                        return logger.log("Fetching rules."), this._fetch().then(function (_this) {
                            return function (responses) {
                                return logger.log("Rules response received.", responses), _this.merge.apply(_this, responses)
                            }
                        }(this)).then(_.bind(this.parse, this)).then(function (_this) {
                            return function (rules) {
                                return logger.log("Caching user rules."), _this.data = rules
                            }
                        }(this))
                    }, Rules.prototype.fetchForTaco = function () {
                        return logger.log("Fetching rules."), this._fetchForTaco().then(function (_this) {
                            return function (responses) {
                                return logger.log("Rules response received.", responses), _this.merge.apply(_this, responses)
                            }
                        }(this)).then(_.bind(this.parse, this)).then(function (_this) {
                            return function (rules) {
                                return logger.log("Caching user rules."), _this.data = rules
                            }
                        }(this))
                    }, Rules.prototype._fetch = function () {
                        return ES6Promise.Promise.all([this._fetchDefaultRules(), this._fetchUserRules(), this._fetchUserHistory(), this._getLocalRuleIds()])
                    }, Rules.prototype._fetchForTaco = function () {
                        return ES6Promise.Promise.all([this._fetchDefaultRules(), this._fetchUserRules(), this.fetchUserHistoryFromApi(), this._getLocalRuleIds()])
                    }, Rules.prototype._fetchDefaultRules = function () {
                        var request;
                        return request = _.bind(this.request, this), new ES6Promise.Promise(function (resolve, reject) {
                            var data;
                            return bootstrap && bootstrap.defaultRules ? (data = bootstrap.defaultRules, logger.log("Using bootstrapped data", data), resolve(data)) : (logger.log("No bootstrapped rules data found. Fetching from server."), request({
                                method: "get",
                                url: "/default.json"
                            }).then(resolve, reject))
                        })
                    }, Rules.prototype._fetchUserRules = function () {
                        var uuid;
                        return uuid = user.toUUID(), this.request({method: "get", url: "/" + uuid + ".json"})
                    }, Rules.prototype._fetchUserHistory = function () {
                        var flowHistory, hotspotsHistory;
                        return flowHistory = this.history.fetchFlows(), hotspotsHistory = ES6Promise.Promise.all([this.history.fetchHotspotGroups(), this.history.fetchCoachmarkGroups()]).then(function (arg) {
                            var coachmarkGroupsHistory, history, hotspotGroupsHistory;
                            return hotspotGroupsHistory = arg[0], coachmarkGroupsHistory = arg[1], (hotspotGroupsHistory || coachmarkGroupsHistory) && (history = _.extend({}, hotspotGroupsHistory, coachmarkGroupsHistory)), null != history ? _.reduce(history, function (memo, hist, hotspotGroupId) {
                                var obj;
                                return obj = {}, "completed" === hist.state ? obj[hotspotGroupId] = !0 : _.size(hist.hotspots) && (obj[hotspotGroupId] = _.clone(hist.hotspots)), _.extend(memo, obj)
                            }, {}) : null
                        }), ES6Promise.Promise.all([flowHistory, hotspotsHistory]).then(function (arg) {
                            var flowHistory, hotspotHistory;
                            return flowHistory = arg[0], hotspotHistory = arg[1], null === flowHistory && null === hotspotHistory ? null : (null === flowHistory ? flowHistory = {} : null === hotspotHistory && (hotspotHistory = {}), _.extend(flowHistory, hotspotHistory))
                        }).catch(function (e) {
                            throw e
                        })
                    }, Rules.prototype.fetchUserHistoryFromApi = function () {
                        return this.history.fromApi().then(function (history) {
                            var coachmarkGroupsHistory, flowHistory, hotspotGroupsHistory, hotspotHistory,
                                journeyHistory;
                            return flowHistory = history.flows, hotspotGroupsHistory = history["hotspot-groups"], coachmarkGroupsHistory = history["coachmark-group"], journeyHistory = history.journeys, (hotspotGroupsHistory || coachmarkGroupsHistory) && (history = _.extend({}, hotspotGroupsHistory, coachmarkGroupsHistory)), hotspotHistory = null != history ? _.reduce(history, function (memo, hist, hotspotGroupId) {
                                var obj;
                                return obj = {}, "completed" === hist.state ? obj[hotspotGroupId] = !0 : _.size(hist.hotspots) && (obj[hotspotGroupId] = _.clone(hist.hotspots)), _.extend(memo, obj)
                            }, {}) : null, null === flowHistory && null === hotspotHistory && null === journeyHistory ? null : (null == flowHistory && (flowHistory = {}), null == hotspotHistory && (hotspotHistory = {}), null == journeyHistory && (journeyHistory = {}), _.extend({}, flowHistory, hotspotHistory, journeyHistory))
                        })
                    }, Rules.prototype._getLocalRuleIds = function () {
                        var i, id, len, ref, ruleIds;
                        for (ruleIds = {}, ref = this.getShownCookieIds(), i = 0, len = ref.length; i < len; i++)id = ref[i], ruleIds[id] = !0;
                        return ruleIds
                    }, Rules.prototype.merge = function (defaultRules, userRules, userHistory, localRuleIds) {
                        var contentShown, flowIdsToSync, mergedRule, mergedRules, removeShownCookie, ruleId, ruleset,
                            userRule, whereHash;
                        if (mergedRules = utils.deepClone(defaultRules), flowIdsToSync = {}, userRules || userHistory) {
                            null == userRules && (userRules = {});
                            for (whereHash in mergedRules)if (ruleset = mergedRules[whereHash], null != userRules[whereHash] || userHistory) {
                                null == userRules[whereHash] && (userRules[whereHash] = {}), null == userHistory && (userHistory = {});
                                for (ruleId in ruleset)ruleset[ruleId], mergedRule = mergedRules[whereHash][ruleId], userRule = userRules[whereHash][ruleId], contentShown = userHistory[ruleId], (localRuleIds && localRuleIds[ruleId] || !1 || (null != userRule ? userRule.shown : void 0) || contentShown) && (_.isObject(contentShown) ? mergedRule.hotspots = contentShown : mergedRule.shown = !0, contentShown || (flowIdsToSync[ruleId] = !0))
                            }
                        }
                        return _.isEmpty(flowIdsToSync) || (removeShownCookie = _.bind(this.removeShownCookie, this), this.history.markFlowsViewed(flowIdsToSync).then(function () {
                            return _.each(_.keys(flowIdsToSync), removeShownCookie)
                        })), mergedRules
                    }, Rules.prototype.parse = function (rules) {
                        var parsed, rule, ruleId, ruleset, whereHash;
                        if (parsed = {}, _.isObject(rules))for (whereHash in rules) {
                            ruleset = rules[whereHash];
                            for (ruleId in ruleset)rule = ruleset[ruleId], parsed[ruleId] = _.clone(rule)
                        }
                        return parsed
                    }, Rules.prototype.getUserRules = function () {
                        var filtered, ref, rule, ruleId, userData;
                        if (filtered = {}, _.isObject(this.data)) {
                            userData = user.get(), ref = this.data;
                            for (ruleId in ref)rule = ref[ruleId], ruleChecker.checkUserProperties(rule, userData) && (filtered[ruleId] = rule)
                        }
                        return filtered
                    }, Rules.prototype._contentTypeValue = function (contentType) {
                        return "flow" !== contentType && contentType ? "coachmark-group" === contentType ? 5 : 0 : 9
                    }, Rules.prototype._ruleSortValue = function (arg, options) {
                        var nextContentIds, ref, ref1, ref2, ref3, rule;
                        return arg[0], rule = arg[1], null == options && (options = {}), nextContentIds = null != (ref = options.nextContentIds) ? ref : [], [null != (ref1 = rule.sortPriority) ? ref1 : 0, (ref2 = rule.id, indexOf.call(nextContentIds, ref2) >= 0 ? 0 : 9), rule.nextContentId ? 9 : 0, this._contentTypeValue(rule.contentType), "every_time" === rule.frequency ? 0 : 9, rule.isRegex ? 0 : 9, null != (ref3 = rule.updatedAt) ? ref3 : rule.createdAt]
                    }, Rules.prototype._getNextContentIds = function (rulePairs) {
                        return _.chain(rulePairs).map(function (pair) {
                            var ref, ref1, ref2;
                            return (null != (ref = pair[1]) ? ref.nextContentId : void 0) || (null != (ref1 = pair[1]) && null != (ref2 = ref1.nextContent) ? ref2.id : void 0)
                        }).filter(function (contentId) {
                            return null != contentId
                        }).value()
                    }, Rules.prototype._sortRules = function (rulePairs) {
                        var nextContentIds;
                        return nextContentIds = this._getNextContentIds(rulePairs), rulePairs.sort(function (_this) {
                            return function (a, b) {
                                var i, index, len, ref;
                                for (a = _this._ruleSortValue(a, {nextContentIds: nextContentIds}), b = _this._ruleSortValue(b, {nextContentIds: nextContentIds}), ref = _.range(0, a.length), i = 0, len = ref.length; i < len; i++)if (index = ref[i], a[index] !== b[index])return a[index] > b[index] ? -1 : 1;
                                return 0
                            }
                        }(this)), rulePairs
                    }, Rules.prototype.getRuleIdForPath = function (rules, path) {
                        var _ruleId, hashedPath, i, len, ref, rule, sortedRules;
                        if (null == rules && (rules = this.getUserRules()), !rules)return void logger.warn("Looking up a ruleId requires a rules argument.");
                        for (null == path && (path = urls.getPath()), hashedPath = md5.hash(path), sortedRules = this._sortRules(_.pairs(rules)), i = 0, len = sortedRules.length; i < len; i++)if (ref = sortedRules[i], _ruleId = ref[0], rule = ref[1], ruleChecker.checkTimeframe(rule) && ruleChecker.checkUserHistory(rule) && ruleChecker.checkUrl(rule, path, hashedPath) && ruleChecker.checkLanguage(rule))return _ruleId;
                        return null
                    }, Rules.prototype.markFlowAsShown = function (ruleId) {
                        var removeShownCookie, request;
                        return this.addShownCookie(ruleId), removeShownCookie = _.bind(this.removeShownCookie, this, ruleId), request = new ES6Promise.Promise(function (_this) {
                            return function (resolve, reject) {
                                var e, flows, msg, rule, shownAt;
                                return rule = _this.getRule(ruleId), user.isAnonymous() ? (logger.log("Did not mark as shown because user is unknown."), resolve()) : rule ? (logger.log("Persisting that flow " + ruleId + " as shown."), rule.shown ? (logger.log("Actually, we already knew that flow was seen."), resolve()) : (logger.log("Persisting rule state to server."), shownAt = date.now(), rule.shown = !0, rule.shownAt = shownAt, flows = {}, flows[ruleId] = !0, _this.history.markFlowsViewed(flows).then(resolve).catch(reject))) : (msg = "Failed to save flow shown state: known user and unknown flow ID " + ruleId, logger.error(msg, user, rule), e = new Error(msg), report(e), reject(e))
                            }
                        }(this)), request.then(removeShownCookie).catch(function (e) {
                            return logger.warn("Rule cookie failed to clear after rule was marked as shown server-side.")
                        })
                    }, Rules.prototype.updateHotspotGroupState = function (ruleId, state) {
                        var e, msg, rule;
                        if (null != (rule = this.getRule(ruleId))) {
                            if (rule.shown)return void logger.log("Actually, we already knew that hotspot-group was completed.");
                            switch (state) {
                                case"completed":
                                    rule.shown = !0;
                                    break;
                                case"started":
                                    rule.shown = !1
                            }
                        } else msg = "Failed to update hotspot-group state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e);
                        return this.history.updateHotspotGroupState(ruleId, state)
                    }, Rules.prototype.markHotspotsViewed = function (ruleId, hotspots) {
                        var e, msg, rule;
                        return rule = this.getRule(ruleId), null != rule ? null != rule.hotspots ? rule.hotspots = _.extend(rule.hotspots, hotspots) : rule.hotspots = hotspots : (msg = "Failed to update individual hotspots state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e)), this.history.markHotspotsViewed(ruleId, hotspots)
                    }, Rules.prototype.updateCoachmarkGroupState = function (ruleId, state) {
                        var e, msg, rule;
                        if (null != (rule = this.getRule(ruleId))) {
                            if (rule.shown)return void logger.log("Coachmark group " + ruleId + " was already completed.");
                            switch (state) {
                                case"completed":
                                    rule.shown = !0;
                                    break;
                                case"started":
                                    rule.shown = !1
                            }
                        } else msg = "Failed to update coachmark group state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e);
                        return this.history.updateCoachmarkGroupState(ruleId, state)
                    }, Rules.prototype.markCoachmarksViewed = function (ruleId, hotspots) {
                        var e, msg, rule;
                        return rule = this.getRule(ruleId),
                            null != rule ? null != rule.hotspots ? rule.hotspots = _.extend(rule.hotspots, hotspots) : rule.hotspots = hotspots : (msg = "Failed to update individual hotspot state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e)), this.history.markCoachmarksViewed(ruleId, hotspots)
                    }, Rules.prototype.getRule = function (ruleId) {
                        if (ruleId && _.isObject(this.data))return this.data[ruleId]
                    }, Rules.prototype.addShownCookie = function (ruleId) {
                        var existing;
                        return ruleId ? cookie.enabled ? (existing = cookie.get(this._cookieKey) || "", -1 === existing.indexOf(ruleId) ? (logger.log("Saving rule ID to cookie."), existing && "undefined" !== existing ? existing += "," + ruleId : existing = "" + ruleId, cookie.set(this._cookieKey, existing)) : logger.log("Rule ID already exists in cookie.")) : logger.warn("Cookies are not enabled.") : logger.warn("No rule ID given."), !1
                    }, Rules.prototype.removeShownCookie = function (ruleId) {
                        var existing, newCookie;
                        return !!cookie.enabled && (existing = cookie.get(this._cookieKey) || "", newCookie = existing.replace(ruleId, "").replace(/^,+/, "").replace(/,+$/, ""), "" === newCookie ? cookie.remove(this._cookieKey) : cookie.set(this._cookieKey, newCookie), logger.log("Removing shown cookie " + ruleId + "."))
                    }, Rules.prototype.getShownCookieIds = function () {
                        var idStr, ids;
                        return ids = [], cookie.enabled && (idStr = cookie.get(this._cookieKey)) && (ids = idStr.split(",")), ids
                    }, Rules
                }(APIClient)
            })
        }.call(this), function () {
            var extend = function (child, parent) {
                function ctor() {
                    this.constructor = child
                }

                for (var key in parent)hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
            }, hasProp = {}.hasOwnProperty;
            define("collections/taco-flows", ["env", "client", "models/user", "models/settings"], function (env, APIClient, user, settings) {
                return function (superClass) {
                    function TacoFlows(options) {
                        null == options && (options = {}), this.options(options), this.data = {}
                    }

                    return extend(TacoFlows, superClass), TacoFlows.prototype.fetch = function (currentUrl) {
                        var appcuesId, userId;
                        return appcuesId = settings.get("appcuesId"), userId = user.get("userId"), this.request({
                            method: "get",
                            url: env.API_URL + "/accounts/" + appcuesId + "/users/" + userId + "/taco",
                            data: {url: currentUrl}
                        })
                    }, TacoFlows
                }(APIClient)
            })
        }.call(this), function () {
            define("taco/taco-api", ["env", "underscore", "reqwest", "es6-promise", "collections/rules", "collections/taco-flows", "models/user", "models/settings"], function (env, _, request, ES6Promise, Rules, TacoFlows, user, settings) {
                return function () {
                    function TacoAPI(options) {
                        this.rules = new Rules, this.tacoFlows = new TacoFlows, this.items = [], this._promise = null
                    }

                    return TacoAPI.prototype.urlRoot = function () {
                        var appcuesId;
                        return appcuesId = settings.get("appcuesId"), env.firebase + "/public/users/" + appcuesId
                    }, TacoAPI.prototype.parseApiResponse = function (apiResponse) {
                        return _.map(apiResponse.contents, function (item) {
                            return {
                                version_id: item.version_id,
                                name: item.name,
                                id: item.id,
                                migrated_from_step_id: item.migrated_from_step_id
                            }
                        })
                    }, TacoAPI.prototype.joinUserHistory = function (flows, userHistory) {
                        return _.map(flows, function (flow) {
                            var shown;
                            return shown = !!userHistory[flow.id], flow.migrated_from_step_id && (shown = shown || !!userHistory[flow.migrated_from_step_id]), _.extend({}, flow, {shown: shown})
                        })
                    }, TacoAPI.prototype.fetch = function (currentUrl) {
                        return this._promise ? this._promise : this._promise = ES6Promise.Promise.all([this.tacoFlows.fetch(currentUrl), this.rules.fetchUserHistoryFromApi()]).then(function (_this) {
                            return function (responses) {
                                var flows, userHistory;
                                return _this._promise = null, flows = responses[0], userHistory = responses[1], _this.items = _this.joinUserHistory(_this.parseApiResponse(flows), userHistory), _this.items
                            }
                        }(this))
                    }, TacoAPI.prototype.getItemFromId = function (itemId) {
                        var foundItem, i, item, len, ref;
                        for (foundItem = null, ref = this.items, i = 0, len = ref.length; i < len; i++)if (item = ref[i], item.id === itemId) {
                            foundItem = item;
                            break
                        }
                        return foundItem
                    }, TacoAPI
                }()
            })
        }.call(this), function () {
            define("taco/widget-manager", ["eventbus", "utils/dollar", "underscore", "utils/logger", "models/user", "models/settings", "taco/widget", "taco/widget-analytics", "taco/taco-api", "utils/urls"], function (Eventbus, $, _, Logger, user, settings, WidgetView, Analytics, API, urls) {
                return function () {
                    function WidgetManager() {
                        this.views = [], this.items = [], this.analytics = new Analytics, this.api = new API, this.currentUrl = void 0, Eventbus.on("widget_content_interaction", function (_this) {
                            return function (itemId) {
                                return _this.renderAll(_this.updateItem(itemId, {shown: !0}))
                            }
                        }(this)), Eventbus.on("widget_analytics", function (_this) {
                            return function (eventData) {
                                var actionId, selector;
                                if (actionId = eventData.actionId, selector = eventData.selector, actionId)return delete eventData.actionId, _this.analytics.track(actionId, selector, eventData)
                            }
                        }(this))
                    }

                    return WidgetManager.prototype.checkUrl = function () {
                        return this.currentUrl !== window.location.href && (this.currentUrl = window.location.href, this.fetchItems(this.currentUrl).then(_.bind(this.renderAll, this)).catch(function (e) {
                            return Logger.log("failed to fetch items from appcues")
                        })), _.delay(_.bind(this.checkUrl, this), 1e3)
                    }, WidgetManager.prototype.add = function (selector, options) {
                        var el, view, views;
                        if (null == options && (options = {}), el = this.findElement(selector)) {
                            if ($(el).hasClass(WidgetView.prototype.WIDGET_CLASS))return _.find(this.views, function (v) {
                                return v.el === el
                            });
                            views = [], _.each(this.views, function (v) {
                                if (v.el !== el)return views.push(v)
                            }), this.views = views, options.selector = selector, view = new WidgetView(el, options), this.views.push(view), view.init()
                        }
                        return this.currentUrl || this.checkUrl(), view
                    }, WidgetManager.prototype.findElement = function (selector) {
                        var el;
                        return el = $(document).findOne(selector), el || Logger.warn("Appcues Widget initialization failed: could not find element associated with given selector " + selector + "."), el
                    }, WidgetManager.prototype.fetchItems = function (currentUrl) {
                        return this.api.fetch(currentUrl)
                    }, WidgetManager.prototype.updateItem = function (itemId, changes) {
                        return this.items = _.map(this.items, function (item) {
                            return item.id === itemId ? _.extend(item, changes) : item
                        }), this.items
                    }, WidgetManager.prototype.renderAll = function (flows) {
                        var i, len, ref, results, view;
                        for (this.items = flows, ref = this.views, results = [], i = 0, len = ref.length; i < len; i++)view = ref[i], view.items = this.items, results.push(view.render());
                        return results
                    }, WidgetManager
                }()
            })
        }.call(this), function () {
            define("taco/taco", ["env", "underscore", "utils/dollar", "utils/utils", "models/user", "models/settings", "utils/logger", "eventbus", "taco/widget-manager", "es6-promise"], function (env, _, $, utils, user, settings, Logger, Eventbus, Manager, ES6Promise) {
                return function (appcuesId, userAttrs, settingsAttrs) {
                    var create, initPromise;
                    return null == appcuesId && (appcuesId = {}), initPromise = new ES6Promise.Promise(function (resolve, reject) {
                        return _.isObject(appcuesId) && (settingsAttrs = userAttrs || {}, userAttrs = appcuesId, appcuesId = null), _.isFunction(userAttrs.then) || (userAttrs = ES6Promise.Promise.resolve(userAttrs)), userAttrs.then(function (attrs) {
                            return null == appcuesId && (appcuesId = attrs.appcuesId || attrs._appcuesId, delete attrs.appcuesId, delete attrs._appcuesId), settings.set({appcuesId: appcuesId}), settings.isValid() || reject(new Error("Missing Appcues account ID.")), resolve({
                                appcuesId: appcuesId,
                                userAttrs: attrs,
                                settingsAttrs: settingsAttrs
                            })
                        })
                    }), create = function (selector, options) {
                        var initView;
                        return null == options && (options = {}), selector || console.warn("Missing CSS selector argument. Please tell us where you would like the Appcues widget to be rendered."), initView = function () {
                            var manager;
                            return manager = new Manager, manager.add(selector, options)
                        }, initPromise.then(function (arg) {
                            var settingsAttrs, userAttrs;
                            return arg.appcuesId, userAttrs = arg.userAttrs, settingsAttrs = arg.settingsAttrs, settings.set(settingsAttrs), user.set(userAttrs), initView()
                        }).catch(function (err) {
                            return initView(), console.warn("Could not initialize Appcues widget: ", err)
                        })
                    }, {init: create}
                }
            })
        }.call(this), require("taco/taco")
    })
}();
//# sourceMappingURL=widget-bundle.min.js.map