sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    	"sap/suite/ui/commons/MicroProcessFlowItem",
    "sap/suite/ui/commons/MicroProcessFlow"
],
    function (Controller, JSONModel,Filter,FilterOperator,MicroProcessFlowItem,MicroProcessFlow) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.VendorRequest", {
            
            onInit: function () {
                debugger;
                this.getOwnerComponent().getRouter().getRoute("Routerequests").attachPatternMatched(this.onObjectMatchedS, this);

                 this.STATUS_MAP = Object.freeze({
                    "g": "Success",
                    "w": "None",
                    "y": "Warning",
                    "r": "Error"
                });
                this.Tooltip_MAP = Object.freeze({
                    "g": "Completed",
                    "w": "Not Initiated",
                    "y": "Send Back",
                    "r": "Reject"
                });

                let oModel = this.getOwnerComponent().getModel("registration-manage");
                this.getView().setModel(oModel);
                var oView = this.getView();
                var oTable = oView.byId("idInvitedTabledsf");
                oTable.attachUpdateFinished(this.updateFinished, this);
                oView.setModel(oModel);
                

            },
            onObjectMatchedS: function(){
                this.byId("idSmartTableReports").rebindTable();
             },
            updateFinished: function () {
               
                var oTable = this.getView().byId("idInvitedTabledsf");
                var that = this;
                oTable.getItems().forEach(function (oItem) {
                    var oChart = oItem.getCells()[4]
               
                       var sStatus = oChart.data("VENDOR_REPORT_PROGESSBAR"),
                        aStatusItems = sStatus?.split("-");
                        oChart.removeAllContent();
                    aStatusItems?.forEach(function (sStatus) {
                        oChart?.addContent(new MicroProcessFlowItem({
                            state: that.STATUS_MAP[sStatus],
                            press: [that.itemPressed, that],
                            title:that.Tooltip_MAP[sStatus]
                        }));
                    });
                });
            },
         
            
            statusFormatter: function (status, role) {
                switch (status) {
                    case 2:
                        return `Request Invited`
                    case 3:
                        return `Request Rejected`

                    case 4:
                        return `Form in Progress`
                    case 5:
                        return `Request Registered`
                    case 6:
                        return `Form in Progress`
                    case 7:
                        return `Request SendBack`
                    case 9:
                        return `Request SendBack`
                    case 10:
                        return `Request  Deleted`
                    default:
                        return "Form in Progress"
                }
            },

            formatTextWithNewLine: function(Status){
                return Status;
            },

            onSearchRequestNoChange: function (oEvent) {
                debugger;
                var oTable = this.byId("idSmartTableReports");
                var oBinding = oTable.getTable().getBinding("items");
                var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
                var aFilters = [];
                
                if (sQuery) {
                    let res = parseFloat(sQuery);
                    if (!isNaN(res)) {
                        // If sQuery is a number (Request No)
                        aFilters.push(new Filter("REQUEST_NO", FilterOperator.EQ, res));
                    } else {
                        // If sQuery is not a number (Assume it's an email)
                        aFilters.push(new Filter("REGISTERED_ID", FilterOperator.EQ, sQuery));
                    }
                }
            
                oBinding.filter(aFilters);
            },

            handleProcessTable_RowClickReperts: function(oEvent){
                let url = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                this.getOwnerComponent().getRouter().navTo("ReportObjPage", { id: url });
            },

            formatMicroProcessFlowItemState: function (status, itemIndex) {
                debugger;
                let index = parseInt(itemIndex, 10);
                switch(status){
                    case 2:
                        return "Success"
                        case 4:
                        return "Success"
                       
                }
            },
            onOpenDateFilterDialog: function () {
                if (!this._oDateRangeDialog) {
                    this._oDateRangeDialog = this.getView().byId("dateRangeDialog");
                }
                this._oDateRangeDialog.open();
            },
    
            // Close the date range filter dialog
            onCloseDateFilterDialog: function () {
                this._oDateRangeDialog.close();
            },
    
            // Apply the date range filter
            onApplyDateFilter: function () {
                debugger;
                var oView = this.getView();
                var oDateRangeSelection = oView.byId("dateRangeSelection");
                var sFromDate = oDateRangeSelection.getDateValue();  // Start date
                var sToDate = oDateRangeSelection.getSecondDateValue();  // End date
    
                // Check if valid date range is selected
                if (sFromDate && sToDate) {
                    // Convert to Unix timestamp (in milliseconds)
                    var iFromTimestamp = sFromDate.getTime();  // Start date as Unix timestamp
                    var iToTimestamp = sToDate.getTime();      // End date as Unix timestamp
    
                    // Format the string as required: 'from,to'
                    var sFormattedDateRange = iFromTimestamp + "," + iToTimestamp;
    
                    // Create a filter with the formatted date range string
                    var oFilter = new Filter({
                        path: "startingDate",    // Replace this with your actual field name
                        operator: FilterOperator.EQ,
                        value1: sFormattedDateRange
                    });
    
                    // Get the SmartTable binding and apply the filter
                    var oSmartTable = oView.byId("idSmartTableReports");
                    var oBinding = oSmartTable.getTable().getBinding("items");
                    oBinding.filter([oFilter]);
    
                    // Close the dialog after applying the filter
                    this._oDateRangeDialog.close();
                } else {
                    sap.m.MessageToast.show("Please select a valid date range.");
                }
            }
            






        });
    });
