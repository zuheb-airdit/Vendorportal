sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
],
    function (Controller, formatter, UIComponent, JSONModel, MessageBox, Fragment) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RequestObj", {
            formatter: formatter,
            onInit: function () {
                var oRouter = UIComponent.getRouterFor(this);
                let oModel = this.getOwnerComponent().getModel("registration-manage");
                this.getView().setModel(oModel);
                this.getOwnerComponent().getRouter().getRoute("RegisterObjPage").attachPatternMatched(this.onObjectMatched, this);
            },
            createdOnAndByFormatter: function (createdOn) {
                debugger;
                if (!createdOn) {
                    return "";
                }

                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd-MM-yyyy"
                });
                var formattedDate = oDateFormat.format(new Date(createdOn));

                return formattedDate;
            },

            onObjectMatched: function (oEvent) {
                this.getView().setBusy(true)
                var sObjectId = oEvent.getParameter("arguments").id;
                // let oModel = this.getOwnerComponent().getModel("registration-manage");
                // this.getView().setModel(oModel)
                let model = this.getView().getModel();
                let sPath = `/RequestInfo/${sObjectId}`
                debugger;
                model.read(sPath, {
                    success: function (res) {
                        debugger;
                        if (res.STATUS == 5) {
                            this.byId("idAcceptBtn").setEnabled(false);
                            this.byId("idRejectBtn").setEnabled(false);
                            this.byId("idSendBackBtn").setEnabled(false);
                            this.byId("idEditBtn").setEnabled(false);
                        } else {
                            this.byId("idAcceptBtn").setEnabled(true);
                            this.byId("idRejectBtn").setEnabled(true);
                            this.byId("idSendBackBtn").setEnabled(true);
                            this.byId("idEditBtn").setEnabled(true);
                        }
                        var oJsonModel = new JSONModel(res);
                        this.getView().setModel(oJsonModel, "requestInfo");
                        oJsonModel.setProperty("/editable", false);
                        this.getView().setBusy(false);
                        let arrAttachemnts = res.TO_ATTACHMENTS.results.map((item) => {
                            return {
                                "REGESTERED_MAIL": item.REGISTERED_MAIL,
                                "DESCRIPTION": item.DESCRIPTION,
                                "IMAGEURL": item.IMAGEURL,
                                "IMAGE_FILE_NAME": item.IMAGE_FILE_NAME
                            }
                        })

                        this.payLoad =
                        {
                            "action": "APPROVE",
                            "REQUEST_NO": res.REQUEST_NO,
                            "stepNo": 1,
                            "reqHeader": [
                                {
                                    "REGISTERED_ID": res.REGISTERED_ID,
                                    "VENDOR_ORGANISATION_NAME": res.VENDOR_ORGANISATION_NAME,
                                    "CONTACT_PERSON": res.CONTACT_PERSON,
                                    "PRIORITY": res.PRIORITY,
                                    "PAN_NO": res.PAN_NO,
                                    "GST_NO": res.GST_NO,
                                    "DUE_DELI_NUM": res.DUE_DELI_NUM,
                                    "LST_NO": res.LST_NO,
                                    "CST_NO": res.CST_NO,
                                    "MSME_CATEGORY": res.MSME_CATEGORY,
                                    "VENDOR_ACCOUNT_GROUP": res.VENDOR_ACCOUNT_GROUP,
                                    "DUE_DILIGANCE": res.DUE_DILIGANCE,
                                    "DUE_DILIGANCE_REQ_NO": res.DUE_DELI_NUM,
                                    "APPROVER": res.APPROVER
                                }
                            ],
                            "addressData": [
                                {
                                    "STREET1": res.TO_ADDRESS.results[0].STREET1,
                                    "STREET2": res.TO_ADDRESS.results[0].STREET2,
                                    "STREET3": res.TO_ADDRESS.results[0].STREET3,
                                    "CITY": res.TO_ADDRESS.results[0].CITY,
                                    "COUNTRY": res.TO_ADDRESS.results[0].COUNTRY,
                                    "DISTRICT": res.TO_ADDRESS.results[0].DISTRICT,
                                    "PINCODE": res.TO_ADDRESS.results[0].POSTAL_CODE,
                                    "STATE": res.TO_ADDRESS.results[0].STATE,
                                    "POSTAL_CODE": res.TO_ADDRESS.results[0].POSTAL_CODE,
                                    "EMAIL": res.TO_ADDRESS.results[0].EMAIL,
                                    "EMAIL_ADDRESS_FOR_PAYMENT": res.TO_ADDRESS.results[0].EMAIL_PAYMENT,
                                    "CONTACT_NO": res.TO_ADDRESS.results[0].CONTACT_NO,
                                    "CONTACT_TELECODE": res.TO_ADDRESS.results[0].TELEPHONE
                                }
                            ],
                            "bankData": [
                                {
                                    "BRANCH_NAME": res.TO_BANKS.results[0].BRANCH_NAME,
                                    "IFSC": res.TO_BANKS.results[0].IFSC_CODE,
                                    "BANK_NAME": res.TO_BANKS.results[0].BANK_NAME,
                                    "ACCOUNT_NO": res.TO_BANKS.results[0].ACCOUNT_NO,
                                    "ACCOUNT_TYPE": res.TO_BANKS.results[0].ACCOUNT_TYPE
                                }
                            ],
                            "CompanyProfile": arrAttachemnts,


                        }



                    }.bind(this),
                    error: function (err) {
                        debugger;
                    }
                })
            },

            onNavBack: function () {
                history.go(-1)
            },

            onPreviewAttachment: function (oEvent) {
                debugger;
                let pdfURL = oEvent.getSource().data("customData");

                // Function to convert URL to base64 and preview it
                window.open(pdfURL, '_blank');
            },

            convertUrlToBase64: function (url, callback) {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        let reader = new FileReader();
                        reader.onloadend = function () {
                            let base64String = reader.result.split(',')[1]; // Remove the "data:application/pdf;base64," part
                            callback(base64String);
                        };
                        reader.readAsDataURL(blob);
                    })
                    .catch(error => {
                        console.error('Error fetching the PDF file:', error);
                        sap.m.MessageBox.error('Failed to fetch the PDF file. Please try again.');
                    });
            },




            // onSubmitRequestForm:function(){
            //     debugger;
            //     let data = this.payLoad;
            //     let model=this.getView().getModel();

            //      model.create("/PostRegData",data,{
            //         success: function(res,data){
            //             console.log("res",res)
            //             debugger;
            //             MessageBox.show("Approved Successfully");
            //         },
            //         error: function(err){
            //             debugger;
            //             MessageBox.show("Unable to Approve");
            //         }
            //      })

            // }
            // onSubmitRequestForm: function () {
            //     debugger;
            //     this.getView().setBusy(true)
            //     var sFunctionImportPath = "/PostRegData";
            //     let oModel = this.getView().getModel();
            //     let pData = this.payLoad;
            //     oModel.create(sFunctionImportPath, pData, {
            //         success: function (oData, response) {
            //             debugger;
            //             this.getView().setBusy(false)
            //             sap.m.MessageBox.success(oData.PostRegData, {
            //                 emphasizedAction: sap.m.MessageBox.Action.CLOSE,
            //                 onClose: function (sAction) {
            //                     this.getOwnerComponent().getRouter().navTo("RegisterApproval")

            //                 }.bind(this)
            //             })
            //         }.bind(this),
            //         error: function (oError) {
            //             debugger;
            //             const jsonResponse = JSON.parse(oError.responseText);
            //             const errorMessage = jsonResponse.error.message.value;
            //             this.getView().setBusy(false)
            //             sap.m.MessageBox.error(errorMessage);

            //         }.bind(this)
            //     });
            // },

            onSubmitRequestForm: function () {
                MessageBox.confirm(`Are you sure you want to Approve?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.getView().setBusy(true);
                            var sFunctionImportPath = "/PostRegData";
                            let oModel = this.getView().getModel();
                            let pData = this.payLoad;
                            oModel.create(sFunctionImportPath, pData, {
                                success: function (oData, response) {
                                    debugger;
                                    this.getView().setBusy(false);
                                    sap.m.MessageBox.success(oData.PostRegData, {
                                        emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                                        onClose: function (sAction) {
                                            this.getOwnerComponent().getRouter().navTo("RegisterApproval");
                                        }.bind(this)
                                    });
                                }.bind(this),
                                error: function (oError) {
                                    debugger;
                                    const jsonResponse = JSON.parse(oError.responseText);
                                    const errorMessage = jsonResponse.error.message.value;
                                    this.getView().setBusy(false);
                                    sap.m.MessageBox.error(errorMessage);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },


            // _submitForm: function () {
            //     debugger;
            //     this.getView().setBusy(true);
            //     var sFunctionImportPath = "/PostRegData";
            //     let oModel = this.getView().getModel();
            //     let pData = this.payLoad;
            //     oModel.create(sFunctionImportPath, pData, {
            //         success: function (oData, response) {
            //             debugger;
            //             this.getView().setBusy(false);
            //             sap.m.MessageBox.success(oData.PostRegData, {
            //                 emphasizedAction: sap.m.MessageBox.Action.CLOSE,
            //                 onClose: function (sAction) {
            //                     this.getOwnerComponent().getRouter().navTo("RegisterApproval");
            //                 }.bind(this)
            //             });
            //         }.bind(this),
            //         error: function (oError) {
            //             debugger;
            //             const jsonResponse = JSON.parse(oError.responseText);
            //             const errorMessage = jsonResponse.error.message.value;
            //             this.getView().setBusy(false);
            //             sap.m.MessageBox.error(errorMessage);
            //         }.bind(this)
            //     });
            // },


            formatDueDeliNum: function (sDueDeliNum) {
                return sDueDeliNum ? sDueDeliNum : "N/A";
            },

            onRejectRegistration: function () {
                MessageBox.confirm("Are you sure you want to Reject?",{
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction : MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.getView().setBusy(true)
                            var sFunctionImportPath = "/PostRegData";
                            let oModel = this.getView().getModel();
                            let pData = this.payLoad;
                            pData.action = "REJECT"
            
                            oModel.create(sFunctionImportPath, pData, {
                                success: function (oData, response) {
                                    debugger;
                                    this.getView().setBusy(false)
                                    sap.m.MessageBox.success('Request Rejected', {
                                        emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                                        onClose: function (sAction) {
                                            this.getOwnerComponent().getRouter().navTo("RegisterApproval")
            
                                        }.bind(this)
                                    })
                                }.bind(this),
                                error: function (oError) {
                                    debugger;
                                    this.getView().setBusy(false)
                                    sap.m.MessageBox.error("Something went Wrong");
                                    console.error("Error:", oError);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                })
              
            },
            onSendBackRegistration: function () {
                var oView = this.getView();
                if (!this.sendBackFragment) {
                    this.sendBackFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestManagement.SendBackDialog", this);
                    this.getView().addDependent(this.sendBackFragment);
                }
                this.sendBackFragment.open();
            },

            onDialogCancel: function () {
                this.sendBackFragment.close();
            },

            onSendBackConfirm: function () {
                var sInstructions = sap.ui.getCore().byId("instructionInput").getValue();
                this.getView().setBusy(true);

                var sFunctionImportPath = "/PostRegData";
                let oModel = this.getView().getModel();
                let pData = this.payLoad;
                pData.action = "SEND_BACK";
                debugger;
                pData.reqHeader[0].INSTRUCTIONS = sInstructions; // Add instructions to payload


                oModel.create(sFunctionImportPath, pData, {
                    success: function (oData, response) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success('Request Sent Back', {
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                            onClose: function (sAction) {
                                this.getOwnerComponent().getRouter().navTo("RegisterApproval");
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
                this.sendBackFragment.close(); // Close the dialog
            },

            onEditPress: function () {
                debugger;
                let oModel = this.getView().getModel("requestInfo");
                let bEditable = oModel.getProperty("/editable");
                // this.byId("idSubmitBtn").setVisible(true)
                oModel.setProperty("/editable", !bEditable);
                let bAcceptBtnVisible = this.byId("idAcceptBtn").getEnabled();
                let bRejectBtnVisible = this.byId("idRejectBtn").getEnabled();
                let bSendBackBtnVisible = this.byId("idSendBackBtn").getEnabled();
                let bSubmitBtnVisible = this.byId("idSubmitBtn").getVisible();

                // Toggle the visibility state of the buttons
                this.byId("idAcceptBtn").setEnabled(!bAcceptBtnVisible);
                this.byId("idRejectBtn").setEnabled(!bRejectBtnVisible);
                this.byId("idSendBackBtn").setEnabled(!bSendBackBtnVisible);
                this.byId("idSubmitBtn").setVisible(!bSubmitBtnVisible);
                let sEditButtonText = bEditable ? "Edit" : "Cancel";
                this.byId("idEditBtn").setText(sEditButtonText);
            },

            onSubmitEditRegistration: function () {
                this.getView().setBusy(true)
                var sFunctionImportPath = "/PostRegData";
                let dataModel = this.getView().getModel("requestInfo")
                let oModel = this.getView().getModel();
                let pData = dataModel.getData();
                const payload = this.convertModelToPayload(pData);
                debugger;
                oModel.create(sFunctionImportPath, payload, {
                    success: function (oData, response) {
                        debugger;
                        this.getView().setBusy(false)
                        sap.m.MessageBox.success('Request Edited Succesfully!', {
                            emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                            onClose: function (sAction) {
                                this.byId("idAcceptBtn").setEnabled(false);
                                this.byId("idRejectBtn").setEnabled(false);
                                this.byId("idSendBackBtn").setEnabled(false);
                                this.byId("idSubmitBtn").setVisible(false);
                                this.byId("idEditBtn").setText("Edit");
                                this.getOwnerComponent().getRouter().navTo("RegisterApproval")

                            }.bind(this)
                        })
                    }.bind(this),
                    error: function (oError) {
                        debugger;
                        this.getView().setBusy(false)
                        sap.m.MessageBox.error("Something went Wrong");
                        console.error("Error:", oError);
                    }.bind(this)
                });
            },

            convertModelToPayload: function (modelData) {
                return {
                    "action": "EDIT",
                    "stepNo": 1,
                    "REQUEST_NO": modelData.REQUEST_NO,
                    "reqHeader": [
                        {
                            "REGISTERED_ID": modelData.REGISTERED_ID,
                            "VENDOR_ORGANISATION_NAME": modelData.VENDOR_ORGANISATION_NAME,
                            "CONTACT_PERSON": modelData.CONTACT_PERSON,
                            "PRIORITY": modelData.PRIORITY,
                            "PAN_NO": modelData.PAN_NO,
                            "GST_NO": modelData.GST_NO,
                            "DUE_DELI_NUM": modelData.DUE_DELI_NUM,
                            "LST_NO": modelData.LST_NO,
                            "CST_NO": modelData.CST_NO,
                            "MSME_CATEGORY": modelData.MSME_CATEGORY,
                            "VENDOR_ACCOUNT_GROUP": modelData.VENDOR_ACCOUNT_GROUP,
                            "DUE_DILIGANCE": modelData.DUE_DILIGANCE,
                            "DUE_DILIGANCE_REQ_NO": modelData.DUE_DILIGANCE_REQ_NO,
                            "APPROVER": modelData.APPROVER
                        }
                    ],
                    "addressData": modelData.TO_ADDRESS.results.map(address => ({
                        "STREET1": address.STREET1,
                        "CITY": address.CITY,
                        "COUNTRY": address.COUNTRY,
                        "DISTRICT": address.DISTRICT,
                        "PINCODE": address.PINCODE,
                        "STATE": address.STATE,
                        "POSTAL_CODE": address.POSTAL_CODE,
                        "EMAIL": address.EMAIL,
                        "EMAIL_ADDRESS_FOR_PAYMENT": address.EMAIL_ADDRESS_FOR_PAYMENT,
                        "CONTACT_NO": address.CONTACT_NO,
                        "CONTACT_TELECODE": address.CONTACT_TELECODE
                    })),
                    "bankData": modelData.TO_BANKS.results.map(bank => ({
                        "BRANCH_NAME": bank.BRANCH_NAME,
                        "IFSC": bank.IFSC,
                        "BANK_NAME": bank.BANK_NAME,
                        "ACCOUNT_NO": bank.ACCOUNT_NO,
                        "ACCOUNT_TYPE": bank.ACCOUNT_TYPE
                    })),
                    "CompanyProfile": modelData.TO_ATTACHMENTS.results.map(attachment => ({
                        "REGESTERED_MAIL": attachment.REGESTERED_MAIL,
                        "DESCRIPTION": attachment.DESCRIPTION,
                        "IMAGEURL": attachment.IMAGEURL,
                        "IMAGE_FILE_NAME": attachment.IMAGE_FILE_NAME
                    }))
                };
            }

        });
    });
