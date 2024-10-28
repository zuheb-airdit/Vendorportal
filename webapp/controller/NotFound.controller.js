sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent"
],
    function (Controller, JSONModel,Filter,FilterOperator,UIComponent) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.NotFound", {
            onInit: function () {
                debugger;
                this._router = UIComponent.getRouterFor(this);


            },

            onNavPress: function(){
                history.go(-1)
            }
          
            






        });
    });
