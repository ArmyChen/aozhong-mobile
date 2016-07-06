
var error = function (element, tag) {
    var errorElementid = "error-id-" + element.attr("id");
    var _this = this;
    _this.show = function (text) {
        element.Warning();
        element.after($('<div id="' + errorElementid + '" name="error-name-' + element.attr("id") + '" class="validation-advice" style="display: block;">' + text + '</div>'));
    };

    _this.clear = function () {
        element.Pass();
        $("div[name='error-name-" + element.attr("id") + "']").remove();
        //$("#" + errorElementid).remove();
        return _this;
    };
}
CheckStrongPass = function (obj) {
    var password = $(obj).val();
    var strength = 0;
    if (password.length >= 10) {
        if (password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@@#$%^&*_?])/)) {
            strength = 3;
        } else if (password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[~!@@#$%^&*_?])/)) {
            strength = 2;
        } else if (password.match(/(?=.*\d)(?=.*[a-z])/)) {
            strength = 1;
        }
    } else if (password.length >= 6) {
        if (password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[~!@@#$%^&*_?])/)) {
            strength = 2;
        } else if (password.match(/(?=.*\d)(?=.*[a-z])|(?=.*[A-Z])/)) {
            strength = 1;
        }
    }
    for (var i = 0; i < strength; i++) {
        $("#meter-box_" + obj.id + " i").eq(i).addClass("green");
    }
}
//用户账号
FormVerify_account = function () {
    var _element = $("#account");
    var err = new error(_element).clear();

    if (_element.val() == "") {
        err.show("这是必须的。");
        return false;
    }

    var reg = /^[a-zA-Z0-9_\u4e00-]+$/;
    if (!reg.test(_element.val())) {
        err.show("由字母、数字、下划线的组合！");
        return false;
    }

    return true;
}
//真实姓名
FormVerify_truename = function () {
    var _element = $("#truename");
    var err = new error(_element).clear();

    if (_element.val() == "") {
        err.show("这是必须的。");
        return false;
    }

    if (/[u4e00-u9fa5]+/.test(_element.val())) {
        err.show("真实姓名只能为中文。");
        return false;
    }

    return true;

}
//密码
FormVerify_passWord = function () {
    var password = $("#password");
    var err = new error(password).clear();

    if (password.val() == "") {
        err.show("这是必须的。");
        return false;
    }

    if (password.val().length < 6) {
        err.show("登陆密码不能少于6位。");
        return false;
    }

    return true;
}
//确认密码
FormVerify_passWord2 = function () {
    var password = $("#password");
    var password1 = $("#password1");
    var err = new error(password1).clear();
    if (password1.val() == "") {
        err.show("这是必须的。");
        return false;
    }


    if (password.val() != password1.val()) {
        err.show("两次输入的密码不一致。");
        return false;
    }

    return true;
}

//保险柜密码
FormVerify_InsurePassWord = function () {
    var insurePassWord = $("#InsurePassWord");
    var err = new error(insurePassWord).clear();

    if (insurePassWord.val() == "") {
        err.show("这是必须的。");
        return false;
    }
  
    if (insurePassWord.val().length < 6) {
        err.show("保险柜密码不能少于6位。");
        return false;
    }

    return true;
}

FormVerify_InsurePassWord2 = function ()
{
    var insurePassWord = $("#InsurePassWord");
    var insurePassWord1 = $("#InsurePassWord1");
    var err = new error(insurePassWord1).clear();

    if (insurePassWord1.val() == "") {
        err.show("这是必须的。");
        return false;
    }
    
    if (insurePassWord.val() != insurePassWord1.val()) {
        err.show("两次输入的密码不一致。");
        return false;
    }

    return true;
}

//验证邮箱
FormVerify_Email = function () {
    var _element = $("#emailtext");
    var _elementVal = _element.val();
    var err = new error(_element).clear();

    if (_elementVal == "") {
        err.show("这是必须的。");
        return false;
    } 

    var reg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
    if (!reg.test(_elementVal)) {
        err.show("请输入一个有效的邮箱地址（格式：admin@example.com）。。");
        return false;
    }

    return true;
}

//验证手机号
FormVerify_Tel = function () {
    var _element = $("#telText");
    var _elementVal = _element.val();
    var err = new error(_element).clear();

    if (_elementVal == "") {
        err.show("这是必须的。");
        return false;
    }
 

    if (isNaN(_elementVal)) {
        err.show("手机号格式不正确。");
        return false;
    }
    
   
    if (_elementVal.length != 11) {
        err.show("请输入11位手机号。");
        return false;
    }
    return true;
}
//QQ
FormVerify_QQ = function () {
    var _element = $("#telQQ");
    var _elementVal = _element.val();
    var err = new error(_element).clear();


    if (_elementVal == "") {
        err.show("这是必须的。");
        return false;
    }   

    if (isNaN(_elementVal)) {
        err.show("QQ号格式不正确。");
        return false;
    }
   
    return true;
}
//验证码
FormVerify_VCode = function () {
    var _element = $("#vcodetext");
    var err = new error(_element).clear();

    if (_element.val() == "") {
        err.show("这是必须的。");
        return false;
    }
    return true;
}


SubmitForm = function () {
    if (!FormVerify_account()) return false;
    if (!FormVerify_passWord()) return false;
    if (!FormVerify_InsurePassWord()) return false;
    if (!FormVerify_VCode()) return false;
}
