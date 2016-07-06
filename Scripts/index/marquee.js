/**
 * Marquee
 *
 * LICENSE
 *
 * @category	Marquee
 * @package		Marquee
 * @copyright	Copyright (c)
 * @author		Dong
 * @license		
 */
var marquee = new Class({
    speed       : 30,       //滚动速度    
    exterior    : null,     //外围容器
    run         : null,     //滚动容器
    content     : null,     //内容容器
    children    : 'span',   //内容子级标签

    _contentFormerWidth : 0,    //内容初始宽度
    _contentWidth : 0,          //内容加量后宽度

    init: function () {
        if (this.exterior && this.run && this.content && this.content.innerHTML.trim().length != 0) {
            this.addcontent();
            var exterior = this.exterior,
            speed = this.speed,
            contentFormerWidth = this._contentFormerWidth;
            function move() {
                if(exterior.scrollLeft > contentFormerWidth){
                    exterior.scrollLeft = 1;
                }else{
                    exterior.scrollLeft++;
                }
            };
            var moveTime = setInterval(move,this.speed);
            this.exterior.onmouseover   = function(){clearInterval(moveTime)} ;
            this.exterior.onmouseout    = function(){moveTime=setInterval(move,speed)} ;
        }else{
            return false;
        }
    },

    addcontent: function () {
        var exteriorWidth   = this.exterior.getStyle('width').toInt(); 
        var runWidth        = 0; 
        var html            = "";
        var addhtml         = "";
        var contentWidth    = 0;
        children = this.children;
        this.content.getChildren(children).each(function (el) {
            if (runWidth < exteriorWidth) {
                runWidth = runWidth + el.getStyle('width').toInt() + 60;
                addhtml  = addhtml + "<"+ children +"><a href='"+ el.get('url') +"'>" + el.innerHTML + "</a></" + children + ">";
            }
            contentWidth = contentWidth + el.getStyle('width').toInt() + 60;
            html = html + "<"+ children +"><a href='"+ el.get('url') +"'>" + el.innerHTML + "</a></" + children + ">";
        });

        this._contentFormerWidth = contentWidth;
        contentWidth            += runWidth;
        html += addhtml;
       
        while(contentWidth < exteriorWidth * 2){
            contentWidth        += runWidth;
            html                += addhtml;
        }
        this._contentWidth     = contentWidth;
        this.run.innerHTML     = html;
        return this;
    }
});