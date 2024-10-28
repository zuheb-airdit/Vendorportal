sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    "sap/m/TablePersoController",
],
    function (Controller, JSONModel, Filter, FilterOperator, UIComponent, TablePersoController) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.SuppliersList", {
            onInit: function () {
                this.getView().setBusy(true)
                debugger;
                let model = this.getOwnerComponent().getModel("zapi-business-partnersample");
                this.getView().setModel(model);
                let viewModel = this.getView().getModel();
                debugger;
                viewModel.read("/A_Supplier", {
                    success: function (res) {
                        debugger;
                        var oSupplierModel = new sap.ui.model.json.JSONModel();
                        oSupplierModel.setData(res); // 'res' contains the response from OData

                        this.getView().setModel(oSupplierModel, "supplierModel");
                        this.getView().setBusy(false)

                    }.bind(this),
                    error: function (err) {
                        this.getView().setBusy(false)
                        return sap.m.MessageBox.error("Error in fetching")

                    }.bind(this)
                })
                this._oTablePersoController = new TablePersoController({
                    table: this.byId("supplierTable"),
                    persoService: {
                        getPersData: function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve({}); // Initial empty personalization data
                            return oDeferred.promise();
                        },
                        setPersData: function (oPersData) {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve();
                            return oDeferred.promise();
                        },
                        delPersData: function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve();
                            return oDeferred.promise();
                        }
                    }
                });

                this._oTablePersoController.activate();

            },

            onNavPress: function () {
                history.go(-1)
            },
            formatDate: function (sDate) {
                if (sDate) {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "medium" });
                    return oDateFormat.format(new Date(sDate));
                }
                return sDate;
            },

            onclickofVendor: function (oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("listItem");

                // Get the selected supplier data
                var oSupplier = oSelectedItem.getBindingContext("supplierModel").getObject();

                // Retrieve the Supplier value
                var sSupplier = oSupplier.Supplier;

                // Perform navigation and pass the Supplier as a parameter
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SupplierReportObject", {
                    id: sSupplier // Pass the supplier code in the 'id' parameter
                });
            },

            onRowActionPress: function(){
                debugger;
            },

            handleProcessTable_RowClickReperts: function(oEvent){
                debugger;
                let Partnercode = oEvent.getSource().getBindingContext("supplierModel").getObject().Supplier;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SupplierReportObject", {
                    id: Partnercode // Pass the supplier code in the 'id' parameter
                });
            },

            onSearch: function(oEvent) {
                let sQuery = oEvent.getParameter("query"); // Get the search query
                let oTable = this.byId("idInvitefdTabledsf"); // Get the table
                let oBinding = oTable.getBinding("items"); // Get the binding of the items aggregation
                let oFilter = []; // Define an empty filter array
            
                // If there's a query, create a filter for multiple columns
                if (sQuery && sQuery.length > 0) {
                    oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("SupplierFullName", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("SupplierAccountGroup", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("CreatedByUser", sap.ui.model.FilterOperator.Contains, sQuery)
                        ],
                        and: false // This means that any one of these conditions can match
                    });
                }
            
                // Apply the filter to the binding
                oBinding.filter(oFilter);
            }
            








        });
    });
