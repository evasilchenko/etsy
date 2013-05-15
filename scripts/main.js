/*
 *	Project: Etsy Store
 *	Module: Store functionality
 *	Author: Eugene Vasilchenko
 */

(function () {
	
	$(document).ready(function () {
		try {
			var ui = new SmartStore.UI();
			ui.init();
		} 
		catch (ex) {
			alert(ex.name + ": " + ex.message);
		}
		
	});
}());