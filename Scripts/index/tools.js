/**
 * Javascript Tools
 *
 * LICENSE
 *
 * Includes this script, when used mootools javascript framework.
 * Compatible with Prototype JS.
 *
 * @category	js
 * @package		js
 * @copyright	Copyright (c)
 * @author		Mark.Yao
 * @license		
 */

/**
 * Window dialog.
 *
 * @category	window
 * @package		window
 * @author		Mark.Yao
 * @requires
 */
(function(){
	/**
	 * String _getDialogFeatures(options)
	 *
	 * @param Object options
	 * @return String
	 * @type String
	 */
	function _getDialogFeatures(options)
	{
		var newOptions	= {};
		newOptions["dialogWidth"]	= options["dialogWidth"]||window.screen.width/2;
		newOptions["dialogHeight"]	= options["dialogHeight"]||window.screen.height/2;
		newOptions["center"]		= 1;
		if(!Object.isUndefined(options['center'])){
			newOptions["center"]		= options["center"];
		}
		if(!Object.isUndefined(options['dialogTop'])){
			newOptions["dialogTop"]		= options["dialogTop"];
		}
		if(!Object.isUndefined(options['dialogLeft'])){
			newOptions["dialogLeft"]	= options["dialogLeft"];
		}
		if(!Object.isUndefined(options['resizable'])){
			newOptions["resizable"]		= options["resizable"];
		}
		if(!Object.isUndefined(options['scroll'])){
			newOptions["scroll"]		= options["scroll"];
		}
		if(!Object.isUndefined(options['toolbar'])){
			newOptions["toolbar"]		= options["toolbar"];
		}
		options		= null;
		if(newOptions["center"] === 1 || newOptions["center"] === "yes" || newOptions["center"] === "on"){
			var screenWidth		= window.screen.width,
				screenHeight	= window.screen.height;
			newOptions['dialogTop']		= ((screenHeight - newOptions['dialogHeight']) / 4).floor();
			newOptions['dialogLeft']	= ((screenWidth - newOptions['dialogWidth']) / 2).floor() +'px';
		}
		if(!Object.isUndefined(newOptions['dialogWidth'])){
			newOptions['dialogWidth']		+= 'px';
		}
		if(!Object.isUndefined(newOptions['dialogHeight'])){
			newOptions['dialogHeight']		+= 'px';
		}
		if(!Object.isUndefined(newOptions['dialogTop'])){
			newOptions['dialogTop']		+= 'px';
		}
		if(!Object.isUndefined(newOptions['dialogLeft'])){
			newOptions['dialogLeft']		+= 'px';
		}
		var features	= [];
		for(var name in newOptions){
			features.push(name +'='+ newOptions[name]);
		}
		features	= features.join(';');
		return features;
	}
	
	/**
	 * Destroy subwindow
	 *
	 * void _destroySubwindow()
	 *
	 * @return void
	 */
	function _destroySubwindow()
	{
		var me	= window;
		if(me.popupWindow && !me.popupWindow.closed){
			me.popupWindow.opener.focus();
			me.popupWindow.opener	= null;
			me.popupWindow.close();
		}
		me.popupWindow	= null;
	}
	
	/**
	 * Converts the options to the features of method: window.open
	 *
	 * String _toOpenFeatures(options)
	 *
	 * @param String|Object options Optional
	 * @return String
	 * @type String
	 */
	function _toOpenFeatures(options){
		var newOptions	= [];
		if(!Object.isString(options)){
			options		= _getDialogFeatures(options);
		}
		options.split(';').each(function(param){
			if('' === param){
				return;
			}
			var _param	= param.split('=');
			switch(_param[0]){
				case "dialogWidth":
					param	= "width="+ _param[1];
					break;
				case "dialogHeight":
					param	= "height="+ _param[1];
					break;
				case "dialogTop":
					param	= "top="+ _param[1];
					break;
				case "dialogLeft":
					param	= "left="+ _param[1];
					break;
				case "scroll":
					param	= "scrollbars="+ _param[1];
					break;
			}
			newOptions.push(param);
		});
		return newOptions.join(',');
	}
	
	/**
	 * void _showDialog(url, target, options, replace)
	 *
	 * @param String url
	 * @param String|Object target
	 * @param String|Object options Optional, sea: _getDialogFeatures()
	 * @param Boolean replace Optional
	 * @return void
	 */
	function _showDialog(url, target, options, replace)
	{
		options		= options||{};
		replace		= Object.isUndefined(replace) ? true : replace;
		var me		= window;
		if(me.popupWindow && !me.popupWindow.closed){
			me.popupWindow.focus();
			try{
				me.popupWindow.location.replace(url);
			}catch(e){//捕捉请求URL时窗口没有响应的异常(仅对IE)
				me.destroy();
			}
		}
		if(!me.popupWindow || me.popupWindow.closed){
			me.popupWindow	= window.open(url, target, _toOpenFeatures(options), replace);
		}
		if(!me.popupWindow.opener){
			me.popupWindow.opener	= window;
		}
		me.popupWindow.opener	= null;
		me.popupWindow			= null;
	}
	
	window.destroySubwindow	= _destroySubwindow;
	window.showDialog		= _showDialog;
	
	if(!window.showModalDialog){
		function _showModalDialog(url, args, options){
			window.showDialog(url, "_blank", options, true);
		}
		window.showModalDialog	= _showModalDialog;
	}
})();

function firebugEnabled()
{
	if(window.console && window.console.firebug){
		return true;
	}
	return false;
}

function debugEnabled()
{
	if(window.console && window.console.debug){
		return true;
	}
	return false;
}

function setLocation(url)
{
	window.location.href	= url;
}

/**
 * @return false
 */
function deleteConfirm(message, url)
{
	if(confirm(message)){
		setLocation(url);
	}
	return false;
}

function hideElement(element)
{
	element	= $(element);
	element.setStyle('display', 'none');
}

function hideElements(expression, parent)
{
	if(!parent){
		parent	= document;
	}
	parent.getElements(expression).each(hideElement);
}

function showElement(element)
{
	element	= $(element);
	element.removeClass('no-display');
	element.setStyle('display', '');
}

function showElements(expression, parent)
{
	if(!parent){
		parent	= document;
	}
	parent.getElements(expression).each(showElement);
}

function disableElement(element)
{
	element	= $(element);
	element.disabled	= true;
	element.addClassName('disabled');
}

function enableElement(element)
{
	element	= $(element);
	element.disabled	= false;
	element.removeClassName('disabled');
}

function disableElements(search)
{
	$$('.' + search).each(disableElement);
}

function enableElements(search)
{
	$$('.' + search).each(enableElement);
}
