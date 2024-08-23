sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "../model/formatter"
],
    function (Controller, MessageBox, DateFormat, Filter, formatter) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RegisterManagement", {
            formatter: formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel("request-process");
                this.getView().setModel(oModel);
                this.getOwnerComponent().getRouter().getRoute("RegisterManagement").attachPatternMatched(this.onObjectMatchedS, this);
                let oViewModel = new sap.ui.model.json.JSONModel({
                    searchQuery: ""
                });
                this.getView().setModel(oViewModel, "viewModel");
                // let register = this.getOwnerComponent().getModel("registration-manage");


                // const customizeConfig = {
                //     autoColumnWidth: {
                //         '*': { min: 2, max: 5, gap: 1, truncateLabel: false },
                //         'REQUEST_NO': { min: 2, max: 4, gap: 1, truncateLabel: false },
                //         'VENDOR_NAME1':{min: 2, max: 5, gap: 1, truncateLabel: false},
                //         'REGISTERED_ID':{min: 2, max: 7, gap: 1, truncateLabel: false},
                //         'SUPPL_TYPE':{min: 2, max: 5, gap: 1, truncateLabel: false},
                //         "SUPPL_TYPE_DESC":{min: 2, max: 5, gap: 1, truncateLabel: false},
                //         'STATUS':{min: 2, max: 3, gap: 1, truncateLabel: false},
                //          "BP_TYPE_CODE":{min: 2, max: 6, gap: 1, truncateLabel: false}
                //     }
                // };
                // this.oSmartTable = this.getView().byId('idSmartTableApproval');
                // this.oSmartTable.setCustomizeConfig(customizeConfig);


            },
            onObjectMatchedS: function () {
                this.byId("idSmartTableRegisterMangement").rebindTable();
            },
            // onRebindSmartTableRegisterManagement: function (oEvent) {
            //     var filterStatus4 = new sap.ui.model.Filter("STATUS", "EQ", "6");
            //     var filterStatus5 = new sap.ui.model.Filter("STATUS", "EQ", "9");
            //     var combinedFilter = new sap.ui.model.Filter({
            //         filters: [filterStatus4, filterStatus5],
            //         and: false
            //     });
            //     debugger
            //     oEvent.getParameter("bindingParams").filters.push(combinedFilter);
            //     // let oBindingParams = oEvent.getParameter("bindingParams");
            //     //  var oFilter = new sap.ui.model.Filter("STATUS","EQ","6")
            //     // oBindingParams.filters.push(oFilter);
            // },
            onOpenFormRegister: function (oEvent) {
                debugger;
                let url = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                let email = oEvent.getSource().getBindingContext().getObject().REGISTERED_ID;
                this.getOwnerComponent().getRouter().navTo("RegisterFormPage", { id: url, Email: email });
            },

            statusFormattertest: function (status, role) {
                switch (status) {
                    case 6:
                        return `Form in Progress`
                    case 9:
                        return 'Send back'
                }
            },

            indicationFormat: function (status) {
                switch (status) {
                    case 6:
                        return "Indication15"
                    case 9:
                        return "Indication13"
                }
            },

            onRebindSmartTableRegisterManagement: function (oEvent) {
                let oBindingParams = oEvent.getParameter("bindingParams");
                let oSmartTable = this.getView().byId("idSmartTableRegisterMangement");
                oBindingParams.filters = [];
                let req = this.getView().getModel("viewModel").getProperty("/searchQuery");
                if (req) {
                    let oFilter = new sap.ui.model.Filter("REQUEST_NO", EQ, req);
                    oBindingParams.filters.push(oFilter);
                }
            },
            onSearchRequestNoChange: function (oEvent) {
                debugger;
                let req = oEvent.getParameter("query");
                var oSmartTable = this.byId("idSmartTableRegisterMangement");
                var oBinding = oSmartTable.getTable().getBinding("items");
                var aFilters = [];
                if (req) {
                    aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, req));
                }
                oBinding.filter(aFilters);
            }
        });
    });
