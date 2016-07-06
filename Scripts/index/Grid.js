/**
 * Game
 *
 * LICENSE
 *
 * Enter license...
 *
 * @category	widget
 * @package		grid
 * @copyright	Game workgroup copyright (c)
 * @author		Game Team.
 * @license		
 *
 */

function openGridRow(event)
{
	var element	= Event.findElement(event, 'tr');
	if(['a', 'input', 'select', 'option'].indexOf(Event.getElement(event).tagName.toLowerCase()) != -1){
		return;
	}
	if(element.title && '#' != element.title){
		setLocation(element.title);
	}
}


/**
 * Enter description...
 *
 * @category	widget
 * @package		grid
 * @author		Mark.Yao
 * @requires
 	Core
 */
(function(){
	/**
	 * @constructor
	 * @param String containerId Grid container ID.
	 * @param String url
	 */
	function _Grid(containerId, url, pageVar)
	{
		var me	= this;
		me._containerId		= containerId;
		me._url				= url;
		me._pageVar			= pageVar;
		me._sortVar			= 'sort';
		me._dirVar			= 'dir';
		me._requestParams	= false;
		me.thLinkOnClick	= me.doSort.bindAsEventListener(me);
		me.initGrid();
	}
	
	/**
	 * @destructor
	 */
	function _destroy()
	{
		var me	= this;
		me._rows.clear();
		me._rowCallbacks.clear();
		me._rows			= null;
		me._rowCallbacks	= null;
		me._activeRow		= null;
	}
	
	/**
	 * @param Boolean	useAjax
	 * @return	Grid
	 * @type	Object
	 */
	function _setUseAjax(useAjax)
	{
		this._useAjax	= !!useAjax;
		return this;
	}
	
	/**
	 * @param Grid.Massaction massaction
	 * @return	Grid
	 * @type	Grid
	 */
	function _setMassaction(massaction)
	{
		this._massaction	= massaction;
		return this;
	}
	
	/**
	 * Initializes grid.
	 *
	 * @private
	 * @return	void
	 */
	function _initGrid()
	{
		var tableId,
			me	= this;
		tableId	= me._containerId + me._tableSuffix;
		if($(tableId)){
			me._rows	= $$('#'+ tableId +' tbody tr');
			me._rows.each(function(row, index){
				if((++index % 2) === 0){
					Element.addClassName(row, 'even');
				}
				Event.addListener(row, 'mouseover', me.onRowMouseOver.bindAsEventListener(me));
				Event.addListener(row, 'mouseout', me.onRowMouseOut.bindAsEventListener(me));
				Event.addListener(row, 'click', me.onRowClick.bindAsEventListener(me));
				Event.addListener(row, 'dblclick', me.onRowDblClick.bindAsEventListener(me));
			});
		}
		me._bindFilterFields();
		
		var columns		= $$('#'+ tableId +' thead a');
		for(var col=0; col < columns.length; col++){
			Event.addListener(columns[col],'click',me.thLinkOnClick);
		}
	}
	
	/**
	 * Used for Ajax.
	 *
	 * @private
	 * @return	void
	 */
	function _initGridAjax()
	{
		var me	= this;
		me.initGrid();
	}
	
	/**
	 * @return	Array
	 * @type	Array
	 */
	function _getRows()
	{
		return this._rows;
	}
	
	/**
	 * Retrieves row object by child element.
	 *
	 * @param HTMLElement element Child element
	 * @return	HTMLTableRowElement
	 * @type	HTMLTableRowElement
	 */
	function _getRowByChild(element)
	{
		element	= $(element);
		return Element.up(element, 'tr');
	}
	
	/**
	 * Retrieves table row object by event.
	 *
	 * @param Event event
	 * @return	HTMLTableRowElement
	 * @type	HTMLTableRowElement
	 */
	function _getRowByEvent(event)
	{
		return Event.findElement(event, 'tr');
	}
	
	/**
	 * Adds callback function
	 *
	 * @param String	evtName Event name
	 * @param Function	callback Callback function
	 * @return	Grid
	 * @type	Object
	 */
	function _setRowCallback(callbacks)
	{
		var eventName;
		if(arguments.length > 1){
			eventName	= callbacks;
			callbacks	= {};
			callbacks[eventName]	= arguments[1];
		}
		var me	= this;
		for(eventName in callbacks){
			if(Object.isFunction(callbacks[eventName]))
				me._rowCallbacks[eventName]	= callbacks[eventName];
		}
		return this;
	}
	
	/**
	 * Lighlight row
	 *
	 * @private
	 * @param HTMLTableRowElement	row
	 * @param Boolean				bool Highlight true or false
	 * @return	Grid
	 * @type	Object
	 */
	function _highlight(row)
	{
		if(false === Browser.ie || Browser.version >= 7){
			return this;
		}
		var className	= 'highlight';
//		if(false === bool){
//			Element.removeClassName(row, className);
//			return this;
//		}
//		if(true === bool && false === Element.hasClassName(row, className)){
//			Element.addClassName(row, className);
//			return this;
//		}
		Element.toggleClassName(row, className);
		return this;
	}
	
	/**
	 * Activates row
	 *
	 * @param HTMLTableRowElement	row
	 * @param Boolean				isActive True or false
	 * @return	Grid
	 * @type	Object
	 */
	function _activateRow(row, isActive)
	{
		var me	= this;
		if(me._massaction){
			// Multi-select mode:
			if(true == Object.isUndefined(isActive)){
				Element.toggleClassName(row, 'active');
				return me;
			}
			if(false == isActive){
				Element.removeClassName(row, 'active');
				return me;
			}
			if(false == Element.hasClassName(row, 'active')){
				Element.addClassName(row, 'active');
			}
			return me;
		}
		
		if(me._activeRow && me._activeRow != row){
			Element.removeClassName(me._activeRow, 'active');
		}
		Element.addClassName(row, 'active');
		me._activeRow	= row;
		return me;
	}
	
	/**
	 * Acttivates row
	 */
	function _onRowActivate(event)
	{
		var me	= this,
			row	= me.getRowByEvent(event);
		me.activateRow(row);
		// Do callback:
		if(Object.isFunction(me._rowCallbacks['activate'])){
			me._rowCallbacks['activate'].apply(me, [event]);
		}
	}
	
	/**
	 * Fires if click row
	 */
	function _onRowClick(event)
	{
		var me	= this;
		if(false == ['a', 'input', 'select', 'option'].contains(Event.getElement(event).tagName.toLowerCase())){
			me.onRowActivate.apply(me, [event]);
		}
		// Do callback:
		if(Object.isFunction(me._rowCallbacks['click'])){
			me._rowCallbacks['click'].apply(me, [event]);
		}
	}
	
	/**
	 * Fires if dbl click row
	 */
	function _onRowDblClick(event)
	{
		var me	= this;
		// Do callback:
		if(Object.isFunction(me._rowCallbacks['dblClick'])){
			me._rowCallbacks['dblClick'].apply(me, [event]);
		}
	}
	
	/**
	 * Fires if mouse over to row
	 */
	function _onRowMouseOver(event)
	{
		var me	= this,
			row	= me.getRowByEvent(event);
		me._highlight(row);
		if(row.title && '#' != row.title){
			row.addClass('on-mouse');
			if(!row.hasClass('pointer')){
				row.addClass('pointer');
			}
		}
	}
	
	/**
	 * Fires if mouse out from row
	 */
	function _onRowMouseOut(event)
	{
		var me	= this,
			row	= me.getRowByEvent(event);
		me._highlight(row);
		row.removeClass('on-mouse');
	}
	
	
	/**
	 * @param String url
	 * @return void
	 */
	function _reload(url)
	{
		var me	= this;
		if(!me._useAjax){
			location.href	= url;
			return;
		}
		// Do ajax:
		if('string' == typeof(FORM_KEY)){
			if(!me._requestParams){
				me._requestParams	= {'form_key': FORM_KEY};
			}else{
				me._requestParams.form_key	= FORM_KEY;
			}
		}
		(new HttpRequest({
			'url'		: url,
			'method'	: 'GET',
			'update'	: me._containerId,
			'onComplete'	: me.initGridAjax.bind(me)
		})).send(me._requestParams);
	}
	
	/**
	 * @param String name	Parameter name.
	 * @param String value	Parameter value.
	 * @return	String
	 * @type	String
	 */
	function _addParamToUrl(name, value)
	{
		var me		= this,
			oUri	= new URI(me._url);
		reg	= new RegExp('\/('+ name +'\/.*?\/)');
		oUri.set('directory', 
			oUri.get('directory').replace(reg, '/') + name +'/'+ value +'/'
		);
		me._url		= oUri.toString();
		return me._url;
	}
	
	function _doSort(event)
	{
		var me	= this;
		var element		= Event.findElement(event, 'a');
		if(element.name && element.title){
			me._addParamToUrl(me._sortVar, element.name);
			me._addParamToUrl(me._dirVar, element.title);
			me.reload(me._url);
		}
		Event.stop(event);
		return false;
	}
	
	function _filterOnKeyPress(event)
	{
		if(Event.KEY_RETURN == event.keyCode){
			this.doFilter();
		}
	}
	
	function _doFilter()
	{
		var me	= this;
		var queryString	= Object.serializeFormElements(
			$(me._containerId).select('.filter')
		);
		var oUri	= new URI(me._url);
		oUri.set('query', queryString);
		me._url		= oUri.toString();
		me.reload(me._url);
	}
	
	function _resetFilter()
	{
		var me	= this;
		var queryHash	= Object.unserializeFormElements(
			$(me._containerId).select('.filter')
		);
		for(var n in queryHash){
			queryHash[n]	= null;
		}
		var oUri	= new URI(me._url);
		oUri.clearData('query');
		me.reload(oUri.toString());
	}
	
	/**
	 * Calls this, after prepare grid.
	 *
	 * @private
	 */
	function _bindFilterFields()
	{
		var me	= this;
		var filters	= $(me._containerId).select('.filter input', '.filter select');
		filters.each(function(element){
			Event.addListener(element, 'keypress', me.filterOnKeyPress.bind(me));
		});
	}
	
	function _doExport()
	{
		alert('doExport');
	}
	
	/**
	 * @return void
	 */
	function _loadByElement(element)
	{
		var me	= this;
		if(element && element.name){
			me.reload(
				me._addParamToUrl(element.name, element.value)
			);
		}
	}
	
	/**
	 * Gotos page.
	 *
	 * @param Event event
	 * @param Number totalPage The total number of page.
	 * @return void
	 */
	function _inputPage(event, totalPage)
	{
		var page	= Event.getElement(event).value;
		if(event.keyCode == Event.KEY_RETURN && totalPage > 1 && page <= totalPage){
			this.goPage(page);
		}
	}
	
	/**
	 * Gotos page.
	 *
	 * @param Number page Page number.
	 * @return void
	 */
	function _goPage(page)
	{
		page	= parseInt(page)||1;
		var me	= this;
		me.reload(
			me._addParamToUrl(me._pageVar, page)
		);
	}
	
	this.Grid	= new Class({
		/**
		 * @var String
		 */
		_containerId	: null,
		
		/**
		 * Base URL
		 *
		 * @var String
		 */
		_url			: null,
		
		/**
		 * @var String
		 */
		_tableSuffix	: '_table',
		
		/**
		 * @var Boolean
		 */
		_useAjax		: false,
		
		/**
		 * @var Array
		 */
		_rows			: [],
		
		/**
		 * @var Array
		 */
		_rowCallbacks	: [],
		
		/**
		 * @var Grid.Massaction
		 */
		_massaction		: null,
		
		/**
		 * Used for single mode only.
		 *
		 * @var HTMLTableRowElement
		 */
		_activeRow		: null,
		
		'initialize'		: _Grid,
		'destroy'			: _destroy,
		'setMassaction'		: _setMassaction,
		'setUseAjax'		: _setUseAjax,
		'initGrid'			: _initGrid,
		'initGridAjax'		: _initGridAjax,
		'getRows'			: _getRows,
		'getRowByChild'		: _getRowByChild,
		'getRowByEvent'		: _getRowByEvent,
		'_highlight'		: _highlight,
		'activateRow'		: _activateRow,
		'setRowCallback'	: _setRowCallback,
		/**
		 * Events:
		 */
		'onRowActivate'		: _onRowActivate,
		'onRowClick'		: _onRowClick,
		'onRowDblClick'		: _onRowDblClick,
		'onRowMouseOver'	: _onRowMouseOver,
		'onRowMouseOut'		: _onRowMouseOut,
		
		'reload'			: _reload,
		'_addParamToUrl'	: _addParamToUrl,
		'doSort'			: _doSort,
		'filterOnKeyPress'	: _filterOnKeyPress,
		'doFilter'			: _doFilter,
		'resetFilter'		: _resetFilter,
		'_bindFilterFields'	: _bindFilterFields,
		'doExport'			: _doExport,
		'loadByElement'		: _loadByElement,
		'inputPage'			: _inputPage,
		'goPage'			: _goPage,
		
		'CLASS_NAME'		: 'Grid'
	});
})();

