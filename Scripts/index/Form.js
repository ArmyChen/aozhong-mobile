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
 * Enter description...
 *
 * @category	widget
 * @package		form
 * @subpackage	form.password
 * @author		Mark.Yao
 * @requires
 	Core
 */
(function(){
	/**
	 * @constructor
	 * @param String|HtmlInputElement|Array elements
	 */
	function _PasswordMeter(elements)
	{
		var me	= this;
		me._initEvents(elements);
	}
	
	/**
	 * @private
	 * @param String|HtmlInputElement|Array elements
	 */
	function _initEvents(elements)
	{
		if(false == Object.isArray(elements)){
			elements	= [elements];
		}
		var me	= this;
		elements.each(function(element){
			$(element).addEvent((Browser.ie?'keyup':'input'), me._updateMeter.bind(me));
		});
	}
	
	/**
	 * @private
	 */
	function _updateMeter(event)
	{
		var me	= this,
			field	= event.target;
		var meter	= field.getParent('.row').getElement('.strength-meter');
		if(meter.getElement('.strength-bar')){
			var strength	= me._getStrengthIndex(field.value);
			
		}else{
			var strength	= me._getStrengthLevel(field.value);
			meter.getElement('.meter-box').getElements('*').each(function(elem, index){
				if(index < strength){
					elem.addClass('green');
					return;
				}
				elem.removeClass('green');
			});
		}
	}
	
	/**
	 * @private
	 * @param string password Password field value.
	 */
	function _getStrengthIndex(password)
	{
		var strength	= 0,
			passwordLength	= password.length;
		strength		+= passwordLength;
		if(passwordLength > 0 && passwordLength <= 3){
			strength	+= passwordLength;
		}else if(passwordLength > 3 && passwordLength <= 6){
			strength	+= 7;
		}else if(passwordLength > 6 && passwordLength <= 15){
			strength	+= 12;
		}else if(passwordLength >= 16){
			strength	+= 18;
		}
		
		if(password.match(/[a-z]/)){
			strength	+= 1;
		}
		if(password.match(/[\d]/)){
			strength	+= 1;
		}
		if(password.match(/[A-Z]/)){
			strength	+= 5;
		}
		if(password.match(/[~!@#$%^&*_?]/)){
			strength	+= 5;
		}
		if(password.match(/.*[~!@#$%^&*_?].*[~!@#$%^&*_?]/)){
			strength	+= 5;
		}
		if(password.match(/(?=.*[a-z])(?=.*[A-Z])/)){
			strength	+= 2;
		}
		if(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)){
			strength	+= 2;
		}
		if(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_?])/)){
			strength	+= 2;
		}
		
		return strength;
	}
	
	/**
	 * @private
	 * @param string password Password field value.
	 */
	function _getStrengthLevel(password)
	{
		var strength	= 0;
		if(password.length >= 10){
			if(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_?])/)){
				strength	= 3;
			}else if(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[~!@#$%^&*_?])/)){
				strength	= 2;
			}else if(password.match(/(?=.*\d)(?=.*[a-z])/)){
				strength	= 1;
			}
		}else if(password.length >= 6){
			if(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[~!@#$%^&*_?])/)){
				strength	= 2;
			}else if(password.match(/(?=.*\d)(?=.*[a-z])|(?=.*[A-Z])/)){
				strength	= 1;
			}
		}
		
		return strength;
	}
	
	Form.PasswordMeter	= new Class({
		
		'initialize'		: _PasswordMeter,
		'_initEvents'		: _initEvents,
		'_updateMeter'		: _updateMeter,
		'_getStrengthIndex'	: _getStrengthIndex,
		'_getStrengthLevel'	: _getStrengthLevel,
		
		'CLASS_NAME'	: 'Form.PasswordMeter'
	});
})();

/**
 * Enter description...
 *
 * @category	widget
 * @package		form
 * @subpackage	form.validation
 * @author		Mark.Yao
 * @requires
 	Core
 	More
 */
(function(){
	/**
	 * @private
	 */
	function _isBody(element)
	{
		return (/^(?:body|html)$/i).test(element.tagName);
	}
	
	/**
	 * @constructor
	 */
	function _Validation(frm)
	{
		var me	= this;
		me._validator	= new Form.Validator.Inline(frm, {
			'onElementFail'	: me.setErrorToStatusBar.bind(me)
		});
		me._validator.getFields().each(function(field){
			field.addEvent('change', me.setChangeToStatusBar.bind(me, field));
		});
	}
	
	/**
	 * @destructor
	 */
	function _destroy()
	{
		var me	= this;
		me._validator	= null;
	}
	
	/**
	 * @return HTMLFormElement
	 */
	function _toElement()
	{
		return this._validator.toElement();
	}
	
	/**
	 * @return Form.Validator
	 */
	function _getValidator()
	{
		return this._validator;
	}
	
	/**
	 * Submits form.
	 *
	 * @return bool
	 */
	function _submit()
	{
		var me	= this;
		if(true == me._waiting){
			return false;
		}
		me.fireEvent('formSubmit', [me.toElement()]);
		if(me._validator && me._validator.validate()){
			me._waiting		= true;
			me.toElement().submit();
			return true;
		}
		return false;
	}
	
	/**
	 * Resets form.
	 */
	function _reset()
	{
		this.toElement().reset();
	}
	
	/**
	 * @private
	 * @return HTMLElement
	 */
	function _getStatusBarFromField(field)
	{
		if(false == this.isLoadStatusBar()){
			return false;
		}
		var statusBar	= field.retrieve('status_bar');
		if(null === statusBar){
			var parentNode	= field.parentNode;
			field.store('status_bar', false);
			while(parentNode && !_isBody(parentNode)){
				if(parentNode.statusBar){
					statusBar	= parentNode.statusBar;
					field.store('status_bar', parentNode.statusBar);
					break;
				}
				parentNode	= parentNode.parentNode;
			}
		}
		return statusBar;
	}
	
	/**
	 * Event method: Sets this changed to status bar.
	 *
	 * @return void
	 */
	function _setChangeToStatusBar(field)
	{
		if(field.hasClass('no-changes')) return;
		
		var statusBar	= this._getStatusBarFromField(field);
		if(statusBar) statusBar.addClass('changed');
	}
	
	/**
	 * Sets this error to status bar.
	 *
	 * @private
	 * @return void
	 */
	function _setErrorToStatusBar(field)
	{
		var statusBar	= this._getStatusBarFromField(field);
		if(statusBar) statusBar.addClass('error');
	}
	
	/**
	 * Temp method.
	 */
	function _isLoadStatusBar()
	{
		var me	= this;
		if(Object.isUndefined(me._loadStatusBar)){
			me._loadStatusBar	= arguments.length > 0 ? arguments[0] : true;
		}
		return me._loadStatusBar;
	}
	
	Form.Validation	= new Class({
		Implements: [Events],
		
		/**
		 * @var Form.Validator
		 */
		'_validator'	: null,
		_waiting		: false,
		
		'initialize'	: _Validation,
		'destroy'		: _destroy,
		'toElement'		: _toElement,
		'getValidator'	: _getValidator,
		'submit'		: _submit,
		'reset'			: _reset,
		/**
		 * Private methods:
		 */
		'_getStatusBarFromField': _getStatusBarFromField,
		'setChangeToStatusBar'	: _setChangeToStatusBar,
		'setErrorToStatusBar'	: _setErrorToStatusBar,
		'isLoadStatusBar'		: _isLoadStatusBar,
		
		'CLASS_NAME'	: 'Form.Validation'
	});
})();
