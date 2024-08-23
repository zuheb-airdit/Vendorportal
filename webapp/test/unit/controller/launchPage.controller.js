/*global QUnit*/

sap.ui.define([
	"comairvp/lnchpage/controller/launchPage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("launchPage Controller");

	QUnit.test("I should test the launchPage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
