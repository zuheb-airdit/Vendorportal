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
                var oModel = this.getModel("registration-manage");
                debugger;
                oModel.read("/UserAttributes", {
                    success: function (oData) {
                        debugger;
                        var lpadData = {
                            name: oData.results[0].name,
                            email: oData.results[0].email,
                            imageurl: oData.results[0].imageurl,
                            phone: oData.results[0].phone,
                            role: oData.results[0].role,
                            departmentName: oData.results[0].departmentName,
                            selectedKey: oData.results[0].roles[0].appId || "",
                            navigation: oData.results[0].roles || [],
                            fixedNavigation: [
                                {
                                    description: "Setting",
                                    icon: "sap-icon://action-settings"
                                },
                                {
                                    description: "Support",
                                    icon: "sap-icon://headset"
                                },
                                {
                                    description: "Help Documents",
                                    icon: "sap-icon://learning-assistant"
                                }
                            ]
                        };
                        var lpadModel = new sap.ui.model.json.JSONModel(lpadData);
                        this.setModel(lpadModel, "lpadData");
                        this.userData = lpadData;
                        // enable routing
                        this.getRouter().initialize();
                    }.bind(this),
                    error: function (oError) {
                        console.log("Error fetching roles:", oError);
                        // enable routing
                        this.getRouter().initialize();
                    }.bind(this),
                });
            }
        });
    }
);