/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/air/vp/lnchpage/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.air.vp.lnchpage.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                let spath = jQuery.sap.getModulePath("com.air.vp.lnchpage");
                let oImageModel = new sap.ui.model.json.JSONModel({
                    path: spath
                });
                this.setModel(oImageModel, "imageModel");
                sap.ui.loader.config({
                    paths: {"pratham":"/app"}
                });
            }
        });
    }
);