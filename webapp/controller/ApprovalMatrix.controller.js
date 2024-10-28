sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.ApprovalMatrix", {
            onInit: function () {
                debugger;
                let oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oModel);

                let approvalMatrix = []
                var hierarchyModel = new sap.ui.model.json.JSONModel({ jsonObjects: approvalMatrix });
                this.getView().setModel(hierarchyModel, "hierarchydata");
                this._isBox1FullWidth = true;
                let usermodel = this.getOwnerComponent().getModel("user-master");
                this.getView().setModel(usermodel,"userModel")
                // usermodel.read("/GeographicalAreaMASTER",{
                //     success: function(res){
                //       let newGAModel = new sap.ui.model.json.JSONModel({Ga: res.results});

                //     },
                //     error : function(err){
                //         debugger;
                //     }
                // })

                const customizeConfig = {
                    autoColumnWidth: {
                        '*': { min: 2, max: 7, gap: 1, truncateLabel: false },
                        'USER_ID': { min: 2, max: 15, gap: 1, truncateLabel: false },
                        'COMPANY_CODE': { min: 2, max: 6, gap: 1, truncateLabel: false },
                        'SUPPL_TYPE': { min: 2, max: 7, gap: 1, truncateLabel: false },
                        "SUPPL_TYPE_DESC": { min: 2, max: 6, gap: 1, truncateLabel: false },
                        'STATUS': { min: 2, max: 3, gap: 1, truncateLabel: false },
                        "BP_TYPE_CODE": { min: 2, max: 8, gap: 1, truncateLabel: false }
                    }
                };
                this.oSmartTable = this.getView().byId('idSmartTablAppr');
                this.oSmartTable.setCustomizeConfig(customizeConfig);

            },


            onCreateApproval: function () {
                debugger;
                let oModel = this.getView().getModel()
                // oModel.setData({ jsonObjects: [] })
                // this.byId("idCompanyApproval").setValue("");
                // this.byId("idCompoBoxReq").setSelectedKey("");
                // this.byId("idEditApproval").setVisible(false)
                // var oBox1 = this.byId("box1");
                // var oBox2 = this.byId("box2");

                // if (this._isBox1FullWidth) {
                //     oBox1.getLayoutData().setSize("300px");
                //     oBox2.getLayoutData().setSize("auto");
                // } else {
                //     oBox1.getLayoutData().setSize("auto");
                //     oBox2.getLayoutData().setSize("0px");
                // }

                // this._isBox1FullWidth = !this._isBox1FullWidth;
                // oModel.read("/VMUsers", {
                //     success: function (res) {
                //         var mdmData = res.results.filter(function (item) {
                //             return item.USER_ROLE === "MDM"; // Adjust "MDM" to the role that represents MDM
                //         });

                //         var approverData = res.results.filter(function (item) {
                //             return item.USER_ROLE === "APPROVER"; // Adjust "APPROVER" to the role that represents Approver
                //         });

                //         // Creating JSON models
                //         var oMdmModel = new sap.ui.model.json.JSONModel({ Mdm: mdmData });
                //         var oApproverModel = new sap.ui.model.json.JSONModel({ Approver: approverData });

                //         // Setting the models to the view (adjust as necessary)
                //         this.getView().setModel(oMdmModel, "MdmModel");
                //         this.getView().setModel(oApproverModel, "ApproverModel");
                //         debugger;
                //     }.bind(this),
                //     error: function (err) {
                //         debugger;
                //     }
                // })
                if (!this.createFragment) {
                    this.createFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.ApprovalMatrix.createApprovalMatrix", this);
                    this.getView().addDependent(this.createFragment);
                }
                this.createFragment.open();
            },
            onValueHelpClicked: function () {
                if (!this.createFragmentValue) {
                    this.createFragmentValue = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.ApprovalMatrix.valueHelpForDepartment", this);
                    this.getView().addDependent(this.createFragmentValue);
                }
                this.createFragmentValue.open();
            },
            onCloseofApprovalDepartmentDialog: function (oEvent) {
                debugger;
                var sDescription, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                sDescription = oSelectedItem.getInfo();
                sTitle = oSelectedItem.getTitle()
                sap.ui.getCore().byId("idDepartments").setValue(`${sDescription} - ${sTitle}`);
                // sap.ui.getCore().byId("idUserName").setValue(sTitle);
                let oModel = this.getView().getModel()
                oModel.read("/VMUsers", {
                    success: function (res) {
                        var department = sTitle; 
                
                        // Filter for MDM role and specific department
                        var mdmData = res.results.filter(function (item) {
                            return item.USER_ROLE === "MDM" && item.DEPARTMENT === department;
                        });
                
                        // Filter for Approver role and specific department
                        var approverData = res.results.filter(function (item) {
                            return item.USER_ROLE === "APPROVER" && item.DEPARTMENT === department;
                        });

                        var reviewerData = res.results.filter(function (item) {
                            return item.USER_ROLE === "REVIEWER" && item.DEPARTMENT === department;
                        });
                
                        // Creating JSON models
                        var oMdmModel = new sap.ui.model.json.JSONModel({ Mdm: mdmData });
                        var oApproverModel = new sap.ui.model.json.JSONModel({ Approver: approverData });
                        var reviewerModel = new sap.ui.model.json.JSONModel({Reviewer:reviewerData})
                
                        // Setting the models to the view
                        this.getView().setModel(oMdmModel, "MdmModel");
                        this.getView().setModel(oApproverModel, "ApproverModel");
                        this.getView().setModel(reviewerModel, "reviewrModel");
                
                        debugger;
                    }.bind(this),
                    error: function (err) {
                        debugger;
                    }
                });
                
            },
            onCloseApprovalfrag: function () {
                debugger;
                this.createFragment.close();
                sap.ui.getCore().byId("idDepartments").setValue("");  
                sap.ui.getCore().byId("idReviewer").setSelectedKey("");  
                sap.ui.getCore().byId("idApprover").setSelectedKey("");  
                sap.ui.getCore().byId("idGAType").setSelectedKey("");
                sap.ui.getCore().byId("idMDM").setSelectedKey("");
            },
            onCloseApprovalSplit: function (oEvent) {
                debugger;
                let editVisib = this.byId("idEditApproval").getVisible();
                let createBtn = this.byId("idCreateMassRequest").getEnabled();
                let deleBtn = this.byId("idDeleteBtmApprovalRow").getVisible();
                let remBtn = this.byId("idRemoveBtmApprovalRow").getVisible();

                if (deleBtn) {
                    this.byId("idDeleteBtmApprovalRow").setVisible(false)
                    this.byId("idDeleteBtmApprovalRow").setEnabled(false)
                }
                if (remBtn) {
                    this.byId("idRemoveBtmApprovalRow").setVisible(false)
                    this.byId("idRemoveBtmApprovalRow").setEnabled(false)
                }
                if (!editVisib) {
                    this.byId("idEditApproval").setVisible(true)
                }
                if (createBtn) {
                    this.byId("idCreateMassRequest").setEnabled(false)
                    this.byId("idDeleteBtmApprovalRow").setEnabled(false)
                }
                // var oModel = this.getView().getModel("hierarchydata");
                // var aData = oModel.getData();
                // let companyCode = this.byId("idCompanyApproval").getValue().split("-")[0].trim();
                // let approvalType = this.byId("idCompoBoxReq").getSelectedKey();
                // debugger;
                // if (aData.jsonObjects.length !== 0 || companyCode.length !== 0 || approvalType.length !== 0) {
                //     var oButton = oEvent.getSource();
                //     this.byId("actionSheet").openBy(oButton);
                // } else {
                var oBox1 = this.byId("box1");
                var oBox2 = this.byId("box2");

                if (this._isBox1FullWidth) {
                    oBox1.getLayoutData().setSize("300px");
                    oBox2.getLayoutData().setSize("auto");
                } else {
                    oBox1.getLayoutData().setSize("auto");
                    oBox2.getLayoutData().setSize("0px");
                }
                this.byId("idSubmtUpdate").setVisible(false)
                this.byId("idSubBtn").setVisible(true)
                this.byId("idText").setText("New Company")
                this.byId("idCompoBoxReq").setEditable(true)

                this._isBox1FullWidth = !this._isBox1FullWidth;
                // }
            },
            onDiscardAll: function () {
                this.byId("idCompanyApproval").setValue("");
                this.byId("idCompoBoxReq").setSelectedKey("");
                let oModel = this.getView().getModel("hierarchydata")
                oModel.setProperty("/jsonObjects", []);
                this.companyCode = false;
                this.ApprovalType = false;
                this.byId("idCreateMassRequest").setEnabled(false)
                this.getView().byId("idSmartTablAppr").rebindTable()
            },
            onPressCreateMassApprovalInputs: function () {
                let approvalType = this.byId("idCompoBoxReq").getSelectedKey();
                this.byId("idRemoveBtmApprovalRow").setVisible(true)

                // if (approvalType == "R0") {
                //     this.byId("idApprove").setVisible(false)
                // }
                debugger;
                var oModel = this.getView().getModel("hierarchydata");
                var oData = oModel.getData();
                oData.jsonObjects.push({
                    "approvalLevel": (oData.jsonObjects.length + 1).toString(),
                    "role": "",
                    "user": "",
                    "selected": false,
                    "checkboxVisible": true,
                    "editCheckboxVisible": false,
                    "approveCheckboxVisible": false,
                    "sendBackCheckboxVisible": false,
                    "rejectCheckboxVisible": false,
                    "editable": true,
                    "mdmBtn": false
                });
                oModel.setData(oData);

            },

            onValueHelpApprovalMatrix: function () {
                if (!this.vhFragmentCompanyCode) {
                    this.vhFragmentCompanyCode = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.ApprovalMatrix.valueHelpApprovalF4Help", this);
                    this.getView().addDependent(this.vhFragmentCompanyCode);
                }
                this.vhFragmentCompanyCode.open();
            },

            onValueHelpDialogClose: function (oEvent) {
                debugger;

                var sDescription, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }
                if (this.ApprovalType) {
                    this.byId("idCreateMassRequest").setEnabled(true)
                    this.byId("idRemoveBtmApprovalRow").setVisible(true)
                }

                sDescription = oSelectedItem.getInfo();
                sTitle = oSelectedItem.getTitle()
                let model = this.getView().getModel();

                // Create a filter for DEPARTMENT equals 'Sales'
                let oFilter = new sap.ui.model.Filter("DEPARTMENT", sap.ui.model.FilterOperator.EQ, sTitle);

                model.read("/REVIEWERUSERS", {
                    filters: [oFilter], // Add the filter here
                    success: function (res) {
                        debugger;
                        // Create a new JSON model with the data from the success response
                        let oReviewerFiltersModel = new sap.ui.model.json.JSONModel(res.results);


                        this.getView().setModel(oReviewerFiltersModel, "ReviewerFilters");
                    }.bind(this), // Bind the context to access 'this' inside the success callback
                    error: function (err) {
                        MessageBox.show("Please select again")
                    }
                });

                // sap.ui.getCore().byId("idCompanyApproval").setValue(sDescription);
                this.byId("idCompanyApproval").setValue(`${sTitle} - ${sDescription}`);
                var oText = this.byId("idText");

                // Change the text
                oText.setText(sDescription);
                this.companyCode = true;
            },
            onSplitterResize: function () {
                var oSmartTable = this.byId("LineItemsSmartTable");
                if (oSmartTable) {
                    oSmartTable.rebindTable();
                }
            },

            onPressDeleteSelectedRows: function (oEvent) {
                debugger;
                // var oTable = this.byId("idProductsTablse");
                // var aSelectedItems = oTable.getSelectedItems();
                // let item = aSelectedItems[0].getBindingContext("hierarchydata").getObject()
                // if (aSelectedItems.length == 0) {
                //     return MessageBox.error("Please Select Atleast One Item")
                // }
                // var oModel = this.getView().getModel("hierarchydata");
                // var oData = oModel.getData();

                // // Loop through the selected items and remove them from the data model
                // aSelectedItems.forEach(function (oItem) {
                //     var oContext = oItem.getBindingContext("hierarchydata");
                //     var sPath = oContext.getPath();
                //     var iIndex = parseInt(sPath.split("/").pop(), 10);

                //     // Remove the item from the array
                //     oData.jsonObjects.splice(iIndex, 1);
                // });

                // // Update the model with the new data
                // oModel.setData(oData);
                let oModel = this.getView().getModel();
                // omodel.delete(`/ApprovalHierarchy${}`)
                let cCode = this.byId("idCompanyApproval").getValue();
                let reqType = this.byId("idCompoBoxReq").getValue();
                const that = this;
                // var oModel = this.getView().byId('idSmartTableUserMaster').getModel();
                var oTable = this.getView().byId('idProductsTablse');

                // Get selected items
                var aSelectedItems = oTable.getSelectedItems();
                var sName = aSelectedItems[0].getBindingContext("hierarchydata").getObject().user

                MessageBox.confirm(`Are you sure you want to delete ${sName}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    //CALLBACK FUNCTION WHICH GETS EXECUTED WHEN THE MESSGE BOX IS CLOSED
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            that.getView().setBusy(true)
                            aSelectedItems.forEach(function (oSelectedItem) {
                                var obj = oSelectedItem.getBindingContext("hierarchydata").getObject();
                                let sPath = `/ApprovalHierarchy(USER_ID='${obj.user}',APPR_TYPE='${reqType}',COMPANY_CODE='${cCode}')`
                                oModel.remove(sPath, {
                                    success: function (oResponse) {
                                        that.getView().setBusy(false)
                                        MessageBox.success('User Deleted');
                                        oTable.removeSelections();
                                        that.getView().byId('idProductsTablse').rebindTable();
                                    }.bind(this),
                                    error: function (oError) {
                                        MessageBox.error('SOMETHING WENT WRONG')
                                        that.getView().setBusy(false)

                                    }
                                });
                            });

                        }
                    }
                });

            },

            onValueHelpRoleApproval: function (oEvent) {
                this._inputFieldRole = oEvent.getSource();
                if (!this.vhFragmentRoleInApproval) {
                    this.vhFragmentRoleInApproval = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.ApprovalMatrix.valueHelpRoleInApproval", this);
                    this.getView().addDependent(this.vhFragmentRoleInApproval);
                }
                this.vhFragmentRoleInApproval.open();
            },

            onSelectionChange: function () {
                let deleBtn = this.byId("idDeleteBtmApprovalRow").getEnabled()
                // let remBtn = this.byId("idRemoveBtmApprovalRow").getEnabled()
                if (!deleBtn) {
                    this.byId("idDeleteBtmApprovalRow").setEnabled(true)
                }
                // if(!remBtn){
                //     this.byId("idRemoveBtmApprovalRow").setEnabled(true)

                // }

            },


            onValueHelpDialogCloseRole: function (oEvent) {
                debugger;
                var sDescription, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                let tab = this.byId("idProductsTablse");
                let cCode = this.byId("idCompanyApproval").getValue();
                let val = cCode.split("-")[0].trim();

                if (!oSelectedItem) {
                    return;
                }
                var sPath = this._inputFieldRole.getBindingContext("hierarchydata").getPath();
                // var ojModel = this.getView().getModel("hierarchydata");

                sDescription = oSelectedItem.getInfo();
                sTitle = oSelectedItem.getTitle();
                // if (sTitle == "MDM") {
                //     this.byId("idAddMdmBtn").setVisible(true)
                //     ojModel.setProperty(sPath + "/mdmBtn", true);
                // }
                this._inputFieldRole.setValue(sTitle);

                this.getView().getModel("hierarchydata").setProperty(sPath + "/role", sTitle);

                var oFilter = new sap.ui.model.Filter("USER_ROLE", sap.ui.model.FilterOperator.EQ, `APPROVER`);
                var oFilter1 = new sap.ui.model.Filter("DEPARTMENT", sap.ui.model.FilterOperator.EQ, `${val}`);
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilter, oFilter1],
                    and: true
                });
                let oModel = this.getView().getModel();
                oModel.read("/VMUsers", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        debugger;
                        var filterUserModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(filterUserModel, "FilteredUser");
                    }.bind(this),
                    error: function (oError) {
                        debugger
                    }
                });

            },

            // opens value help for role 
            onValueHelpUserDetails: function (oEvent) {
                this._inputFieldRoleInF4 = oEvent.getSource();
                this._fieldName = oEvent.getSource().getBindingInfo("value").binding.getPath(); // Store the field name ('role' or 'user')

                debugger;
                if (!this.vhFragmentUserDetails) {
                    this.vhFragmentUserDetails = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.ApprovalMatrix.valueHelpFilteredUsers", this);
                    this.getView().addDependent(this.vhFragmentUserDetails);
                }
                this.vhFragmentUserDetails.open();
            },

            onValueHelpSelectionChangeUser: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource().getSelectedItem();
                if (oSelectedItem) {
                    var sEmail = oSelectedItem.getBindingContext("FilteredUser").getProperty("EMAIL");
                    this._inputFieldRoleInF4.setValue(sEmail);

                    var sPath = this._inputFieldRoleInF4.getBindingContext("hierarchydata").getPath();
                    this.getView().getModel("hierarchydata").setProperty(sPath + "/user", sEmail);

                    this.vhFragmentUserDetails.close();
                }
            },

            onCloseValueHelpDialog: function () {
                this.vhFragmentUserDetails.close();
            },
            // onAddMdmUsers: function(){
            //     var oModel = this.getView().getModel("hierarchydata");
            //     var oData = oModel.getData();
            //     let app = oData.jsonObjects[0].approvalLevel;
            //     // var sPath = this._inputFieldRole.getBindingContext("hierarchydata").getPath();
            //     // oModel.setProperty(sPath + "/role", sTitle);


            //     oData.jsonObjects.push({
            //         "approvalLevel": app,
            //         "role": "",
            //         "user": "",
            //         "selected": false,
            //         "checkboxVisible": true,
            //         "editCheckboxVisible": false,
            //         "approveCheckboxVisible": false,
            //         "sendBackCheckboxVisible": false,
            //         "rejectCheckboxVisible": false,
            //         "editable": false,
            //         "mdmBtn": false
            //     });

            //     oModel.setData(oData);
            // },
            onSelectofApproval: function (oEvent) {
                debugger;
                this.ApprovalType = true;
                var sKey = oEvent.getParameter("selectedItem");
                let item = sKey.getAdditionalText();
                let oModel = this.getView().getModel("hierarchydata");
                let data = oModel.getData();

                if (this.companyCode) {
                    this.byId("idCreateMassRequest").setEnabled(true)
                    this.byId("idDeleteBtmApprovalRow").setEnabled(true)

                }
                // 
                var sKey = oEvent.getSource().getSelectedKey();
                var oTable = this.byId("idProductsTablse");
                var tModel = oTable.getModel();
                var aData = oModel.getProperty("/jsonObjects");

                // Update checkbox visibility based on the dropdown selection
                data.jsonObjects.forEach(function (item) {
                    if (sKey === "R0") {
                        item.checkboxVisible = false;
                    } else if (sKey === "R1") {
                        item.checkboxVisible = true;
                    }
                });

                oModel.setData(data)
                debugger
                // oTable.getBinding("items").refresh();
            },
            onSubmitApprovalEntity: function () {
                MessageBox.confirm(`Are you sure you want to Submit?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        debugger;
                        if (oAction === MessageBox.Action.YES) {
                            var oModel = this.getView().getModel("hierarchydata");
                            var oDataModel = this.getView().getModel();
                            var aData = oModel.getProperty("/jsonObjects");
                            let companyCode = this.byId("idCompanyApproval").getValue().split("-")[0].trim();
                            let approvalType = this.byId("idCompoBoxReq").getSelectedKey();
                            if (oModel.getData().jsonObjects.length == 0) {
                                return MessageBox.error("Please fill all data")
                            }
                            let userData = oModel.getData().jsonObjects[0].user;
                            let role = oModel.getData().jsonObjects[0].role;


                            if (!companyCode || !approvalType || userData == "" || role == "") {
                                return MessageBox.error("Please fill all data")
                            }
                            this.getView().setBusy(true)

                            const ApprovalData = aData.map((item) => {
                                return {
                                    APPR_TYPE: companyCode,
                                    COMPANY_CODE: approvalType,
                                    USER_ID: item.user,
                                    APPROVER_LEVEL: parseInt(item.approvalLevel, 10),
                                    USER_ROLE: item.role,
                                    ACCESS_EDIT: item.editCheckboxVisible,
                                    ACCESS_APPROVE: item.approveCheckboxVisible,
                                    ACCESS_SENDBACK: item.sendBackCheckboxVisible,
                                    ACCESS_REJECT: item.rejectCheckboxVisible
                                };
                            });
                            debugger;
                            let oPayload = { "ApprovalData": ApprovalData }
                            oDataModel.create("/CreateApprovalHierarchy", oPayload, {
                                success: function (oData) {
                                    this.getView().setBusy(false)
                                    MessageBox.success("Approval Create ");
                                    this.getView().byId("idSmartTablAppr").rebindTable()
                                    this.byId("idCompanyApproval").setValue("");
                                    this.byId("idCompoBoxReq").setSelectedKey("");

                                    oModel.setProperty("/jsonObjects", []);
                                }.bind(this),
                                error: function (oError) {
                                    const jsonResponse = JSON.parse(oError.responseText);
                                    const errorMessage = jsonResponse.error.message.value;
                                    this.getView().setBusy(false);
                                    sap.m.MessageBox.error(errorMessage);
                                }.bind(this)
                            })
                        }
                    }.bind(this)
                });
                // var oModel = this.getView().getModel("hierarchydata");
                // var oDataModel = this.getView().getModel();
                // var aData = oModel.getProperty("/jsonObjects");
                // let companyCode = this.byId("idCompanyApproval").getValue().split("-")[0].trim();
                // let approvalType = this.byId("idCompoBoxReq").getSelectedKey();

                // if (!companyCode || !approvalType) {
                //     return MessageBox.error("Please Fill Data")
                // }
                // this.getView().setBusy(true)

                // const ApprovalData = aData.map((item) => {
                //     return {
                //         APPR_TYPE: approvalType,
                //         COMPANY_CODE: companyCode,
                //         USER_ID: item.user,
                //         APPROVER_LEVEL: parseInt(item.approvalLevel, 10),
                //         USER_ROLE: item.role,
                //         ACCESS_EDIT: item.editCheckboxVisible,
                //         ACCESS_APPROVE: item.approveCheckboxVisible,
                //         ACCESS_SENDBACK: item.sendBackCheckboxVisible,
                //         ACCESS_REJECT: item.rejectCheckboxVisible
                //     };
                // });
                // debugger;
                // let oPayload = { "ApprovalData": ApprovalData }
                // oDataModel.create("/CreateApprovalHierarchy", oPayload, {
                //     success: function (oData) {
                //         this.getView().setBusy(false)
                //         MessageBox.success("Approval Create ");
                //         this.getView().byId("idSmartTablAppr").rebindTable()
                //         this.byId("idCompanyApproval").setValue("");
                //         this.byId("idCompoBoxReq").setSelectedKey("");

                //         oModel.setProperty("/jsonObjects", []);
                //     }.bind(this),
                //     error: function (oError) {
                //         const jsonResponse = JSON.parse(oError.responseText);
                //         const errorMessage = jsonResponse.error.message.value;
                //         this.getView().setBusy(false);
                //         sap.m.MessageBox.error(errorMessage);
                //     }.bind(this)
                // })
            },
            onNavBackApproval: function () {
                history.go(-1)
            },

            onDeleteApprovalMatrix: function () {
                debugger;
                const that = this;
                var oModel = this.getView().byId('idSmartTablAppr').getModel();
                var oTable = this.getView().byId('idApprovalTable');
                var aSelectedItems = oTable.getSelectedItems();
                var uId = aSelectedItems[0].getBindingContext().getObject().COMPANY_CODE

                MessageBox.confirm(`Are you sure you want to delete ${uId}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    //CALLBACK FUNCTION WHICH GETS EXECUTED WHEN THE MESSGE BOX IS CLOSED
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            that.getView().setBusy(true)
                            aSelectedItems.forEach(function (oSelectedItem) {
                                var sPath = oSelectedItem.getBindingContext().getPath();

                                oModel.remove(sPath, {
                                    success: function (oResponse) {
                                        debugger;
                                        that.getView().setBusy(false)
                                        MessageBox.success('Approval Deleted');
                                        oTable.removeSelections();
                                        that.getView().byId('idSmartTablAppr').rebindTable();
                                    }.bind(this),
                                    error: function (oError) {
                                        MessageBox.error('SOMETHING WENT WRONG')
                                        that.getView().setBusy(false)

                                    }
                                });
                            });

                        }
                    }
                });
            },

            onSlectionofRow: function () {
                this.byId("idDeleteApproval").setEnabled(true)
            },

            onPressRowApprovalHierarchy: function (oEvent) {
                debugger;
                // this.byId("idCreateMassRequest").setEnabled(true)
                let item = oEvent.getSource().getBindingContext().getObject();
                this.getView().setBusy(true)
                this.getView().getModel().read("/CompanyCodeType", {
                    filters: [
                        new sap.ui.model.Filter("APPR_TYPE", sap.ui.model.FilterOperator.EQ, item.APPR_TYPE),
                        new sap.ui.model.Filter("COMPANY_CODE", sap.ui.model.FilterOperator.EQ, item.COMPANY_CODE)
                    ],
                    success: function (res) {
                        debugger;
                        let apptypeIdField = this.byId("idCompoBoxReq");
                        let apprType = res.results[0].APPR_TYPE;
                        let updBtn = this.byId("idSubmtUpdate");
                        this.byId("idCompanyApproval").setValue(apprType)
                        this.byId("idDeleteBtmApprovalRow").setVisible(true)
                        apptypeIdField.setValue(res.results[0].COMPANY_CODE);
                        apptypeIdField.setEditable(false)
                        // this.byId("idText").setText(res.results[0].TO_COMPANY_CODE.BUTXT)
                        // if (apprType == "R1") {
                        //     updBtn.setVisible(true)
                        // }
                        this.byId("idSubBtn").setVisible(false)
                        let oModel = this.getView().getModel("hierarchydata");
                        oModel.setData({ jsonObjects: [] })
                        let oData = oModel.getData();
                        let dataArr = res.results[0].TO_HIERARCHY.results;
                        dataArr.forEach(item => {
                            oData.jsonObjects.push({
                                "approvalLevel": item.APPROVER_LEVEL,
                                "role": item.USER_ROLE,
                                "user": item.USER_ID,
                                "selected": false,
                                "checkboxVisible": true,
                                "editCheckboxVisible": item.ACCESS_EDIT,
                                "approveCheckboxVisible": item.ACCESS_APPROVE,
                                "sendBackCheckboxVisible": item.ACCESS_SENDBACK,
                                "rejectCheckboxVisible": item.ACCESS_REJECT,
                                "editable": false,
                                "editablechk": false,

                            });
                        });

                        // Set the updated data back to the model
                        oModel.setData(oData);
                        this.getView().setBusy(false)
                    }.bind(this),
                    error: function (err) {
                        debugger;
                        this.getView().setBusy(false)

                    }.bind(this)
                })
                var oBox1 = this.byId("box1");
                var oBox2 = this.byId("box2");

                if (this._isBox1FullWidth) {
                    oBox1.getLayoutData().setSize("300px");
                    oBox2.getLayoutData().setSize("auto");
                } else {
                    oBox1.getLayoutData().setSize("auto");
                    oBox2.getLayoutData().setSize("0px");
                }

                this._isBox1FullWidth = !this._isBox1FullWidth;
                // let oModel = this.getView().getModel("hierarchydata");
                // oModel.setData({ jsonObjects: [] })
                // let oData = oModel.getData();
                // oData.jsonObjects.push({
                //     "approvalLevel": item.APPROVER_LEVEL,
                //     "role": item.USER_ROLE,
                //     "user": item.USER_ID,
                //     "selected": false,
                //     "checkboxVisible": item.APPR_TYPE == "R1" ? true : false,
                //     "editCheckboxVisible": item.ACCESS_EDIT,
                //     "approveCheckboxVisible": item.ACCESS_APPROVE,
                //     "sendBackCheckboxVisible": item.ACCESS_SENDBACK,
                //     "rejectCheckboxVisible": item.ACCESS_REJECT
                // });
                // oModel.setData(oData);
            },

            onUpdateApprovalEntity: function (oEvent) {
                // Confirmation dialog
                MessageBox.confirm(`Are you sure you want to Update?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            // Continue with the update process if the user confirms
                            let app = this.byId("idCompoBoxReq").getValue();//department
                            let company = this.byId("idCompanyApproval").getValue();//reviewer
                            var oModel = this.getView().getModel("hierarchydata");
                            let data = oModel.getData().jsonObjects;
                            let userId = data[0].user;
                            let approvalType = this.byId("idCompoBoxReq").getValue();
                            var oDataModel = this.getView().getModel();
                            let arrPay = [];
                            data.map((ele) => {
                                let oPayload = {
                                    "USER_ID": ele.user,
                                    "USER_ROLE": ele.role,
                                    "APPROVER_LEVEL": parseFloat(ele.approvalLevel),
                                    "COMPANY_CODE": app,
                                    "APPR_TYPE": company,
                                    "ACCESS_EDIT": ele.editCheckboxVisible,
                                    "ACCESS_APPROVE": ele.approveCheckboxVisible,
                                    "ACCESS_SENDBACK": ele.sendBackCheckboxVisible,
                                    "ACCESS_REJECT": ele.rejectCheckboxVisible
                                };
                                arrPay.push(oPayload);
                            });

                            let finalPayload = {
                                "ApprovalData": arrPay
                            };

                            let sPath = `/UpdateApprovalHierarchy`;

                            oDataModel.create(sPath, finalPayload, {
                                success: function (oData) {
                                    this.getView().setBusy(false);
                                    MessageBox.success("Approval Updated Successfully");
                                    this.getView().byId("idSmartTablAppr").rebindTable();
                                }.bind(this),
                                error: function (oError) {
                                    debugger;
                                    this.getView().setBusy(false);
                                    MessageBox.error("Unable to Update Approval");
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },


            onEditApprovalEntity: function (oEvent) {
                debugger;

                // Get the button by its ID
                let oButton = this.byId("idEditApproval");
                let createBtn = this.byId("idCreateMassRequest");
                let deletBtn = this.byId("idDeleteBtmApprovalRow")
                let buttonText = oButton.getText();

                // Toggle the button text between "Edit" and "Cancel"
                if (buttonText === "Edit") {
                    oButton.setText("Cancel");
                } else {
                    oButton.setText("Edit");
                }
                let updBtn = this.byId("idSubmtUpdate");
                updBtn.setVisible(!updBtn.getVisible());
                let declineBtn = this.byId("idDeclineBtn");
                if (buttonText === "Edit") {
                    declineBtn.setVisible(false);
                    createBtn.setEnabled(true)
                    deletBtn.setEnabled(true)
                } else {
                    declineBtn.setVisible(true);
                    createBtn.setEnabled(false)
                    deletBtn.setEnabled(false)
                }
                let oModel = this.getView().getModel("hierarchydata");
                let data = oModel.getData();
                data.jsonObjects.forEach((ele) => {
                    ele.editablechk = !ele.editablechk;
                });
                oModel.setData(data);
            },

            onPressRemoveSelectedRows: function (oEvent) {
                debugger;
                var oModel = this.getView().getModel("hierarchydata");
                var oData = oModel.getData();

                // Remove the last item from jsonObjects
                oData.jsonObjects.pop();

                // Update the model with the modified data
                oModel.setData(oData);

                // Check if jsonObjects is empty and hide the Remove button if true
                if (oData.jsonObjects.length === 0) {
                    this.byId("idRemoveBtmApprovalRow").setVisible(false);
                }
            },
            onSubmitApproval: function() {
                debugger;
                this.getView().setBusy(true);
                
                // Retrieve field values
                let department = sap.ui.getCore().byId("idDepartments").getValue();
                let reviewer = sap.ui.getCore().byId("idReviewer").getSelectedKey();
                let approver = sap.ui.getCore().byId("idApprover").getSelectedKey();
                let mdm = sap.ui.getCore().byId("idMDM").getSelectedKey();
                let GaType = sap.ui.getCore().byId("idGAType").getSelectedKey();
            
                // Validation: Check if required fields are filled
                if (!department || department.trim() === "") {
                    sap.m.MessageBox.error("Department is required.");
                    this.getView().setBusy(false);
                    return;
                }
                if (!reviewer || reviewer.trim() === "") {
                    sap.m.MessageBox.error("Reviewer is required.");
                    this.getView().setBusy(false);
                    return;
                }
                if (!approver || approver.trim() === "") {
                    sap.m.MessageBox.error("Approver is required.");
                    this.getView().setBusy(false);
                    return;
                }
                if (!mdm || mdm.trim() === "") {
                    sap.m.MessageBox.error("MDM is required.");
                    this.getView().setBusy(false);
                    return;
                }
                if (!GaType || GaType.trim() === "") {
                    sap.m.MessageBox.error("GA Type is required.");
                    this.getView().setBusy(false);
                    return;
                }
            
                // Create the payload
                let oPayload = [
                    {
                        "USER_ID": approver,
                        "USER_ROLE": "APPROVER",
                        "APPROVER_LEVEL": 1,
                        "COMPANY_CODE": reviewer,
                        "APPR_TYPE": department.split("-")[0].trim(),
                        "APPROVER": approver,
                        "MDM": mdm,
                        "GA": GaType
                    },
                    {
                        "USER_ID": mdm,
                        "USER_ROLE": "MDM",
                        "APPROVER_LEVEL": 2,
                        "COMPANY_CODE": reviewer,
                        "APPR_TYPE": department.split("-")[0].trim(),
                        "APPROVER": approver,
                        "MDM": mdm,
                        "GA": GaType
                    }
                ];
            
                // OData Model request
                var oDataModel = this.getView().getModel();
                let oPayloadS = { "ApprovalData": oPayload };
                
                oDataModel.create("/CreateApprovalHierarchy", oPayloadS, {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        MessageBox.success("Approval Created");
                        this.getView().byId("idSmartTablAppr").rebindTable(); // Refresh table
                        // Clear fields after successful submission
                        sap.ui.getCore().byId("idDepartments").setValue("");
                        sap.ui.getCore().byId("idReviewer").setSelectedKey("");  
                        sap.ui.getCore().byId("idApprover").setSelectedKey("");
                        sap.ui.getCore().byId("idGAType").setSelectedKey("");
                        sap.ui.getCore().byId("idMDM").setSelectedKey("");
                        this.createFragment.close();
                    }.bind(this),
                    error: function (oError) {
                        const jsonResponse = JSON.parse(oError.responseText);
                        const errorMessage = jsonResponse.error.message.value;
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error(errorMessage);
                        // Clear fields after error
                        sap.ui.getCore().byId("idDepartments").setValue("");
                        sap.ui.getCore().byId("idReviewer").setSelectedKey("");  
                        sap.ui.getCore().byId("idApprover").setSelectedKey("");
                        sap.ui.getCore().byId("idGAType").setSelectedKey("");
                        sap.ui.getCore().byId("idMDM").setSelectedKey("");
                        this.createFragment.close();
                    }.bind(this)
                });
            }
            



        });
    });
