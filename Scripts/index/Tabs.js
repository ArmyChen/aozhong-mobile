/**
 * Game
 *
 * LICENSE
 *
 * Enter license...
 *
 * @category	widget
 * @package		tabs
 * @copyright	Game workgroup copyright (c)
 * @author		Game Team.
 * @license		
 *
 */

/**
 * Enter description...
 *
 * @category	widget
 * @package		tabs
 * @author		Mark.Yao
 * @requires
 	Core
 	widget/SlideShow
 */
(function(){
	SlideShow.defineTransitions({
		none: function(data){
			data.previous.hide();
			data.next.show();
			return this;
		}
	});
	
	/**
	 * @constructor
	 * @param String|HTMLElement element Container ID.
	 * @param JSON options
	 */
	function _Tabs(element, options)
	{
		var me	= this;
		me.parent(element, options);
		
		me.bound	= { 'tabClick': me.tabClick.bind(me) };
		me.navs		= me.toElement().getElements(me.options.tabSelector);
		me.addEvent('show', function(data){
			me.navs[data.previous.index].removeClass('current');
			me.navs[data.next.index].addClass('current');
		});
		me.attachEvent();
		
		var activeTab	= $(options.activeTabId);
		if(activeTab){
			activeTab.removeClass('current');
			activeTab.addClass('current');
			me.show(me.navs.indexOf(activeTab));
		}
		activeTab	= null;
		
		/**
		 * Appends tab card to dest element.
		 */
		me.destElement	= $(me.options.destElementId);
		if(me.destElement){
			me.navs.each(function(tab){
				var tabCard	= me.getCard(tab);
				tabCard.statusBar	= tab.getFirst();
				tab.cardMoved	= true;
				me.destElement.appendChild(tabCard);
			});
		}
		window.addEvent('load', me.moveCardToDest.bind(me));
	}
	
	/**
	 * Event method.
	 */
	function _tabClick(event)
	{
		var me	= this,
			nav	= event.target;
		if(false == me.navs.contains(nav)){
			nav	= me.navs.contains(nav.getParent()) ? nav.getParent() : nav.getParent().getParent();
		}
		if(me.navs.contains(nav)){
			event.preventDefault();
			me.show(me.navs.indexOf(nav));
		}
	}
	
	function _attachEvent()
	{
		var me	= this;
		me.toElement().addEvent('click', me.bound.tabClick);
		return me;
	}
	
	function _detachEvent()
	{
		var me	= this;
		me.toElement().removeEvent('click', me.bound.tabClick);
		return me;
	}
	
	/**
	 * @param HTMLElement tab
	 * @return HTMLElement
	 */
	function _getCard(tab)
	{
		return $(tab.id +'_card');
	}
	
	/**
	 * Event method: Binds load event of window.
	 */
	function _moveCardToDest()
	{
		var me	= this;
		me.destElement	= $(me.options.destElementId);
		if(!me.destElement){
			return ;
		}
		me.navs.each(function(tab){
			if(tab.cardMoved){
				return ;
			}
			var tabCard	= me.getCard(tab);
			tabCard.statusBar	= tab.getFirst();
			me.destElement.appendChild(tabCard);
		});
	}
	
	this.Tabs = new Class({
	
		'Extends': SlideShow,
	
		'options': {
			selector	: '.tab-card',
			tabSelector	: '> li.tab',
			transition	: 'none',
			duration	: 0,
			
			/**
			 * HTMLElement ID
			 *
			 * @var string
			 */
			'destElementId': null,
			
			/**
			 * HTMLElement ID
			 *
			 * @var string
			 */
			'activeTabId'	: null
		},
	
		'initialize'	: _Tabs,
		'tabClick'		: _tabClick,
		'attachEvent'	: _attachEvent,
		'detachEvent'	: _detachEvent,
		'getCard'		: _getCard,
		'moveCardToDest'	: _moveCardToDest,
		
		'CLASS_NAME': 'Tabs'
	});
})();
