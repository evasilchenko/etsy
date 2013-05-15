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
	this.heightDifference = "520px";
	this.marginDifference = "280px";
	this.contentExpanded = false;
	this.detailsClass = ".js-details";

	this.search = function (params) {
		this.apiManager.getActiveItems(params);
	}

	this.expandContentBox = function () {

		if(this.contentExpanded) {
			return;
		}

		this.$content_box.animate({
			height: '+=' + this.heightDifference,
			marginTop: '-=' + this.marginDifference
		}, 600, function () {
			that.$results_container.addClass("expanded");
			that.contentExpanded = true;
		});
	}

	this.collapseContentBox = function () {

		if(!this.contentExpanded) {
			return;
		}

		this.$content_box.animate({
			height: '-=' + this.heightDifference,
			marginTop: '+=' + this.marginDifference
		}, 600, function () {
			that.$results_container.removeClass("expanded");
		})
	}

	this.init = function () {
		this.$loading_gif = $("#js-loading-gif");
		this.$search_field = $("#js-search-box");
		this.$search_button = $("#js-search");
		this.$environment_container = $("#js-current-environment");
		this.$results_container = $("#js-results");
		this.$content_box = $(".content");
		this.$sort_on_select = $("#js-sort-on");
		this.$environment_container.text(this.apiManager.mode.title);

		// Search the Etsy api after the search button is clicked
		this.$search_button.click(function () {
			that.$search_button.addClass("hidden");
			that.$loading_gif.removeClass("hidden");
			that.params.keywords = that.$search_field.val();
			that.expandContentBox();
			setTimeout(that.search(that.params), 700);
		});

		this.$content_box.on('click', this.detailsClass, function (e) {
			alert(that.apiManager.results[$(this).attr('id')].title);
		});

		var options_array = [], x;

		for(x = 0; x < SmartStore.EtsyApi.sort_options.sort_on_options.length; x++) {
			var $option = $("<option/>", { 
				text: SmartStore.EtsyApi.sort_options.sort_on_options[x],
				value: SmartStore.EtsyApi.sort_options.sort_on_options[x]
			});

			options_array.push($option);
		}

		this.$sort_on_select.append(options_array);
	}
}

SmartStore.ui = new SmartStore.UI();