sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/core/UIComponent",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller,  formatter, UIComponent, NumberFormat,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RegisterApprovalPending", {
            formatter: formatter,
            onInit: function () {
              let oModel = this.getOwnerComponent().getModel("request-process");
               this.getView().setModel(oModel)
            },

        
        });
    });
