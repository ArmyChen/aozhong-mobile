
(function(){

	function getStyles(direction){
		return {
			property: (direction == 'left' || direction == 'right') ? 'left' : 'top',
			inverted: (direction == 'left' || direction == 'up') ? 1 : -1
		};
	}

	function go(type, styles, data){
		var tweenOptions = {duration: data.duration, unit: '%'};
		if (type == 'blind') {
			data.next.setStyle('z-index', 2);
		}
		if (type != 'slide') {
			data.next
			    .set('tween', tweenOptions)
			    .setStyle(styles.property, 100 * styles.inverted + '%');
			data.next.tween(styles.property, 0);
		}
		if (type != 'blind'){
			data.previous
			    .set('tween', tweenOptions)
			    .tween(styles.property, -(100 * styles.inverted));
		}
	}

})();
