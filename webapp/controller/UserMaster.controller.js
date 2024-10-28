sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/StandardListItem",
    "sap/m/Popover",
    "sap/m/List"
],
    function (Controller, MessageBox, Fragment, StandardListItem, Popover, List) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.UserMaster", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel("user-master");
                this.getView().setModel(this.oModel);
            },
            onCreateUser: function () {
                if (!this.createFragment) {
                    this.createFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.UserMaster.createUserMaster", this);
                    this.getView().addDependent(this.createFragment);
                }
                sap.ui.getCore().byId("idUserId").setValue("");
                sap.ui.getCore().byId("idUserName").setValue("");
                sap.ui.getCore().byId("idUserEntity").setSelectedKey("");
                sap.ui.getCore().byId("idUserRole").setSelectedKey(""); // Or use `setSelectedKeys([])` if it's a multi-select combobox
                sap.ui.getCore().byId("idDepartment").setSelectedKey("");
                sap.ui.getCore().byId("idGaType").setSelectedKey("");
                this.createFragment.open();
               
            },
            onCloseUserFragment: function () {
                this.createFragment.close()
            },
            onValueHelp: function () {
                if (!this.vhFragmentFragment) {
                    this.vhFragmentFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.UserMaster.valueHelpUserId", this);
                    this.getView().addDependent(this.vhFragmentFragment);
                }
                this.vhFragmentFragment.open();
            },
            onValueHelpDialogClose: function (oEvent) {
                var sDescription, sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                sDescription = oSelectedItem.getDescription();
                sTitle = oSelectedItem.getTitle()
                sap.ui.getCore().byId("idUserId").setValue(sDescription);
                sap.ui.getCore().byId("idUserName").setValue(sTitle);
            },

            // onSumbitUserMaster: function () {
            //     let that = this;
            //     debugger;
            //     // var oMultiComboBox = sap.ui.getCore().byId("idUserEntity");
            //     // var aSelectedItems = oMultiComboBox.getSelectedItems();
            //     let Companydesc = "";
            //     // aSelectedItems.forEach(function (oItem) {

            //     //     var sAdditionalText = oItem.getAdditionalText();
            //     //     if (Companydesc) {
            //     //         Companydesc += ", " + sAdditionalText;
            //     //     } else {
            //     //         Companydesc = sAdditionalText;
            //     //     }
            //     // });
            //     let userId = sap.ui.getCore().byId("idUserId").getValue();
            //     let userName = sap.ui.getCore().byId("idUserName").getValue();
            //     let userEntitycomp = sap.ui.getCore().byId("idUserEntity").getSelectedKey();
            //     let userrole = sap.ui.getCore().byId("idUserRole").getSelectedKeys();
            //     let userdepart = sap.ui.getCore().byId("idDepartment").getSelectedKey();
            //     let gaType = sap.ui.getCore().byId("idGaType").getSelectedKey();
            //     if (userId.length == 0) {
            //         sap.ui.getCore().byId("idUserId").setValueState(sap.ui.core.ValueState.Error);
            //         sap.ui.getCore().byId("idUserId").setValueStateText("This field is required.");
            //         bValidationError = true;
            //         return
            //     }
            //     let oModel = this.getView().getModel("user-master");
            //     this.createFragment.close()
            //     this.getView().setBusy(true)
            //     oModel.read("/IasUsers", {
            //         success: function (res) {
            //             let data = res.results.filter((item) => {
            //                 return item.EMAIL == userId
            //             })
            //             let emp_no = data[0]?.USER_ID;
            //             let oPayload = {
            //                 userData: {
            //                     USER_ID: userId,
            //                     USER_NAME: userName,
            //                     USER_ROLE: userrole,
            //                     EMAIL: userId,
            //                     COMPANY_CODE: userEntitycomp,
            //                     EMP_NO: emp_no,
            //                     // COMPANY_DESC: Companydesc,
            //                     DEPARTMENT: userdepart,
            //                     GA: gaType

            //                 }
            //             }
            //             debugger;

            //             oModel.create("/CreateVMUser", oPayload, {
            //                 success: function (oData) {
            //                     that.getView().setBusy(false)
            //                     MessageBox.success("User created successfully!");
            //                     that.getView().byId("idSmartTableUserMaster").rebindTable()
            //                 }.bind(this),
            //                 error: function (oRes) {
            //                     that.getView().setBusy(false)
            //                     MessageBox.error("Unable to Create");
            //                 }.bind(this)
            //             })
            //         },
            //         error: function () {
            //             this.getView().setBusy(false);
            //             MessageBox.error("Something Went Wrong")
            //         }.bind(this)
            //     })
            // },
            onSumbitUserMaster: function () {
                let that = this;
                let bValidationError = false;
                that.getView().setBusy(true);
            
                // Retrieve values from the input fields and combo boxes
                let userId = sap.ui.getCore().byId("idUserId").getValue();
                let userName = sap.ui.getCore().byId("idUserName").getValue();
                let userEntitycomp = sap.ui.getCore().byId("idUserEntity").getSelectedKey();
                let userrole = sap.ui.getCore().byId("idUserRole").getSelectedKey();
                let userdepart = sap.ui.getCore().byId("idDepartment").getSelectedKey();
                let gaType = sap.ui.getCore().byId("idGaType").getSelectedKey();
            debugger;
                // Add validation for userId
                if (userId.length === 0) {
                    sap.ui.getCore().byId("idUserId").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idUserId").setValueStateText("This field is required.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idUserId").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Add validation for userName
                if (userName.length === 0) {
                    sap.ui.getCore().byId("idUserName").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idUserName").setValueStateText("This field is required.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idUserName").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Add validation for userEntitycomp (combobox for company code)
                if (userEntitycomp.length === 0) {
                    sap.ui.getCore().byId("idUserEntity").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idUserEntity").setValueStateText("This field is required.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idUserEntity").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Add validation for userrole (multi-select combobox for user roles)
                if (userrole.length === 0) {
                    sap.ui.getCore().byId("idUserRole").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idUserRole").setValueStateText("At least one role must be selected.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idUserRole").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Add validation for userdepart (combobox for department)
                if (userdepart.length === 0) {
                    sap.ui.getCore().byId("idDepartment").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idDepartment").setValueStateText("This field is required.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idDepartment").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Add validation for gaType (combobox for GA type)
                if (gaType.length === 0) {
                    sap.ui.getCore().byId("idGaType").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idGaType").setValueStateText("This field is required.");
                    bValidationError = true;
                } else {
                    sap.ui.getCore().byId("idGaType").setValueState(sap.ui.core.ValueState.None);
                }
            
                // Stop submission if validation errors are present
                if (bValidationError) {
                    that.getView().setBusy(false);
                    return;
                }
            
                let oModel = this.getView().getModel("user-master");
                this.createFragment.close();
                this.getView().setBusy(true);
            
                // Fetch the employee number based on the user ID (email)
                oModel.read("/IasUsers", {
                    success: function (res) {
                        let data = res.results.filter((item) => {
                            return item.EMAIL == userId;
                        });
            
                        let emp_no = data.length > 0 ? data[0].USER_ID : "";
            
                        // Construct the payload
                        let oPayload = {
                            userData: {
                                USER_ID: userId,
                                USER_NAME: userName,
                                USER_ROLE: userrole, // Join the roles if multiple are selected
                                EMAIL: userId,
                                COMPANY_CODE: userEntitycomp,
                                EMP_NO: emp_no,
                                DEPARTMENT: userdepart,
                                GA: gaType
                            }
                        };
            
                        // Create the new user
                        oModel.create("/CreateVMUser", oPayload, {
                            success: function (oData) {
                                that.getView().setBusy(false);
                                MessageBox.success("User created successfully!");
            
                                // Reset the input fields after success
                                sap.ui.getCore().byId("idUserId").setValue("");
                                sap.ui.getCore().byId("idUserName").setValue("");
                                sap.ui.getCore().byId("idUserEntity").setSelectedKey("");
                                sap.ui.getCore().byId("idUserRole").setSelectedKey(""); // Or use `setSelectedKeys([])` if it's a multi-select combobox
                                sap.ui.getCore().byId("idDepartment").setSelectedKey("");
                                sap.ui.getCore().byId("idGaType").setSelectedKey("");
            
                                // Rebind the table to show updated data
                                that.getView().byId("idSmartTableUserMaster").rebindTable();
                            },
                            error: function (oRes) {
                                that.getView().setBusy(false);
                                MessageBox.error("Unable to Create");
                            }
                        });
                    },
                    error: function () {
                        that.getView().setBusy(false);
                        MessageBox.error("Something Went Wrong");
                    }
                });
            },
            
            onEditUserMaster: function (oEvent) {
                debugger;
            
                // Check if the fragment already exists, if not create it
                if (!this.updateFragment) {
                    this.updateFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.UserMaster.updateUserMaster", this);
                    this.getView().addDependent(this.updateFragment);
                }
                
                // Open the fragment (edit dialog)
                this.updateFragment.open();
            
                // Get selected item from the table
                var oTable = this.getView().byId('idTableUserMaster');
                var aSelectedItems = oTable.getSelectedItems();
            
                // Ensure an item is selected
                if (aSelectedItems.length === 0) {
                    MessageBox.error("Please select a user to edit.");
                    return;
                }
            
                // Extract data from the selected row
                var sData = aSelectedItems[0].getBindingContext().getObject();
            
                // Parse and split company codes and roles if available
                var aSelectedEntity = sData.COMPANY_CODE ? sData.COMPANY_CODE.split(",") : [];
                var aSelectedRoles = sData.USER_ROLE ? sData.USER_ROLE.split(",") : [];
            
                // Set the values in the corresponding fields in the dialog (fragment)
                sap.ui.getCore().byId("idUserIdEdit").setValue(sData.USER_ID); // Set User ID
                sap.ui.getCore().byId("idUserEditEntity").setSelectedKey(sData.COMPANY_CODE); // Set Company Code
                sap.ui.getCore().byId("idEditUserRole").setSelectedKey(aSelectedRoles); // Set User Roles
                sap.ui.getCore().byId("idUserEditName").setValue(sData.USER_NAME); // Set User Name
                sap.ui.getCore().byId("idDepartmentEdit").setSelectedKey(sData.DEPARTMENT); // Set Department
                sap.ui.getCore().byId("idGaEdit").setSelectedKey(sData.GA); // Set GA Type
            },
            
            onCloseUserFragmentEdit: function () {
                this.updateFragment.close()
            },
            onCreateUserMaster: function () {
                this.createFragment.close()
            },
            selectionChangeHandler: function () {
                this.getView().byId(
                    "idEditUserMaster"
                ).setEnabled(true);
                this.getView().byId(
                    "idDeleteUserMaster"
                ).setEnabled(true);
            },
            onDeleteUserMaster: function () {
                const that = this;
                var oModel = this.getView().byId('idSmartTableUserMaster').getModel();
                var oTable = this.getView().byId('idTableUserMaster');
                var aSelectedItems = oTable.getSelectedItems();
                var sName = aSelectedItems[0].getBindingContext().getObject().EMAIL
                MessageBox.confirm(`Are you sure you want to delete ${sName}?`, {
                    icon: MessageBox.Icon.WARNING,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    //CALLBACK FUNCTION WHICH GETS EXECUTED WHEN THE MESSGE BOX IS CLOSED
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            that.getView().setBusy(true)
                            aSelectedItems.forEach(function (oSelectedItem) {
                                var sPath = oSelectedItem.getBindingContext().getPath();
                                debugger;
                                oModel.remove(sPath, {
                                    success: function (oResponse) {
                                        that.getView().setBusy(false)
                                        MessageBox.success('User Deleted');
                                        oTable.removeSelections();
                                        that.getView().byId('idSmartTableUserMaster').rebindTable();
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
            onSumbitUserMasterEdit: function () {
                this.getView().setBusy(true)
                this.updateFragment.close()
                // let userId = sap.ui.getCore().byId("idUserIdEdit").getValue();
                // let userName = sap.ui.getCore().byId("idUserEditName").getValue();
                // // let userEntitycomp = sap.ui.getCore().byId("idUserEditEntity").getSelectedKeys().join(",");
                // let userrole = sap.ui.getCore().byId("idEditUserRole").getSelectedKeys(",").join(",");
                let oModel = this.getView().getModel("user-master");
                // var oMultiComboBox = sap.ui.getCore().byId("idUserEditEntity");
                // let userdepartEdit = sap.ui.getCore().byId("idDepartmentEdit").getSelectedKey();
                // var aSelectedItems = oMultiComboBox.getSelectedItems();
                // let Companydesc = "";
                // aSelectedItems.forEach(function (oItem) {

                //     var sAdditionalText = oItem.getAdditionalText();
                //     if (Companydesc) {
                //         Companydesc += ", " + sAdditionalText;
                //     } else {
                //         Companydesc = sAdditionalText;
                //     }
                // });
                let userId = sap.ui.getCore().byId("idUserIdEdit").getValue();  // Get User ID
                let userrole = sap.ui.getCore().byId("idEditUserRole").getSelectedKey();  // Get selected user roles (comma-separated)
                let userdepartEdit = sap.ui.getCore().byId("idDepartmentEdit").getSelectedKey();  // Get selected department
                let gaType = sap.ui.getCore().byId("idGaEdit").getSelectedKey();  // Get GA Type
                let companycode = sap.ui.getCore().byId("idUserEditEntity").getSelectedKey();  
                let oPayload = {
                    USER_ROLE: userrole,
                    COMPANY_CODE: companycode,
                    DEPARTMENT: userdepartEdit,
                    GA:gaType
                }
                debugger;
                oModel.update(`/VMUsers(EMAIL='${userId}')`, oPayload, {
                    success: function (oData) {
                        MessageBox.success("User Edited successfully!");
                        this.getView().setBusy(false)
                        this.getView().byId("idSmartTableUserMaster").rebindTable()
                    }.bind(this),
                    error: function (oRes) {
                        this.getView().setBusy(false)
                        MessageBox.error("Unable to Edit");
                    }.bind(this)
                })
            },
            onOpenCompanycode: function (oEvent) {
                let oView = this.getView();
                var oButton = oEvent.getSource();
                var oBindingContext = oButton.getBindingContext();
                var oUser = oBindingContext.getObject()
                let jsonObjects = oUser.TO_COMPANY_CODE;
                debugger;
                if (this._pPopover) {
                    var existingModel = oView.getModel("company");
                    if (existingModel) {
                        existingModel.setData({ jsonObjects: [] });
                    }
                }
                var oListModel = new sap.ui.model.json.JSONModel({ jsonObjects: [] });
                oListModel = new sap.ui.model.json.JSONModel({ jsonObjects: jsonObjects });
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "com.air.vp.lnchpage.fragments.UserMaster.CompanycodePopover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    oPopover.setModel(oListModel, "company");
                    return oPopover;
                });
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            onOpenUserRole: function (oEvent) {
                let oView = this.getView();
                var oButton = oEvent.getSource();
                var oBindingContext = oButton.getBindingContext();
                var oUser = oBindingContext.getObject()
                let jsonObjects = oUser.TO_USER_ROLE;
                if (this._pPopover) {
                    var existingModel = oView.getModel("userRole");
                    if (existingModel) {
                        existingModel.setData({ jsonObjects: [] });
                    }
                }
                var oListModel = new sap.ui.model.json.JSONModel({ jsonObjects: [] });
                oListModel = new sap.ui.model.json.JSONModel({ jsonObjects: jsonObjects });
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "com.air.vp.lnchpage.fragments.UserMaster.UserRolePopover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    oPopover.setModel(oListModel, "userRole");
                    oPopover.setPlacement(sap.m.PlacementType.Right);
                    return oPopover;
                });
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });

            },
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteAdministratorPage");
            },

            onValueHelpDialogSearch: function (oEvent) {

                var sValue = oEvent.getParameter("value");
                var oFilter = [];
                var oBinding = oEvent.getSource().getBinding("items");
                if (sValue) {
                    oFilter.push(new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.EQ, sValue));
                }
                oBinding.filter(oFilter);

            },

            onSearchUserMaster: function (oEvent) {
                debugger;
                var oSmartTable = this.byId("idSmartTableUserMaster");
                var oBinding = oSmartTable.getTable().getBinding("items");
                var aFilters = [];
                var sSearchQuery = oEvent.getParameter("query");
                if (sSearchQuery) {
                    aFilters.push(new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.EQ, sSearchQuery));
                }
                oBinding.filter(aFilters);
            },

            onUploadUserMaster: function (oEvent) {
                debugger;
                var oFileUploader = this.byId("fileUploader");

                // Ensure FileUploader exists
                if (oFileUploader) {
                    // Trigger the file selection by programmatically "clicking" the file input
                    oFileUploader.getFocusDomRef().click();
                } else {
                    console.error("FileUploader not found.");
                }
            },
            afterDialogClose: function(){
debugger;
            },
            onFileSelected: function (oEvent) {
                debugger;
                var oFileUploader = oEvent.getSource();
                let that= this;
                that.getView().setBusy(true)
                var oFileUploader = oEvent.getSource();
                var oFile = oEvent.getParameter("files") && oEvent.getParameter("files")[0];  // Get the selected file
                var model = this.getView().getModel();  // Get the OData model
                var oSmartTable = that.byId("idSmartTableUserMaster");
                if (oFile) {
                    var reader = new FileReader();
            
                    // Define what happens once the file is read
                    reader.onload = function (e) {
                        // Get the result and split to remove the data URL prefix
                        var sBase64 = e.target.result.split(",")[1];  // Base64-encoded file data without the prefix
            
                        // Prepare payload with pure Base64 data
                        let payload = {
                            "base64Excel": sBase64
                        };
            
                        // Make the OData call to create the entity
                        model.create("/UploadVMUsers", payload, {
                            success: function (res) {
                                oFileUploader.setValue("");
                                var oBinding = oSmartTable.getTable().getBinding("items"); // Assuming you are using items binding
                                if (oBinding) {
                                    oBinding.refresh();  // Refresh the binding to reload the data
                                }
                                that.getView().setBusy(false)
                                 MessageBox.success("Successfully Uploaded")
                            }.bind(this),
                            error: function (oError) {
                                oFileUploader.setValue("");
                                that.getView().setBusy(false)
                                const jsonResponse = JSON.parse(oError.responseText);
                                            const errorMessage = jsonResponse.error.message.value;
                                            sap.m.MessageBox.error(errorMessage);

                            }
                        });
                    };
            
                    // Read the file as a Base64 URL
                    reader.readAsDataURL(oFile);
                } else {
                    console.error("No file selected.");
                }
            },

            uploadComplete: function(oEvent){
                debugger;
            }
            

        });
    });