/**
 * Enter description...
 *
 * @category	widget
 * @package		grid
 * @subpackage	grid.massaction
 * @author		Mark.Yao
 * @requires
 	More
 	Grid
 */
(function(){
	
	/**
	 * @constructor
	 * @param String	containerId Mass action container ID.
	 * @param Grid		grid
	 * @param JSON		selectedRows
	 * @param String	formFieldNameInternal
	 * @param String	formFieldName
	 */
	function _Massaction(containerId, grid, selectedRows, formFieldNameInternal, formFieldName)
	{
		var me	= this;
		me._containerId	= containerId;
		me._grid		= grid;
		me.setFormFieldNameInternal(formFieldNameInternal)
			.setFormFieldName(formFieldName);
		
		me._grid.setMassaction(this).setRowCallback('activate', me.onGridRowActivate.bind(me));
		me._prepareMassaction();
	}
	
	/**
	 * @destructor
	 */
	function _destroy()
	{
		var me	= this;
		me._items		= null;
		me._checkboxes	= null;
		me._checkedValues.clear();
		me._checkedValues		= null;
	}
	
	/**
	 * @param Boolean	useSelectAll
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _setUseSelectAll(useSelectAll)
	{
		this._useSelectAll	= !!useSelectAll;
		return this;
	}
	
	/**
	 * @param Boolean	useAjax
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _setUseAjax(useAjax)
	{
		this._useAjax	= !!useAjax;
		return this;
	}
	
	/**
	 * @param String message
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _setErrorText(message)
	{
		var me	= this;
		me._errorText	= message;
		return me;
	}
	
	/**
	 * @private
	 */
	function _prepareMassaction()
	{
		var me	= this;
		me._container		= $(me._containerId);
		me._countElement	= $(me._containerId +'-count');
		me._formHiddens		= $(me._containerId +'-form-hiddens');
		me._formAdditional	= $(me._containerId +'-form-additional');
		me._selectElement	= $(me._containerId +'-select');
		Event.addListener(me._selectElement, 'change', me.onSelectChange.bindAsEventListener(me));
		me.getCheckboxes().each(function(checkbox){
			checkbox.addEvent('click', me.onCheckboxClick.bindAsEventListener(me));
		});
		
		me._prepareForm();
	}
	
	/**
	 * @private
	 * @throws Exception
	 */
	function _prepareForm()
	{
		var me	= this;
		me._isAddCheckedValueToFormHiddens	= true;
		me._form	= $(me._containerId +'-form');
		if(!me._form){
			me._isAddCheckedValueToFormHiddens	= false;
			me._form	= Element.up(me._container, 'form');
		}
		if(!me._form){
			throw new Exception('Not found HTMLFormElement.');
		}
		me._validator	= new Form.Validator(me._form);
	}
	
	function _setGridIds(gridIds)
	{
		var me	= this;
		me._gridIds	= gridIds;
		return me;
	}
	
	function _setFormFieldName(name)
	{
		var me	= this;
		me._formFieldName	= name;
		return me;
	}
	
	function _setFormFieldNameInternal(name)
	{
		var me	= this;
		me._formFieldNameInternal	= name;
		return me;
	}
	
	/**
	 * @param JSON items
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _setItems(items)
	{
		this._items	= items;
		return this;
	}
	
	/**
	 * Returns all item
	 *
	 * @return	JSON
	 * @type	Object
	 */
	function _getItems()
	{
		return this._items;	
	}
	
	/**
	 * Returns an item
	 *
	 * @param String itemId
	 * @return	JSON|false
	 * @type	Object|Boolean
	 */
	function _getItem(itemId)
	{
		if(this._items[itemId]){
			return this._items[itemId];
		}
		return false;
	}
	
	/**
	 * @return	JSON
	 * @type	Object
	 */
	function _getSelectedItem()
	{
		var me	= this;
		if(me.getItem(me._selectElement.value)){
			return me.getItem(me._selectElement.value);
		}
		return false;
	}
	
	/**
	 * Selects all rows
	 *
	 * @return	Boolean Default return false
	 * @type	Boolean
	 */
	function _selectAll()
	{
		var me	= this;
		me._activateCheckboxes(true);
		me.setCheckedValues(me.getCheckboxesValues());
		return false;
	}
	
	/**
	 * Deselects all rows
	 *
	 * @return	Boolean Default return false
	 * @type	Boolean
	 */
	function _deselectAll()
	{
		var me	= this;
		me._activateCheckboxes(false);
		me.clearCheckedValues();
		return false;
	}
	
	/**
	 * Selects visible rows
	 *
	 * Boolean selectVisible()
	 *
	 * @return	Boolean Default return false
	 * @type	Boolean
	 */
	function _selectVisible()
	{
		var me	= this;
		me._activateCheckboxes(true);
		me.setCheckedValues(me.getCheckboxesValues());
		return false;
	}
	
	/**
	 * Deselects visible rows
	 *
	 * @return	Boolean Default return false
	 * @type	Boolean
	 */
	function _deselectVisible()
	{
		var me	= this;
		me._activateCheckboxes(false);
		me.clearCheckedValues();
		return false;
	}
	
	/**
	 * Activates a checkbox
	 *
	 * @private
	 * @param HTMLCheckboxElement	checkbox
	 * @param Boolean				checked
	 * @return void
	 */
	function _activateCheckbox(checkbox, checked)
	{
		var me	= this;
		
		if(checkbox.disabled){
			return me;
		}
		
		if(false == Object.isUndefined(checked)){
			checkbox.checked	= !!checked;
		}else{
			checkbox.checked	= !checkbox.checked;
		}
		checked	= checkbox.checked;
		
		var row		= me._grid.getRowByChild(checkbox);
		me._grid.activateRow(row, checked);
		return this;
	}
	
	/**
	 * Activates all checkboxes
	 *
	 * @private
	 * @param Boolean	checked
	 * @return void
	 */
	function _activateCheckboxes(checked)
	{
		var me	= this;
		me.getCheckboxes().each(function(checkbox){
			me._activateCheckbox(checkbox, checked);
		});
	}
	
	/**
	 * @return	Array
	 * @type	Array
	 */
	function _getCheckboxes()
	{
		var me	= this;
		if(null == me._checkboxes){
			var result	= [];
			me._grid.getRows().each(function(row){
				var checkbox	= row.down('.massaction-checkbox');
				if(checkbox) result.push(checkbox);
			});
			me._checkboxes	= result;
		}
		return me._checkboxes;
	}
	
	/**
	 * @return	Array
	 * @type	Array
	 */
	function _getCheckboxesValues()
	{
		var me	= this,
			result	= [];
		me.getCheckboxes().each(function(checkbox){
			if(checkbox.disabled) return;
			result.push(checkbox.value);
		});
		return result;
	}
	
	/**
	 * @param Array|String checkedValues
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _setCheckedValues(checkedValues)
	{
		var me	= this;
		me._checkedValues	= checkedValues;
		me._updateCount();
		return me;
	}
	
	/**
	 * @return	Array
	 * @type	Array
	 */
	function _getCheckedValues()
	{
		return this._checkedValues;
	}
	
	/**
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _clearCheckedValues()
	{
		var me	= this;
		me._checkedValues.clear();
		me._updateCount();
		return me;
	}
	
	/**
	 * @param mixed checkedValue
	 * @return	Boolean
	 * @type	Boolean
	 */
	function _hasCheckedValue(checkedValue)
	{
		return this._checkedValues.indexOf(checkedValue) !== -1;
	}
	
	/**
	 * @param mixed checkedValue
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _addCheckedValue(checkedValue)
	{
		var me	= this;
		if(false === me.hasCheckedValue(checkedValue)){
			me._checkedValues.push(checkedValue);
			me._updateCount();
		}
		return this;
	}
	
	/**
	 * @param mixed checkedValue
	 * @return	Grid.Massaction
	 * @type	Object
	 */
	function _removeCheckedValue(checkedValue)
	{
		var me		= this;
		var index	= me._checkedValues.indexOf(checkedValue);
		if(-1 < index){
			me._checkedValues.splice(index, 1);
			me._updateCount();
		}
		return this;
	}
	
	/**
	 * Updates the total number of checked item
	 *
	 * @private
	 */
	function _updateCount()
	{
		var me	= this;
		me._countElement.update(me.getCheckedValues().size());
	}
	
	function _apply()
	{
		var me	= this;
		if(0 == me.getCheckedValues().size()){
			alert(me._errorText);
			return false;
		}
		var selectedItem	= me.getSelectedItem();
		if(!selectedItem){
			me._validator.validate();
			return false;
		}
		if(selectedItem.confirm && !window.confirm(selectedItem.confirm)){
			return false;
		}
		
		if(true === me._isAddCheckedValueToFormHiddens){
			var fieldName	= selectedItem.field ? selectedItem.field : me._formFieldName;
			me._formHiddens.update(
				'<input type="hidden" name="'+ fieldName +'" value="'+ me.getCheckedValues().toString() +'" />'
			);
		}
		
		if(false == me._validator.validate()){
			return false;
		}
		if(selectedItem.url){
			me._form.action	= selectedItem.url;
			me._form.submit();
		}
	}
	
	/**
	 * Event function
	 *
	 * @param Event event Event object
	 * @return void
	 */
	function _onSelectChange(event)
	{
		var me	= this;
		var selectedItem	= me.getSelectedItem();
		
		if(selectedItem){
			me._formAdditional.update($(me._containerId +'-item-'+ selectedItem.id +'-block').innerHTML);
		}else{
			me._formAdditional.update('');
		}
		
//		var _items	= me.getItems();
//		for(var key in _items){
//			var item	= _items[key];
//			var itemBlock	= $(me._containerId +'-item-'+ item.id +'-block'),
//				disabled	= true;
//			Element.hide(itemBlock);
//			if(selectedItem.id == item.id){
//				Element.show(itemBlock);
//				disabled	= false;
//			}
//			var formElement	= Element.down(itemBlock, 'select');
//			if(!formElement){
//				formElement	= Element.down(itemBlock, 'input');
//			}
//			if(formElement){
//				formElement.disabled	= disabled;
//			}
//		};
	}
	
	/**
	 * @param Event event Event object.
	 * @return void
	 */
	function _onCheckboxClick(event)
	{
		var me	= this,
			checkbox	= Event.getElement(event);
		if(checkbox.checked){
			me.addCheckedValue(checkbox.value);
		}else{
			me.removeCheckedValue(checkbox.value);
		}
		var row		= me._grid.getRowByEvent(event);
		me._grid.activateRow(row);
		
		event.stopPropagation();
	}
	
	/**
	 * Grid callback, attachs to callback event: activate of Grid.
	 *
	 * @param Event event Event object.
	 * @return void
	 */
	function _onGridRowActivate(event)
	{
		var me		= this;
		var row		= me._grid.getRowByEvent(event);
		var checkbox	= row.down('.massaction-checkbox');
		if(checkbox){
			if(!checkbox.disabled){
				checkbox.checked	= !checkbox.checked;
			}else{
				checkbox.checked	= false;
			}
			if(checkbox.checked){
				me.addCheckedValue(checkbox.value);
			}else{
				me._grid.activateRow(row, false);
				me.removeCheckedValue(checkbox.value);
			}
		}else{
			me._grid.activateRow(row, false);
		}
	}
	
	Grid.Massaction	= new Class({
		/**
		 * @var Grid
		 */
		_grid			: null,
		
		/**
		 * @var String
		 */
		_containerId	: null,
		
		/**
		 * @var HTMLDivElement
		 */
		_container		: null,
		
		/**
		 * @var HTMLFormElement
		 */
		_form			: null,
		
		/**
		 * @var Array
		 */
		_gridIds		: [],
		
		/**
		 * @var String
		 */
		_formFieldName	: 'massaction',
		
		/**
		 * @var String
		 */
		_formFieldNameInternal	: 'internal_massaction',
		
		/**
		 * @var Boolean
		 */
		_useSelectAll	: false,
		
		/**
		 * @var Boolean
		 */
		_useAjax		: false,
		
		/**
		 * @var String
		 */
		_errorText		: null,
		
		/**
		 * @var JSON
		 */
		_items			: null,
		
		/**
		 * @var Array
		 */
		_checkboxes		: null,
		
		/**
		 * @var Array
		 */
		_checkedValues	: [],
		
		/**
		 * @var HTMLSelectElement
		 */
		_selectElement	: null,
		
		/**
		 * @var Form.Validator
		 */
		_validator		: null,
		
		'initialize'		: _Massaction,
		'destroy'			: _destroy,
		'setUseSelectAll'	: _setUseSelectAll,
		'setUseAjax'		: _setUseAjax,
		'setErrorText'		: _setErrorText,
		
		'_prepareMassaction'		: _prepareMassaction,
		'_prepareForm'				: _prepareForm,
		'setGridIds'				: _setGridIds,
		'setFormFieldName'			: _setFormFieldName,
		'setFormFieldNameInternal'	: _setFormFieldNameInternal,
		'setItems'				: _setItems,
		'getItems'				: _getItems,
		'getItem'				: _getItem,
		'getSelectedItem'		: _getSelectedItem,
		'selectAll'				: _selectAll,
		'deselectAll'			: _deselectAll,
		'selectVisible'			: _selectVisible,
		'deselectVisible'		: _deselectVisible,
		'_activateCheckbox'		: _activateCheckbox,
		'_activateCheckboxes'	: _activateCheckboxes,
		'getCheckboxes'			: _getCheckboxes,
		'getCheckboxesValues'	: _getCheckboxesValues,
		'setCheckedValues'		: _setCheckedValues,
		'getCheckedValues'		: _getCheckedValues,
		'clearCheckedValues'	: _clearCheckedValues,
		'hasCheckedValue'		: _hasCheckedValue,
		'addCheckedValue'		: _addCheckedValue,
		'removeCheckedValue'	: _removeCheckedValue,
		'_updateCount'			: _updateCount,
		'apply'					: _apply,
		/**
		 * Events:
		 */
		'onSelectChange'		: _onSelectChange,
		'onCheckboxClick'		: _onCheckboxClick,
		'onGridRowActivate'		: _onGridRowActivate,
		
		'CLASS_NAME'			: 'Grid.Massaction'
	});
})();
