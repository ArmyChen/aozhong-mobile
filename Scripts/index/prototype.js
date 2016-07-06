/**
 * Prototype
 *
 * LICENSE
 *
 * Includes this script, when used mootools javascript framework.
 * Compatible with Prototype JS.
 *
 * @category	Prototype
 * @package		Prototype
 * @copyright	Copyright (c) 2014
 * @author		Mark.Yao
 * @license		
 */

var $break	= {};

/**
 * Attachs methods to document object 
 *
 * @category	Prototype
 * @package		document
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	
	var _origId		= document.id;
	Document.implement('id', function(el){
		el	= Object.isString(el) ? document.getElementById(el) : el;
		var args	= Array.from(arguments);
		args.shift();
		args.unshift(el);
		return _origId.apply(document, args);
	});
	
	/**
	 * void _onReady(handler)
	 *
	 * @param Function handler Callback function
	 */
	function _onReady(handler)
	{
		document.addEvent('domready', handler);
	}
	
	/**
	 * void _onDestroy(handler)
	 *
	 * @param Function handler Callback function
	 */
	function _onDestroy(handler)
	{
		window.addListener('unload', handler);
	}
	
	Object.append(document, {
		'onReady'	: _onReady,
		'onDestroy'	: _onDestroy
	});
})();

/**
 * Error prototype
 *
 * @category	Prototype
 * @package		Error
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	function _getMessage()
	{
		var me	= this;
		if(Object.isString(me)){
			return me;
		}
		if(Object.isString(me.description)){
			return me.name +': '+ me.description;
		}
		return me.name +': '+ me.message;
	}
	
	Error.implement({
		'getMessage': _getMessage
	});
})();

/**
 * Event prototype
 *
 * @category	Prototype
 * @package		Event
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	if(typeof Event === 'undefined'){
		this.Event = {};
	}
	
	/**
	 * Add an event handler to HTMLElement
	 * 
	 * @param HTMLElement element
	 * @param String eventName
	 * @param Function handler Callback function
	 * @return HTMLElement
	 */
	function _addListener(element, eventName, handler)
	{
		element	= $(element);
		element.addListener.apply(element, Array.slice(arguments, 1));
		return element;
	}
	
	/**
	 * Removes an event handler in the specified element
	 *
	 * @param HTMLElement element
	 * @param String eventName
	 * @param Function handler Removes the method from the event
	 * @return HTMLElement
	 */
	function _removeListener(element, eventName, handler)
	{
		element = $(element);
		element.removeListener.apply(element, Array.slice(arguments, 1));
		return element;
	}
	
	/**
	 * @return Element Returns firing event object.
	 */
	function _getElement(event)
	{
		if(!(event instanceof DOMEvent)){
			event	= new DOMEvent(event);
		}
		return event.target;
	}
	
	/**
	 * @return Element Returns firing event specified object.
	 */
	function _findElement(event, expression)
	{
		var element	= Event.getElement(event);
		if(!expression) return element;
		while(element){
			if(Object.isElement(element) && element.match(expression)){
				return element;
			}
			element	= element.getParent();
		}
	}
	
	function _stop(event)
	{
		if(!(event instanceof DOMEvent)){
			event	= new DOMEvent(event);
		}
		event.stop();
	}
	
	function _returnEventKeys()
	{
		return {
			KEY_BACKSPACE	: 8,
			KEY_TAB			: 9,
			KEY_RETURN		: 13,
			KEY_ESC			: 27,
			KEY_LEFT		: 37,
			KEY_UP			: 38,
			KEY_RIGHT		: 39,
			KEY_DOWN		: 40,
			KEY_DELETE		: 46,
			KEY_HOME		: 36,
			KEY_END			: 35,
			KEY_PAGEUP		: 33,
			KEY_PAGEDOWN	: 34,
			KEY_INSERT		: 45
		};
	}
	
	Object.append(Event, {
		'addListener'	: _addListener,
		'removeListener': _removeListener,
		'getElement'	: _getElement,
		// Compatible with prototype JS:
		'observe'		: _addListener,
		'element'		: _getElement,
		'findElement'	: _findElement,
		'stop'			: _stop
	}, _returnEventKeys());
})();

