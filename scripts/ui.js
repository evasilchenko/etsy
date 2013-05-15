/*
 *	Project: Etsy Store
 *	Module: Store functionality UI
 *	Author: Eugene Vasilchenko
 */

var SmartStore = SmartStore || {}, ui;

// Constructor for the ui object that creates all the default values and adds all methods
SmartStore.UI = function () {
	var that = this;
	this.$search_field = $("#js-search-box");
	this.$search_button = $("#js-search");
	this.$environment_container = $(".current-environment");
	this.apiManager = new SmartStore.EtsyApi.ApiCalls(SmartStore.EtsyApi.modes.production);
	this.$environment_container.text(this.apiManager.mode.title);
	this.params = SmartStore.EtsyApi.params;

	this.search = function (params) {
		this.apiManager.getActiveItems(params);
	}

	this.init = function () {
		// Search the Etsy api after the search button is clicked
		this.$search_button.click(function () {
			that.params.keywords = that.$search_field.val();
			that.search(that.params);
		});
	}
}

