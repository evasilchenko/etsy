/*
 *	Project: Etsy Store
 *	Module: Store functionality
 *	Author: Eugene Vasilchenko
 */

(function () {
	
	$(document).ready(function () {
		try {
			var $search_field = $("#js-search-box");
			var $search_button = $("#js-search");
			var $environment_container = $(".current-environment");
			var apiManager = new SmartStore.EtsyApi.ApiCalls(SmartStore.EtsyApi.modes.production);
			$environment_container.text(apiManager.mode.title);

			// Search the Etsy api after the search button is clicked
			$search_button.click(function () {
				var params = SmartStore.EtsyApi.params;
				params.keywords = $search_field.val();

				apiManager.getActiveItems(params);
			});
		} 
		catch (ex) {
			alert(ex.name + ": " + ex.message);
		}
		
	});
}());