sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.Workflow", {
            onInit: function () {
                debugger;
                let oModel = this.getOwnerComponent().getModel("registration-manage");
                this.getView().setModel(oModel);
                this.getOwnerComponent().getRouter().getRoute("Routeworkflow").attachPatternMatched(this.onObjectMatchedS, this);

                const customizeConfig = {
                    autoColumnWidth: {
                        '*': { min: 2, max: 8, gap: 1, truncateLabel: false },
                        'REASSIGN_FLAG': { min: 2, max: 6, gap: 1, truncateLabel: false },
                        'DEPARTMENT': { min: 2, max: 6, gap: 1, truncateLabel: false },
                        "REGISTERED_ID": { min: 2, max: 11, gap: 1, truncateLabel: false },
                        // 'STATUS': { min: 2, max: 3, gap: 1, truncateLabel: false },
                        // "BP_TYPE_CODE": { min: 2, max: 8, gap: 1, truncateLabel: false }
                    }
                };
                this.oSmartTable = this.getView().byId('idSmartTableReqManagementWork');
                this.oSmartTable.setCustomizeConfig(customizeConfig);

            },
            // onObjectMatchedS: function () {
            //     this.byId("idSmartTableReqManagementInvitedd").rebindTable();
            // },

            // onBeforrebindWorkflpw: function(oEvent){
            //     debugger;
            //         let oBindingParams = oEvent.getParameter("bindingParams");
            //          var oFilter = new sap.ui.model.Filter("STATUS","EQ","4")
            //         oBindingParams.filters.push(oFilter);
            //         // oBindingParams.events = {
            //         //     dataReceived: function (oData) {
            //         //         let iCount = oData.getParameter("data").results.length;
            //         //         this.getView().getModel("countsModel").setProperty("/sendBackCount", iCount);
            //         //     }.bind(this)
            //         // };
            // },

            onReassignReq: function (oEvent) {
                debugger;
                var oTable = this.getView().byId('idInvitedTableds');
                var aSelectedItems = oTable.getSelectedItems();
                var sData = aSelectedItems[0].getBindingContext().getObject();
                let req = sData.REQUEST_NO;

                debugger;
                let sTitle = sData.APPROVER_ROLE;
                let oFilter1 = new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, `${req}`);
                let model = this.getView().getModel();
                model.read("/RequestInfoWithoutFilter", {
                    filters: [oFilter1],
                    success: function (res) {
                        this.payLoad = this.convertModelToPayload(res)
                    }.bind(this),
                    error: function (err) {

                    }
                })
                debugger;
                var oFilter = new sap.ui.model.Filter("USER_ROLE", sap.ui.model.FilterOperator.EQ, `${sTitle}`);
                let oModel = this.getView().getModel("user-master");
                debugger;
                oModel.read("/VMUsers", {
                    // filters: [oFilter],
                    success: function (oData) {
                        debugger;
                        var filterUserModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(filterUserModel, "FilteredUserReassign");
                    }.bind(this),
                    error: function (oError) {
                        debugger
                    }
                });
                debugger;
                if (!this.reassignFrag) {
                    this.reassignFrag = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestForm.Reassign", this);
                    this.getView().addDependent(this.reassignFrag);
                }
                this.reassignFrag.open();
            },
            selectionChangeHandlerWorkflow: function () {
                this.getView().byId(
                    "idReAssign"
                ).setEnabled(true);
            },
            onSearchRequestNoWorkflow: function (oEvent) {
                debugger;
                let req = oEvent.getParameter("query");
                var oSmartTable = this.byId("idSmartTableReqManagementWork");
                var oBinding = oSmartTable.getTable().getBinding("items");
                var aFilters = [];
                if (req) {
                    aFilters.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, req));
                }
                oBinding.filter(aFilters);
            },
            onSelectionofReassignEmail: function (oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource().getSelectedItem();
                if (oSelectedItem) {
                    var sEmail = oSelectedItem.getBindingContext("FilteredUserReassign").getProperty("EMAIL");
                    sap.ui.getCore().byId("idReassignInput").setValue(sEmail);



                    this.showUserFragment.close();
                }
            },

            onDialogCancel: function () {
                this.reassignFrag.close()
            },

            statusFormatter: function (status, role) {
                switch (status) {
                    case 15:
                        return "Not Invited"
                    case 2:
                        return "Invited"

                    case 3:
                        return "Rejected"
                    case 4:
                        return `Form in Progress-${role}`
                    case 9:
                        return "Send Back"
                    default:
                        return "No Data"
                }

            },

            onValueHelpUserDetails: function () {
                if (!this.showUserFragment) {
                    this.showUserFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestForm.valueHelpFilteredUsersReassign", this);
                    this.getView().addDependent(this.showUserFragment);
                }
                this.showUserFragment.open();
            },

            onCloseValueHelpDialog: function () {
                this.showUserFragment.close();
            },

            onSubmitConfirm: function (oEvent) {
                var reAssignEmail = sap.ui.getCore().byId("idReassignInput").getValue();
                this.getView().setBusy(true);

                var sFunctionImportPath = "/PostRegData";
                let oModel = this.getView().getModel();
                let pData = this.payLoad;
                debugger;
                pData.REASSIGNED_USER_ID = reAssignEmail;

                debugger;
                oModel.create(sFunctionImportPath, pData, {
                    success: function (oData, response) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success(`Request re-assigned to ${reAssignEmail}`, {
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                            onClose: function (sAction) {
                                this.getOwnerComponent().getRouter().navTo("Routeworkflow");
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error("Something went wrong");
                        console.error("Error:", oError);
                    }.bind(this)
                });
                debugger;
                this.reassignFrag.close(); // Close the dialog
            },

            convertModelToPayload: function (modelData) {
                debugger
                // Assuming that modelData has a `results` array containing the data
                let data = modelData.results[0];

                return {
                    "action": "REASSIGN", // Static action for reassignment
                    "stepNo": 1, // Static step number

                    // Main request data
                    "REQUEST_NO": data.REQUEST_NO,

                    // Header section with general vendor information
                    "reqHeader": [
                        {
                            "REGISTERED_ID": data.REGISTERED_ID, // Vendor's registered email or ID
                            "VENDOR_ORGANISATION_NAME": data.VENDOR_ORGANISATION_NAME, // Name of the vendor organization
                            "CONTACT_PERSON": data.CONTACT_PERSON, // Contact person at the vendor organization
                            "PRIORITY": data.PRIORITY, // Priority of the request
                            "PAN_NO": data.PAN_NO, // PAN number of the vendor
                            "GST_NO": data.GST_NO, // GST number of the vendor
                            "DUE_DELI_NUM": data.DUE_DELI_NUM, // Due diligence number
                            "LST_NO": data.LST_NO, // LST number
                            "CST_NO": data.CST_NO, // CST number
                            "MSME_CATEGORY": data.MSME_CATEGORY, // MSME category status (true/false)
                            "VENDOR_ACCOUNT_GROUP": data.VENDOR_ACCOUNT_GROUP, // Vendor account group
                            "DUE_DILIGANCE": data.DUE_DILIGANCE, // Due diligence flag (true/false)
                            "DUE_DILIGANCE_REQ_NO": data.DUE_DILIGANCE_REQ_NO, // Due diligence request number
                            "APPROVER": data.APPROVER // Approver's name
                        }
                    ],

                    // Address data section, mapped from the TO_ADDRESS association
                    "addressData": data.TO_ADDRESS.results.map(address => ({
                        "STREET1": address.STREET1, // Address line 1
                        "CITY": address.CITY, // City
                        "COUNTRY": address.COUNTRY, // Country
                        "DISTRICT": address.DISTRICT, // District
                        "PINCODE": address.PINCODE, // Pincode
                        "STATE": address.STATE, // State
                        "POSTAL_CODE": address.POSTAL_CODE, // Postal code
                        "EMAIL": address.EMAIL, // Primary email address
                        "EMAIL_ADDRESS_FOR_PAYMENT": address.EMAIL_ADDRESS_FOR_PAYMENT, // Email for payment correspondence
                        "CONTACT_NO": address.CONTACT_NO, // Contact number
                        "CONTACT_TELECODE": address.CONTACT_TELECODE // Telecode or additional contact number
                    })),

                    // Bank data section, mapped from the TO_BANKS association
                    "bankData": data.TO_BANKS.results.map(bank => ({
                        "BRANCH_NAME": bank.BRANCH_NAME, // Bank branch name
                        "IFSC": bank.IFSC, // IFSC code
                        "BANK_NAME": bank.BANK_NAME, // Bank name
                        "ACCOUNT_NO": bank.ACCOUNT_NO, // Bank account number
                        "ACCOUNT_TYPE": bank.ACCOUNT_TYPE // Account type (e.g., Current, Savings)
                    })),

                    // Attachment data section, mapped from the TO_ATTACHMENTS association
                    "CompanyProfile": data.TO_ATTACHMENTS.results.map(attachment => ({
                        "REGESTERED_MAIL": attachment.REGESTERED_MAIL, // Registered email related to the attachment
                        "DESCRIPTION": attachment.DESCRIPTION, // Description of the attachment (e.g., MSME certificate)
                        "IMAGEURL": attachment.IMAGEURL, // URL to the image or document file
                        "IMAGE_FILE_NAME": attachment.IMAGE_FILE_NAME // File name of the attachment
                    }))
                };
            }

        });
    });
