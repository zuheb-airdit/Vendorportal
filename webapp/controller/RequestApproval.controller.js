sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/StandardListItem",
    "sap/m/Popover",
    "sap/m/List",
    "sap/ui/core/format/DateFormat",
    "../model/formatter"
],
    function (Controller, MessageBox, Fragment, StandardListItem, Popover, List,DateFormat,formatter) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RequestApproval", {
            formatter: formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel("request-process");
                this.getView().setModel(oModel);
                const customizeConfig = {
                    autoColumnWidth: {
                        '*': { min: 2, max: 5, gap: 1, truncateLabel: false },
                        'REQUEST_NO': { min: 2, max: 4, gap: 1, truncateLabel: false },
                        'VENDOR_NAME1':{min: 2, max: 5, gap: 1, truncateLabel: false},
                        'REGISTERED_ID':{min: 2, max: 7, gap: 1, truncateLabel: false},
                        'SUPPL_TYPE':{min: 2, max: 5, gap: 1, truncateLabel: false},
                        "SUPPL_TYPE_DESC":{min: 2, max: 5, gap: 1, truncateLabel: false},
                        'STATUS':{min: 2, max: 3, gap: 1, truncateLabel: false},
                         "BP_TYPE_CODE":{min: 2, max: 6, gap: 1, truncateLabel: false}
                    }
                };
                this.oSmartTable = this.getView().byId('idSmartTableApproval');
                this.oSmartTable.setCustomizeConfig(customizeConfig);
                
   
            },
            
            onBeforeBindTableReqApproval: function(oEvent){
                debugger;
                let oBindingParams = oEvent.getParameter("bindingParams");
                var filter = new sap.ui.model.Filter("STATUS","EQ","15")
                oBindingParams.filters.push(filter);
            },

            createdOnAndByFormatter: function (createdOn, createdBy) {
                if (!createdOn) {
                    return "";
                }
    
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd-MM-yyyy"
                });
                var formattedDate = oDateFormat.format(new Date(createdOn));
    
                return formattedDate + " " + createdBy;
            },

            

            onRequestApproval: function(oEvent){
                debugger;
                this.getView().setBusy(true)
               this.oSmartTableaa = this.getView().byId('idSmartTableApproval');
               let reqId = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
               let oDataModel = this.getView().getModel("request-process")
               let oPayload = {
                "action": "APPROVE",
                "inputData": [
                    {
                        "REQUEST_NO":reqId
                    }
                ]
            }
               oDataModel.create("/RequestProcess", oPayload, {
                   success: function (oData) {
                       this.getView().setBusy(false)
                       MessageBox.success("Approve Request Sent SuccessFully!");
                       this.oSmartTableaa.rebindTable();
                   }.bind(this),
                   error: function (oRes) {
                       this.getView().setBusy(false)
                       MessageBox.error("Unable to Create");
                   }.bind(this)
               })
            },

            onRequestReject: function(oEvent){
                let reqId = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                let oDataModel = this.getView().getModel("request-process")
                let oPayload = {
                    "action": "REJECT",
                    "inputData": [
                        {
                            "REQUEST_NO":reqId
                        }
                    ]
                }
                oDataModel.create("/RequestProcess", oPayload, {
                    success: function (oData) {
                        this.getView().setBusy(false)
                        MessageBox.success("Request Rejected SuccessFully!");
                    }.bind(this),
                    error: function (oRes) {
                        this.getView().setBusy(false)
                        MessageBox.sucess("Something Went Wrong");
                    }.bind(this)
                })
            },

            statusFormatter: function(status,role){
                if (!role) {
                    return "Vendor Invited";
                }

                switch (status) {
                    case 15:
                        return `In Req Approval-${role}`
                    case 2:
                        return  `In Req Approval-${role}`
                        
                    case 3:
                        return `In Req Approval-${role}`
                    case 4:
                        return `Form In Progress-${role}`
                    default:
                        return "OnProcess"
                }
            },
    
            statusColorFormatter: function(status){
                switch (status) {
                    case 15:
                        return "Indication15"
                    case 2:
                        return  "Indication15"
                        
                    case 3:
                        return "Indication15"
                    case 4:
                        return "Indication15"
                    default:
                        return "None"
                }
            }
           
        });
    });
