/*
 *	Project: Etsy Store
 *	Module: Etsy api functionality
 *	Author: Eugene Vasilchenko
 */

var SmartStore = SmartStore || {};
SmartStore.EtsyApi = SmartStore.EtsyApi || {};

// Set the two different urls for the different etsy api modes (sandbox, prod)
SmartStore.EtsyApi.modes = { 
	sandbox: {
		title: "Sandbox",
		url: "http://sandbox.openapi.etsy.com/v2"
	},
	production: {
		title: "Production",
		url: "http://openapi.etsy.com/v2"
	}
};

SmartStore.EtsyApi.sort_options = {
	sort_on_options: [ "created", "price", "score" ],
	sort_order_options: [ "up", "down" ]
}

// Define a list of parameters that we pass with the Etsy api call
// Notes: The property names mirror the param names passed into the api
// if the api were to change it's param names, this list would have to be updated.
// Also, this list is not complete and can be modified in any way to help add future functionality
SmartStore.EtsyApi.params = {
	limit: 50,
	page: 1,
	keywords: "",
	includes: "MainImage",
	sort_on: SmartStore.EtsyApi.sort_options.sort_on_options[0],
	sort_order: SmartStore.EtsyApi.sort_options.sort_order_options[0]
}

// Create the ApiCalls constructor based on the passed in mode (default is set to sandbox)
SmartStore.EtsyApi.ApiCalls = function (mode, key) {
	this.mode = mode || SmartStore.EtsyApi.modes.sandbox;
	this.baseUrl = this.mode.url;
	this.results = [];
	this.rowClass = "row";
	this.currentSortOn = SmartStore.EtsyApi.sort_options.sort_on_options[0];
	this.currentOrderOn = SmartStore.EtsyApi.sort_options.sort_order_options[0];

	var _key = key || "w7ccqvpohft8w1464vjulwts", that = this;

	this.getKey = function () {
		return _key;
	}

	// This is the main call for getting the active items on Etsy
	this.getActiveItems = function (params) {
		var etsyUrl = this.baseUrl + "/listings/active.js?callback=?&api_key=" + this.getKey();
		SmartStore.ui.$results_container.empty();

		// Loop through each parameter and add it to the etsy api url
		for (param in params) {
			if (!params.hasOwnProperty(param)) {
				continue;
			}

			// the Etsy api doesn't work with an empty keyword, 
			// so we omit it in our call if the passed in value is empty
			if (param == "keywords" && 
				params[param].replace(/\s+/, "").length == 0) {
				SmartStore.ui.$sort_container.addClass("hidden");
				continue;
			}

			etsyUrl += "&" + param + "=" + params[param];
		}

		$.getJSON(etsyUrl, function (data) {
			try {
				if (!data.ok) {
					throw new Error(data.error);
				}

				var results_array = [];

				// Loop through the results and add them to an array
				// After the loop, append entire array to dom container (to reduce lockups)
				for (result in data.results) {

					// Skip over properties that don't belong to this objects and results with errors
					if (!data.results.hasOwnProperty(result) || data.results[result].error_messages) {
						continue;
					}

					var $row = $("<div/>", { "class": that.rowClass, id: "row-" + data.results[result].listing_id });
					$row.created_on = data.results[result].creation_tsz;
					$row.score = data.results[result].featured_rank;
					$row.price = data.results[result].price;
					var $img = $("<img/>", { "src": data.results[result].MainImage.url_75x75 });
					var $imgContainer = $("<div/>", { "class": "img-container" }).append($img);
					var $titleContainer = $("<div/>", { "class": "title-container" }).text(data.results[result].title + 
																							" Score: " +
																							$row.score +
																							" Created: " + 
																							$row.created_on);

					var $priceContainer = $("<div/>", { "class": "price-container" }).text(data.results[result].price ? 
																							'$' + data.results[result].price : '');
					var $detailsContainer = $("<button/>", { 
						text: "Details",
						"class": "js-details", 
						id: data.results[result].listing_id 
					});
 
					$row.append([ $imgContainer, $titleContainer, $detailsContainer, $priceContainer ]);
					results_array.push($row);
				}

				// Store this array in the object for filtering sorting
				that.results = results_array;

				// Unfotunately have to call UI here because of the ajax call
				SmartStore.ui.$results_container.append(results_array);
				SmartStore.ui.$search_button.removeClass("hidden");
				SmartStore.ui.$loading_gif.addClass("hidden");
			} 
			catch (ex) {
				alert(ex.name + ": " + ex.message);
			}
			
		});
	}

	// This call is made when the user changes a sort option
	this.sortListByCategory = function (category) {
		var sortedList;
		SmartStore.EtsyApi.params.sort_on = this.currentSortOn = category;
		SmartStore.EtsyApi.params.sort_order = this.currentOrderOn;

		if (this.currentOrderOn == SmartStore.EtsyApi.sort_options.sort_order_options[0]) {
			sortedList = this.results.sort(function (a, b) {
				if(!a[category] && !b[category]) {
					return 0;
				}
				else if (!a[category] && b[category]) {
					return -1;
				} 
				else if(a[category] && !b[category]) {
					return 1;
				}

				return parseFloat(a[category]) - parseFloat(b[category]);
			});
		}
		else {
			sortedList = this.results.sort(function (a, b) {
				if(!a[category] && !b[category]) {
					return 0;
				}
				else if (a[category] && !b[category]) {
					return -1;
				} 
				else if(!a[category] && b[category]) {
					return 1;
				}

				return parseFloat(b[category]) - parseFloat(a[category]);
			});
		}
		
		SmartStore.ui.$results_container.empty();
		SmartStore.ui.$results_container.append(sortedList);
	}

	this.reverseSortOrder = function () {
		if(this.currentOrderOn == SmartStore.EtsyApi.sort_options.sort_order_options[0]) {
			this.currentOrderOn = SmartStore.EtsyApi.sort_options.sort_order_options[1];
		}
		else {
			this.currentOrderOn = SmartStore.EtsyApi.sort_options.sort_order_options[0];
		}

		this.sortListByCategory(this.currentSortOn);
	}
}