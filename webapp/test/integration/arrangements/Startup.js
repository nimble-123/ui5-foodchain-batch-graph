sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("io.dev.foodchain.ui5-producer-app.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "io.dev.foodchain.ui5-producer-app",
					async: true,
					manifest: true
				}
			});
		}

	});
});
