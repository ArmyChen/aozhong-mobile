/**
 * Game
 *
 * LICENSE
 *
 * Enter license...
 *
 * @category	mootools
 * @package		rewrite
 * @copyright	Game workgroup copyright (c)
 * @author		Game Team.
 * @license		
 *
 */

/**
 * Enter description...
 *
 * @package		Form
 * @subpackage	Form.Validator
 * @author		Mark.Yao
 * @requires
 	Core
	More
 */
(function(){
	
	Form.Validator.implement({
		'options': {
			'warningPrefix'	: '',
			'errorPrefix'	: '',
			'ignoreHidden'	: false,
			'serial'		: false
		}
	});
	
	function _requiredEntry(element)
	{
		return Form.Validator.getValidator('required').test(element);
	}
	
	//Adds validators:
	function _testAccount(element)
	{
		var value	= element.get('value').trim();
		return Form.Validator.getValidator('IsEmpty').test(element) || 
			(/^[a-z0-9]{1}\w*[a-z0-9]{1}$/i).test(value) || 
			(/^[a-z0-9\u4E00-\u9FA5]{1}[\w\u4E00-\u9FA5]*[a-z0-9\u4E00-\u9FA5]{1}$/i).test(value);
	}
	
	function _testCode(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || (/^[a-z]+[a-z0-9_]+$/i).test(element.get('value').trim());
	}
	
	function _testPassword(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || !(/^\s+|\s+$/).test(element.get('value'));
	}
	
	function _testConfirmPassword(element, props)
	{
		return Form.Validator.getValidator('validate-match').test(element, props);
	}
	
	function _testDomain(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || (/^(?:[A-Z0-9][A-Z0-9_-]*)(?:\.[A-Z0-9][A-Z0-9_-]*)+$/i).test(element.get('value').trim());
	}
	
	function _testNumber(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || (/^[0-9]+$/g).test(element.get('value').trim());
	}
	
	function _testGreaterThanZero(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || element.get('value') > 0;
	}
	
	function _testGreaterOrEqualZero(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || element.get('value') >= 0;
	}
	
	function _testGreaterOrEqualCustom(element, props)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || element.get('value') >= props.customValue;
	}
	
	function _testLessThanOne(element)
	{
		return Form.Validator.getValidator('IsEmpty').test(element) || element.get('value') < 1;
	}
	
	function _testSecondDomain(element)
	{
		if(true == Form.Validator.getValidator('IsEmpty').test(element)){
			return true;
		}
		var value	= element.get('value').trim();
		if(false == (/[a-z]+/i).test(value)){
			return false;
		}
		return (/^[a-z0-9]+[a-z0-9_]+$/i).test(value);
	}
	
	Form.Validator.addAllThese([
		['required-entry', {
			'errorMsg'	: Form.Validator.getMsg.pass('required'),
			'test'		: _requiredEntry
		}],
		
		['validate-account', {
			'errorMsg'	: Form.Validator.getMsg.pass('account'),
			'test'		: _testAccount
		}],
		
		['validate-code', {
			'errorMsg'	: Form.Validator.getMsg.pass('code'),
			'test'		: _testCode
		}],
		
		['validate-password', {
			'errorMsg'	: Form.Validator.getMsg.pass('password'),
			'test'		: _testPassword
		}],
		
		['validate-cpassword', {
			'errorMsg'	: Form.Validator.getMsg.pass('cpassword'),
			'test'		: _testConfirmPassword
		}],
		
		['validate-domain', {
			'errorMsg'	: Form.Validator.getMsg.pass('domain'),
			'test'		: _testDomain
		}],
		
		['validate-number', {
			'errorMsg'	: Form.Validator.getMsg.pass('number'),
			'test'		: _testNumber
		}],
		
		['greater-than-zero', {
			'errorMsg'	: Form.Validator.getMsg.pass('greaterThanZero'),
			'test'		: _testGreaterThanZero
		}],
		
		['greater-or-equal-zero', {
			'errorMsg'	: Form.Validator.getMsg.pass('greaterOrEqualZero'),
			'test'		: _testGreaterOrEqualZero
		}],
		
		['greater-or-equal-custom', {
			'errorMsg'	: function(element, props){
				return Form.Validator.getMsg('greaterOrEqualCustom').substitute({customValue: props.customValue});
			},
			'test'		: _testGreaterOrEqualCustom
		}],
		
		['less-than-one', {
			'errorMsg'	: Form.Validator.getMsg.pass('lessThanOne'),
			'test'		: _testLessThanOne
		}],
		['validate-second-domain', {
			'errorMsg'	: Form.Validator.getMsg.pass('secondDomain'),
			'test'		: _testSecondDomain
		}]
	]);
	
	/*
	function _insertAdvice(advice, field)
	{
		var props = field.get('validatorProps');
		if (!props.msgPos || !document.id(props.msgPos)){
			field.getParent().appendChild(advice);
		} else {
			document.id(props.msgPos).grab(advice);
		}
	}
	
	Form.Validator.Inline.implement({
		'insertAdvice': _insertAdvice
	});
	*/
})();

