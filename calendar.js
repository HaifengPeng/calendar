(function( $ ) {
	var _curDate = new Date();
	var _showingDate = {year: _curDate.getFullYear(), month: _curDate.getMonth(), day: _curDate.getDate()};
	var _daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    $.fn.Calendar = function( options ) {
    	var defaults = {
    		lang: 'zh',
			year: _showingDate.year,
			month: _showingDate.month,
			day: null
    	}
    	
		/*是否闰年*/
	 	var _isLeapYear = function() {
	 		return (0 == _showingDate.year % 4  &&  (_showingDate.year % 100 != 0)  ||  (_showingDate.year % 400 == 0));
		}
		/*是否合法月份(0-11)*/
		var _isValidMonth = function( month ) {
			return (!isNaN(month) && month >=0 && month <=11);
		}
		/*是否合法年份(1970至今，四位）*/
		var _isValidYear = function( year ) {
			return (!isNaN(year) && year >= 1970 && year <=9000);
		}
		/*前一个月(0-11)*/
		var _preMonth = function ( curMonth ) {
			var preMonth = curMonth - 1 < 0 ? 11 : curMonth - 1;
			return preMonth;
		}
		/*前一个月(0-11)有年份*/
		var _preMonthYear = function ( curYear, curMonth ) {
			if (curMonth - 1 < 0) {
				return {year: curYear - 1, month: 11};
			}
			return {year: curYear, month: curMonth - 1};
		}
		/*下一个月(0-11)*/
		var _nextMonth = function( curMonth ) {
			var nextMonth = curMonth + 1 > 11 ? 0 : curMonth + 1;
		}
		/*下一个月(0-11)有年份*/
		var _nextMonthYear = function ( curYear, curMonth ) {
			if (curMonth + 1 > 11) {
				return {year: curYear + 1, month: 0};
			}
			return {year: curYear, month: curMonth + 1};
		}
		
		if(options.month) options.month -= 1;//月份参数传1~12
		if (options.lang == 'en') {
			options.monthTag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			options.weekTag = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"]
		} else {
			options.monthTag = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
			options.weekTag = ["一", "二", "三", "四", "五", "六", "日"];
		}
		
    	var settings = $.extend( {}, defaults, options );
    	settings.year = _isValidYear(settings.year) ? settings.year : _curDate.getFullYear();
        settings.month = _isValidMonth(settings.month) ? settings.month : _curDate.getMonth();
    	var $self = $(this);
    	var $dayCell = $("<div class='day-cell' />");

    	/* 绘制日历 */
	    function draw() {
	    	var i;
	    	var $topBar = $("<div class='top-bar' />");
	    	var $monthAndYear = $("<span class='month-year' />");
	    	var $monthPanel = $("<div class='month-panel' />").append("<div class='close-wrap'><b class='close'>&#215;</b></div>");

	    	var $yearPanel = $("<div class='year-panel' />").append("<div class='close-wrap'><b class='pre-yearpage'>Pre</b><b class='next-yearpage'>Next</b><b class='close'>&#215;</b></div><div class='years-wrap'></>");
    		var $weekTag = $("<div class='week-tag' />");
    		
	    	/*顶栏*/
	    	for (i = 0; i < settings.monthTag.length; i++) {
	    		$monthPanel.append($("<a href='#'/>").text(settings.monthTag[i]).attr("data-month", i));
	    		if (i == settings.month) {
	    			$monthAndYear.append($("<b class='year' />").text(settings.year))
	    						 .append($("<b class='month' />").text(settings.monthTag[i]).attr("data-month", i));                    
	    		}
	    	}
	    	$topBar.append($("<span class='pre-month' />"))
	    	       .append($monthAndYear)
	    	       .append($("<span class='next-month' />"))
	    	       .append($monthPanel)
	    	       .append($yearPanel);

	    	/*星期标题栏*/
	    	for (i = 0; i < settings.weekTag.length; i++) {
	    		$weekTag.append($("<span />").text(settings.weekTag[i]));
	    	}
	    	$self.append($topBar)
	    	     .append($weekTag);

	    	$self.append($dayCell);
	    	draw_daycell(settings.year, settings.month);
	    };

	    /*绘制月的每日*/
	    function draw_daycell( year, month) {
	    	year = _isValidYear(year) ? year : _curDate.getFullYear();
	        month = _isValidMonth(month) ? month : _curDate.getMonth();
	        _showingDate.year = year;
	        _showingDate.month = month;
	        if (_isLeapYear()) {
		    	_daysOfMonths[1] = 29; //闰年
		    } else {
				_daysOfMonths[1] = 28;
			}

	        var $dayCell_temp = $("<div />");

	        /*用上月填充空白*/
	        var date = new Date(year, month);
	        var week = date.getDay();
	        if (week == 0) week = 7;
	        week = week - 1;
	        for (i = _daysOfMonths[_preMonth(month)] - week + 1; i <= _daysOfMonths[_preMonth(month)]; i++) {
	        	$dayCell_temp.append($("<span class='no-day'/>").text(i));
	        }
	        /*当月*/
	        for (i = 1; i <= _daysOfMonths[month]; i++) {
				var $tempSpan = $("<span class='day'/>").text(i);
	        	if (i == settings.day) {
	        		$tempSpan.addClass("selected");
	        	}
				if (i == _curDate.getDate() && month == _curDate.getMonth()) {
					$tempSpan.addClass("today");
				}
				$dayCell_temp.append($tempSpan);
	        }
	        /*用下月填充空白*/
	        var _postOutDays = Math.ceil($dayCell_temp.find("span").length / 7) * 7 - $dayCell_temp.find("span").length;
	        for (i = 1; i <= _postOutDays; i ++) {
	        	$dayCell_temp.append($("<span class='no-day'/>").text(i));
	        }
	        $dayCell.html($dayCell_temp);
	    }

	    /*绘制月份选择列表*/
	    function draw_months() {
	    	$_monthPanel = $self.find(".month-panel");
	    	if ($_monthPanel.find("a").length == 0) {
	    		for (i = 0; i < settings.monthTag.length; i++) {
		    		$_monthPanel.append($("<a href='#'/>").text(settings.monthTag[i]).attr("data-month", i));
		    	}
	    	}
	    	$_monthPanel.height($self.height());
	    }

	    /*绘制年份选择列表*/
	    function draw_years(flag) {
	    	var $years_wrap = $self.find(".year-panel .years-wrap");
	    	var _startYears;
	    	if (flag == "pre") {
	    		_startYears = parseInt($years_wrap.find("a:first").text());
	    	} else if (flag == "next") {
	    		_startYears = parseInt($years_wrap.find("a:last").text());
	    	} else {
	    		_startYears = _curDate.getFullYear();
	    	}
	    	_startYears = _startYears - 10;
	    	if (_startYears < 1900) _startYears = 1900;
	    	if (_startYears >= 9000) _startYears = 9000;
	    	var _endYears = _startYears + 18;

	    	var _years = "";
	    	for (var i = _startYears; i < _endYears; i++) {
	    		_years = _years + ("<a href='#'>" + i + "</a>");
	    	}
	    	$self.find(".year-panel").height($self.height());
	    	$years_wrap.html(_years);
	    }

	    function bind_events() {
	    	//var _on = $.fn.on || $.fn.delegate;
	    	var $month = $self.find(".month");
	    	var $monthPanel = $self.find(".month-panel");
	    	var $year = $self.find(".year");
    		var $yearPanel = $self.find(".year-panel");

	    	$self.on("click", ".pre-month", function(evt) {
	    		/*前一个月箭头*/
	    		var _tempMonth = parseInt($month.attr("data-month"));
    			var _tempyear = parseInt($year.text());
	    		var _tempPreMonthYear = _preMonthYear(_tempyear, _tempMonth);
	    		$month.text(settings.monthTag[_tempPreMonthYear.month]).attr("data-month", _tempPreMonthYear.month);
	    		$year.text(_tempPreMonthYear.year);
	    		draw_daycell(_tempPreMonthYear.year, _tempPreMonthYear.month);
	    	}).on("click", ".next-month", function(evt) {
	    		/*下一个月箭头*/
	    		var _tempMonth = parseInt($month.attr("data-month"));
    			var _tempyear = parseInt($year.text());
	    		var _tempPreMonthYear = _nextMonthYear(_tempyear, _tempMonth);
	    		$month.text(settings.monthTag[_tempPreMonthYear.month]).attr("data-month", _tempPreMonthYear.month);
	    		$year.text(_tempPreMonthYear.year);
	    		draw_daycell(_tempPreMonthYear.year, _tempPreMonthYear.month);
	    	}).on("click", ".month", function(evt) {
	    		/*月份点击弹出其选择列表*/
	    		$yearPanel.hide();
	    		draw_months();
	    		$monthPanel.show();
	    	}).on("click", ".month-panel .close", function(evt) {
	    		/*月份选择列表关闭*/
	    		$(".month-panel").hide();
	    	}).on("click", ".month-panel a", function(evt) {
	    		/*月份选择列表 选择*/
	    		evt.preventDefault();
	    		var _tempMonth = parseInt($(this).attr("data-month"));
    			var _tempyear = parseInt($year.text());
    			$month.text(settings.monthTag[_tempMonth]).attr("data-month", _tempMonth);
    			$(".month-panel").hide();
    			draw_daycell(_tempyear, _tempMonth);
	    	}).on("click", ".year", function(evt) {
	    		/*年份点击弹出其选择列表*/
	    		$monthPanel.hide();
    			draw_years();
	    		$yearPanel.show();
	    	}).on("click", ".year-panel .close", function(evt) {
	    		/*年份选择列表关闭*/
	    		$(".year-panel").hide();
	    	}).on("click", ".year-panel a", function(evt) {
	    		/*年份选择列表 选择*/
	    		evt.preventDefault();
	    		var _tempMonth = parseInt($month.attr("data-month"));
    			var _tempyear = parseInt($(this).text());
    			$year.text(_tempyear);
    			$(".year-panel").hide();
    			draw_daycell(_tempyear, _tempMonth);
	    	}).on("click", ".year-panel .pre-yearpage", function(evt) {
	    		/*年份份选择列表 上一页*/
	    		draw_years("pre");
	    	}).on("click", ".year-panel .next-yearpage", function(evt) {
	    		/*年份份选择列表 下一页*/
	    		draw_years("next");
	    	});
	    }

	    draw();
	    bind_events();

	    return $self;
    };

	$.Calendar =  {
		getCurUnixTimestamp: function() {
			return Math.round(new Date(_curDate.getFullYear(), _curDate.getMonth(), _curDate.getDate()).getTime()/1000);
		},
		getCurDate: function() {
			return _curDate.getFullYear() + "-" + (_curDate.getMonth()+1) + "-" + _curDate.getDate();
		}
	}
})( jQuery );
