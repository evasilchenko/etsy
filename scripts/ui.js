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
		this.$sort_container.removeClass("hidden");
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

	// This is the entrance point of our app, this should be called
	// after the dom is fully ready like in $(document).ready
	this.init = function () {
		this.$loading_gif = $("#js-loading-gif");
		this.$search_field = $("#js-search-box");
		this.$search_button = $("#js-search");
		this.$environment_container = $("#js-current-environment");
		this.$results_container = $("#js-results");
		this.$content_box = $(".content");
		this.$sort_container = $("#js-sort-container");
		this.$sort_on_select = $("#js-sort-on");
		this.$reverse_sort_order = $("#js-sort-order");
		this.$environment_container.text(this.apiManager.mode.title);

		this.$details_container = $("#js-details-container");
		this.$details_close = $("#js-details-close");
		this.$details_who_made = $("#js-details-who-made");
		this.$details_title = $("#js-details-title");
		this.$details_image_container = $("#js-details-image-container");
		this.$details_description = $("#js-details-description");
		this.$details_price = $("#js-details-price");
		this.$details_score = $("#js-details-score");

		// Search the Etsy api after the search button is clicked
		this.$search_button.click(function () {
			that.$search_button.addClass("hidden");
			that.$loading_gif.removeClass("hidden");
			that.params.keywords = that.$search_field.val();
			that.expandContentBox();
			setTimeout(that.search(that.params), 700);
		});

		// Bind to the click event all future view details buttons
		this.$content_box.on('click', this.detailsClass, function (e) {
			var row = that.apiManager.resultsMapper[$(this).attr('id')];

			that.$details_who_made.text(row.who_made ? row.who_made : '');
			that.$details_title.text(row.title);
			that.$details_image_container.empty();
			that.$details_image_container.append($("<img/>", { src: row.MainImage["url_170x135"] }));
			that.$details_description.text(row.description);
			that.$details_price.text(row.price ? '$' + row.price : '');
			that.$details_score.text("Score: " + row.featured_rank);

			that.$results_container.addClass("hidden");
			that.$details_container.removeClass("hidden");
			that.$details_container.animate({
				left: "-=870px"
			});
		});

		this.$details_close.click(function () {
			that.$details_container.animate({
				left: "+=870px"
			}, 600, function () {
				that.$details_container.addClass("hidden");
				that.$results_container.removeClass("hidden");
			});
		});

		// Go through and set the options for the categories sort using
		// the predefined values in our etsyapi.js
		var options_array = [], x;

		for(x = 0; x < SmartStore.EtsyApi.sort_options.sort_on_options.length; x++) {
			var $option = $("<option/>", { 
				text: SmartStore.EtsyApi.sort_options.sort_on_options[x],
				value: SmartStore.EtsyApi.sort_options.sort_on_options[x]
			});

			options_array.push($option);
		}

		this.$sort_on_select.append(options_array);

		if (SmartStore.EtsyApi.params.keywords.replace(/\s+/, "").length > 0) {
			this.$sort_container.removeClass("hidden");
		}

		// Set the event handlers for the sort controls, don't fire if in details view
		this.$sort_on_select.change(function () {
			if(!that.$details_container.hasClass("hidden")) {
				return;
			}

			that.apiManager.sortListByCategory(this.value);
		});

		this.$reverse_sort_order.click(function () {
			if(!that.$details_container.hasClass("hidden")) {
				return;
			}

			that.apiManager.reverseSortOrder();
		});
	}
}

// Create a globally accessible instance of the UI object
SmartStore.ui = new SmartStore.UI();