/**
 * Object prototype
 *
 * @category	Prototype
 * @package		Object
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){

	function _isElement(object)
	{
		return object && object.nodeType === 1;
	}

	function _isArray(object)
	{
		return object && object.constructor === Array;
	}

	function _isFunction(object)
	{
		return typeof object === 'function';
	}

	function _isString(object)
	{
		return typeof object === 'string';
	}

	function _isNumber(object)
	{
		return typeof object === 'number';
	}

	function _isUndefined(object)
	{
		return typeof object === 'undefined';
	}
	
	/**
	 * Generates a query string, reads INPUT, SELECT and TEXTAREA element in specified layer element.
	 * Supports `Elements` data type.
	 *
	 * @param Element|Elements element
	 * @return	String
	 * @type	String
	 */
	function _serializeFormElements(element)
	{
		if(Object.isElement(element) || Object.isString(element)){
			return $(element).toQueryString();
		}
		var queryString	= '',
			elements	= element;
		elements.each(function(element){
			var _queryString	= element.toQueryString();
			if(!_queryString) return;
			queryString	+= (queryString != '' ? '&' : '') + _queryString;
		});
		return queryString;
	}
	
	/**
	 * Generates a query hash, reads INPUT, SELECT and TEXTAREA element in specified layer element.
	 * Supports `Elements` data type.
	 *
	 * @param Element|Elements element
	 * @return	JSON
	 * @type	JSON
	 */
	function _unserializeFormElements(element)
	{
		if(Object.isElement(element) || Object.isString(element)){
			return $(element).toQueryString().parseQuery();
		}
		var queryString	= '',
			elements	= element;
		elements.each(function(element){
			var _queryString	= element.toQueryString();
			if(!_queryString) return;
			queryString	+= (queryString != '' ? '&' : '') + _queryString;
		});
		return queryString.parseQuery();
	}
	
	Object.append(Object, {
		'isElement'		: _isElement,
		'isArray'		: _isArray,
		'isFunction'	: _isFunction,
		'isString'		: _isString,
		'isNumber'		: _isNumber,
		'isUndefined'	: _isUndefined,
		'serializeFormElements'		: _serializeFormElements,
		'unserializeFormElements'	: _unserializeFormElements
	});
})();

/**
 * String prototype
 *
 * @category	Prototype
 * @package		String
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 	mootools/String.js
 */
(function(){
	String.alias({'parseQuery': 'parseQueryString'});
})();

/**
 * Array prototype
 *
 * @category	Prototype
 * @package		Array
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	function _size()
	{
		return this.length;	
	}
	
	function _first()
	{
		return this[0];
	}
	
	function _last()
	{
		return this[this.size()-1];
	}
	
	function _clear()
	{
		return this.empty();
		
		this.length		= 0;
		return this;
	}
	
	/**
	 * Object inject(memo, iterator, scope)
	 *
	 * @param Object memo
	 * @param Function iterator
	 * @param Object scope
	 * @return Object
	 */
	function _inject(memo, iterator, scope)
	{
		this.each(function(value, index){
			memo = iterator.call(scope, memo, value, index);
		});
		return memo;
	}
	
	Array.implement({
		'size'		: _size,
		'first'		: _first,
		'last'		: _last,
		'clear'		: _clear
		//'inject'	: _inject
	});
})();

/**
 * Date prototype
 *
 * @category	Prototype
 * @package		Date
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	function _getDaysInMonth()
	{
		return Date.daysInMonth(this.getMonth(), this.getFullYear());
	}
	
	/**
	 * @return Boolean
	 */
	function _equalTo(date)
	{
		var me	= this;
		return date.getFullYear() == me.getFullYear()
			&& date.getMonth() == me.getMonth()
			&& date.getDate() == me.getDate();
	}
	
	Date.alias({'getDaysInMonth' : 'daysInMonth'});
	Date.implement({
		'getDaysInMonth'	: _getDaysInMonth,
		'equalTo'		: _equalTo
	});
})();

/**
 * Function prototype
 *
 * @category	Prototype
 * @package		Function
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	var _slice	= Array.prototype.slice;
	
	function _bindAsEventListener(object)
	{
		var _method	= this,
			args	= _slice.apply(arguments, [1]);
		return function(event){
			return _method.apply(object, [event || window.event].concat(args));
		};
	}
	
	function _methodize()
	{
		if(this._methodized) return this._methodized;
		var me	= this;
		return this._methodized = function(){
			return me.apply(null, [this].concat(Array.from(arguments)));
		};
	}
	
	Function.implement({
		'bindAsEventListener'	: _bindAsEventListener,
		'methodize'				: _methodize
	});
})();

/**
 * Element prototype
 *
 * @category	Prototype
 * @package		Error
 * @author		Mark.Yao
 * @requires
 	mootools-core.js
 */
