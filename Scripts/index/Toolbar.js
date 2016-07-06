/**
 * Game
 *
 * LICENSE
 *
 * Enter license...
 *
 * @category	widget
 * @package		toolbar
 * @copyright	Game workgroup copyright (c)
 * @author		Game Team.
 * @license		
 *
 */

/**
 * Enter description...
 *
 * @category	widget
 * @package		toolbar
 * @author		Mark.Yao
 * @requires
 	Core
	widget/Toolbar/Floating
 */
(function(){
	/**
	 * @param String|HTMLElement element Container ID.
	 * @param JSON options
	 */
	function _listenFloating(element, options)
	{
		var me	= this;
		me._floating	= new Toolbar.Floating(element, options);
		return me;
	}
	
	function _removeFloating()
	{
		var me	= this;
		if(me._floating) me._floating.destroy();
		me._floating	= null;
		return me;
	}
	
	this.Toolbar = {
		/**
		 * @private
		 * @var Toolbar.Floating
		 */
		'_floating'		: null,
		
		'listenFloating'	: _listenFloating,
		'removeFloating'	: _removeFloating
	};
})();

/**
 * Enter description...
 *
 * @category	widget
 * @package		toolbar
 * @subpackage	toolbar.floating
 * @author		Mark.Yao
 * @requires
 	Core
	widget/Toolbar
 */
(function(){
	/**
	 * @constructor
	 * @param String|HTMLElement element Container ID.
	 * @param JSON options
	 */
	function _Floating(element, options)
	{
		var me	= this;
		me.element	= $(element)||document;
		me.setOptions(options);
		me.listen();
	}
	
	/**
	 * @return void
	 */
	function _destroy()
	{
		var me	= this;
		window.removeEvent('load', me._windowOnLoadEvent)
			.removeEvent('scroll', me._updateFromViewportEvent)
			.removeEvent('resize', me._updateFromViewportEvent);
		me._windowOnLoadEvent	= null;
		me._updateFromViewportEvent	= null;
	}
	
	/**
	 * @return HTMLElement
	 */
	function _toElement()
	{
		return this.element;
	}
	
	/**
	 * Initializes floating toolbar.
	 *
	 * @private
	 * @return Toolbar.Floating
	 */
	function _initToolbar()
	{
		var me	= this;
		
		me._bars	= me.element.getElements(me.options.selector);
		me._cloneBars		= [];
		me._toolbarCopy		= $(document.createElement('div'));
		document.body.appendChild(me._toolbarCopy);
		me._toolbarCopy.addClassName(me.options.floatingClassName);
		me._bars.each(function(bar, index){
			var cloneBar	= bar.cloneNode(true);
			me._toolbarCopy.appendChild(cloneBar);
			cloneBar.store('offsetTopFromEntity', (bar.getOffsets()).y)
				.store('displayed', false);
			me._cloneBars[index]	= cloneBar;
		});
		
		return me;
	}
	
	/**
	 * Starts floating toolbar.
	 *
	 * @return Toolbar.Floating
	 */
	function _start()
	{
		var me	= this;
		
		if(me._toolbarCopy){
			me._toolbarCopy.remove();
		}
		me._initToolbar()
			.update();
		
		return me;
	}
	
	/**
	 * Listens floating toolbar.
	 *
	 * @return Toolbar.Floating
	 */
	function _listen()
	{
		var me	= this;
		me._windowOnLoadEvent	= me.start.bind(me);
		me._updateFromViewportEvent	= me.update.bind(me);
		window.addEvent('load', me._windowOnLoadEvent)
			.addEvent('scroll', me._updateFromViewportEvent)
			.addEvent('resize', me._updateFromViewportEvent);
		
		return me;
	}
	
	/**
	 * Updates floating toolbars.
	 *
	 * @return Toolbar.Floating
	 */
	function _update()
	{
		var me	= this;
		if(!me._cloneBars){
			return me;
		}
		
		var cloneBars	= me._cloneBars;
			offsetTop	= (window.getScroll()).y;
		cloneBars.each(function(cloneBar, index){
			var _offsetTop	= offsetTop;
			if(cloneBar.getPrevious()){
				_offsetTop	+= cloneBar.getPrevious().getHeight();
			}
			if(_offsetTop > cloneBar.retrieve('offsetTopFromEntity')){
				cloneBar.show();
				cloneBar.store('displayed', true);
			}else{
				cloneBar.hide();
				cloneBar.store('displayed', false);
			}
		});
		var displayed	= cloneBars.some(function(cloneBar){ return cloneBar.retrieve('displayed'); });
		if(displayed){
			me._toolbarCopy.show();
		}else{
			me._toolbarCopy.hide();
		}
		
		return me;
	}
	
	Toolbar.Floating = new Class({
		
		'Implements': Options,
		
		'options': {
			'selector'	: '.toolbar',
			'floatingClassName'	: 'floating-bar'
		},
		
		/**
		 * @var HTMLElement
		 */
		'_toolbarCopy'	: null,
		
		'initialize'	: _Floating,
		'destroy'		: _destroy,
		'toElement'		: _toElement,
		'_initToolbar'	: _initToolbar,
		'start'			: _start,
		'listen'		: _listen,
		'update'		: _update,
		
		'CLASS_NAME': 'Toolbar.Floating'
	});
})();
