sap.ui.define([
	"sap/ui/test/Opa5",
	"io/dev/foodchain/ui5-producer-app/test/integration/arrangements/Startup",
	"io/dev/foodchain/ui5-producer-app/test/integration/BasicJourney"
], function(Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		pollingInterval: 1
	});

});
