/*
 *	Project: Etsy Store
 *	Module: Store functionality UI
 *	Author: Eugene Vasilchenko
 */

var SmartStore = SmartStore || {};

// Constructor for the ui object that creates all the default values and adds all methods
SmartStore.UI = function () {
	var that = this;
	this.apiManager = new SmartStore.EtsyApi.ApiCalls(SmartStore.EtsyApi.modes.production);
	this.params = SmartStore.EtsyApi.params;

	this.search = function (params) {
		this.apiManager.getActiveItems(params);
	}

	this.init = function () {
		this.$loading_gif = $("#js-loading-gif");
		this.$search_field = $("#js-search-box");
		this.$search_button = $("#js-search");
		this.$environment_container = $("#js-current-environment");
		this.$results_container = $("#js-results");
		this.$environment_container.text(this.apiManager.mode.title);

		// Search the Etsy api after the search button is clicked
		this.$search_button.click(function () {
			that.$search_button.addClass("hidden");
			that.$loading_gif.removeClass("hidden");
			that.params.keywords = that.$search_field.val();
			that.search(that.params);
		});
	}

	return this;
}

SmartStore.ui = new SmartStore.UI();