/**
 * Enter description...
 *
 * @category	mootools
 * @package		rewrite.httprequest
 * @author		Mark.Yao
 * @requires
 	Core
	mootools/Request.js
	rewrite/MaskLoader.js
 */
(function(){
	/**
	 * @constructor
	　*/
	function _HttpRequest(options)
	{
		if(!HttpRequest.maskObject){
			HttpRequest.maskObject	= new MaskLoader($('html-body').getElement('.wrapper'));
		}
		var me	= this;
		me.mask	= HttpRequest.maskObject;
		options.url	= options.url + (options.url.match(new RegExp('\\?')) ? '&ajax=true' : '?ajax=true');
		me.setOptions(options);
	}
	
	/**
	 * @param String|Object params Request parameters.
	 */
	function _sendRequest(params)
	{
		var me	= this;
		var requestType	= me.options.requestType.toLowerCase(),
			_request;
		delete me.options.requestType;
		switch(requestType){
			case 'json':
				_request	= new Request.JSON(me.options);
				break;
			case 'jsonp':
				_request	= new Request.JSONP(me.options);
				break;
			default:
				_request	= new Request.HTML(me.options);
		}
		/**
		 * Adds events:
		 */
		_request.addEvents({
			'request'	: me.onRequest.bind(me),
			'complete'	: me.onComplete.bind(me),
			'failure'	: me.onFailure.bind(me),
			'error'		: me.onError.bind(me)
		});
		try{
			_request.send({data: params});
		}catch(e){
			if(debugEnabled()){
				window.console.debug(e.getMessage());
			}
		}
		return me;
	}
	
	/**
	 * onRequest event.
	 */
	function _onRequest()
	{
		var me	= this;
		me.mask.show();
	}
	
	/**
	 * onComplete event.
	 */
	function _onComplete()
	{
		var me	= this;
		me.mask.hide();
	}
	
	function _onFailure(xhr)
	{
		if(debugEnabled()){
			window.console.debug(xhr.responseText);
		}
		var me	= this;
		me.mask.hide();
	}
	
	function _onError(text)
	{
		if(debugEnabled()){
			window.console.debug(text);
		}
		var me	= this;
		me.mask.hide();
	}
	
	var HttpRequest = this.HttpRequest = new Class({
		Implements	: Options,
		options		: {
			'url'		: '',
			data		: '',
			method		: 'post',
			'update'	: false,
			'apend'		: false,
			requestType	: 'html'
		},
		'onRequest'	: _onRequest,
		'onComplete': _onComplete,
		'onFailure'	: _onFailure,
		'onError'	: _onError,
		/**
		 * @var MaskLoader
		 */
		'mask'		: false,
		initialize	: _HttpRequest,
		send		: _sendRequest,
		
		'CLASS_NAME'	: 'HttpRequest'
	});
})();

/**
 * Enter description...
 *
 * @category	mootools
 * @package		rewrite.maskloader
 * @author		Mark.Yao
 * @requires
 	Core
	mootools/Mask.js
 */
(function(){
	var MaskLoader = this.MaskLoader = new Class({
		Extends:	Mask,
		initialize:	function(target, options){
			options		= options||{};
			if(!options.inject){
				options.inject	= {
					'where'		: 'inside',
					'target'	: document.body
				};
			}
			this.parent(target, options);
		},
		render: function(){
			var me	= this;
			me.element	= $('loading-mask');
			me.hidden	= true;
			me.element.addClass(me.options['class']);
		},
		
		'Class_Name'	: 'MaskLoader'
	});
})();
