sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, Filter, JSONModel) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.RegistrationForm", {
            onInit: function () {
                debugger;
                this._Router = this.getOwnerComponent().getRouter();
                let model = this.getOwnerComponent().getModel("registration-manage")
                this.getView().setModel(model)
                this._Router.getRoute("RegisterFormPage").attachPatternMatched(function (oEvent) {
                    let oDataModel = this.getOwnerComponent().getModel('agpFormData')
                    this._Email = oEvent.getParameter("arguments").Email;
                    var attchmentModel = new JSONModel();
                    this.getView().setModel(attchmentModel, "attachmModel");
                    let req = oEvent.getParameter("arguments").id;
                    oDataModel.setProperty('/GENERAL_INFORMATION/VENDOR_ADDRESS/EMAIL', this._Email)
                    model.read(`/RequestInfo(${req})`, {
                        success: function (res) {
                            debugger;
                            let aFilters = [
                                new Filter("accountGroupCode", "EQ", res.VENDOR_ACCOUNT_GROUP)
                            ];
                            oDataModel.setProperty('/FINANCIAL_INFORMATION/PRIMARY_BANK_DETAILS/VENDOR_ACCOUNT_GROUP', res.VENDOR_ACCOUNT_GROUP)
                            this.status = res.STATUS
                            if (this.status === 9) {
                                let oDataModel = this.getOwnerComponent().getModel('agpFormData');
                                let docmodel = this.getView().getModel("attachmModel");

                                // Map the response data to your model structure
                                let mappedData = {
                                    GENERAL_INFORMATION: {
                                        VENDOR_INFORMATION: {
                                            VENDOR_NAME: res.VENDOR_ORGANISATION_NAME,
                                            WEBSITE: "",
                                            EMAIL: res.EMAIL,
                                            VENDOR_ORGANISATION_NAME: res.VENDOR_ORGANISATION_NAME,
                                            CONTACT_PERSON: res.CONTACT_PERSON,
                                            PRIORITY: res.PRIORITY
                                        },
                                        VENDOR_ADDRESS: {
                                            STREET: res.TO_ADDRESS.results[0].STREET1,
                                            STREET2: res.TO_ADDRESS.results[0].STREET2,
                                            STREET3: res.TO_ADDRESS.results[0].STREET3,
                                            REGION: "",
                                            DISTRICT: res.TO_ADDRESS.results[0].DISTRICT,
                                            CITY: res.TO_ADDRESS.results[0].CITY,
                                            STATE: res.TO_ADDRESS.results[0].STATE,
                                            COUNTRY: res.TO_ADDRESS.results[0].COUNTRY,
                                            POSTAL_CODE: res.TO_ADDRESS.results[0].POSTAL_CODE,
                                            EMAIL: res.TO_ADDRESS.results[0].EMAIL,
                                            CONTACT_NO: res.TO_ADDRESS.results[0].CONTACT_NO,
                                            TELEPHONE: res.TO_ADDRESS.results[0].CONTACT_TELECODE,
                                            EMAIL_PAYMENT: res.TO_ADDRESS.results[0].EMAIL_ADDRESS_FOR_PAYMENT
                                        }
                                    },
                                    FINANCIAL_INFORMATION: {
                                        PRIMARY_BANK_DETAILS: {
                                            BANK_COUNTRY: res.TO_BANKS.results[0].BANK_COUNTRY,
                                            IFSC_CODE: res.TO_BANKS.results[0].IFSC,
                                            SWIFT_CODE: "",
                                            BANK_NAME: res.TO_BANKS.results[0].BANK_NAME,
                                            BRANCH_NAME: res.TO_BANKS.results[0].BRANCH_NAME,
                                            BENEFICIARY_NAME: "",
                                            ACCOUNT_NO: res.TO_BANKS.results[0].ACCOUNT_NO,
                                            ACCOUNT_NAME: "",
                                            BANK_CURRENCY: "",
                                            ACCOUNT_TYPE: res.TO_BANKS.results[0].ACCOUNT_TYPE,
                                            LOCAL_SALES_TAX_NO: res.LOCAL_SALES_TAX_NO,
                                            COMMERCIAL_SALES_TAX_NO: res.COMMERCIAL_SALES_TAX_NO,
                                            PAN_NO: res.PAN_NO,
                                            GST_NO: res.GST_NO,
                                            MSME_CATEGORY: res.MSME_CATEGORY,
                                            LST_NO: res.LST_NO,
                                            CST_NO: res.CST_NO,
                                            VENDOR_ACCOUNT_GROUP: res.VENDOR_ACCOUNT_GROUP,
                                            DUE_DELI_NUM: res.DUE_DELI_NUM,
                                            APPROVER: res.APPROVER
                                        }
                                    },
                                    ATTACHMENTS: {
                                        attachments: res.TO_ATTACHMENTS.results.map(item => ({
                                            REGISTERED_MAIL: item.REGISTERED_MAIL,
                                            DESCRIPTION: item.DESCRIPTION,
                                            IMAGEURL: item.IMAGEURL,
                                            IMAGE_FILE_NAME: item.IMAGE_FILE_NAME
                                        }))
                                    }
                                };

                                // Set the mapped data to the model
                                debugger
                                oDataModel.setData(mappedData);
                                
                                // Reset the attachment model
                                // model.read("/VendorAccountGroupAttachments", {
                                //     filters: aFilters,
                                //     success: function (oData) {
                                //         this.getView().setBusy(true)
                                //         let oDueDiligenceYes = this.byId("dueDiligenceYes");
                                //         let bDueDiligenceSelected = oDueDiligenceYes.getSelected();
                                //         debugger;
                                //         let res = oData.results[0].requisiteDocuments.split(",");
                                //         let dataArray = res.map((item) => {
                                //             return {
                                //                 doc: item,
                                                
                                //             }
                                //         });
                
                                //         // Check if Due Diligence Yes is selected
                                //         if (bDueDiligenceSelected) {
                                //             dataArray.push({ doc: "MSME" });
                                //         }
                
                                //         var attchmentModels = this.getView().getModel("attachmModel");
                                //         attchmentModels.setData({ documents: dataArray })
                                //         this.getView().setBusy(false)
                                //         debugger;
                                //     }.bind(this),
                                //     error: function (oError) {
                
                                //     }
                                // });

                            }
                            model.read("/VendorAccountGroupAttachments", {
                                filters: aFilters,
                                success: function (oData) {
                                    this.getView().setBusy(true)
                                    let oDueDiligenceYes = this.byId("dueDiligenceYes");
                                    let bDueDiligenceSelected = oDueDiligenceYes.getSelected();
                                    debugger;
                                    let res = oData.results[0].requisiteDocuments.split(",");
                                    let dataArray = res.map((item) => {
                                        return {
                                            REGISTERED_MAIL: this._Email,
                                            DESCRIPTION: item,
                                            IMAGEURL: "",
                                            IMAGE_FILE_NAME: item
                                        }
                                    });
            
                                    // Check if Due Diligence Yes is selected
                                    if (bDueDiligenceSelected) {
                                        dataArray.push({ 
                                            REGISTERED_MAIL: this._Email,
                                            DESCRIPTION: "MSME",
                                            IMAGEURL: "",
                                            IMAGE_FILE_NAME: "MSME"
                                        });
                                    }
            
                                    var attchmentModels = this.getView().getModel("attachmModel");
                                    attchmentModels.setData({ documents: dataArray })
                                    this.getView().setBusy(false)
                                    debugger;
                                }.bind(this),
                                error: function (oError) {
            
                                }
                            });
                        }.bind(this),
                        error: function (res) {
                            debugger;
                        }
                    });

                }, this);
                this._wizard = this.byId("idWizard");
                this._oNavContainer = this.byId("idNavContainer");
                this._oWizardContentPage = this.byId("idWizardContentPage");

                this._AttachmentData = []

                this.stateCodeMapping = {
                    "Jammu and Kashmir": "01",
                    "Himachal Pradesh": "02",
                    "Punjab": "03",
                    "Chandigarh": "04",
                    "Uttarakhand": "05",
                    "Haryana": "06",
                    "Delhi": "07",
                    "Rajasthan": "08",
                    "Uttar Pradesh": "09",
                    "Bihar": "10",
                    "Sikkim": "11",
                    "Arunachal Pradesh": "12",
                    "Nagaland": "13",
                    "Manipur": "14",
                    "Mizoram": "15",
                    "Tripura": "16",
                    "Meghalaya": "17",
                    "Assam": "18",
                    "West Bengal": "19",
                    "Jharkhand": "20",
                    "Odisha": "21",
                    "Chattisgarh": "22",
                    "Madhya Pradesh": "23",
                    "Gujarat": "24",
                    "Daman and Diu": "25",
                    "Dadra and Nagar Haveli": "26",
                    "Maharashtra": "27",
                    "Karnataka": "29",
                    "Goa": "30",
                    "Lakshadweep Islands": "31",
                    "Kerala": "32",
                    "Tamil Nadu": "33",
                    "Pondicherry": "34",
                    "Andaman and Nicobar": "35",
                    "Telangana": "36",
                    "Andhra Pradesh": "37",
                    "Ladakh": "38"
                };

            },
            handleFileSelection: function (oEvent) {
                let oFileUploader = oEvent.getSource();
                let oFile = oEvent.getParameter("files")[0];
                let oFileName = oFileUploader.getProperty('name')

                let oReader = new FileReader();
                oReader.onload = function (e) {
                    let sBaseURL = e.target.result;
                    this._URL = sBaseURL;
                    this.getView().byId('idDeleteAttachmentBtn').setEnabled(true)
                    this.getView().byId('idPreviewAttachmentBtn').setEnabled(true)
                    this.getView().byId('idSubmitButton').setEnabled(true)
                }.bind(this);
                oReader.readAsDataURL(oFile);
            },
            // onSelectionChange:function(oEvent){
            //     let oAttachmentData = {
            //         name: oEvent.getSource().getProperty('name'),
            //         description: oEvent.getSource().getProperty('additionalData'),
            //         fileName: oEvent.getParameter("files")[0].name,
            //         url: ''
            //     }
            //     debugger
            //     // let oModel = this.getOwnerComponent().getModel('RegistrationData')
            //     let oFileUploader = oEvent.getSource();
            //     let oFile = oEvent.getParameter("files")[0];
            //     let oFileName = oFileUploader.getProperty('name')
            //     let oReader = new FileReader();
            //     oReader.onload = function (e) {
            //         let sUrl = e.target.result;
            //         let sBase64Url = sUrl.split(',')[1]
            //         debugger;
            //         // oModel.setProperty(`/ATTACHMENTS/${oFileName}/IMAGEURL`, sBase64Url)
            //         oAttachmentData.url = sBase64Url
            //         this._AttachmentData.push(oAttachmentData)
            //     }.bind(this);
            //     oReader.readAsDataURL(oFile);
            // },
            onItemAdded: function (oEvent) {
                oEvent.getParameter("item").setVisibleEdit(false)
            },
            onUploadCompleted: function (oEvent) {
                debugger;

                let oItem = oEvent.getParameter('item');
                let oFile = oItem.getFileObject();
                let oFileName = oFile.name; // Get the file name
                let oFileType = oFile.type; // Get the file type
                let oReader = new FileReader();
                let oModel = this.getView().getModel("agpFormData");

                oReader.onload = function (e) {
                    let sUrl = e.target.result;
                    let sBase64Url = sUrl.split(',')[1];

                    // Set the object with fileName, fileType, and base64Url in oModel
                    let oAttachmentData = {
                        fileName: oFileName,
                        fileType: oFileType,
                        base64Url: sBase64Url
                    };

                    // Get the current attachments array from the model
                    let aAttachments = oModel.getProperty("/ATTACHMENTS/attachments") || [];

                    // Push the new attachment data into the attachments array
                    aAttachments.push(oAttachmentData);

                    // Update the model with the new attachments array
                    // oModel.setProperty("/ATTACHMENTS", aAttachments);

                    debugger;
                }.bind(this);

                oReader.readAsDataURL(oFile);

                let arr = this.byId("UploadSet").getItems();
                debugger;
            },

            testFuntion: function (oEvent) {

                debugger;
                let oAttachmentData = {
                    // name: oEvent.getSource().getProperty('name'),
                    // description: oEvent.getSource().getProperty('additionalData'),
                    // fileName: oEvent.getParameter("files")[0].name,
                    // url: '',
                    REGESTERED_MAIL: this._Email,
                    DESCRIPTION: oEvent.getSource().getProperty('name'),
                    IMAGEURL: "",
                    IMAGE_FILE_NAME: oEvent.getParameter("files")[0].name,
                }
                debugger
                let oModel = this.getOwnerComponent().getModel('agpFormData')
                let aAttachments = oModel.getProperty('/ATTACHMENTS/attachments') || [];
                // Push new attachment data
                aAttachments.push(oAttachmentData);
                // Update model with the new attachments array
                oModel.setProperty('/ATTACHMENTS/attachments', aAttachments);
                let oFileUploader = oEvent.getSource();
                let oFile = oEvent.getParameter("files")[0];
                let oFileName = oFileUploader.getProperty('name')
                let oReader = new FileReader();
                oReader.onload = function (e) {
                    let sUrl = e.target.result;
                    let sBase64Url = sUrl.split(',')[1]
                    oModel.setProperty(`/ATTACHMENTS/attachments/${oFileName}/IMAGEURL`, sBase64Url)
                    oAttachmentData.IMAGEURL = sBase64Url
                    this._AttachmentData.push(oAttachmentData)
                }.bind(this);
                oReader.readAsDataURL(oFile);
            },


            handleOpenAttachment: function (oEvent) {
                let base64URL = oEvent.getSource().data("customData"); // Your base64 URL
                let oModel = this.getOwnerComponent().getModel('agpFormData');
                let arr = oModel.getData().ATTACHMENTS.attachments;
                let res = arr.find(attachment => attachment.DESCRIPTION === base64URL);
                debugger
                this.convertBlobUrlToBase64(res.IMAGEURL).then(function(base64String) {
                    console.log("Base64 String:", base64String);
                    // You can now use the base64String as needed
                }).catch(function(error) {
                    console.error("Error converting Blob URL to Base64:", error);
                });
                // var byteCharacters = atob(res.IMAGEURL);
                // var byteNumbers = new Array(byteCharacters.length);
                // for (var i = 0; i < byteCharacters.length; i++) {
                //     byteNumbers[i] = byteCharacters.charCodeAt(i);
                // }
                // var byteArray = new Uint8Array(byteNumbers);

                // // Create a blob from the byte array
                // var blob = new Blob([byteArray], { type: 'application/pdf' });

                // // Create an object URL from the blob
                // var objectURL = URL.createObjectURL(blob);

                // // Open the object URL in a new tab
                // window.open(objectURL);
            },
            handleFormSubmit: function (oEvent) {
                let validation = this._validateForm();
               
                debugger;
                if (validation == true) {
                    this.getOwnerComponent().getRouter().navTo(`Login${this._Email}`)
                    let oDataModel = this.getOwnerComponent().getModel('agpFormData')
                    let oModel = this.getView().getModel()
                    let oData = oDataModel.getData()
                    this.getView().setBusy(true);
                    let docmodel = this.getView().getModel("attachmModel");
                    let requiredDocuments = docmodel.getData().documents;
                    let arrReq = requiredDocuments.map((doc) => doc.DESCRIPTION)



                    //PREPARING PAYLOAD
                    let aReqHeader = [];
                    let aAddressData = [];
                    let aBankData = [];
                    let attachment = [];

                    let oReqHeader = {
                        "REGISTERED_ID": this._Email,
                        "VENDOR_ORGANISATION_NAME": oData.GENERAL_INFORMATION.VENDOR_INFORMATION.VENDOR_ORGANISATION_NAME,
                        "CONTACT_PERSON": oData.GENERAL_INFORMATION.VENDOR_INFORMATION.CONTACT_PERSON,
                        "PRIORITY": oData.GENERAL_INFORMATION.VENDOR_INFORMATION.PRIORITY,
                        "PAN_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.PAN_NO,
                        "GST_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.GST_NO,
                        "DUE_DELI_NUM": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.DUE_DELI_NUM,
                        "LST_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.LST_NO,
                        "CST_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.CST_NO,
                        "MSME_CATEGORY": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.MSME_CATEGORY,
                        "VENDOR_ACCOUNT_GROUP": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.VENDOR_ACCOUNT_GROUP,
                        "DUE_DILIGANCE": false,
                        "DUE_DILIGANCE_REQ_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.DUE_DELI_NUM,
                        "APPROVER": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.APPROVER

                    }

                    let oAddressData = {
                        "STREET1": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.STREET,
                        "STREET2": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.STREET2,
                        "STREET3": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.STREET3,
                        "CITY": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.CITY,
                        "COUNTRY": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.COUNTRY,
                        "DISTRICT": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.DISTRICT,
                        "PINCODE": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.POSTAL_CODE,
                        "STATE": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.STATE,
                        "POSTAL_CODE": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.POSTAL_CODE,
                        "EMAIL": this._Email,
                        "EMAIL_ADDRESS_FOR_PAYMENT": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.EMAIL_PAYMENT,
                        "CONTACT_NO": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.CONTACT_NO,
                        "CONTACT_TELECODE": oData.GENERAL_INFORMATION.VENDOR_ADDRESS.TELEPHONE
                    }


                    let oBankData = {
                        "BRANCH_NAME": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.BRANCH_NAME,
                        "IFSC": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.IFSC_CODE,
                        "BANK_NAME": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.BANK_NAME,
                        "ACCOUNT_NO": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.ACCOUNT_NO,
                        "ACCOUNT_TYPE": oData.FINANCIAL_INFORMATION.PRIMARY_BANK_DETAILS.ACCOUNT_TYPE
                    };
                    let AllAttachemnts = [];
                    oData.ATTACHMENTS.attachments.map((item) => {
                        let oCompanyProfile = {
                            REGESTERED_MAIL: item.REGESTERED_MAIL,
                            DESCRIPTION: item.DESCRIPTION,
                            IMAGEURL: item.IMAGEURL,
                            IMAGE_FILE_NAME: item.IMAGE_FILE_NAME
                        }
                        AllAttachemnts.push(oCompanyProfile)
                    })
                    debugger
                    let arr = AllAttachemnts.map(obj => obj.DESCRIPTION)

                    let missingDocuments = arrReq.filter(doc => !arr.includes(doc));

                    if (missingDocuments.length > 0) {
                        this.getView().setBusy(false);
                        return sap.m.MessageBox.error("Please upload all required documents: " + missingDocuments.join(", "));
                    }
                    aReqHeader.push(oReqHeader)
                    aAddressData.push(oAddressData)
                    aBankData.push(oBankData)

                    const oPayload = {
                        action: this.status == 6 ? "CREATE" : "EDIT",
                        stepNo: 1,
                        reqHeader: aReqHeader,
                        addressData: aAddressData,
                        bankData: aBankData,
                        CompanyProfile: AllAttachemnts,
                    }

                    debugger;

                    oModel.create('/PostRegData', oPayload, {
                        success: function (oEvent) {
                            debugger
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success('Submitted', {
                                emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                                onClose: function (sAction) {
                                    oDataModel.setData({
                                        GENERAL_INFORMATION: {
                                            VENDOR_INFORMATION: {
                                                VENDOR_ORGANISATION_NAME: "",
                                                CONTACT_PERSON: "",
                                                PRIORITY: ""
                                            },
                                            VENDOR_ADDRESS: {
                                                STREET: "",
                                                STREET2: "",
                                                STREET3: "",
                                                CITY: "",
                                                COUNTRY: "",
                                                DISTRICT: "",
                                                POSTAL_CODE: "",
                                                STATE: "",
                                                EMAIL_PAYMENT: "",
                                                CONTACT_NO: "",
                                                TELEPHONE: ""
                                            }
                                        },
                                        FINANCIAL_INFORMATION: {
                                            PRIMARY_BANK_DETAILS: {
                                                PAN_NO: "",
                                                GST_NO: "",
                                                DUE_DELI_NUM: "",
                                                LST_NO: "",
                                                CST_NO: "",
                                                MSME_CATEGORY: "",
                                                VENDOR_ACCOUNT_GROUP: "",
                                                APPROVER: "",
                                                BRANCH_NAME: "",
                                                IFSC_CODE: "",
                                                BANK_NAME: "",
                                                ACCOUNT_NO: "",
                                                ACCOUNT_TYPE: ""
                                            }
                                        },
                                        ATTACHMENTS: {
                                            attachments: []
                                        }
                                    });
                                    docmodel.setData({
                                        documents: []
                                    });
                                    this.getOwnerComponent().getRouter().navTo("RegisterManagement")

                                }.bind(this)
                            })
                            // sap.m.MessageBox.success("Submitted");
                            // const oRouter = this.getOwnerComponent().getRouter()
                            // oRouter.navTo('Login', { Email: this._EMAIL })
                        }.bind(this),
                        error: function (oEvent) {
                            debugger
                            this.getView().setBusy(false);
                            sap.m.MessageBox.error("Something went wrong \n Please try again")
                        }.bind(this),
                    })
                } else {
                    // Show an error message
                    sap.m.MessageToast.show("Please fill all the mandatory fields.");
                }

            },

            onDueDiligenceSelect: function (oEvent) {
                debugger;
                var sSelectedCheckBoxId = oEvent.getSource().getId();
                var oDueDiligenceYes = this.byId("dueDiligenceYes");
                var oDueDiligenceNo = this.byId("dueDiligenceNo");
                var oInput = this.byId("dueDiligenceRequestNumber");
                let attachmentModel = this.getView().getModel("attachmModel");
                let isYesSelected = oDueDiligenceYes.getSelected();
                let isNoSelected = oDueDiligenceNo.getSelected();

                // Ensure only one checkbox is selected at a time
                if (sSelectedCheckBoxId === oDueDiligenceYes.getId() && isYesSelected) {
                    oDueDiligenceNo.setSelected(false);
                    oInput.setEditable(true); // Make input editable if Yes is selected

                    if (attachmentModel) {
                        let res = attachmentModel.getData().documents;
                        let msmeDoc = res.find(doc => doc.doc === 'MSME');
                        if (!msmeDoc) {
                            res.push({
                                REGISTERED_MAIL: this._Email,
                                DESCRIPTION: "MSME",
                                IMAGEURL: "",
                                IMAGE_FILE_NAME: "MSME"
                            });
                            attachmentModel.refresh();
                        }
                    }
                } else if (sSelectedCheckBoxId === oDueDiligenceNo.getId() && isNoSelected) {
                    oDueDiligenceYes.setSelected(false);
                    oInput.setEditable(false); // Make input non-editable if No is selected

                    if (attachmentModel) {
                        let res = attachmentModel.getData().documents;
                        let msmeDocIndex = res.findIndex(doc => doc.DESCRIPTION === 'MSME');
                        if (msmeDocIndex !== -1) {
                            res.splice(msmeDocIndex, 1);
                            attachmentModel.refresh();
                        }
                    }
                }
            },


            onGstNumberChange: function (oEvent) {
                debugger;
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().toUpperCase(); // Convert to uppercase

                if (sValue.length > 15) {
                    oInput.setValue(sValue.substring(0, 15));
                    sValue = oInput.getValue();
                } else {
                    oInput.setValue(sValue); // Update the input with the uppercase value
                }

                var oPanInput = this.byId("panInput");
                var sPanValue = oPanInput.getValue().toUpperCase(); // Convert PAN to uppercase for comparison
                var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                if (sValue.length === 15) {
                    var stateCode = sValue.substring(0, 2);
                    var panPart = sValue.substring(2, 12);
                    var isValidStateCode = Object.values(this.stateCodeMapping).includes(stateCode);

                    if (!isValidStateCode) {
                        oInput.setValueState(sap.ui.core.ValueState.Error);
                        oInput.setValueStateText("Invalid GST number.");
                        return;
                    }

                    if (panPattern.test(panPart) && panPart === sPanValue) {
                        oInput.setValueState(sap.ui.core.ValueState.Success);
                        oInput.setValueStateText("");
                    } else {
                        oInput.setValueState(sap.ui.core.ValueState.Error);
                        oInput.setValueStateText("Invalid GST number.");
                    }
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Invalid GST number");
                }
            },



            onPanChange: function (oEvent) {
                debugger;
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().toUpperCase(); // Convert to uppercase

                // Regular expression for PAN validation
                var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                if (sValue.length > 10) {
                    oInput.setValue(sValue.substring(0, 10));
                    sValue = oInput.getValue();
                } else {
                    oInput.setValue(sValue); // Update the input with the uppercase value
                }

                if (sValue.length === 10) {
                    if (panPattern.test(sValue)) {
                        oInput.setValueState(sap.ui.core.ValueState.Success);
                        oInput.setValueStateText("");
                    } else {
                        oInput.setValueState(sap.ui.core.ValueState.Error);
                        oInput.setValueStateText("Invalid PAN format");
                    }
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Invalid PAN format");
                }
            },


            onPreviewBtn: function () {
                if (!this.previewFragment) {
                    this.previewFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.RequestForm.PreviewForm", this);
                    this.getView().addDependent(this.previewFragment);
                }
                this.previewFragment.open();
            },

            onClosePreview: function () {
                this.previewFragment.close()
            },
            onDownloadPDF: function () {

                var oVBox = sap.ui.getCore().byId("previewVBox");
                html2canvas(oVBox.getDomRef()).then(function (canvas) {
                    var imgData = canvas.toDataURL('image/jpeg', 0.6); // Adjust the second parameter to set the image quality (0.0 to 1.0)
                    const { jsPDF } = window.jspdf;
                    var doc = new jsPDF('p', 'mm', 'a4');

                    // Calculate width and height of the image in PDF format
                    var imgWidth = 210; // A4 width in mm
                    var pageHeight = 295; // A4 height in mm
                    var imgHeight = canvas.height * imgWidth / canvas.width;
                    var heightLeft = imgHeight;
                    var position = 0;

                    // Add image to PDF
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    // If the image is larger than one page, add extra pages
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        doc.addPage();
                        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    doc.save('FormPreview.pdf');
                }).catch(function (error) {
                    console.error('Error generating PDF:', error);
                });
            },
            onSelectVendorGroup: function (oEvent) {
                debugger;
                let oDueDiligenceYes = this.byId("dueDiligenceYes");
                let bDueDiligenceSelected = oDueDiligenceYes.getSelected();
                var sSelectedKey = oEvent.mParameters.value;
                let oModel = this.getOwnerComponent().getModel("registration-manage");
                var aFilters = [
                    new Filter("accountGroupCode", "EQ", sSelectedKey)
                ];

                oModel.read("/VendorAccountGroupAttachments", {
                    filters: aFilters,
                    success: function (oData) {
                        this.getView().setBusy(true)
                        let oDueDiligenceYes = this.byId("dueDiligenceYes");
                        let bDueDiligenceSelected = oDueDiligenceYes.getSelected();
                        debugger;
                        let res = oData.results[0].requisiteDocuments.split(",");
                        let dataArray = res.map((item) => {
                            return {
                                REGISTERED_MAIL: "",
                                DESCRIPTION: item,
                                IMAGEURL: "",
                                IMAGE_FILE_NAME: item
                            }
                        });

                        // Check if Due Diligence Yes is selected
                        if (bDueDiligenceSelected) {
                            dataArray.push({ doc: "MSME" });
                        }

                        var attchmentModels = this.getView().getModel("attachmModel");
                        attchmentModels.setData({ documents: dataArray })
                        this.getView().setBusy(false)
                        debugger;
                    }.bind(this),
                    error: function (oError) {

                    }
                });
            },

            _validateForm: function () {
                var isValid = true;

                // Collect all the required inputs from all forms
                var aForms = [
                    this.byId("SimpleFormChangeColumn_oneGrousp234"),
                    this.byId("SimpleFormChangeColumn_oneGroup234"),
                    this.byId("SimpleFormChangeColumn_oneGrokup234"),
                    this.byId("SimpleFormChangeColumn_oneGrsoup234")
                ];

                aForms.forEach(function (oForm) {
                    var aContent = oForm.getContent();
                    aContent.forEach(function (oElement) {
                        if (oElement instanceof sap.m.Input || oElement instanceof sap.m.ComboBox) {
                            if (oElement.getRequired() && !oElement.getValue()) {
                                oElement.setValueState("Error");
                                isValid = false;
                            } else {
                                oElement.setValueState("None");
                            }
                        }
                        if (oElement instanceof sap.m.CheckBox) {
                            // Handle checkboxes if needed
                        }
                    });
                });

                return isValid;
            },

            onBackfromForm: function () {
                this
                let oDataModel = this.getOwnerComponent().getModel('agpFormData');
                oDataModel.setData({
                    GENERAL_INFORMATION: {
                        VENDOR_INFORMATION: {
                            VENDOR_ORGANISATION_NAME: "",
                            CONTACT_PERSON: "",
                            PRIORITY: ""
                        },
                        VENDOR_ADDRESS: {
                            STREET: "",
                            STREET2: "",
                            STREET3: "",
                            CITY: "",
                            COUNTRY: "",
                            DISTRICT: "",
                            POSTAL_CODE: "",
                            STATE: "",
                            EMAIL_PAYMENT: "",
                            CONTACT_NO: "",
                            TELEPHONE: ""
                        }
                    },
                    FINANCIAL_INFORMATION: {
                        PRIMARY_BANK_DETAILS: {
                            PAN_NO: "",
                            GST_NO: "",
                            DUE_DELI_NUM: "",
                            LST_NO: "",
                            CST_NO: "",
                            MSME_CATEGORY: "",
                            VENDOR_ACCOUNT_GROUP: "",
                            APPROVER: "",
                            BRANCH_NAME: "",
                            IFSC_CODE: "",
                            BANK_NAME: "",
                            ACCOUNT_NO: "",
                            ACCOUNT_TYPE: ""
                        }
                    },
                    ATTACHMENTS: {
                        attachments: []
                    }
                });
                this.getOwnerComponent().getRouter().navTo("RegisterManagement")
            },

            convertBlobUrlToBase64: function(blobUrl) {
                return new Promise(function(resolve, reject) {
                    fetch(blobUrl)
                        .then(function(response) {
                            return response.blob(); // Fetch the Blob from the URL
                        })
                        .then(function(blob) {
                            var reader = new FileReader();
                            reader.onloadend = function() {
                                var base64data = reader.result.split(",")[1]; // Extract the base64 part from Data URL
                                resolve(base64data); // Resolve the promise with the Base64 string
                            };
                            reader.onerror = function(error) {
                                reject(error); // Reject the promise in case of an error
                            };
                            reader.readAsDataURL(blob); // Read the Blob as Data URL
                        })
                        .catch(function(error) {
                            reject(error); // Handle fetch errors
                        });
                });
            }

        });
    });
