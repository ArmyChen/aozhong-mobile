(function ($) {
    Pagination = function (pageElement) {
        var that = this;
        $("#fmyPage").val(1);

        that.selectLimits = [20, 30, 50, 100, 200];
        that.pElement = pageElement;


        that.selectOptionStr = new String();
        for (var i = 0; i < that.selectLimits.length; i++) {
            _r = that.selectLimits[i];
            that.selectOptionStr += "<option value = '" + _r + "'>" + _r + "</option>";
        }


        that.arrow_leftoff = "/Images/pager_arrow_left_off.gif";
        that.arrow_left = "/Images/pager_arrow_left.gif";
        that.arrow_right_off = "/Images/pager_arrow_right_off.gif";
        that.arrow_right = "/Images/pager_arrow_right.gif";

        that.FmyPageElement = $("<input />").attr("type", "hidden");
        that.pElement.append(that.FmyPageElement)
        that.currentPage = function () {
            this.get = function () {
                return parseInt(that.FmyPageElement.val()) || 1;
            }

            this.set = function (value) {
                that.FmyPageElement.val(value);
            }
        }        
       
        //that.SelectPageLimitElement = $("<select />").attr({ name: "limit", id: "limit_select" }).html(that.selectOptionStr);
    }

    Pagination.prototype =
    {
        Bind: function (data, event, tableid,parms) {
            var _this = this;
            var _currpage = new _this.currentPage();
            var _curr = _currpage.get();
            var _previousPageElement = $("<img />").attr({ class: "arrow" }).unbind("click");
            var _nextPageElement = $("<img />").attr({ class: "arrow" }).unbind("click");
            var _inputPageingElement = $("<input />").attr({ type: "text", name: "page", class: "ye", value: new _this.currentPage().get() }).blur(function () {
                var thisinput = $(this);
                var tval = thisinput.val();
                var _pcount = parseInt(data.PageCount, 10);
                if (tval == "")
                    thisinput.val(data.Page);
                else if (parseInt(tval) > _pcount)
                    thisinput.val(_pcount);
                else if (parseInt(tval) <= 0)
                    thisinput.val(1);

                _currpage.set(thisinput.val());
                event(parms);
            });
            
            _this.SelectPageLimitElement = $("<select />").attr({ name: "limit", id: "limit_select" }).html(_this.selectOptionStr).val(data.PageSize).change(function () {
                _currpage.set(1);
                event(parms);
            });
           



            if (_curr <= 1) {
                _previousPageElement.attr("src", _this.arrow_leftoff);
            }
            else {
                _previousPageElement.attr("src", _this.arrow_left);
                _previousPageElement.on("click", function () {
                    _currpage.set(--_curr)
                    event(parms);
                });
            }

            if (_curr < data.PageCount) {
                _nextPageElement.attr("src", _this.arrow_right);
                _nextPageElement.on("click", function () {
                    _currpage.set(++_curr)
                    event(parms);
                });
            }
            else {
                _nextPageElement.attr("src", _this.arrow_right_off);
            }         
            _this.pElement.html("第").append(_inputPageingElement).append("页，共 " + data.PageCount + " 页	")
          .append("| 查看")
          .append(_this.SelectPageLimitElement)
          .append(" 条 / 每页<span >|</span> 共 " + data.Counts + " 条记录	<span id='reportGrid-total-count' class='no-display'>" + data.Counts + "</span>");
        },
        pageIndex: function () {
            return new this.currentPage().get();
        },
        pageSize: function () {
            var _limitSelect = $("#limit_select");
            var _rVlaue = this.selectLimits[0];
            if (_limitSelect.length != 0) {
                _rVlaue = _limitSelect.val() == "" ? that.selectLimits[0] : parseInt(_limitSelect.val());
            }
            return _rVlaue;
        }
        
    }
    TrEvents = function (thisObj) {
        var thistr = $(thisObj);
        thistr.addClass("active");
        thistr.siblings().removeClass("active");
    }
    window.page = Pagination;
})(jQuery);