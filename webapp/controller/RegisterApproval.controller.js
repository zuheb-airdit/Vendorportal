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

        return Controller.extend("com.air.vp.lnchpage.controller.RegisterApproval", {
            formatter: formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel("request-process");
                this.getView().setModel(oModel);
                this.getOwnerComponent().getRouter().getRoute("RegisterApproval").attachPatternMatched(this.onObjectMatchedS, this);
                const customizeConfig = {
                    autoColumnWidth: {
                        '*': { min: 2, max: 7, gap: 1, truncateLabel: false },
                        'REQUEST_NO': { min: 2, max: 2, gap: 1, truncateLabel: false },
                        'VENDOR_NAME1': { min: 2, max: 7, gap: 1, truncateLabel: false },
                        'REGISTERED_ID': { min: 2, max: 13, gap: 1, truncateLabel: false },
                        'STATUS': { min: 2, max: 8, gap: 1, truncateLabel: false },
                        "DEPARTMENT":{ min: 4, max: 5, gap: 1, truncateLabel: false }
                    }
                };
                this.oSmartTable = this.getView().byId('idSmartTableApprovalRegister');
                this.oSmartTable1 = this.getView().byId('idSmartTableApprovalRegisterApproval');

                this.oSmartTable.setCustomizeConfig(customizeConfig);
                this.oSmartTable1.setCustomizeConfig(customizeConfig)


            },

            onObjectMatchedS: function(){
               this.byId("idSmartTableApprovalRegister").rebindTable();
            },

            formatReqType: function(reqType){
                debugger;
                return reqType
            },

            selectionChangeHandlerRregister: function (oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();
                var sObjectId = oContext.getProperty("REQUEST_NO"); 
                var navPath = sap.ui.getCore().byId(oEvent.getParameter('id')).getBindingContext();
                this.getOwnerComponent().getRouter().navTo('DetailedViewProjects', { id: navPath.getPath().split("'")[1] });
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            handleProcessTable_RowClick: function (oEvent) {
                debugger;
                let url = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                this.getOwnerComponent().getRouter().navTo("RegisterObjPage", { id: url });
            },
            // onSearchRequestNoChange: function (oEvent) {
            //     debugger;
            //     var oTable = this.byId("idTest");
            //     var oBinding = oTable.getBinding("items");
    
            //     // Get the search value from the event
            //     var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
    
            //     // Create a filter for the search
            //     var aFilters = [];
            //     if (sQuery) {
            //         aFilters.push(new Filter("REQUEST_NO", FilterOperator.Contains, sQuery));
            //     }
    
            //     // Apply the filter to the table's binding
            //     oBinding.filter(aFilters);
            // },

            onRebindSmartTableRegister: function (oEvent) {
                debugger;
                var filterStatus4 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "4");
                var filterStatus5 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "5");
                var combinedFilter = new sap.ui.model.Filter({
                    filters: [filterStatus4, filterStatus5],
                    and: false
                });
                debugger
                oEvent.getParameter("bindingParams").filters.push(filterStatus4);
            },

            statusFormatter: function (status, role) {
                console.log(status)
                if (role == "ADMIN") {
                    role = "ADM"
                }
                switch (status) {
                    case 15:
                        return `In Req Approval-${role}`
                    case 2:
                        return `In Req Approval-${role}`

                    case 3:
                        return `In Req Approval-${role}`
                    case 4:
                        return `Form In Progress-${role}`
                    default:
                        return "Registration Completed"
                }
            },

            colorFormatter: function(reqType){
                debugger;
                return  reqType == "Create Supplier" ? "Indication05": "Indication04"
            },

            formatRequestInfo: function (sValue, reqType) {
                if (!sValue) {
                    return "";
                }
                var oNumberFormat = NumberFormat.getIntegerInstance({
                    groupingEnabled: false
                });
                let num = oNumberFormat.format(sValue);
                var sFormattedText = "<span style='color:red'>" + num + "</span> <span style='color:black'>" + reqType + "</span>";
                return sFormattedText
            },

            onSearchRequestNoChange: function (oEvent) {
                debugger;
                var oTable = this.byId("idSmartTableApprovalRegister");
                var oBinding =oTable.getTable().getBinding("items");
                var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
                let res = parseFloat(sQuery)
                var aFilters = [];
                if (sQuery) {
                    aFilters.push(new Filter("REQUEST_NO", FilterOperator.EQ, res));
                }  
                oBinding.filter(aFilters);
                

            }



        });
    });
