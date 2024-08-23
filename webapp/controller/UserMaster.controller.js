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
                this.createFragment.open();
                sap.ui.getCore().byId("idUserId").setValue("");
                sap.ui.getCore().byId("idUserEntity").setSelectedKeys([])
                sap.ui.getCore().byId("idUserRole").setSelectedKeys([])
                sap.ui.getCore().byId("idUserName").setValue("")
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

            onSumbitUserMaster: function () {
                let that = this;
                debugger;
                var oMultiComboBox = sap.ui.getCore().byId("idUserEntity");
                var aSelectedItems = oMultiComboBox.getSelectedItems();
                let Companydesc = "";
                aSelectedItems.forEach(function (oItem) {

                    var sAdditionalText = oItem.getAdditionalText();
                    if (Companydesc) {
                        Companydesc += ", " + sAdditionalText;
                    } else {
                        Companydesc = sAdditionalText;
                    }
                });
                let userId = sap.ui.getCore().byId("idUserId").getValue();
                let userName = sap.ui.getCore().byId("idUserName").getValue();
                let userEntitycomp = sap.ui.getCore().byId("idUserEntity").getSelectedKeys().join(",");
                let userrole = sap.ui.getCore().byId("idUserRole").getSelectedKeys(",").join(",");
                if (userId.length == 0) {
                    sap.ui.getCore().byId("idUserId").setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("idUserId").setValueStateText("This field is required.");
                    bValidationError = true;
                    return
                }
                let oModel = this.getView().getModel("user-master");
                this.createFragment.close()
                this.getView().setBusy(true)
                oModel.read("/IasUsers", {
                    success: function (res) {
                        let data = res.results.filter((item) => {
                            return item.EMAIL == userId
                        })
                        let emp_no = data[0].USER_ID;
                        let oPayload = {
                            userData: {
                                USER_ID: userId,
                                USER_NAME: userName,
                                USER_ROLE: userrole,
                                EMAIL: userId,
                                COMPANY_CODE: userEntitycomp,
                                EMP_NO: emp_no,
                                COMPANY_DESC: Companydesc
                            }
                        }
                        debugger;

                        oModel.create("/CreateVMUser", oPayload, {
                            success: function (oData) {
                                that.getView().setBusy(false)
                                MessageBox.success("User created successfully!");
                                that.getView().byId("idSmartTableUserMaster").rebindTable()
                            }.bind(this),
                            error: function (oRes) {
                                that.getView().setBusy(false)
                                MessageBox.error("Unable to Create");
                            }.bind(this)
                        })
                    },
                    error: function () {
                        this.getView().setBusy(false);
                        MessageBox.error("Something Went Wrong")
                    }.bind(this)
                })
            },

            onEditUserMaster: function (oEvent) {
                debugger;
                if (!this.updateFragment) {
                    this.updateFragment = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.UserMaster.updateUserMaster", this);
                    this.getView().addDependent(this.updateFragment);
                }
                this.updateFragment.open();
                var oTable = this.getView().byId('idTableUserMaster');
                var aSelectedItems = oTable.getSelectedItems();
                var sData = aSelectedItems[0].getBindingContext().getObject();
                var aSelectedEntity = sData.COMPANY_CODE ? sData.COMPANY_CODE.split(",") : [];
                var aSelectedRoles = sData.USER_ROLE ? sData.USER_ROLE.split(",") : [];
                sap.ui.getCore().byId("idUserIdEdit").setValue(sData.USER_ID);
                sap.ui.getCore().byId("idUserEditEntity").setSelectedKeys(aSelectedEntity)
                sap.ui.getCore().byId("idEditUserRole").setSelectedKeys(aSelectedRoles)
                sap.ui.getCore().byId("idUserEditName").setValue(sData.USER_NAME);
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
                that.getView().setBusy(true)
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
                let userId = sap.ui.getCore().byId("idUserIdEdit").getValue();
                let userName = sap.ui.getCore().byId("idUserEditName").getValue();
                let userEntitycomp = sap.ui.getCore().byId("idUserEditEntity").getSelectedKeys().join(",");
                let userrole = sap.ui.getCore().byId("idEditUserRole").getSelectedKeys(",").join(",");
                let oModel = this.getView().getModel("user-master");
                var oMultiComboBox = sap.ui.getCore().byId("idUserEditEntity");
                var aSelectedItems = oMultiComboBox.getSelectedItems();
                let Companydesc = "";
                aSelectedItems.forEach(function (oItem) {

                    var sAdditionalText = oItem.getAdditionalText();
                    if (Companydesc) {
                        Companydesc += ", " + sAdditionalText;
                    } else {
                        Companydesc = sAdditionalText;
                    }
                });
                let oPayload = {
                    USER_ROLE: userrole,
                    COMPANY_CODE: userEntitycomp,
                    COMPANY_DESC: Companydesc
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
                var oFilter = new sap.ui.model.Filter({
                    path: "EMAIL", // The property to filter by
                    operator: sap.ui.model.FilterOperator.EQ, 
                    value1: sValue
                });
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
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
            }

        });
    });
