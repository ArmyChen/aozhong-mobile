(function () {
    var FData = function (dataMap) {
        if (dataMap === "" || dataMap === null) return "";
        var date = "";
        $.each(dataMap, function (k, v) {
            date += k + "=" + v + "&";
        });
        return date.substring(0, date.length - 1);
    }
    QueryString = function (n) {
        var t = location.href, f = t.substring(t.indexOf("?") + 1, t.length).split("&"), u = {}, r;
        for (i = 0; j = f[i]; i++)
            u[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        return r = u[n.toLowerCase()], typeof r == "undefined" ? "" : r
    }
    QueryHash = function ()
    {
        var hash = location.hash.replace(/#/, '');
        var windex = location.hash.indexOf("?");
        if (hash && windex > 0)
            hash = hash.substring(0, windex - 1);
        return hash;
    }
    $.extend({
        SendData: function (action, pdata, bSend, succe, ptype) {
            $.ajax({
                type: ptype || "POST",
                dataType: "json",
                data: FData(pdata),
                url: "/AjaxService/" + action,
                beforeSend: function () {
                    bSend && bSend();
                },
                success: function (msg) {
                    succe(msg);
                }
            });
        },
        SendDataSync: function (action, pdata, succe, ptype) {
            $.ajax({
                type: ptype || "POST",
                dataType: "json",
                data: FData(pdata),
                url: "/AjaxService/" + action,
                async: false,
                beforeSend: function () {
                },
                success: function (msg) {
                    succe(msg);
                }
            });
        },
        isUndefined: function (object) {
            return typeof object === 'undefined';
        }
    });
    $.fn.extend({
        Warning: function () {
            $(this).addClass("validation-failed");
        },
        Pass: function () {
            $(this).removeClass("validation-failed");
        },
        SetDefaultDate: function (addDay) {
            var mdate = new Date();
            var _that = $(this);
            if (!addDay)
                _that.val(mdate.getFullYear() + "-" + (mdate.getMonth() + 1) + "-" + (parseInt(mdate.getDate())));
            else
            {                
                mdate = mdate.valueOf();
                mdate = mdate + addDay * 24 * 60 * 60 * 1000;
                mdate = new Date(mdate);
                _that.val(mdate.getFullYear() + "-" + (mdate.getMonth() + 1) + "-" + (parseInt(mdate.getDate())));
            }
            return _that;
        }
    });

})();
function CheckForm(objStr, buttonObj) {
    var isSubmit = true;
    $(objStr).each(function () {
        if (isSubmit)
            isSubmit = CheckEmpty(this);
        else
            CheckEmpty(this);
    });
    if (isSubmit) {
        if (buttonObj)
            buttonObj.trigger("submit");
        else
            $("#save").trigger("submit");
    }
    return isSubmit;
}
function CheckEmpty(that, tags) {
    if (that) {
        var _that = $(that), isnotempty;
        if (_that.is(":hidden")) return true;         

        var _tags = tags || _that.nextAll("div").eq(0);       
        if (_that.val() == "") {
            _that.Warning();
            _tags.show();
            isnotempty = false;
        }
        else {
            _that.Pass();
            _tags.hide();
            isnotempty = true;
        }
        return isnotempty;
    }
    else
        return true;
}