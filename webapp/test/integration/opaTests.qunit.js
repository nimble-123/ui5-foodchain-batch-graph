/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"io/dev/foodchain/ui5-producer-app/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});
