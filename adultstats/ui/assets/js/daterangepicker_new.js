(function (a, b) {
    if (typeof define === "function" && define.amd) {
        define(["moment", "jquery", "exports"], function (h, g, f) {
            a.daterangepicker = b(a, f, h, g)
        })
    } else {
        if (typeof exports !== "undefined") {
            var d = require("moment");
            var e = (typeof window != "undefined") ? window.jQuery : undefined;
            if (!e) {
                try {
                    e = require("jquery");
                    if (!e.fn) {
                        e.fn = {}
                    }
                } catch (c) {
                    if (!e) {
                        throw new Error("jQuery dependency not found")
                    }
                }
            }
            b(a, exports, d, e)
        } else {
            a.daterangepicker = b(a, {}, a.moment || moment, (a.jQuery || a.Zepto || a.ender || a.$))
        }
    }
}(this || {}, function (b, c, e, d) {
    var a = function (m, s, k) {
        this.parentEl = "body";
        this.element = d(m);
        this.startDate = e().startOf("day");
        this.endDate = e().endOf("day");
        this.minDate = false;
        this.maxDate = false;
        this.dateLimit = false;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.ranges = {};
        this.opens = "right";
        if (this.element.hasClass("pull-right")) {
            this.opens = "left"
        }
        this.drops = "down";
        if (this.element.hasClass("dropup")) {
            this.drops = "up"
        }
        this.buttonClasses = "btn btn-sm";
        this.applyClass = "btn-success";
        this.cancelClass = "btn-default";
        this.locale = {
            format: "MM/DD/YYYY",
            separator: " - ",
            applyLabel: "Apply",
            cancelLabel: "Cancel",
            weekLabel: "W",
            customRangeLabel: "Custom Range",
            daysOfWeek: e.weekdaysMin(),
            monthNames: e.monthsShort(),
            firstDay: e.localeData().firstDayOfWeek()
        };
        this.callback = function () {
        };
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};
        if (typeof s !== "object" || s === null) {
            s = {}
        }
        s = d.extend(this.element.data(), s);
        if (typeof s.template !== "string") {
            s.template = '<div class="daterangepicker dropdown-menu"><div class="calendar left"><div class="daterangepicker_input"><input class="input-mini" type="text" name="daterangepicker_start" value="" /><i class="fa fa-calendar glyphicon glyphicon-calendar"></i><div class="calendar-time"><div></div><i class="fa fa-clock-o glyphicon glyphicon-time"></i></div></div><div class="calendar-table"></div></div><div class="calendar right"><div class="daterangepicker_input"><input class="input-mini" type="text" name="daterangepicker_end" value="" /><i class="fa fa-calendar glyphicon glyphicon-calendar"></i><div class="calendar-time"><div></div><i class="fa fa-clock-o glyphicon glyphicon-time"></i></div></div><div class="calendar-table"></div></div><div class="ranges"><div class="range_inputs"><button class="applyBtn" disabled="disabled" type="button"></button> <button class="cancelBtn" type="button"></button></div></div></div>'
        }
        this.parentEl = (s.parentEl && d(s.parentEl).length) ? d(s.parentEl) : d(this.parentEl);
        this.container = d(s.template).appendTo(this.parentEl);
        if (typeof s.locale === "object") {
            if (typeof s.locale.format === "string") {
                this.locale.format = s.locale.format
            }
            if (typeof s.locale.separator === "string") {
                this.locale.separator = s.locale.separator
            }
            if (typeof s.locale.daysOfWeek === "object") {
                this.locale.daysOfWeek = s.locale.daysOfWeek.slice()
            }
            if (typeof s.locale.monthNames === "object") {
                this.locale.monthNames = s.locale.monthNames.slice()
            }
            if (typeof s.locale.firstDay === "number") {
                this.locale.firstDay = s.locale.firstDay
            }
            if (typeof s.locale.applyLabel === "string") {
                this.locale.applyLabel = s.locale.applyLabel
            }
            if (typeof s.locale.cancelLabel === "string") {
                this.locale.cancelLabel = s.locale.cancelLabel
            }
            if (typeof s.locale.weekLabel === "string") {
                this.locale.weekLabel = s.locale.weekLabel
            }
            if (typeof s.locale.customRangeLabel === "string") {
                this.locale.customRangeLabel = s.locale.customRangeLabel
            }
        }
        if (typeof s.startDate === "string") {
            this.startDate = e(s.startDate, this.locale.format)
        }
        if (typeof s.endDate === "string") {
            this.endDate = e(s.endDate, this.locale.format)
        }
        if (typeof s.minDate === "string") {
            this.minDate = e(s.minDate, this.locale.format)
        }
        if (typeof s.maxDate === "string") {
            this.maxDate = e(s.maxDate, this.locale.format)
        }
        if (typeof s.startDate === "object") {
            this.startDate = e(s.startDate)
        }
        if (typeof s.endDate === "object") {
            this.endDate = e(s.endDate)
        }
        if (typeof s.minDate === "object") {
            this.minDate = e(s.minDate)
        }
        if (typeof s.maxDate === "object") {
            this.maxDate = e(s.maxDate)
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone()
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone()
        }
        if (typeof s.applyClass === "string") {
            this.applyClass = s.applyClass
        }
        if (typeof s.cancelClass === "string") {
            this.cancelClass = s.cancelClass
        }
        if (typeof s.dateLimit === "object") {
            this.dateLimit = s.dateLimit
        }
        if (typeof s.opens === "string") {
            this.opens = s.opens
        }
        if (typeof s.drops === "string") {
            this.drops = s.drops
        }
        if (typeof s.showWeekNumbers === "boolean") {
            this.showWeekNumbers = s.showWeekNumbers
        }
        if (typeof s.buttonClasses === "string") {
            this.buttonClasses = s.buttonClasses
        }
        if (typeof s.buttonClasses === "object") {
            this.buttonClasses = s.buttonClasses.join(" ")
        }
        if (typeof s.showDropdowns === "boolean") {
            this.showDropdowns = s.showDropdowns
        }
        if (typeof s.singleDatePicker === "boolean") {
            this.singleDatePicker = s.singleDatePicker;
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone()
            }
        }
        if (typeof s.timePicker === "boolean") {
            this.timePicker = s.timePicker
        }
        if (typeof s.timePickerSeconds === "boolean") {
            this.timePickerSeconds = s.timePickerSeconds
        }
        if (typeof s.timePickerIncrement === "number") {
            this.timePickerIncrement = s.timePickerIncrement
        }
        if (typeof s.timePicker24Hour === "boolean") {
            this.timePicker24Hour = s.timePicker24Hour
        }
        if (typeof s.autoApply === "boolean") {
            this.autoApply = s.autoApply
        }
        if (typeof s.autoUpdateInput === "boolean") {
            this.autoUpdateInput = s.autoUpdateInput
        }
        if (typeof s.linkedCalendars === "boolean") {
            this.linkedCalendars = s.linkedCalendars
        }
        if (typeof s.isInvalidDate === "function") {
            this.isInvalidDate = s.isInvalidDate
        }
        if (this.locale.firstDay != 0) {
            var o = this.locale.firstDay;
            while (o > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                o--
            }
        }
        var h, l, p;
        if (typeof s.startDate === "undefined" && typeof s.endDate === "undefined") {
            if (d(this.element).is("input[type=text]")) {
                var i = d(this.element).val(), r = i.split(this.locale.separator);
                h = l = null;
                if (r.length == 2) {
                    h = e(r[0], this.locale.format);
                    l = e(r[1], this.locale.format)
                } else {
                    if (this.singleDatePicker && i !== "") {
                        h = e(i, this.locale.format);
                        l = e(i, this.locale.format)
                    }
                }
                if (h !== null && l !== null) {
                    this.setStartDate(h);
                    this.setEndDate(l)
                }
            }
        }
        if (typeof s.ranges === "object") {
            for (p in s.ranges) {
                if (typeof s.ranges[p][0] === "string") {
                    h = e(s.ranges[p][0], this.locale.format)
                } else {
                    h = e(s.ranges[p][0])
                }
                if (typeof s.ranges[p][1] === "string") {
                    l = e(s.ranges[p][1], this.locale.format)
                } else {
                    l = e(s.ranges[p][1])
                }
                if (this.minDate && h.isBefore(this.minDate)) {
                    h = this.minDate.clone()
                }
                var g = this.maxDate;
                if (this.dateLimit && h.clone().add(this.dateLimit).isAfter(g)) {
                    g = h.clone().add(this.dateLimit)
                }
                if (g && l.isAfter(g)) {
                    l = g.clone()
                }
                if ((this.minDate && l.isBefore(this.minDate)) || (g && h.isAfter(g))) {
                    continue
                }
                var j = document.createElement("textarea");
                j.innerHTML = p;
                rangeHtml = j.value;
                this.ranges[rangeHtml] = [h, l]
            }
            var q = "<ul>";
            for (p in this.ranges) {
                q += "<li>" + p + "</li>"
            }
            q += "<li>" + this.locale.customRangeLabel + "</li>";
            q += "</ul>";
            this.container.find(".ranges").prepend(q)
        }
        if (typeof k === "function") {
            this.callback = k
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf("day");
            this.endDate = this.endDate.endOf("day");
            this.container.find(".calendar-time").hide()
        }
        if (this.timePicker && this.autoApply) {
            this.autoApply = false
        }
        if (this.autoApply && typeof s.ranges !== "object") {
            this.container.find(".ranges").hide()
        } else {
            if (this.autoApply) {
                this.container.find(".applyBtn, .cancelBtn").addClass("hide")
            }
        }
        if (this.singleDatePicker) {
            this.container.addClass("single");
            this.container.find(".calendar.left").addClass("single");
            this.container.find(".calendar.left").show();
            this.container.find(".calendar.right").hide();
            this.container.find(".daterangepicker_input input, .daterangepicker_input i").hide();
            if (!this.timePicker) {
                this.container.find(".ranges").hide()
            }
        }
        if (typeof s.ranges === "undefined" && !this.singleDatePicker) {
            this.container.addClass("show-calendar")
        }
        this.container.addClass("opens" + this.opens);
        if (typeof s.ranges !== "undefined" && this.opens == "right") {
            var f = this.container.find(".ranges");
            var n = f.clone();
            f.remove();
            this.container.find(".calendar.left").parent().prepend(n)
        }
        this.container.find(".applyBtn, .cancelBtn").addClass(this.buttonClasses);
        if (this.applyClass.length) {
            this.container.find(".applyBtn").addClass(this.applyClass)
        }
        if (this.cancelClass.length) {
            this.container.find(".cancelBtn").addClass(this.cancelClass)
        }
        this.container.find(".applyBtn").html(this.locale.applyLabel);
        this.container.find(".cancelBtn").html(this.locale.cancelLabel);
        this.container.find(".calendar").on("click.daterangepicker", ".prev", d.proxy(this.clickPrev, this)).on("click.daterangepicker", ".next", d.proxy(this.clickNext, this)).on("click.daterangepicker", "td.available", d.proxy(this.clickDate, this)).on("mouseenter.daterangepicker", "td.available", d.proxy(this.hoverDate, this)).on("mouseleave.daterangepicker", "td.available", d.proxy(this.updateFormInputs, this)).on("change.daterangepicker", "select.yearselect", d.proxy(this.monthOrYearChanged, this)).on("change.daterangepicker", "select.monthselect", d.proxy(this.monthOrYearChanged, this)).on("change.daterangepicker", "select.hourselect,select.minuteselect,select.secondselect,select.ampmselect", d.proxy(this.timeChanged, this)).on("click.daterangepicker", ".daterangepicker_input input", d.proxy(this.showCalendars, this)).on("change.daterangepicker", ".daterangepicker_input input", d.proxy(this.formInputsChanged, this));
        this.container.find(".ranges").on("click.daterangepicker", "button.applyBtn", d.proxy(this.clickApply, this)).on("click.daterangepicker", "button.cancelBtn", d.proxy(this.clickCancel, this)).on("click.daterangepicker", "li", d.proxy(this.clickRange, this)).on("mouseenter.daterangepicker", "li", d.proxy(this.hoverRange, this)).on("mouseleave.daterangepicker", "li", d.proxy(this.updateFormInputs, this));
        if (this.element.is("input")) {
            this.element.on({
                "click.daterangepicker": d.proxy(this.show, this),
                "focus.daterangepicker": d.proxy(this.show, this),
                "keyup.daterangepicker": d.proxy(this.elementChanged, this),
                "keydown.daterangepicker": d.proxy(this.keydown, this)
            })
        } else {
            this.element.on("click.daterangepicker", d.proxy(this.toggle, this))
        }
        if (this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            this.element.trigger("change")
        } else {
            if (this.element.is("input") && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format));
                this.element.trigger("change")
            }
        }
    };
    a.prototype = {
        constructor: a, setStartDate: function (f) {
            if (typeof f === "string") {
                this.startDate = e(f, this.locale.format)
            }
            if (typeof f === "object") {
                this.startDate = e(f)
            }
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf("day")
            }
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement)
            }
            if (this.minDate && this.startDate.isBefore(this.minDate)) {
                this.startDate = this.minDate
            }
            if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
                this.startDate = this.maxDate
            }
            if (!this.isShowing) {
                this.updateElement()
            }
            this.updateMonthsInView()
        }, setEndDate: function (f) {
            if (typeof f === "string") {
                this.endDate = e(f, this.locale.format)
            }
            if (typeof f === "object") {
                this.endDate = e(f)
            }
            if (!this.timePicker) {
                this.endDate = this.endDate.endOf("day")
            }
            if (this.timePicker && this.timePickerIncrement) {
                this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement)
            }
            if (this.endDate.isBefore(this.startDate)) {
                this.endDate = this.startDate.clone()
            }
            if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
                this.endDate = this.maxDate
            }
            if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
                this.endDate = this.startDate.clone().add(this.dateLimit)
            }
            if (!this.isShowing) {
                this.updateElement()
            }
            this.updateMonthsInView()
        }, isInvalidDate: function () {
            return false
        }, updateView: function () {
            if (this.timePicker) {
                this.renderTimePicker("left");
                this.renderTimePicker("right");
                if (!this.endDate) {
                    this.container.find(".right .calendar-time select").attr("disabled", "disabled").addClass("disabled")
                } else {
                    this.container.find(".right .calendar-time select").removeAttr("disabled").removeClass("disabled")
                }
            }
            if (this.endDate) {
                this.container.find('input[name="daterangepicker_end"]').removeClass("active");
                this.container.find('input[name="daterangepicker_start"]').addClass("active")
            } else {
                this.container.find('input[name="daterangepicker_end"]').addClass("active");
                this.container.find('input[name="daterangepicker_start"]').removeClass("active")
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs()
        }, updateMonthsInView: function () {
            if (this.endDate) {
                if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format("YYYY-MM") == this.leftCalendar.month.format("YYYY-MM") || this.startDate.format("YYYY-MM") == this.rightCalendar.month.format("YYYY-MM")) && (this.endDate.format("YYYY-MM") == this.leftCalendar.month.format("YYYY-MM") || this.endDate.format("YYYY-MM") == this.rightCalendar.month.format("YYYY-MM"))) {
                    return
                }
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2)
                } else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, "month")
                }
            } else {
                if (this.leftCalendar.month.format("YYYY-MM") != this.startDate.format("YYYY-MM") && this.rightCalendar.month.format("YYYY-MM") != this.startDate.format("YYYY-MM")) {
                    this.leftCalendar.month = this.startDate.clone().date(2);
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, "month")
                }
            }
        }, updateCalendars: function () {
            if (this.timePicker) {
                var g, m, k;
                if (this.endDate) {
                    g = parseInt(this.container.find(".left .hourselect").val(), 10);
                    m = parseInt(this.container.find(".left .minuteselect").val(), 10);
                    k = this.timePickerSeconds ? parseInt(this.container.find(".left .secondselect").val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var j = this.container.find(".left .ampmselect").val();
                        if (j === "PM" && g < 12) {
                            g += 12
                        }
                        if (j === "AM" && g === 12) {
                            g = 0
                        }
                    }
                } else {
                    g = parseInt(this.container.find(".right .hourselect").val(), 10);
                    m = parseInt(this.container.find(".right .minuteselect").val(), 10);
                    k = this.timePickerSeconds ? parseInt(this.container.find(".right .secondselect").val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var j = this.container.find(".left .ampmselect").val();
                        if (j === "PM" && g < 12) {
                            g += 12
                        }
                        if (j === "AM" && g === 12) {
                            g = 0
                        }
                    }
                }
                this.leftCalendar.month.hour(g).minute(m).second(k);
                this.rightCalendar.month.hour(g).minute(m).second(k)
            }
            this.renderCalendar("left");
            this.renderCalendar("right");
            this.container.find(".ranges li").removeClass("active");
            if (this.endDate == null) {
                return
            }
            var f = true;
            var l = 0;
            for (var h in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[h][0]) && this.endDate.isSame(this.ranges[h][1])) {
                        f = false;
                        this.chosenLabel = this.container.find(".ranges li:eq(" + l + ")").addClass("active").html();
                        break
                    }
                } else {
                    if (this.startDate.format("YYYY-MM-DD") == this.ranges[h][0].format("YYYY-MM-DD") && this.endDate.format("YYYY-MM-DD") == this.ranges[h][1].format("YYYY-MM-DD")) {
                        f = false;
                        this.chosenLabel = this.container.find(".ranges li:eq(" + l + ")").addClass("active").html();
                        break
                    }
                }
                l++
            }
            if (f) {
                this.chosenLabel = this.container.find(".ranges li:last").addClass("active").html();
                this.showCalendars()
            }
        }, renderCalendar: function (A) {
            var P = A == "left" ? this.leftCalendar : this.rightCalendar;
            var g = P.month.month();
            var h = P.month.year();
            var C = P.month.hour();
            var q = P.month.minute();
            var F = P.month.second();
            var k = e([h, g]).daysInMonth();
            var B = e([h, g, 1]);
            var L = e([h, g, k]);
            var I = e(B).subtract(1, "month").month();
            var v = e(B).subtract(1, "month").year();
            var z = e([v, I]).daysInMonth();
            var t = B.day();
            var P = [];
            P.firstDay = B;
            P.lastDay = L;
            for (var R = 0; R < 6; R++) {
                P[R] = []
            }
            var T = z - t + this.locale.firstDay + 1;
            if (T > z) {
                T -= 7
            }
            if (t == this.locale.firstDay) {
                T = z - 6
            }
            var p = e([v, I, T, 12, q, F]);
            var n, w;
            for (var R = 0, n = 0, w = 0; R < 42; R++, n++, p = e(p).add(24, "hour")) {
                if (R > 0 && n % 7 === 0) {
                    n = 0;
                    w++
                }
                P[w][n] = p.clone().hour(C).minute(q).second(F);
                p.hour(12);
                if (this.minDate && P[w][n].format("YYYY-MM-DD") == this.minDate.format("YYYY-MM-DD") && P[w][n].isBefore(this.minDate) && A == "left") {
                    P[w][n] = this.minDate.clone()
                }
                if (this.maxDate && P[w][n].format("YYYY-MM-DD") == this.maxDate.format("YYYY-MM-DD") && P[w][n].isAfter(this.maxDate) && A == "right") {
                    P[w][n] = this.maxDate.clone()
                }
            }
            if (A == "left") {
                this.leftCalendar.calendar = P
            } else {
                this.rightCalendar.calendar = P
            }
            var j = A == "left" ? this.minDate : this.startDate;
            var s = this.maxDate;
            var G = A == "left" ? this.startDate : this.endDate;
            var H = '<table class="table-condensed">';
            H += "<thead>";
            H += "<tr>";
            if (this.showWeekNumbers) {
                H += "<th></th>"
            }
            if ((!j || j.isBefore(P.firstDay)) && (!this.linkedCalendars || A == "left")) {
                H += '<th class="prev available"><i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i></th>'
            } else {
                H += "<th></th>"
            }
            var M = this.locale.monthNames[P[1][1].month()] + P[1][1].format(" YYYY");
            if (this.showDropdowns) {
                var E = P[1][1].month();
                var u = P[1][1].year();
                var D = (s && s.year()) || (u + 5);
                var x = (j && j.year()) || (u - 50);
                var K = u == x;
                var O = u == D;
                var r = '<select class="monthselect">';
                for (var Q = 0; Q < 12; Q++) {
                    if ((!K || Q >= j.month()) && (!O || Q <= s.month())) {
                        r += "<option value='" + Q + "'" + (Q === E ? " selected='selected'" : "") + ">" + this.locale.monthNames[Q] + "</option>"
                    } else {
                        r += "<option value='" + Q + "'" + (Q === E ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[Q] + "</option>"
                    }
                }
                r += "</select>";
                var f = '<select class="yearselect">';
                for (var N = x; N <= D; N++) {
                    f += '<option value="' + N + '"' + (N === u ? ' selected="selected"' : "") + ">" + N + "</option>"
                }
                f += "</select>";
                M = r + f
            }
            H += '<th colspan="5" class="month">' + M + "</th>";
            if ((!s || s.isAfter(P.lastDay)) && (!this.linkedCalendars || A == "right" || this.singleDatePicker)) {
                H += '<th class="next available"><i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i></th>'
            } else {
                H += "<th></th>"
            }
            H += "</tr>";
            H += "<tr>";
            if (this.showWeekNumbers) {
                H += '<th class="week">' + this.locale.weekLabel + "</th>"
            }
            d.each(this.locale.daysOfWeek, function (m, i) {
                H += "<th>" + i + "</th>"
            });
            H += "</tr>";
            H += "</thead>";
            H += "<tbody>";
            if (this.endDate == null && this.dateLimit) {
                var S = this.startDate.clone().add(this.dateLimit).endOf("day");
                if (!s || S.isBefore(s)) {
                    s = S
                }
            }
            for (var w = 0; w < 6; w++) {
                H += "<tr>";
                if (this.showWeekNumbers) {
                    H += '<td class="week">' + P[w][0].week() + "</td>"
                }
                for (var n = 0; n < 7; n++) {
                    var l = [];
                    if (P[w][n].isSame(new Date(), "day")) {
                        l.push("today")
                    }
                    if (P[w][n].isoWeekday() > 5) {
                        l.push("weekend")
                    }
                    if (P[w][n].month() != P[1][1].month()) {
                        l.push("off")
                    }
                    if (this.minDate && P[w][n].isBefore(this.minDate, "day")) {
                        l.push("off", "disabled")
                    }
                    if (s && P[w][n].isAfter(s, "day")) {
                        l.push("off", "disabled")
                    }
                    if (this.isInvalidDate(P[w][n])) {
                        l.push("off", "disabled")
                    }
                    if (P[w][n].format("YYYY-MM-DD") == this.startDate.format("YYYY-MM-DD")) {
                        l.push("active", "start-date")
                    }
                    if (this.endDate != null && P[w][n].format("YYYY-MM-DD") == this.endDate.format("YYYY-MM-DD")) {
                        l.push("active", "end-date")
                    }
                    if (this.endDate != null && P[w][n] > this.startDate && P[w][n] < this.endDate) {
                        l.push("in-range")
                    }
                    var o = "", J = false;
                    for (var R = 0; R < l.length; R++) {
                        o += l[R] + " ";
                        if (l[R] == "disabled") {
                            J = true
                        }
                    }
                    if (!J) {
                        o += "available"
                    }
                    H += '<td class="' + o.replace(/^\s+|\s+$/g, "") + '" data-title="r' + w + "c" + n + '">' + P[w][n].date() + "</td>"
                }
                H += "</tr>"
            }
            H += "</tbody>";
            H += "</table>";
            this.container.find(".calendar." + A + " .calendar-table").html(H)
        }, renderTimePicker: function (t) {
            var s, q, p, g = this.maxDate;
            if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate))) {
                g = this.startDate.clone().add(this.dateLimit)
            }
            if (t == "left") {
                q = this.startDate.clone();
                p = this.minDate
            } else {
                if (t == "right") {
                    q = this.endDate ? this.endDate.clone() : this.startDate.clone();
                    p = this.startDate
                }
            }
            s = '<select class="hourselect">';
            var h = this.timePicker24Hour ? 0 : 1;
            var n = this.timePicker24Hour ? 23 : 12;
            for (var r = h; r <= n; r++) {
                var j = r;
                if (!this.timePicker24Hour) {
                    j = q.hour() >= 12 ? (r == 12 ? 12 : r + 12) : (r == 12 ? 0 : r)
                }
                var l = q.clone().hour(j);
                var o = false;
                if (p && l.minute(59).isBefore(p)) {
                    o = true
                }
                if (g && l.minute(0).isAfter(g)) {
                    o = true
                }
                if (j == q.hour() && !o) {
                    s += '<option value="' + r + '" selected="selected">' + r + "</option>"
                } else {
                    if (o) {
                        s += '<option value="' + r + '" disabled="disabled" class="disabled">' + r + "</option>"
                    } else {
                        s += '<option value="' + r + '">' + r + "</option>"
                    }
                }
            }
            s += "</select> ";
            s += ': <select class="minuteselect">';
            for (var r = 0; r < 60; r += this.timePickerIncrement) {
                var f = r < 10 ? "0" + r : r;
                var l = q.clone().minute(r);
                var o = false;
                if (p && l.second(59).isBefore(p)) {
                    o = true
                }
                if (g && l.second(0).isAfter(g)) {
                    o = true
                }
                if (q.minute() == r && !o) {
                    s += '<option value="' + r + '" selected="selected">' + f + "</option>"
                } else {
                    if (o) {
                        s += '<option value="' + r + '" disabled="disabled" class="disabled">' + f + "</option>"
                    } else {
                        s += '<option value="' + r + '">' + f + "</option>"
                    }
                }
            }
            s += "</select> ";
            if (this.timePickerSeconds) {
                s += ': <select class="secondselect">';
                for (var r = 0; r < 60; r++) {
                    var f = r < 10 ? "0" + r : r;
                    var l = q.clone().second(r);
                    var o = false;
                    if (p && l.isBefore(p)) {
                        o = true
                    }
                    if (g && l.isAfter(g)) {
                        o = true
                    }
                    if (q.second() == r && !o) {
                        s += '<option value="' + r + '" selected="selected">' + f + "</option>"
                    } else {
                        if (o) {
                            s += '<option value="' + r + '" disabled="disabled" class="disabled">' + f + "</option>"
                        } else {
                            s += '<option value="' + r + '">' + f + "</option>"
                        }
                    }
                }
                s += "</select> "
            }
            if (!this.timePicker24Hour) {
                s += '<select class="ampmselect">';
                var k = "";
                var m = "";
                if (p && q.clone().hour(12).minute(0).second(0).isBefore(p)) {
                    k = ' disabled="disabled" class="disabled"'
                }
                if (g && q.clone().hour(0).minute(0).second(0).isAfter(g)) {
                    m = ' disabled="disabled" class="disabled"'
                }
                if (q.hour() >= 12) {
                    s += '<option value="AM"' + k + '>AM</option><option value="PM" selected="selected"' + m + ">PM</option>"
                } else {
                    s += '<option value="AM" selected="selected"' + k + '>AM</option><option value="PM"' + m + ">PM</option>"
                }
                s += "</select>"
            }
            this.container.find(".calendar." + t + " .calendar-time div").html(s)
        }, updateFormInputs: function () {
            if (this.container.find("input[name=daterangepicker_start]").is(":focus") || this.container.find("input[name=daterangepicker_end]").is(":focus")) {
                return
            }
            this.container.find("input[name=daterangepicker_start]").val(this.startDate.format(this.locale.format));
            if (this.endDate) {
                this.container.find("input[name=daterangepicker_end]").val(this.endDate.format(this.locale.format))
            }
            if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
                this.container.find("button.applyBtn").removeAttr("disabled")
            } else {
                this.container.find("button.applyBtn").attr("disabled", "disabled")
            }
        }, move: function () {
            var f = {top: 0, left: 0}, h;
            var g = d(window).width();
            if (!this.parentEl.is("body")) {
                f = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                g = this.parentEl[0].clientWidth + this.parentEl.offset().left
            }
            if (this.drops == "up") {
                h = this.element.offset().top - this.container.outerHeight() - f.top
            } else {
                h = this.element.offset().top + this.element.outerHeight() - f.top
            }
            this.container[this.drops == "up" ? "addClass" : "removeClass"]("dropup");
            if (this.opens == "left") {
                this.container.css({
                    top: h,
                    right: g - this.element.offset().left - this.element.outerWidth(),
                    left: "auto"
                });
                if (this.container.offset().left < 0) {
                    this.container.css({right: "auto", left: 9})
                }
            } else {
                if (this.opens == "center") {
                    this.container.css({
                        top: h,
                        left: this.element.offset().left - f.left + this.element.outerWidth() / 2 - this.container.outerWidth() / 2,
                        right: "auto"
                    });
                    if (this.container.offset().left < 0) {
                        this.container.css({right: "auto", left: 9})
                    }
                } else {
                    this.container.css({top: h, left: this.element.offset().left - f.left, right: "auto"});
                    if (this.container.offset().left + this.container.outerWidth() > d(window).width()) {
                        this.container.css({left: "auto", right: 0})
                    }
                }
            }
        }, show: function (f) {
            if (this.isShowing) {
                return
            }
            this._outsideClickProxy = d.proxy(function (g) {
                this.outsideClick(g)
            }, this);
            d(document).on("mousedown.daterangepicker", this._outsideClickProxy).on("touchend.daterangepicker", this._outsideClickProxy).on("click.daterangepicker", "[data-toggle=dropdown]", this._outsideClickProxy).on("focusin.daterangepicker", this._outsideClickProxy);
            d(window).on("resize.daterangepicker", d.proxy(function (g) {
                this.move(g)
            }, this));
            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger("show.daterangepicker", this);
            this.isShowing = true
        }, hide: function (f) {
            if (!this.isShowing) {
                return
            }
            if (!this.endDate) {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone()
            }
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) {
                this.callback(this.startDate, this.endDate, this.chosenLabel)
            }
            this.updateElement();
            d(document).off(".daterangepicker");
            d(window).off(".daterangepicker");
            this.container.hide();
            this.element.trigger("hide.daterangepicker", this);
            this.isShowing = false
        }, toggle: function (f) {
            if (this.isShowing) {
                this.hide()
            } else {
                this.show()
            }
        }, outsideClick: function (g) {
            var f = d(g.target);
            if (g.type == "focusin" || f.closest(this.element).length || f.closest(this.container).length || f.closest(".calendar-table").length) {
                return
            }
            this.hide()
        }, showCalendars: function () {
            this.container.addClass("show-calendar");
            this.move();
            this.element.trigger("showCalendar.daterangepicker", this)
        }, hideCalendars: function () {
            this.container.removeClass("show-calendar");
            this.element.trigger("hideCalendar.daterangepicker", this)
        }, hoverRange: function (h) {
            if (this.container.find("input[name=daterangepicker_start]").is(":focus") || this.container.find("input[name=daterangepicker_end]").is(":focus")) {
                return
            }
            var f = h.target.innerHTML;
            if (f == this.locale.customRangeLabel) {
                this.updateView()
            } else {
                var g = this.ranges[f];
                this.container.find("input[name=daterangepicker_start]").val(g[0].format(this.locale.format));
                this.container.find("input[name=daterangepicker_end]").val(g[1].format(this.locale.format))
            }
        }, clickRange: function (h) {
            var f = h.target.innerHTML;
            this.chosenLabel = f;
            if (f == this.locale.customRangeLabel) {
                this.showCalendars()
            } else {
                var g = this.ranges[f];
                this.startDate = g[0];
                this.endDate = g[1];
                if (!this.timePicker) {
                    this.startDate.startOf("day");
                    this.endDate.endOf("day")
                }
                this.hideCalendars();
                this.clickApply()
            }
        }, clickPrev: function (g) {
            var f = d(g.target).parents(".calendar");
            if (f.hasClass("left")) {
                this.leftCalendar.month.subtract(1, "month");
                if (this.linkedCalendars) {
                    this.rightCalendar.month.subtract(1, "month")
                }
            } else {
                this.rightCalendar.month.subtract(1, "month")
            }
            this.updateCalendars()
        }, clickNext: function (g) {
            var f = d(g.target).parents(".calendar");
            if (f.hasClass("left")) {
                this.leftCalendar.month.add(1, "month")
            } else {
                this.rightCalendar.month.add(1, "month");
                if (this.linkedCalendars) {
                    this.leftCalendar.month.add(1, "month")
                }
            }
            this.updateCalendars()
        }, hoverDate: function (k) {
            if (this.container.find("input[name=daterangepicker_start]").is(":focus") || this.container.find("input[name=daterangepicker_end]").is(":focus")) {
                return
            }
            if (!d(k.target).hasClass("available")) {
                return
            }
            var m = d(k.target).attr("data-title");
            var n = m.substr(1, 1);
            var h = m.substr(3, 1);
            var f = d(k.target).parents(".calendar");
            var i = f.hasClass("left") ? this.leftCalendar.calendar[n][h] : this.rightCalendar.calendar[n][h];
            if (this.endDate) {
                this.container.find("input[name=daterangepicker_start]").val(i.format(this.locale.format))
            } else {
                this.container.find("input[name=daterangepicker_end]").val(i.format(this.locale.format))
            }
            var j = this.leftCalendar;
            var l = this.rightCalendar;
            var g = this.startDate;
            if (!this.endDate) {
                this.container.find(".calendar td").each(function (p, q) {
                    if (d(q).hasClass("week")) {
                        return
                    }
                    var u = d(q).attr("data-title");
                    var t = u.substr(1, 1);
                    var o = u.substr(3, 1);
                    var s = d(q).parents(".calendar");
                    var r = s.hasClass("left") ? j.calendar[t][o] : l.calendar[t][o];
                    if (r.isAfter(g) && r.isBefore(i)) {
                        d(q).addClass("in-range")
                    } else {
                        d(q).removeClass("in-range")
                    }
                })
            }
        }, clickDate: function (l) {
            if (!d(l.target).hasClass("available")) {
                return
            }
            var n = d(l.target).attr("data-title");
            var o = n.substr(1, 1);
            var h = n.substr(3, 1);
            var f = d(l.target).parents(".calendar");
            var i = f.hasClass("left") ? this.leftCalendar.calendar[o][h] : this.rightCalendar.calendar[o][h];
            if (this.endDate || i.isBefore(this.startDate)) {
                if (this.timePicker) {
                    var k = parseInt(this.container.find(".left .hourselect").val(), 10);
                    if (!this.timePicker24Hour) {
                        var m = f.find(".ampmselect").val();
                        if (m === "PM" && k < 12) {
                            k += 12
                        }
                        if (m === "AM" && k === 12) {
                            k = 0
                        }
                    }
                    var j = parseInt(this.container.find(".left .minuteselect").val(), 10);
                    var g = this.timePickerSeconds ? parseInt(this.container.find(".left .secondselect").val(), 10) : 0;
                    i = i.clone().hour(k).minute(j).second(g)
                }
                this.endDate = null;
                this.setStartDate(i.clone())
            } else {
                if (this.timePicker) {
                    var k = parseInt(this.container.find(".right .hourselect").val(), 10);
                    if (!this.timePicker24Hour) {
                        var m = this.container.find(".right .ampmselect").val();
                        if (m === "PM" && k < 12) {
                            k += 12
                        }
                        if (m === "AM" && k === 12) {
                            k = 0
                        }
                    }
                    var j = parseInt(this.container.find(".right .minuteselect").val(), 10);
                    var g = this.timePickerSeconds ? parseInt(this.container.find(".right .secondselect").val(), 10) : 0;
                    i = i.clone().hour(k).minute(j).second(g)
                }
                this.setEndDate(i.clone());
                if (this.autoApply) {
                    this.clickApply()
                }
            }
            if (this.singleDatePicker) {
                this.setEndDate(this.startDate);
                if (!this.timePicker) {
                    this.clickApply()
                }
            }
            this.updateView()
        }, clickApply: function (f) {
            this.hide();
            this.element.trigger("apply.daterangepicker", this)
        }, clickCancel: function (f) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            this.element.trigger("cancel.daterangepicker", this)
        }, monthOrYearChanged: function (i) {
            var k = d(i.target).closest(".calendar").hasClass("left"), j = k ? "left" : "right", h = this.container.find(".calendar." + j);
            var g = parseInt(h.find(".monthselect").val(), 10);
            var f = h.find(".yearselect").val();
            if (!k) {
                if (f < this.startDate.year() || (f == this.startDate.year() && g < this.startDate.month())) {
                    g = this.startDate.month();
                    f = this.startDate.year()
                }
            }
            if (this.minDate) {
                if (f < this.minDate.year() || (f == this.minDate.year() && g < this.minDate.month())) {
                    g = this.minDate.month();
                    f = this.minDate.year()
                }
            }
            if (this.maxDate) {
                if (f > this.maxDate.year() || (f == this.maxDate.year() && g > this.maxDate.month())) {
                    g = this.maxDate.month();
                    f = this.maxDate.year()
                }
            }
            if (k) {
                this.leftCalendar.month.month(g).year(f);
                if (this.linkedCalendars) {
                    this.rightCalendar.month = this.leftCalendar.month.clone().add(1, "month")
                }
            } else {
                this.rightCalendar.month.month(g).year(f);
                if (this.linkedCalendars) {
                    this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, "month")
                }
            }
            this.updateCalendars()
        }, timeChanged: function (l) {
            var f = d(l.target).closest(".calendar"), n = f.hasClass("left");
            var k = parseInt(f.find(".hourselect").val(), 10);
            var i = parseInt(f.find(".minuteselect").val(), 10);
            var h = this.timePickerSeconds ? parseInt(f.find(".secondselect").val(), 10) : 0;
            if (!this.timePicker24Hour) {
                var m = f.find(".ampmselect").val();
                if (m === "PM" && k < 12) {
                    k += 12
                }
                if (m === "AM" && k === 12) {
                    k = 0
                }
            }
            if (n) {
                var g = this.startDate.clone();
                g.hour(k);
                g.minute(i);
                g.second(h);
                this.setStartDate(g);
                if (this.singleDatePicker) {
                    this.endDate = this.startDate.clone()
                } else {
                    if (this.endDate && this.endDate.format("YYYY-MM-DD") == g.format("YYYY-MM-DD") && this.endDate.isBefore(g)) {
                        this.setEndDate(g.clone())
                    }
                }
            } else {
                if (this.endDate) {
                    var j = this.endDate.clone();
                    j.hour(k);
                    j.minute(i);
                    j.second(h);
                    this.setEndDate(j)
                }
            }
            this.updateCalendars();
            this.updateFormInputs();
            this.renderTimePicker("left");
            this.renderTimePicker("right")
        }, formInputsChanged: function (h) {
            var g = d(h.target).closest(".calendar").hasClass("right");
            var i = e(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
            var f = e(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);
            if (i.isValid() && f.isValid()) {
                if (g && f.isBefore(i)) {
                    i = f.clone()
                }
                this.setStartDate(i);
                this.setEndDate(f);
                if (g) {
                    this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format))
                } else {
                    this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format))
                }
            }
            this.updateCalendars();
            if (this.timePicker) {
                this.renderTimePicker("left");
                this.renderTimePicker("right")
            }
        }, elementChanged: function () {
            if (!this.element.is("input")) {
                return
            }
            if (!this.element.val().length) {
                return
            }
            if (this.element.val().length < this.locale.format.length) {
                return
            }
            var g = this.element.val().split(this.locale.separator), h = null, f = null;
            if (g.length === 2) {
                h = e(g[0], this.locale.format);
                f = e(g[1], this.locale.format)
            }
            if (this.singleDatePicker || h === null || f === null) {
                h = e(this.element.val(), this.locale.format);
                f = h
            }
            if (!h.isValid() || !f.isValid()) {
                return
            }
            this.setStartDate(h);
            this.setEndDate(f);
            this.updateView()
        }, keydown: function (f) {
            if ((f.keyCode === 9) || (f.keyCode === 13)) {
                this.hide()
            }
        }, updateElement: function () {
            if (this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                this.element.trigger("change")
            } else {
                if (this.element.is("input") && this.autoUpdateInput) {
                    this.element.val(this.startDate.format(this.locale.format));
                    this.element.trigger("change")
                }
            }
        }, remove: function () {
            this.container.remove();
            this.element.off(".daterangepicker");
            this.element.removeData()
        }
    };
    d.fn.daterangepicker = function (f, g) {
        this.each(function () {
            var h = d(this);
            if (h.data("daterangepicker")) {
                h.data("daterangepicker").remove()
            }
            h.data("daterangepicker", new a(h, f, g))
        });
        return this
    }
}));