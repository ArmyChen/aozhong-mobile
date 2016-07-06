/**
 * Game
 *
 * LICENSE
 *
 * Enter license...
 *
 * @category	widget
 * @package		form
 * @copyright	Game workgroup copyright (c)
 * @author		Game Team.
 * @license		
 *
 */

/**
 * @category	widget
 * @package		form
 * @subpackage	form.captcha
 * @author		Mark.Yao
 * @requires
 	Core
 */
(function(){
	/**
	 * @constructor
	 */
	function _Captcha(captchaUrl, formId)
	{
		var me	= this;
		me._captchaUrl	= captchaUrl;
		me._formId		= formId;
	}
	
	function _refresh(element)
	{
		var me	= this;
		if(element){
			element.addClass('refreshing');
		}
		(new Request.JSON({
			'url'		: me._captchaUrl,
			'onSuccess'	: function(json, responseText){
				if(element){
					element.removeClass('refreshing');
				}
				if(!json.error && json.imgSrc){
					$(me._formId).src	= json.imgSrc;
				}
			},
			'onFailure'	: function(xhr){
				if(debugEnabled()){
					window.console.debug(xhr.responseText);
				}
			},
			'onError'	: function(text){
				if(debugEnabled()){
					window.console.debug(text);
				}
			}
		})).post({'formId': me._formId});
		return me;
	}
	
	this.Captcha = Form.Captcha = new Class({
		/**
		 * @var String
		 */
		'_captchaUrl': null,
		
		/**
		 * @var String
		 */
		'_formId': null,
		
		'initialize'	: _Captcha,
		'refresh'		: _refresh,
		'CLASS_NAME'	: 'Captcha'
	});
})();