(function(){
	
	function _remove(element)
	{
		element	= $(element);
		return element.dispose();
	}
	
	/**
	 * @return Element|null Returns null, if not found.
	 */
	function _up(element, expression, index)
	{
		element	= $(element);
		if(arguments.length == 1){
			return element.getParent();
		}
		
		if(Object.isNumber(expression)){
			index		= expression;
			expression	= false;
		}else if(false == Object.isNumber(index)){
			index	= 0;
		}
		if(index == 0){
			return expression ? element.getParent(expression) : element.getParent();
		}
		if(!expression) expression	= '*';
		var parents	= element.getParents(expression);
		if(parents && parents[index]){
			return parents[index];
		}
		return null;
	}
	
	/**
	 * @return Element|null Returns null, if not found.
	 */
	function _down(element, expression, index)
	{
		element	= $(element);
		if(arguments.length == 1){
			return $(element.getFirst());
		}
		
		if(Object.isNumber(expression)){
			index		= expression;
			expression	= false;
		}else if(false == Object.isNumber(index)){
			index	= 0;
		}
		if(index == 0){
			return expression ? element.getElement(expression) : element.getFirst();
		}
		if(!expression) expression	= '*';
		var descendants	= element.getElements(expression);
		if(descendants && descendants[index]){
			return descendants[index];
		}
		return null;
	}
	
	/**
	 * @return Element|null Returns null, if not found.
	 */
	function _previous(element, expression, index)
	{
		element	= $(element);
		if(arguments.length == 1){
			return $(element.getPrevious());
		}
		
		if(Object.isNumber(expression)){
			index		= expression;
			expression	= false;
		}else if(false == Object.isNumber(index)){
			index	= 0;
		}
		if(index == 0){
			return expression ? element.getPrevious(expression) : element.getPrevious();
		}
		if(!expression) expression	= '*';
		var previousElements	= element.getAllPrevious(expression);
		if(previousElements && previousElements[index]){
			return previousElements[index];
		}
		return null;
	}
	
	/**
	 * @return Element|null Returns null, if not found.
	 */
	function _next(element, expression, index)
	{
		element	= $(element);
		if(arguments.length == 1){
			return $(element.getNext());
		}
		
		if(Object.isNumber(expression)){
			index		= expression;
			expression	= false;
		}else if(false == Object.isNumber(index)){
			index	= 0;
		}
		if(index == 0){
			return expression ? element.getNext(expression) : element.getNext();
		}
		if(!expression) expression	= '*';
		var nexts	= element.getAllNext(expression);
		if(nexts && nexts[index]){
			return nexts[index];
		}
		return null;
	}
	
	function _hasClassName(element, className)
	{
		element	= $(element);
		return element.hasClass(className);
	}
	
	function _addClassName(element, className)
	{
		element	= $(element);
		return element.addClass(className);
	}
	
	function _removeClassName(element, className)
	{
		element	= $(element);
		return element.removeClass(className);
	}
	
	function _toggleClassName(element, className)
	{
		element	= $(element);
		return element.toggleClass(className);
	}
	
	function _select(element, expression)
	{
		element	= $(element);
		var args	= Array.slice(arguments, 1);
		var _expression	= '';
		args.each(function(arg){
			_expression	+= (_expression === '' ? '' : ', ') + arg;
		});
		expression	= _expression;
		return element.getElements(expression);
	}
	
	function _update(element, content)
	{
		element	= $(element);
		if(false == Object.isString(content) && false == Object.isNumber(content)){
			element.innerHTML	= '';
			element.appendChild(content);
			return element;
		}
		element.set('html', content);
		return element;
	}
	
	function _insert(element, where)
	{
		element	= $(element);
		return element.grab(element, where);
	}
	
	/**
	 * @return JSON Value: {0: offset left, 1: offset top}
	 */
	function _cumulativeOffset(element)
	{
		element	= $(element);
		var offsets	= element.getOffsets();
		offsets[0]	= offsets.x;
		offsets[1]	= offsets.y;
		return offsets;
	}
	
	Element.alias({observe: 'addListener'});
	Element.extend({
		'remove'	: _remove,
		'up'		: _up,
		'down'		: _down,
		'previous'	: _previous,
		'next'		: _next,
		'hasClassName'		: _hasClassName,
		'addClassName'		: _addClassName,
		'removeClassName'	: _removeClassName,
		'toggleClassName'	: _toggleClassName,
		'select'			: _select,
		'update'			: _update,
		'cumulativeOffset'	: _cumulativeOffset
	});
	Element.implement({
		'remove'	: _remove.methodize(),
		'up'		: _up.methodize(),
		'down'		: _down.methodize(),
		'previous'	: _previous.methodize(),
		'next'		: _next.methodize(),
		'hasClassName'		: _hasClassName.methodize(),
		'addClassName'		: _addClassName.methodize(),
		'removeClassName'	: _removeClassName.methodize(),
		'toggleClassName'	: _toggleClassName.methodize(),
		'select'			: _select.methodize(),
		'update'			: _update.methodize(),
		'cumulativeOffset'	: _cumulativeOffset.methodize()
	});
})();
