sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, MessageBox, Filter , FilterOperator,formatter,JSONModel) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RequestManagement", {
            formatter: formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel("request-process");
                this.getView().setModel(oModel);
                var oCountModel = new JSONModel({
                    notInvitedCount:0,
                    invitedCount: 0,
                    rejectedCount:0,
                    sendBackCount:0,
                    deletedCount:0
                });
                this.getView().setModel(oCountModel, "countsModel");
                const customizeConfig = {
                    autoColumnWidth: {
                        '*': { min: 2, max: 6, gap: 1, truncateLabel: false },
                        'REQUEST_NO': { min: 2, max: 6, gap: 1, truncateLabel: false },
                        'COMPANY_CODE':{min: 2, max: 6, gap: 1, truncateLabel: false},
                        'SUPPL_TYPE':{min: 2, max: 7, gap: 1, truncateLabel: false},
                        "SUPPL_TYPE_DESC":{min: 2, max: 6, gap: 1, truncateLabel: false},
                        'STATUS':{min: 2, max: 3, gap: 1, truncateLabel: false},
                         "BP_TYPE_CODE":{min: 2, max: 8, gap: 1, truncateLabel: false}
                    }
                };
                this.oSmartTable = this.getView().byId('idSmartTableReqManagement');
                this.oSmartTableInvited = this.getView().byId('idSmartTableReqManagementInvited');
                this.oSmartTableInvited.setCustomizeConfig(customizeConfig);
                // this.oSmartTable.setCustomizeConfig(customizeConfig);


            },
            onRebindSmartTable: function(){
                console.log("rbin")
            },

            // onEditReqManagement: function(oEvent){
            //    debugger;
            //    if (!this.EditFragmentReqManagement) {
            //     this.EditFragmentReqManagement = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestManagement.editReq", this);
            //     this.getView().addDependent(this.EditFragmentReqManagement);
            // }
            // this.EditFragmentReqManagement.open();
            // },

            onDeleteReq: function(oEvent) {
                debugger;
                var req = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                var oTable = this.getView().byId('idSmartTableReqManagementReject');
    
                // Get selected items
               
                var model = this.getView().byId('idSmartTableReqManagementReject').getModel();
                var that = this; // Preserve the context
    
                MessageBox.confirm(`Are you sure you want to delete request ${req}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            let deleTable = that.getView().byId('idSmartTableReqManagementDeleted');
                            that.getView().setBusy(true); // Set busy indicator
                            let sPath= `/RequestInfo(${req})`
                            model.remove(sPath,{
                                success: function(res){
                                    that.getView().setBusy(false)
                                    oTable.rebindTable();
                                    deleTable.rebindTable()
                                    MessageBox.success("Request Deleted")
                                },
                                error: function(err){
                                    MessageBox.error("Unable to Delete")
                                }
                            })
                        }
                    }
                });
            },
            onDeleteReqInvite: function(oEvent) {
                debugger;
                var req = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                var oTable = this.getView().byId('idSmartTableReqManagementInvited');
    
                // Get selected items
               
                var model = this.getView().byId('idSmartTableReqManagementInvited').getModel();
                var that = this; // Preserve the context
    
                MessageBox.confirm(`Are you sure you want to delete request ${req}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            let deleTable = that.getView().byId('idSmartTableReqManagementDeleted');
                            that.getView().setBusy(true); // Set busy indicator
                            let sPath= `/RequestInfo(${req})`
                            model.remove(sPath,{
                                success: function(res){
                                    that.getView().setBusy(false)
                                    oTable.rebindTable();
                                    deleTable.rebindTable()
                                    MessageBox.success("Request Deleted")
                                },
                                error: function(err){
                                    MessageBox.error("Unable to Delete")
                                }
                            })
                        }
                    }
                });
            },
            onDeleteReqsendback: function(oEvent) {
                debugger;
                var req = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                var oTable = this.getView().byId('idSmartTableSendback');
    
                // Get selected items
               
                var model = this.getView().byId('idSmartTableSendback').getModel();
                var that = this; // Preserve the context
    
                MessageBox.confirm(`Are you sure you want to delete request ${req}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            that.getView().setBusy(true); // Set busy indicator
                            let deleTable = that.getView().byId('idSmartTableReqManagementDeleted');
                            let sPath= `/RequestInfo(${req})`
                            model.remove(sPath,{
                                success: function(res){
                                    that.getView().setBusy(false)
                                    oTable.rebindTable();
                                    MessageBox.success("Request Deleted")
                                    deleTable.rebindTable()
                                },
                                error: function(err){
                                    MessageBox.error("Unable to Delete")
                                }
                            })
                        }
                    }
                });
            },
            onDeleteReqRegis: function(oEvent) {
                debugger;
                var req = oEvent.getSource().getBindingContext().getObject().REQUEST_NO;
                var oTable = this.getView().byId('idSmartTableRegisterd');
    
                // Get selected items
               
                var model = this.getView().byId('idSmartTableRegisterd').getModel();
                var that = this; // Preserve the context
    
                MessageBox.confirm(`Are you sure you want to delete request ${req}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            that.getView().setBusy(true); // Set busy indicator
                            let deleTable = that.getView().byId('idSmartTableReqManagementDeleted');

                            let sPath= `/RequestInfo(${req})`
                            model.remove(sPath,{
                                success: function(res){
                                    that.getView().setBusy(false)
                                    oTable.rebindTable();
                                    deleTable.rebindTable()
                                    MessageBox.success("Request Deleted")
                                },
                                error: function(err){
                                    MessageBox.error("Unable to Delete")
                                }
                            })
                        }
                    }
                });
            },


            onCreateRquestManagement: function () {
                if (!this.vhFragmentReqManagement) {
                    this.vhFragmentReqManagement = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestManagement.createRequestManagement", this);
                    this.getView().addDependent(this.vhFragmentReqManagement);
                }
                this.vhFragmentReqManagement.open();
            },

            onCloseReqManagement: function () {
                this.vhFragmentReqManagement.close();
                sap.ui.getCore().byId("idReqType").setValue([]);
                sap.ui.getCore().byId("idVendorEntity").setValue([]);
                sap.ui.getCore().byId("idVendorGroupType").setValue("");
                sap.ui.getCore().byId("idVendorEmail").setValue("");
                sap.ui.getCore().byId("idTextArea").setValue("");
            },

            onValueHelpVendorFrag: function () {
                if (!this.vhVendorTypeFrag) {
                    this.vhVendorTypeFrag = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestManagement.valueHelpForVendorType", this);
                    this.getView().addDependent(this.vhVendorTypeFrag);
                }
                this.vhVendorTypeFrag.open();
            },

            onValueHelpDialogClosereq: function (oEvent) {

                var sDescription, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                sDescription = oSelectedItem.getInfo();
                sTitle = oSelectedItem.getTitle()
                sap.ui.getCore().byId("idVendorTypes").setValue(`${sTitle} - ${sDescription}`)
            },

            // onSumbitReqManagement: function () {
            //     debugger;
            //     this.getView().setBusy(true);
            //     this.vhFragmentReqManagement.close();
            //     let reqModel = this.getView().getModel("request-process");
            //     let reqType = sap.ui.getCore().byId("idReqType").getSelectedKey();
            //     let companyCode = sap.ui.getCore().byId("idVendorEntity").getSelectedKey();
            //     let vendorAccount = sap.ui.getCore().byId("idVendorGroupType").getValue();
            //     // let vendorType = sap.ui.getCore().byId("idVendorTypes").getValue();
            //     let venderEmail = sap.ui.getCore().byId("idVendorEmail").getValue();
            //     // let vendorSubType = sap.ui.getCore().byId("idSubVendorTypes").getValue();
            //     let comment = sap.ui.getCore().byId("idTextArea").getValue();

            //     // let suplType = vendorSubType.split("-")[0];
            //     // let suplDescr = vendorSubType.split("-")[1];
            //     // let bpType = vendorType.split("-")[0];
            //     // let byDesc = vendorType.split("-")[1];
            //     debugger;
            //     let payload = {
            //         action: "CREATE",
            //         inputData: [
            //             {
            //                 REGISTERED_ID: venderEmail,
            //                 COMPANY_CODE: companyCode,
            //                 // SUPPL_TYPE_DESC: suplDescr,
            //                 // SUPPL_TYPE: suplType,
            //                 // BP_TYPE_CODE: bpType,
            //                 // BP_TYPE_DESC: byDesc,
            //                 VENDOR_ACCOUNT_GROUP:vendorAccount,
            //                 REQUEST_TYPE: reqType,
            //                 COMMENT: comment,
            //                 REQUESTER_ID: "vai@gmail.com"
            //             }
            //         ]
            //     };

            //     reqModel.create("/RequestProcess", payload, {
            //         success: function (oData) {
            //             this.getView().setBusy(false);
            //             debugger;
            //             MessageBox.success(oData.RequestProcess);
            //             // this.getView().byId("idSmartTableReqManagement").rebindTable();
            //             let oTable = this.getView().byId('idSmartTableReqManagementInvited');
            //             oTable.rebindTable();
            //             sap.ui.getCore().byId("idReqType").setValue([]);
            //             sap.ui.getCore().byId("idVendorEntity").setValue([]);
            //             sap.ui.getCore().byId("idVendorGroupType").setValue("");
            //             sap.ui.getCore().byId("idVendorEmail").setValue("");
            //             sap.ui.getCore().byId("idTextArea").setValue("");
            //         }.bind(this),
            //         error: function (oRes) {
            //             this.getView().setBusy(false);
            //             const jsonResponse = JSON.parse(oRes.responseText);
            //             const errorMessage = jsonResponse.error.message.value;
            //             MessageBox.error(errorMessage);
            //         }.bind(this)
            //     });


            // },
            onSumbitReqManagement: function () {
                debugger;
                // Retrieve input values
                let reqType = sap.ui.getCore().byId("idReqType").getSelectedKey();
                let companyCode = sap.ui.getCore().byId("idVendorEntity").getSelectedKey();
                let vendorAccount = sap.ui.getCore().byId("idVendorGroupType").getValue();
                let venderEmail = sap.ui.getCore().byId("idVendorEmail").getValue();
                let comment = sap.ui.getCore().byId("idTextArea").getValue();
            
                // Validate inputs
                if (!reqType) {
                    MessageBox.error("Request Type is required.");
                    return;
                }
                if (!companyCode) {
                    MessageBox.error("Company Code is required.");
                    return;
                }
                if (!vendorAccount) {
                    MessageBox.error("Vendor Account is required.");
                    return;
                }
                if (!venderEmail || !this._isValidEmail(venderEmail)) {
                    MessageBox.error("A valid Vendor Email is required.");
                    return;
                }
            
                // Proceed with form submission
                this.getView().setBusy(true);
                this.vhFragmentReqManagement.close();
            
                let reqModel = this.getView().getModel("request-process");
            
                let payload = {
                    action: "CREATE",
                    inputData: [
                        {
                            REGISTERED_ID: venderEmail,
                            COMPANY_CODE: companyCode,
                            VENDOR_ACCOUNT_GROUP: vendorAccount,
                            REQUEST_TYPE: reqType,
                            COMMENT: comment,
                            REQUESTER_ID: "login@gmail.com",
                            REASSIGN_FLAG:false
                        }
                    ]
                };
            
                reqModel.create("/RequestProcess", payload, {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        debugger;
                        MessageBox.success(oData.RequestProcess);
                        let oTable = this.getView().byId('idSmartTableReqManagementInvited');
                        oTable.rebindTable();
                        sap.ui.getCore().byId("idReqType").setValue([]);
                        sap.ui.getCore().byId("idVendorEntity").setValue([]);
                        sap.ui.getCore().byId("idVendorGroupType").setValue("");
                        sap.ui.getCore().byId("idVendorEmail").setValue("");
                        sap.ui.getCore().byId("idTextArea").setValue("");
                    }.bind(this),
                    error: function (oRes) {
                        this.getView().setBusy(false);
                        const jsonResponse = JSON.parse(oRes.responseText);
                        const errorMessage = jsonResponse.error.message.value;
                        MessageBox.error(errorMessage);
                    }.bind(this)
                });
            },
            
            _isValidEmail: function (email) {
                var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },
            

            // onVendorSubTypeSelectionChange: function(oEvent) {
            //     // Get the selected item

            //     var oSelectedItem = oEvent.getParameter('selectedItem');
            //     if (oSelectedItem) {
            //         // Get the values of the selected item
            //         var sText = oSelectedItem.getText();
            //         var sAdditionalText = oSelectedItem.getAdditionalText();

            //         // Combine the text and additional text
            //         var sCombinedText = sText + ' - ' + sAdditionalText;

            //         // Update the input field with the combined text
            //         var oInput = sap.ui.getCore().byId('idVendorSubType');
            //         oInput.setValue(sCombinedText);
            //     }
            // }

            onValueHelpSubVendorFrag: function () {
                if (!this.vhVendorTypeSubFrag) {
                    this.vhVendorTypeSubFrag = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestManagement.valueHelpForSubVendorType", this);
                    this.getView().addDependent(this.vhVendorTypeSubFrag);
                }
                this.vhVendorTypeSubFrag.open();
            },

            onValueHelpDialogClosereqSubVendor: function (oEvent) {
                var sInfo, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                sInfo = oSelectedItem.getInfo();
                sTitle = oSelectedItem.getTitle()
                sap.ui.getCore().byId("idSubVendorTypes").setValue(`${sTitle} - ${sInfo}`)
            },

            statusFormatter: function(status){
                switch (status) {
                    case 15:
                        return "Not Invited"
                    case 2:
                        return  "Invited"
                        
                    case 3:
                        return "Rejected"
                    case 7:
                            return "SendBack"
                    default:
                        return "No Data"
                }
            },
            statusColorFormatter: function(status){
                switch (status) {
                    case 15:
                        return "Indication13"
                    case 2:
                        return  "Indication14"
                        
                    case 3:
                        return "Indication11"
                        case 7:
                            return "Indication15"
                    default:
                        return "None"
                }
            },

            onIconTabBarSelect : function(oEvent){
                debugger;
                var oSmartTableNotInvited = this.byId("idSmartTableReqManagement");
                var oSmartTableInvited = this.byId("idSmartTableReqManagementInvited");
                var oSmartTablerejected = this.byId("idSmartTableReqManagementReject");
                var oSmartTablesendBack = this.byId("idSmartTableSendback");
                var sKey = oEvent.getParameter("key");
                var oFilter;
    
                if (sKey === "NotInvited") {
                    oSmartTableNotInvited.rebindTable();
                } else if (sKey === "Invited") {
                    oSmartTableInvited.rebindTable();
                } else if (sKey == "Rejected"){
                    oSmartTablerejected.rebindTable()
                }else if (sKey == "SendBack"){
                    oSmartTablesendBack.rebindTable()
                }
            },

            onInvitedFilter: function(oEvent){
                debugger
                let oBindingParams = oEvent.getParameter("bindingParams");
                 var oFilter = new sap.ui.model.Filter("STATUS","EQ","2")
                oBindingParams.filters.push(oFilter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        let iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/invitedCount", iCount);
                    }.bind(this)
                };
            },
            onDeletedFilter: function(oEvent){
                debugger
                let oBindingParams = oEvent.getParameter("bindingParams");
                 var oFilter = new sap.ui.model.Filter("STATUS","EQ","10")
                oBindingParams.filters.push(oFilter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        let iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/deletedCount", iCount);
                    }.bind(this)
                };
            },
            onRebindSmartTableregisterd: function(oEvent){
                debugger
                let oBindingParams = oEvent.getParameter("bindingParams");
                 var oFilter = new sap.ui.model.Filter("STATUS","EQ","5")
                oBindingParams.filters.push(oFilter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        let iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/registered", iCount);
                    }.bind(this)
                };
            },
            onRebindSmartTableSendBack: function(oEvent){
                let oBindingParams = oEvent.getParameter("bindingParams");
                 var oFilter = new sap.ui.model.Filter("STATUS","EQ","7")
                oBindingParams.filters.push(oFilter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        let iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/sendBackCount", iCount);
                    }.bind(this)
                };
            },

            onRebindSmartTableNotInvited: function(oEvent){
                debugger;
                let oBindingParams = oEvent.getParameter("bindingParams");
                var filter = new sap.ui.model.Filter("STATUS","EQ","15")
                oBindingParams.filters.push(filter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        var iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/notInvitedCount", iCount);
                    }.bind(this)
                };
            },

            onRebindSmartTableReject: function(oEvent){
                let oBindingParams = oEvent.getParameter("bindingParams");
                var filter = new sap.ui.model.Filter("STATUS","EQ","3")
                oBindingParams.filters.push(filter);
                oBindingParams.events = {
                    dataReceived: function (oData) {
                        var iCount = oData.getParameter("data").results.length;
                        this.getView().getModel("countsModel").setProperty("/rejectedCount", iCount);
                    }.bind(this)
                };
            },
            onSearchReqmanagement: function(oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableReqManagementInvited");
                var oBinding = oSmartTable.getTable().getBinding("items");// Initialize an array to hold multiple filters
                var aFilters = [];  // Get the search query from the event (if applicable)
                var sSearchQuery = oEvent.getParameter("query"); // Filter for EMAIL (based on the search query)
                let res = parseFloat(sSearchQuery)
                aFilters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2")); 
                aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, res));
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true 
                });
                if(sSearchQuery == ""){
                    oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2")); 
                }else{
                    oBinding.filter(oCombinedFilter);
                }
            },
            onSearchReqmanagementReject: function(oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableReqManagementReject");
                var oBinding = oSmartTable.getTable().getBinding("items");// Initialize an array to hold multiple filters
                var aFilters = [];  // Get the search query from the event (if applicable)
                var sSearchQuery = oEvent.getParameter("query"); // Filter for EMAIL (based on the search query)
                let res = parseFloat(sSearchQuery)
                aFilters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "3")); 
                aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, res));
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true 
                });
                if(sSearchQuery == ""){
                    oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "3")); 
                }else{
                    oBinding.filter(oCombinedFilter);
                }
                // if (res !== "Nan") {
                //     var oCombinedFilter = new sap.ui.model.Filter({
                //         filters: aFilters,
                //         and: true 
                //     });
                //     oBinding.filter(oCombinedFilter);
                // } else {
                //     oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2"));  // Clear filters if search is canceled or empty
                // }
            },
            onSearchReqmanagementSendBack: function(oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableSendback");
                var oBinding = oSmartTable.getTable().getBinding("items");// Initialize an array to hold multiple filters
                var aFilters = [];  // Get the search query from the event (if applicable)
                var sSearchQuery = oEvent.getParameter("query"); // Filter for EMAIL (based on the search query)
                let res = parseFloat(sSearchQuery)
                aFilters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "7")); 
                aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, res));
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true 
                });
                if(sSearchQuery == ""){
                    oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "7")); 
                }else{
                    oBinding.filter(oCombinedFilter);
                }
                // if (res !== "Nan") {
                //     var oCombinedFilter = new sap.ui.model.Filter({
                //         filters: aFilters,
                //         and: true 
                //     });
                //     oBinding.filter(oCombinedFilter);
                // } else {
                //     oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2"));  // Clear filters if search is canceled or empty
                // }
            },

            onSearchRegistered: function(oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableRegisterd");
                var oBinding = oSmartTable.getTable().getBinding("items");// Initialize an array to hold multiple filters
                var aFilters = [];  // Get the search query from the event (if applicable)
                var sSearchQuery = oEvent.getParameter("query"); // Filter for EMAIL (based on the search query)
                let res = parseFloat(sSearchQuery)
                aFilters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "5")); 
                aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, res));
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true 
                });
                if(sSearchQuery == ""){
                    oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "5")); 
                }else{
                    oBinding.filter(oCombinedFilter);
                }
                // if (res !== "Nan") {
                //     var oCombinedFilter = new sap.ui.model.Filter({
                //         filters: aFilters,
                //         and: true 
                //     });
                //     oBinding.filter(oCombinedFilter);
                // } else {
                //     oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2"));  // Clear filters if search is canceled or empty
                // }
            },

            onSearchReqmanagementDeleted: function(oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableReqManagementDeleted");
                var oBinding = oSmartTable.getTable().getBinding("items");// Initialize an array to hold multiple filters
                var aFilters = [];  // Get the search query from the event (if applicable)
                var sSearchQuery = oEvent.getParameter("query"); // Filter for EMAIL (based on the search query)
                let res = parseFloat(sSearchQuery)
                aFilters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "10")); 
                aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, res));
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true 
                });
                if(sSearchQuery == ""){
                    oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "10")); 
                }else{
                    oBinding.filter(oCombinedFilter);
                }
                // if (res !== "Nan") {
                //     var oCombinedFilter = new sap.ui.model.Filter({
                //         filters: aFilters,
                //         and: true 
                //     });
                //     oBinding.filter(oCombinedFilter);
                // } else {
                //     oBinding.filter(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, "2"));  // Clear filters if search is canceled or empty
                // }
            }
            

        });
    });
