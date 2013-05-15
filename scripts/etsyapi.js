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
	limit: 10,
	page: 1,
	keywords: "",
	sort_on: SmartStore.EtsyApi.sort_options.sort_on_options[0],
	sort_order: SmartStore.EtsyApi.sort_options.sort_order_options[0]
}

// Create the ApiCalls constructor based on the passed in mode (default is set to sandbox)
SmartStore.EtsyApi.ApiCalls = function (mode, key) {
	this.mode = mode || SmartStore.EtsyApi.modes.sandbox;
	this.baseUrl = this.mode.url;

	var _key = key || "w7ccqvpohft8w1464vjulwts";

	this.getKey = function () {
		return _key;
	}

	// This is the main call for getting the active items on Etsy
	this.getActiveItems = function (params) {
		var etsyUrl = this.baseUrl + "/listings/active.js?callback=?&api_key=" + this.getKey();
		var $results_container = $("#js-results").text("Searching Etsy ... ");

		for (param in params) {
			if (!params.hasOwnProperty(param)) {
				continue;
			}

			// the Etsy api doesn't work with an empty keyword, 
			// so we omit it in our call if the passed in value is empty
			if (param == "keywords" && 
				params[param].replace(/\s+/, "").length == 0) {
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
					if (!data.results.hasOwnProperty(result)) {
						continue;
					}

					var $result = $("<div/>", { "class": "row" });
					$result.text("Title:" + data.results[result].title + " Price:" + data.results[result].price);
					results_array.push($result);
				}
				
				$results_container.empty();
				$results_container.append(results_array);
			} 
			catch (ex) {
				alert(ex.name + ": " + ex.message);
			}
			
		});
	}
}