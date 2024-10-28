sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"

],
    function (Controller, JSONModel, Filter, FilterOperator, UIComponent, Fragment, MessageBox) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.EmailConfig", {
            onInit: function () {
                this._editMode = false;
                let oModel = this.getOwnerComponent().getModel("vendor");
                oModel.read("/EmailConfiguration", {
                    success: function (res) {
                        // Create a JSON model from the response data
                        let oEmailConfigModel = new sap.ui.model.json.JSONModel(res.results[0]);

                        // Set the model to the view
                        this.getView().setModel(oEmailConfigModel, "emailConfigModel");

                        // Bind the data to the form inputs using the model
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageBox.error("Failed to load Email Configuration data.");
                    }
                });

                this.getView().setModel(oModel);
                debugger;


            },

            onNavPress: function () {
                history.go(-1)
            },

            onEditPress: function () {
                var oView = this.getView();
                var oEditButton = oView.byId("editButton");
                var oSubmitButton = oView.byId("submitButton");

                // Toggle the edit mode
                this._editMode = !this._editMode;

                // Update the input fields to be editable or not
                oView.byId("hostNameInput").setEditable(this._editMode);
                oView.byId("portInput").setEditable(this._editMode);
                oView.byId("securityInput").setEditable(this._editMode);
                oView.byId("userNameInput").setEditable(this._editMode);
                oView.byId("passwordInput").setEditable(this._editMode);
                oView.byId("senderEmailInput").setEditable(this._editMode);

                // Change button text based on edit mode
                if (this._editMode) {
                    oEditButton.setText("Cancel");
                    oSubmitButton.setVisible(true);  // Show the submit button
                } else {
                    oEditButton.setText("Edit");
                    oSubmitButton.setVisible(false);  // Hide the submit button
                }
            },

            onSubmitPress: function () {
                var oView = this.getView();

                // Retrieve the model and the data from it
                var oModel = this.getView().getModel("emailConfigModel");
                var oData = oModel.getData();

                // Input field validation
                if (!oData.HOST || oData.HOST.trim() === "") {
                    sap.m.MessageBox.error("Host is required.");
                    return;
                }

                if (!oData.USERNAME || oData.USERNAME.trim() === "") {
                    sap.m.MessageBox.error("Username is required.");
                    return;
                }

                if (!oData.PASSWORD || oData.PASSWORD.trim() === "") {
                    sap.m.MessageBox.error("Password is required.");
                    return;
                }

                if (!oData.PORT || isNaN(oData.PORT)) {
                    sap.m.MessageBox.error("Please enter a valid port number.");
                    return;
                }

                if (!oData.SENDER_EMAIL || !this._validateEmail(oData.SENDER_EMAIL)) {
                    sap.m.MessageBox.error("Please enter a valid email address.");
                    return;
                }

                // Set busy indicator to true
                oView.setBusy(true);

                // Prepare the payload by extracting values from the model
                var payload = {
                    host: oData.HOST, // Fetch from model
                    username: oData.USERNAME, // Fetch from model
                    password: oData.PASSWORD, // Fetch from model
                    port: parseInt(oData.PORT), // Fetch and convert to integer
                    secure: oData.SECURE, // Boolean value fetched from model
                    senderEmail: oData.SENDER_EMAIL // Fetch from model
                };

                console.log("Payload:", JSON.stringify(payload));

                // Call the OData action import 'updateEmailConfig'
                let model = this.getView().getModel();
                model.create("/updateEmailConfig", payload, {
                    success: function (res) {
                        oView.setBusy(false);
                        sap.m.MessageBox.success("Configuration Submitted Successfully");

                        // Reset edit mode and update button states
                        this._editMode = false;
                        oView.byId("editButton").setText("Edit");
                        oView.byId("submitButton").setVisible(false);

                        // Make input fields non-editable after submission
                        oView.byId("hostNameInput").setEditable(false);
                        oView.byId("portInput").setEditable(false);
                        oView.byId("securityInput").setEditable(false);
                        oView.byId("userNameInput").setEditable(false);
                        oView.byId("passwordInput").setEditable(false);
                        oView.byId("senderEmailInput").setEditable(false);
                    }.bind(this),
                    error: function (err) {
                        oView.setBusy(false);
                        sap.m.MessageBox.error("Please Try Again");

                        // Reset edit mode and button states
                        this._editMode = false;
                        oView.byId("editButton").setText("Edit");
                        oView.byId("submitButton").setVisible(false);

                        // Make input fields non-editable again after error
                        oView.byId("hostNameInput").setEditable(false);
                        oView.byId("portInput").setEditable(false);
                        oView.byId("securityInput").setEditable(false);
                        oView.byId("userNameInput").setEditable(false);
                        oView.byId("passwordInput").setEditable(false);
                        oView.byId("senderEmailInput").setEditable(false);
                    }.bind(this)
                });
            },

            // Helper function for email validation



            onTestEmailPress: function () {
                var oView = this.getView();

                // Load the fragment if it is not already loaded
                if (!this.byId("emailTestDialog")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.air.vp.lnchpage.fragments.AdminConfig.TestEmail",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("emailTestDialog").open();
                }
            },

            onDialogClose: function () {
                this.byId("emailTestDialog").close();
            },

            onSubmitEmailPress: function () {
                var oView = this.getView();

                // Get values from the inputs
                var fromEmail = this.byId("fromEmailInput").getValue();
                var toEmail = this.byId("toEmailInput").getValue();
                var ccEmails = this.byId("ccEmailInput").getValue();
                var subject = this.byId("subjectInput").getValue();
                var message = this.byId("messageInput").getValue();

                // Input validation
                if (!fromEmail || !this._validateEmail(fromEmail)) {
                    sap.m.MessageBox.error("Please enter a valid From Email.");
                    return;
                }

                if (!toEmail || !this._validateEmail(toEmail)) {
                    sap.m.MessageBox.error("Please enter a valid To Email.");
                    return;
                }

                if (ccEmails && !this._validateMultipleEmails(ccEmails)) {
                    sap.m.MessageBox.error("Please enter valid CC Emails.");
                    return;
                }

                if (!subject || subject.trim() === "") {
                    sap.m.MessageBox.error("Please enter a subject.");
                    return;
                }

                if (!message || message.trim() === "") {
                    sap.m.MessageBox.error("Please enter a message.");
                    return;
                }

                // Set busy indicator to true
                oView.setBusy(true);

                // Prepare the payload
                var payload = {
                    "ToEmails": toEmail,
                    "CCEmail": ccEmails,
                    "subject": subject,
                    "body": message,
                    "type": "html"
                };

                // Call OData create method
                let oModel = this.getView().getModel();
                oModel.create("/testEmailConfig", payload, {
                    success: function (res) {
                        oView.setBusy(false);
                        sap.m.MessageBox.success("Email Sent Successfully!");

                        // Reset the fields after successful submission
                        this.byId("fromEmailInput").setValue("");
                        this.byId("toEmailInput").setValue("");
                        this.byId("ccEmailInput").setValue("");
                        this.byId("subjectInput").setValue("");
                        this.byId("messageInput").setValue("");

                        // Close the dialog
                        this.onDialogClose();
                    }.bind(this),
                    error: function (err) {
                        oView.setBusy(false);
                        sap.m.MessageBox.error("Something went wrong. Please try again.");

                        // Close the dialog and reset the fields on error as well
                        this.onDialogClose();
                    }.bind(this)
                });
            },

            // Helper function for single email validation
            _validateEmail: function (email) {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailPattern.test(email);
            },

            // Helper function for validating multiple CC emails (comma-separated)
            _validateMultipleEmails: function (emails) {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                var emailArray = emails.split(',').map(email => email.trim());
                return emailArray.every(email => emailPattern.test(email));
            },


            onComboBoxChangeMaster: function (oEvent) {
                debugger;
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sKey = oSelectedItem.getKey(); // Get the key of the selected item
                let oModel = this.getView().getModel("user-master"); // OData Model

                // Perform actions based on the selected key
                switch (sKey) {
                    case "userRole":
                        oModel.read("/UserRole", {
                            success: function (res) {
                                let mastJson = new sap.ui.model.json.JSONModel();
                                mastJson.setData(res);
                                this.getView().setModel(mastJson, "mastJsonModel");
                            }.bind(this),
                            error: function (err) {
                                debugger;
                            }
                        });
                        break;

                    case "department":
                        let mastJson = this.getView().getModel("mastJsonModel");
                        if (mastJson) {
                            mastJson.setData(null); // Clear model data
                        } else {
                            mastJson = new sap.ui.model.json.JSONModel();
                        }

                        // Call "UserMasterDept" entity from the OData model
                        oModel.read("/UserMasterDept", {
                            success: function (res) {
                                let data = {
                                    results: res.results.map(function (item) {
                                        return {
                                            CODE: item.Department,
                                            DESCRIPTION: item.Dept_Desc
                                        };
                                    })
                                };

                                // Set the model with the new data
                                mastJson.setData(data);
                                this.getView().setModel(mastJson, "mastJsonModel");
                            }.bind(this),
                            error: function (err) {
                                debugger;
                            }
                        });
                        break;

                    case "gaType":
                        // Clear existing model data first
                        let mastJsonGA = this.getView().getModel("mastJsonModel");
                        if (mastJsonGA) {
                            mastJsonGA.setData(null); // Clear model data
                        } else {
                            mastJsonGA = new sap.ui.model.json.JSONModel();
                        }

                        // Call "GeographicalAreaMASTER" entity from the OData model
                        oModel.read("/GeographicalAreaMASTER", {
                            success: function (res) {
                                let data = {
                                    results: res.results.map(function (item) {
                                        return {
                                            CODE: item.GA_Code, // Assuming this is the code field
                                            DESCRIPTION: item.GA_Description,
                                            COMPANY: item.Company
                                        };
                                    })
                                };

                                // Set the model with the new data
                                mastJsonGA.setData(data);
                                this.getView().setModel(mastJsonGA, "mastJsonModel");
                            }.bind(this),
                            error: function (err) {
                                debugger;
                            }
                        });
                        break;

                    case "companyCode":
                        // Clear the existing model data
                        let mastJsonCC = this.getView().getModel("mastJsonModel");
                        if (mastJsonCC) {
                            mastJsonCC.setData(null); // Clear model data
                        } else {
                            mastJsonCC = new sap.ui.model.json.JSONModel();
                        }

                        // Call "CompanyCode" entity from the OData model
                        oModel.read("/CompanyCode", {
                            success: function (res) {
                                let data = {
                                    results: res.results.map(function (item) {
                                        return {
                                            CODE: item.BUKRS, // Company Code
                                            DESCRIPTION: item.BUTXT, // Company Description
                                            COMPANY: item.Company
                                        };
                                    })
                                };

                                // Set the model with the new data
                                mastJsonCC.setData(data);
                                this.getView().setModel(mastJsonCC, "mastJsonModel");
                            }.bind(this),
                            error: function (err) {
                                debugger;
                            }
                        });
                        break;



                    default:
                        sap.m.MessageToast.show("Unknown selection");
                }
            },

            onSearchProducts: function(oEvent) {
                // Get the search query from the event
                var sQuery = oEvent.getParameter("query");
            
                // Get the binding of the table items
                var oTable = this.byId("idProductsTable");
                var oBinding = oTable.getBinding("items");
            
                // Define filters
                var aFilters = [];
            
                if (sQuery) {
                    // Create a filter for 'CODE'
                    var oFilterCode = new sap.ui.model.Filter("CODE", sap.ui.model.FilterOperator.Contains, sQuery);
            
                    // Create a filter for 'DESCRIPTION'
                    var oFilterDescription = new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sQuery);
            
                    // Create a filter for 'COMPANY'
                    var oFilterCompany = new sap.ui.model.Filter("COMPANY", sap.ui.model.FilterOperator.Contains, sQuery);
            
                    // Combine the filters in an OR condition
                    aFilters.push(new sap.ui.model.Filter({
                        filters: [oFilterCode, oFilterDescription, oFilterCompany],
                        and: false
                    }));
                }
            
                // Apply the filter to the table's binding
                oBinding.filter(aFilters);
            },
            


            onAddProduct: function () {
                var oComboBox = this.byId("selectControl"); // Assuming ComboBox ID is "idPopinLayout"
                var sSelectedKey = oComboBox.getSelectedKey(); // Get the selected key from the dropdown

                // Open the fragment based on the selected key
                switch (sSelectedKey) {
                    case "userRole":
                        this._openCreateRoleDialog();
                        break;

                    case "department":
                        this._openCreateDepartmentDialog();
                        break;

                    case "gaType":
                        this._openCreateGATypeDialog();
                        break;

                    case "companyCode":
                        this._openCreateCompanyCodeDialog();
                        break;

                    default:
                        sap.m.MessageToast.show("Please select a valid option.");
                }
            },

            _openCreateRoleDialog: function () {
                if (!this._oCreateRoleDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.air.vp.lnchpage.fragments.AdminConfig.CreateRole",
                        controller: this
                    }).then(function (oDialog) {
                        this._oCreateRoleDialog = oDialog;
                        this.getView().addDependent(this._oCreateRoleDialog);
                        this._oCreateRoleDialog.open();
                    }.bind(this));
                } else {
                    this._oCreateRoleDialog.open();
                }
            },

            _openCreateDepartmentDialog: function () {
                if (!this._oCreateDepartmentDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.air.vp.lnchpage.fragments.AdminConfig.CreateDepartment", // Path to Department fragment
                        controller: this
                    }).then(function (oDialog) {
                        this._oCreateDepartmentDialog = oDialog;
                        this.getView().addDependent(this._oCreateDepartmentDialog);
                        this._oCreateDepartmentDialog.open();
                    }.bind(this));
                } else {
                    this._oCreateDepartmentDialog.open();
                }
            },


            //--------------Delete function
            // DeleteFunction: function (oEvent) {
            //     // Get the reference to the Table and Model
            //     var oTable = this.byId("idProductsTable");
            //     var oModel = this.getView().getModel("mastJsonModel");

            //     // Get the selected item's binding context path
            //     var oItem = oEvent.getSource().getParent(); // Button -> ColumnListItem
            //     var sPath = oItem.getBindingContext("mastJsonModel").getPath(); // Get the binding path

            //     // Confirmation dialog before deleting
            //    sap.m.MessageBox.confirm("Are you sure you want to delete this item?", {
            //         actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.YES) {
            //                 // Delete the item from the model
            //                 var aData = oModel.getProperty("/results");
            //                 var iIndex = parseInt(sPath.split("/")[2], 10); // Extract index from path
            //                 aData.splice(iIndex, 1); // Remove the item from array
            //                 oModel.setProperty("/results", aData); // Update model

            //                 // Show success message
            //                 MessageToast.show("Item deleted successfully.");
            //             }
            //         }
            //     });
            // },

            // // The generalized DeleteFunction triggered by the Delete button
            // DeleteFunction: function (oEvent) {
            //     var that = this;  // reference to the controller for callbacks
            //     // Get the reference to the Table and Model
            //     var oTable = this.byId("idProductsTable");
            //     var oModel = this.getView().getModel("mastJsonModel");

            //     // Get the selected item's binding context path
            //     var oItem = oEvent.getSource().getParent(); // Button -> ColumnListItem
            //     var sPath = oItem.getBindingContext("mastJsonModel").getPath(); // Get the binding path

            //     // Extract the unique identifier (ID, CODE, or similar) based on the master data type
            //     var sEntityType = this._getSelectedEntityType();  // Determine which master data entity is selected
            //     var sDeleteId;
            //     var sODataPath;

            //     // Dynamically decide which ID to use and the correct backend delete action
            //     switch (sEntityType) {
            //         case "userRole":
            //             sDeleteId = oModel.getProperty(sPath + "/CODE");
            //             sODataPath = "/DeleteRole('" + sDeleteId + "')";
            //             break;
            //         case "department":
            //             sDeleteId = oModel.getProperty(sPath + "/Department");
            //             sODataPath = "/DeleteDepartment('" + sDeleteId + "')";
            //             break;
            //         case "gaType":
            //             sDeleteId = oModel.getProperty(sPath + "/GA_Code");
            //             sODataPath = "/DeleteGA('" + sDeleteId + "')";
            //             break;
            //         case "companyCode":
            //             sDeleteId = oModel.getProperty(sPath + "/BUKRS");
            //             sODataPath = "/DeleteCompany(Company='" + oModel.getProperty(sPath + "/Company") + "',BUKRS='" + sDeleteId + "')";
            //             break;
            //         default:
            //             MessageBox.error("Unknown entity type selected for deletion.");
            //             return;
            //     }

            //     // Confirmation dialog before deleting
            //     MessageBox.confirm("Are you sure you want to delete this item?", {
            //         actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.YES) {
            //                 // Call backend service to delete the item
            //                 var oDataModel = that.getView().getModel();  // Assuming ODataModel is attached to the view

            //                 oDataModel.remove(sODataPath, {
            //                     success: function () {
            //                         // Success callback
            //                         // Update the model on the client side
            //                         var aData = oModel.getProperty("/results");
            //                         var iIndex = parseInt(sPath.split("/")[2], 10); // Extract index from path
            //                         aData.splice(iIndex, 1); // Remove the item from the array
            //                         oModel.setProperty("/results", aData); // Update the model

            //                         // Show success message
            //                         MessageToast.show("Item deleted successfully from the database.");
            //                     },
            //                     error: function () {
            //                         // Error callback
            //                         MessageBox.error("Failed to delete the item from the database.");
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // },


            // Open dialog for GA Type
            _openCreateGATypeDialog: function () {
                debugger;
                if (!this._oCreateGATypeDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.air.vp.lnchpage.fragments.AdminConfig.CreateGAType", // Path to GA Type fragment
                        controller: this
                    }).then(function (oDialog) {
                        this._oCreateGATypeDialog = oDialog;
                        this.getView().addDependent(this._oCreateGATypeDialog);
                        this._oCreateGATypeDialog.open();
                    }.bind(this));
                } else {
                    this._oCreateGATypeDialog.open();
                }
            },

            // Open dialog for Company Code
            _openCreateCompanyCodeDialog: function () {
                if (!this._oCreateCompanyCodeDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.air.vp.lnchpage.fragments.AdminConfig.CreateCompanyCode", // Path to Company Code fragment
                        controller: this
                    }).then(function (oDialog) {
                        this._oCreateCompanyCodeDialog = oDialog;
                        this.getView().addDependent(this._oCreateCompanyCodeDialog);
                        this._oCreateCompanyCodeDialog.open();
                    }.bind(this));
                } else {
                    this._oCreateCompanyCodeDialog.open();
                }
            },
            onCancelDialog: function () {
                this.byId("createRoleDialog").close();
            },


            onSaveRole: function () {
                // Get the input values from the fragment
                var sRole = this.byId("roleInput").getValue();
                var sRoleDesc = this.byId("roleDescInput").getValue();

                // Check if inputs are valid
                if (!sRole || !sRoleDesc) {
                    sap.m.MessageBox.error("Please fill in all required fields.");
                    return;
                }
                this.getView().setBusy(true);
                // Create the payload object
                let payload = {
                    "CODE": sRole,
                    "DESCRIPTION": sRoleDesc
                }

                let oModel = this.getView().getModel();
                oModel.create("/CreateRole", payload, {
                    success: function (res) {
                        this._oCreateRoleDialog.close();

                        sap.m.MessageBox.success("Role Created successfully!")
                        this.byId("roleInput").setValue("");
                        this.byId("roleDescInput").setValue("");
                        let mastJsonModel = this.getView().getModel("mastJsonModel");
                        let data = mastJsonModel.getData();

                        // If data.results doesn't exist, initialize it
                        if (!data.results) {
                            data.results = [];
                        }

                        // Push the new payload (role) into the results array
                        data.results.push({
                            CODE: payload.CODE,
                            DESCRIPTION: payload.DESCRIPTION
                        });

                        // Set the updated data back to the JSON model
                        mastJsonModel.setData(data);
                        mastJsonModel.refresh();
                        this.getView().setBusy(false);

                    }.bind(this),
                    error: function (err) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Something went wrong")
                        this.byId("createRoleDialog").close();
                        this.byId("roleInput").setValue("");
                        this.byId("roleDescInput").setValue("");
                    }.bind(this)
                })



                // Close the dialog after saving

            },



            onSaveDepartment: function () {
                var sDept = this.byId("departmentInput").getValue();
                var sDeptDesc = this.byId("departmentDescInput").getValue();

                if (!sDept || !sDeptDesc) {
                    sap.m.MessageToast.show("Please fill in all required fields.");
                    return;
                }
                this.getView().setBusy(true);

                let payload = {
                    "Department": sDept,
                    "Dept_Desc": sDeptDesc
                };

                let oModel = this.getView().getModel();
                oModel.create("/CreateDepartment", payload, {
                    success: function (res) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Department Created successfully!");
                        this.byId("departmentInput").setValue("");
                        this.byId("departmentDescInput").setValue("");
                        this.byId("createDepartmentDialog").close();
                        let mastJsonModel = this.getView().getModel("mastJsonModel");
                        let data = mastJsonModel.getData();

                        // If data.results doesn't exist, initialize it
                        if (!data.results) {
                            data.results = [];
                        }

                        // Push the new payload (role) into the results array
                        data.results.push({
                            CODE: payload.Department,
                            DESCRIPTION: payload.Dept_Desc
                        });

                        // Set the updated data back to the JSON model
                        mastJsonModel.setData(data);
                        mastJsonModel.refresh();
                    }.bind(this),
                    error: function (err) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error("Something went wrong");
                        this.byId("createDepartmentDialog").close();
                        this.byId("departmentInput").setValue("");
                        this.byId("departmentDescInput").setValue("");
                    }.bind(this)
                });
            },

            // Save GA Type
            onSaveGAType: function () {
                var sGAType = this.byId("gaTypeInput").getValue();
                var sGATypeDesc = this.byId("gaTypeDescInput").getValue();
                var sGACompanyCode = this.byId("gaTypeCompanyInput").getValue();

                if (!sGAType || !sGATypeDesc || !sGACompanyCode) {
                    sap.m.MessageBox.error("Please fill in all required fields.");
                    return;
                }

                let payload = {
                    "Company": sGACompanyCode,
                    "GA_Code": sGAType,
                    "GA_Description": sGATypeDesc
                };

                // Show busy indicator before making the request
                this.getView().setBusy(true);

                let oModel = this.getView().getModel();
                oModel.create("/CreateGA", payload, {
                    success: function (res) {
                        // Hide busy indicator after success
                        this.getView().setBusy(false);

                        sap.m.MessageBox.success("GA Type Created successfully!");
                        this.byId("gaTypeInput").setValue("");
                        this.byId("gaTypeDescInput").setValue("");
                        this.byId("gaTypeCompanyInput").setValue("");
                        this.byId("createGATypeDialog").close();

                        let mastJsonModel = this.getView().getModel("mastJsonModel");
                        let data = mastJsonModel.getData();

                        // If data.results doesn't exist, initialize it
                        if (!data.results) {
                            data.results = [];
                        }

                        // Push the new payload (GA Type) into the results array
                        data.results.push({
                            "COMPANY": payload.Company,
                            "CODE": payload.GA_Code,
                            "DESCRIPTION": payload.GA_Description
                        });

                        // Set the updated data back to the JSON model
                        mastJsonModel.setData(data);
                        mastJsonModel.refresh();
                    }.bind(this),
                    error: function (err) {
                        // Hide busy indicator after error
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error("Something went wrong");
                        this.byId("createGATypeDialog").close();
                        this.byId("gaTypeInput").setValue("");
                        this.byId("gaTypeDescInput").setValue("");
                    }.bind(this)
                });
            },


            // Save Company Code
            onSaveCompanyCode: function () {
                var sCompanyCode = this.byId("companyCodeInput").getValue();
                var sCompanyCodeDesc = this.byId("companyCodeDescInput").getValue();
                var sCompany = this.byId("companyinput").getValue();

                if (!sCompanyCode || !sCompanyCodeDesc) {
                    sap.m.MessageToast.show("Please fill in all required fields.");
                    return;
                }
                this.getView().setBusy(true);
                let payload = {
                    "BUKRS": sCompanyCode,
                    "BUTXT": sCompanyCodeDesc,
                    "Company": sCompany
                };

                let oModel = this.getView().getModel();
                oModel.create("/CreateCompany", payload, {
                    success: function (res) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("Company Code Created successfully!");
                        this.byId("companyCodeInput").setValue("");
                        this.byId("companyCodeDescInput").setValue("");
                        this.byId("createCompanyCodeDialog").close();
                        let mastJsonModel = this.getView().getModel("mastJsonModel");
                        let data = mastJsonModel.getData();

                        // If data.results doesn't exist, initialize it
                        if (!data.results) {
                            data.results = [];
                        }

                        // Push the new payload (role) into the results array
                        data.results.push({
                            "CODE": payload.BUKRS,
                            "DESCRIPTION": payload.BUTXT,
                            "COMPANY": payload.Company
                        });

                        // Set the updated data back to the JSON model
                        mastJsonModel.setData(data);
                    }.bind(this),
                    error: function (err) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.error("Something went wrong");
                        this.byId("createCompanyCodeDialog").close();
                        this.byId("companyCodeInput").setValue("");
                        this.byId("companyCodeDescInput").setValue("");
                    }.bind(this)
                });
            },

            // Cancel dialog for all entities
            onCancelDialog: function () {
                if (this._oCreateRoleDialog) {
                    this._oCreateRoleDialog.close();
                }
                if (this._oCreateDepartmentDialog) {
                    this._oCreateDepartmentDialog.close();
                }
                if (this._oCreateGATypeDialog) {
                    this._oCreateGATypeDialog.close();
                }
                if (this._oCreateCompanyCodeDialog) {
                    this._oCreateCompanyCodeDialog.close();
                }
                if (this._editUserDialog) {
                    this._editUserDialog.close();
                }
                if (this._editDepartmentDialog) {
                    this._editDepartmentDialog.close();
                }
                if (this._editGATypeDialog) {
                    this._editGATypeDialog.close();
                }
                if (this._editCompanyCodeDialog) {
                    this._editCompanyCodeDialog.close();
                }
                
            },

            onDeleteFunction: function (oEvent) {
                var oComboBox = this.byId("selectControl"); // Assuming ComboBox ID is "selectControl"
                var sSelectedKey = oComboBox.getSelectedKey(); // Get the selected key from the dropdown
                var oModel = this.getView().getModel(); // OData model
                var oJsonModel = this.getView().getModel("mastJsonModel"); // JSON model for frontend
                var index = oEvent.getSource().getParent().getBindingContext("mastJsonModel").sPath.split("/")[2];

                // Check if there's selected data to delete
                if (!oJsonModel) {
                    sap.m.MessageBox.error("No data to delete.");
                    return;
                }

                // Get selected item from the JSON model to delete
                var aItems = oEvent.getSource().getParent().getBindingContext("mastJsonModel").getModel().getData().results; // Assuming data is in "results" array
                var oSelectedItem = oEvent.getSource().getParent().getBindingContext("mastJsonModel").getObject();

                if (!oSelectedItem) {
                    sap.m.MessageBox.error("No item selected for deletion.");
                    return;
                }

                // Show confirmation dialog before deletion
                sap.m.MessageBox.confirm("Are you sure you want to delete this item?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            // Show busy indicator during deletion
                            sap.ui.core.BusyIndicator.show(0);

                            // Open the fragment based on the selected key and handle deletion
                            switch (sSelectedKey) {
                                case "userRole":
                                    // DELETE request to backend for userRole
                                    let payload = {
                                        "CODE": oSelectedItem.CODE
                                    };
                                    oModel.create(`/DeleteRole`, payload, {
                                        success: function (res) {
                                            // Remove the item from the frontend JSON model
                                            aItems.splice(index, 1);
                                            oJsonModel.setData({ results: aItems });
                                            sap.m.MessageBox.success("User Role deleted successfully.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator after success
                                        },
                                        error: function (err) {
                                            sap.m.MessageBox.error("Failed to delete User Role.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator on error
                                        }
                                    });
                                    break;

                                case "department":
                                    // DELETE request to backend for department
                                    let depPay = {
                                        "Department": oSelectedItem.CODE
                                    };
                                    oModel.create(`/DeleteDepartment`, depPay, {
                                        success: function () {
                                            aItems.splice(index, 1);
                                            oJsonModel.setData({ results: aItems });
                                            sap.m.MessageBox.success("Department deleted successfully.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator after success
                                        },
                                        error: function (err) {
                                            sap.m.MessageBox.error("Failed to delete Department.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator on error
                                        }
                                    });
                                    break;

                                case "gaType":
                                    let gaPay = {

                                        "GA_Code": oSelectedItem.CODE

                                    }
                                    // DELETE request to backend for Geographical Area
                                    oModel.create(`/DeleteGA`, gaPay, {
                                        success: function () {
                                            // Remove the item from the frontend JSON model
                                            aItems.splice(index, 1);
                                            oJsonModel.setData({ results: aItems });
                                            sap.m.MessageBox.success("Geographical Area deleted successfully.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator after success
                                        },
                                        error: function (err) {
                                            sap.m.MessageBox.error("Failed to delete Geographical Area.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator on error
                                        }
                                    });
                                    break;

                                case "companyCode":
                                    // DELETE request to backend for Company Code
                                    let cPayload = {
                                        "Company": oSelectedItem.COMPANY,
                                        "BUKRS": oSelectedItem.CODE
                                    };
                                    oModel.create(`/DeleteCompany`, cPayload, {
                                        success: function () {
                                            // Remove the item from the frontend JSON model
                                            aItems.splice(index, 1);
                                            oJsonModel.setData({ results: aItems });
                                            sap.m.MessageBox.success("Company Code deleted successfully.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator after success
                                        },
                                        error: function (err) {
                                            sap.m.MessageBox.error("Failed to delete Company Code.");
                                            sap.ui.core.BusyIndicator.hide(); // Hide busy indicator on error
                                        }
                                    });
                                    break;

                                default:
                                    sap.m.MessageBox.error("Please select a valid option.");
                                    sap.ui.core.BusyIndicator.hide(); // Hide busy indicator for invalid option
                            }
                        }
                    }
                });
            },

            onIconTabBarSelectEmail: function (oEvent) {
                debugger;
                var sKey = oEvent.getParameter("key"); // Get the key from IconTabBar selection
                var oModel = this.getView().getModel(); // Get the model from the view

                if (sKey === "attachment") { // Check if the selected key is 'attachment'
                    oModel.read("/VendorAccountGroupAttachments", {
                        success: function (oData) {
                            debugger;
                            var oAttachmentModel = new sap.ui.model.json.JSONModel(); // Create a new JSON model
                            oAttachmentModel.setData(oData); // Set data from the OData response into the JSON model
                            this.getView().setModel(oAttachmentModel, "attachmentmodel");
                        }.bind(this), // Bind 'this' context to ensure it refers to the controller
                        error: function (oError) {
                            debugger;
                            // Handle error response
                            console.error("Error fetching data:", oError);
                        }.bind(this) // Bind 'this' context for error handler as well
                    });
                }
            },

            onAddAccountType: function(){
                if (!this._createAccountTypeDialog) {
                    this._createAccountTypeDialog = sap.ui.xmlfragment(
                        "com.air.vp.lnchpage.fragments.AdminConfig.CreateAccountTypeDialog", // Provide the correct path to your fragment
                        this // Bind the controller to handle the fragment events
                    );
                    this.getView().addDependent(this._createAccountTypeDialog); // Ensure the fragment is a dependent of the view
                }
                this._createAccountTypeDialog.open(); 
            },

            onSaveAccountType: function () {
                // Retrieve values from input fields
                var sAccountGroup = sap.ui.getCore().byId("accountGroupInput").getValue();
                var sDescription = sap.ui.getCore().byId("descGroupInput").getValue();
                var sRequiredDocs = sap.ui.getCore().byId("requiredDocsInput").getValue();
            
                // Perform basic validation
                if (!sAccountGroup || !sRequiredDocs || !sDescription) {
                    sap.m.MessageToast.show("Please fill in all required fields.");
                    return;
                }
            
                // Show busy indicator
                this.getView().setBusy(true);
            
                // Prepare the payload for creation
                let payload = {
                    "accountGroupCode": sAccountGroup,
                    "description": sDescription,
                    "requisiteDocuments": sRequiredDocs
                };
            
                // Get the OData model
                let oModel = this.getView().getModel();
                
                // Call the OData service to create a new entry
                oModel.create("/CreateAttachment", payload, {
                    success: function (res) {
                        // Turn off busy indicator
                        this.getView().setBusy(false);
            
                        // Show success message
                        sap.m.MessageBox.success("Account Type created successfully!");
            
                        // Clear the input fields
                        sap.ui.getCore().byId("accountGroupInput").setValue("");
                        sap.ui.getCore().byId("requiredDocsInput").setValue("");
                        sap.ui.getCore().byId("descGroupInput").setValue("");
                        // Close the dialog
                        this._createAccountTypeDialog.close();
            
                        // Update the local JSON model (mastJsonModel)
                        let mastJsonModel = this.getView().getModel("attachmentmodel");
                        let data = mastJsonModel.getData();
            
                        // If data.results doesn't exist, initialize it
                        if (!data.results) {
                            data.results = [];
                        }
            
                        // Push the new account group into the results array
                        data.results.push({
                            "accountGroupCode": payload.accountGroupCode,
                            "description": payload.description,
                            "requisiteDocuments": payload.requisiteDocuments
                        });
            
                        // Set the updated data back to the JSON model
                        mastJsonModel.setData(data);
                    }.bind(this),
                    error: function (err) {
                        // Turn off busy indicator
                        this.getView().setBusy(false);
            
                        // Show error message
                        sap.m.MessageBox.error("Something went wrong");
            
                        // Clear the input fields and close the dialog
                        sap.ui.getCore().byId("accountGroupInput").setValue("");
                        sap.ui.getCore().byId("requiredDocsInput").setValue("");
                        sap.ui.getCore().byId("descGroupInput").setValue("");
                        this._createAccountTypeDialog.close();
                    }.bind(this)
                });
            },
            
            
            onCancelDialogAccount: function() {
                // Close the dialog without saving
                this._createAccountTypeDialog.close();
            },

            onDeleteAccountType: function(oEvent) {
                // Get the selected item (you can retrieve the selected context from the event)
                var oSelectedItem = oEvent.getSource().getBindingContext("attachmentmodel").getObject();
            
                // Construct the payload for delete operation
                let depPay = {
                    "accountGroupCode": oSelectedItem.accountGroupCode
                };
            
                // Get the model from the view
                let oModel = this.getView().getModel();
            
                // Show a confirmation dialog before delete
                sap.m.MessageBox.confirm("Are you sure you want to delete this Account Type?", {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function(oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            // Show busy indicator while processing
                            sap.ui.core.BusyIndicator.show();
            
                            // Send DELETE request to backend
                            oModel.create("/DeleteAttachment", depPay, {
                                success: function() {
                                    // Remove the deleted item from the local JSON model
                                    let oJsonModel = this.getView().getModel("attachmentmodel");
                                    let aItems = oJsonModel.getData().results;
            
                                    // Find the index of the selected item
                                    let index = aItems.findIndex(item => item.accountGroupCode === oSelectedItem.accountGroupCode);
            
                                    // Remove the item from the array
                                    if (index !== -1) {
                                        aItems.splice(index, 1);
                                    }
            
                                    // Update the model with the new data
                                    oJsonModel.setData({ results: aItems });
            
                                    // Show success message
                                    sap.m.MessageBox.success("Account Type deleted successfully.");
            
                                    // Hide the busy indicator
                                    sap.ui.core.BusyIndicator.hide();
                                }.bind(this),
                                error: function(err) {
                                    // Show error message
                                    sap.m.MessageBox.error("Failed to delete Account Type.");
            
                                    // Hide the busy indicator
                                    sap.ui.core.BusyIndicator.hide();
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },

            onEditAccountType: function(oEvent) {
                debugger;
                // Get the selected item
                var oSelectedItem = oEvent.getSource().getBindingContext("attachmentmodel").getObject();
            
                // Load the fragment if it hasn't been loaded yet
                if (!this._editAccountTypeDialog) {
                    this._editAccountTypeDialog = sap.ui.xmlfragment(
                        "com.air.vp.lnchpage.fragments.AdminConfig.EditAccountTypeDialog", // Fragment path
                        this // Bind the controller to handle fragment events
                    );
                    this.getView().addDependent(this._editAccountTypeDialog); // Add fragment as dependent to the view
                }
            
                // Pre-fill the fragment fields with the selected item data
                sap.ui.getCore().byId("editAccountGroupInput").setValue(oSelectedItem.accountGroupCode);
                sap.ui.getCore().byId("editRequiredDocsInput").setValue(oSelectedItem.requisiteDocuments);
                sap.ui.getCore().byId("editDescriptionInput").setValue(oSelectedItem.description);
                // Open the dialog
                this._editAccountTypeDialog.open();
            },

            onSaveEditAccountType: function() {
                // Retrieve the updated values from the fragment inputs
                var sAccountGroupCode = sap.ui.getCore().byId("editAccountGroupInput").getValue();
                var description = sap.ui.getCore().byId("editDescriptionInput").getValue();
                var sRequisiteDocuments = sap.ui.getCore().byId("editRequiredDocsInput").getValue();
            
                // Validation check
                if (!sAccountGroupCode || !sRequisiteDocuments || !description ) {
                    sap.m.MessageBox.error("Please fill in all required fields.");
                    return;
                }
            
                // Show busy indicator
                this.getView().setBusy(true);
            
                // Prepare the payload for update
                let payload = {
                    "accountGroupCode": sAccountGroupCode,
                    "description": description,
                    "requisiteDocuments": sRequisiteDocuments
                };
            
                // Get the OData model
                let oModel = this.getView().getModel();
            
                // Call the update service
                oModel.create("/UpdateAttachment", payload, {
                    success: function() {
                        // Update the local JSON model
                        let oJsonModel = this.getView().getModel("attachmentmodel");
                        let aItems = oJsonModel.getData().results;
            
                        // Find the index of the updated item
                        debugger
                        let index = aItems.findIndex(item => item.accountGroupCode === sAccountGroupCode);
            
                        // Update the requisite documents in the model
                        if (index !== -1) {
                            aItems[index].requisiteDocuments = sRequisiteDocuments;
                            aItems[index].description = description;
                        }
            
                        // Set the updated data back to the JSON model
                        oJsonModel.setData({ results: aItems });
            
                        // Hide the busy indicator
                        this.getView().setBusy(false);
            
                        // Show success message
                        sap.m.MessageBox.success("Account Type updated successfully!");
            
                        // Close the dialog
                        this._editAccountTypeDialog.close();
                    }.bind(this),
                    error: function(err) {
                        // Hide the busy indicator
                        this.getView().setBusy(false);
            
                        // Show error message
                        sap.m.MessageBox.error("Failed to update Account Type.");
            
                        // Close the dialog on error
                        this._editAccountTypeDialog.close();
                    }.bind(this)
                });
            },
            
            onCancelEditDialog: function() {
                // Close the dialog without saving
                this._editAccountTypeDialog.close();
            },

            onSearchAccountType: function(oEvent) {
                // Get the search query from the event
                var sQuery = oEvent.getParameter("query");
            
                // Get the binding of the table items
                var oTable = this.byId("idAttachmentTable");
                var oBinding = oTable.getBinding("items");
            
                // Define filters
                var aFilters = [];
            
                if (sQuery) {
                    // Create a filter for 'accountGroupCode'
                    var oFilterAccountGroup = new sap.ui.model.Filter("accountGroupCode", sap.ui.model.FilterOperator.Contains, sQuery);
            
                    // Create a filter for 'requisiteDocuments'
                    var oFilterRequisiteDocs = new sap.ui.model.Filter("requisiteDocuments", sap.ui.model.FilterOperator.Contains, sQuery);
            
                    // Combine the filters in an OR condition
                    aFilters.push(new sap.ui.model.Filter({
                        filters: [oFilterAccountGroup, oFilterRequisiteDocs],
                        and: false
                    }));
                }
            
                // Apply the filter to the table's binding
                oBinding.filter(aFilters);
            },

            onEditFunction: function (oEvent) {
                debugger;
                var oComboBox = this.byId("selectControl"); 
                var sSelectedKey = oComboBox.getSelectedKey(); 
                var oModel = this.getView().getModel(); 
                var oJsonModel = this.getView().getModel("mastJsonModel"); // JSON model for frontend
                var index = oEvent.getSource().getParent().getBindingContext("mastJsonModel").getObject();

                // Check if there's selected data to delete
                if (!oJsonModel) {
                    sap.m.MessageBox.error("No data to delete.");
                    return;
                }
                switch (sSelectedKey) {
                    case "userRole":
                        if (!this._editUserDialog) {
                            this._editUserDialog = sap.ui.xmlfragment(
                                "com.air.vp.lnchpage.fragments.AdminConfig.EditRole", // Fragment path
                                this // Bind the controller to handle fragment events
                            );
                            this.getView().addDependent(this._editUserDialog); // Add fragment as dependent to the view
                        }
                    
                        // Pre-fill the fragment fields with the selected item data
                        sap.ui.getCore().byId("editRoleInput").setValue(index.CODE);
                        sap.ui.getCore().byId("editRoleDescInput").setValue(index.DESCRIPTION);
                        this._editUserDialog.open();
                        break;
                        
                    case "department":
                        if (!this._editDepartmentDialog) {
                            this._editDepartmentDialog = sap.ui.xmlfragment(
                                "com.air.vp.lnchpage.fragments.AdminConfig.EditDepartment", // Fragment path
                                this // Bind the controller to handle fragment events
                            );
                            this.getView().addDependent(this._editDepartmentDialog); // Add fragment as dependent to the view
                        }
                    
                        // Pre-fill the fragment fields with the selected item data
                        sap.ui.getCore().byId("editDepartmentInput").setValue(index.CODE);
                        sap.ui.getCore().byId("editDepartmentDescInput").setValue(index.DESCRIPTION);
                        this._editDepartmentDialog.open();
                        break;
                        
                    case "gaType":
                        if (!this._editGATypeDialog) {
                            this._editGATypeDialog = sap.ui.xmlfragment(
                                "com.air.vp.lnchpage.fragments.AdminConfig.EditGA", // Fragment path
                                this // Bind the controller to handle fragment events
                            );
                            this.getView().addDependent(this._editGATypeDialog); // Add fragment as dependent to the view
                        }
                    
                        // Pre-fill the fragment fields with the selected item data
                        sap.ui.getCore().byId("editGATypeInput").setValue(index.CODE);
                        sap.ui.getCore().byId("editGATypeDescInput").setValue(index.DESCRIPTION);
                        sap.ui.getCore().byId("editGATypeCompanyInput").setValue(index.COMPANY);
                        this._editGATypeDialog.open();
                        break;
                        
                    case "companyCode":
                        if (!this._editCompanyCodeDialog) {
                            this._editCompanyCodeDialog = sap.ui.xmlfragment(
                                "com.air.vp.lnchpage.fragments.AdminConfig.EditCompany", // Fragment path
                                this // Bind the controller to handle fragment events
                            );
                            this.getView().addDependent(this._editCompanyCodeDialog); // Add fragment as dependent to the view
                        }
                    
                        // Pre-fill the fragment fields with the selected item data
                        sap.ui.getCore().byId("editCompanyCodeInput").setValue(index.CODE);
                        sap.ui.getCore().byId("editCompanyCodeDescInput").setValue(index.DESCRIPTION);
                        sap.ui.getCore().byId("editCompanyInput").setValue(index.COMPANY);
                        this._editCompanyCodeDialog.open();
                        break;
                        
                    default:
                        sap.m.MessageBox.error("Please select a valid option.");
                        return;
                }

                // Get selected item from the JSON model to delete
              
            },

            onEditRole: function (oEvent) {
                debugger;
                var oModel = this.getView().getModel(); // OData model
                let mastJsonModel = this.getView().getModel("mastJsonModel");
                let data = mastJsonModel.getData();
                // Retrieve the input values for CODE and DESCRIPTION
                var sRoleCode = sap.ui.getCore().byId("editRoleInput").getValue(); // Get the role code from the input field
                var sRoleDescription = sap.ui.getCore().byId("editRoleDescInput").getValue(); // Get the role description from the input field
            
                // Prepare the payload for the update request
                var payload = {
                    "CODE": sRoleCode,
                    "DESCRIPTION": sRoleDescription
                };
            
                // Validate if required fields are filled
                if (!sRoleCode || !sRoleDescription) {
                    sap.m.MessageBox.error("Both Role Code and Description are required.");
                    return;
                }
            
                // Show busy indicator (loader) while the request is being processed
              this.getView().setBusy(true)
            
                // Construct the endpoint for the update request
                var sUpdateUrl = "/UpdateRole";
            
                // Send the update request using the OData model
                oModel.create(sUpdateUrl, payload, {
                    success: function () {
                        sap.m.MessageBox.success("Role updated successfully.");
                        
                        // Clear the input fields after a successful update
                        sap.ui.getCore().byId("editRoleInput").setValue("");
                        sap.ui.getCore().byId("editRoleDescInput").setValue("");
            
                        // Close the dialog
                        this._editUserDialog.close();
            
                        // Hide busy indicator after success
                        this.getView().setBusy(false)
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageBox.error("Failed to update the role.");
                        this._editUserDialog.close();
                        // Hide busy indicator on error
                        this.getView().setBusy(false)
                    }.bind(this)
                });
            }
            ,
            onEditDepartment: function (oEvent) {
                var oModel = this.getView().getModel(); // OData model
                let jsonModel = this.getView().getModel("mastJsonModel");
            
                // Retrieve the input values for Department and Description
                var sDepartment = sap.ui.getCore().byId("editDepartmentInput").getValue(); 
                var sDeptDesc = sap.ui.getCore().byId("editDepartmentDescInput").getValue(); 
            
                // Prepare the payload for the update request
                var payload = {
                    "Department": sDepartment,
                    "Dept_Desc": sDeptDesc
                };
            
                // Validate if required fields are filled
                if (!sDepartment || !sDeptDesc) {
                    sap.m.MessageBox.error("Both Department Name and Description are required.");
                    return;
                }
            
                // Show busy indicator while the request is being processed
                this.getView().setBusy(true);
            
                // Send the update request to UpdateDepartment endpoint
                oModel.create("/UpdateDepartment", payload, {
                    success: function () {
                        sap.m.MessageBox.success("Department updated successfully.");
                        sap.ui.getCore().byId("editDepartmentInput").setValue("");
                        sap.ui.getCore().byId("editDepartmentDescInput").setValue("");
                        this._editDepartmentDialog.close();
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageBox.error("Failed to update the department.");
                        this._editDepartmentDialog.close();
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            onEditGAType: function (oEvent) {
                var oModel = this.getView().getModel(); // OData model
                var oDialog = this.byId("editGATypeDialog"); // Get the dialog reference
                let mastJsonModel = this.getView().getModel("mastJsonModel"); // Get the JSON model
                let jsonData = mastJsonModel.getData().results; // Access the data within the JSON model
                
                // Retrieve the input values for GA Code, Description, and Company
                var sGACode = sap.ui.getCore().byId("editGATypeInput").getValue(); 
                var sGADescription = sap.ui.getCore().byId("editGATypeDescInput").getValue(); 
                var sCompany = sap.ui.getCore().byId("editGATypeCompanyInput").getValue(); 
            
                // Prepare the payload for the update request
                var payload = {
                    "GA_Code": sGACode,
                    "GA_Description": sGADescription,
                    "Company": sCompany
                };
            
                // Validate if required fields are filled
                if (!sGACode || !sGADescription || !sCompany) {
                    sap.m.MessageBox.error("GA Code, Description, and Company are required.");
                    return;
                }
            
                // Show busy indicator while the request is being processed
                this.getView().setBusy(true);
            
                // Send the update request to UpdateGA endpoint
                oModel.create("/UpdateGA", payload, {
                    success: function (res) {
                        sap.m.MessageBox.success("GA Type updated successfully.");
            
                        // Clear the input fields after a successful update
                        sap.ui.getCore().byId("editGATypeInput").setValue("");
                        sap.ui.getCore().byId("editGATypeDescInput").setValue("");
                        sap.ui.getCore().byId("editGATypeCompanyInput").setValue("");
                        this._editGATypeDialog.close()
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageBox.error("Failed to update the GA Type.");
                        this._editGATypeDialog.close()
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            

            onEditCompanyCode: function (oEvent) {
                debugger;
                var oModel = this.getView().getModel(); // OData model
            
                // Retrieve the input values for Company, BUKRS, and Description
                var sCompany = sap.ui.getCore().byId("editCompanyCodeInput").getValue(); 
                var sBukrs = sap.ui.getCore().byId("editCompanyCodeDescInput").getValue(); 
                var sButxt = sap.ui.getCore().byId("editCompanyInput").getValue(); 
            
                // Prepare the payload for the update request
                var payload = {
                    "Company": sCompany,
                    "BUKRS": sBukrs,
                    "BUTXT": sButxt
                };
            
                // Validate if required fields are filled
                if (!sCompany || !sBukrs || !sButxt) {
                    sap.m.MessageBox.error("Company, BUKRS, and Description are required.");
                    return;
                }
            
                // Show busy indicator while the request is being processed
                this.getView().setBusy(true);
            
                // Send the update request to UpdateCompany endpoint
                oModel.create("/UpdateCompany", payload, {
                    success: function (res) {
                        debugger;
                        sap.m.MessageBox.success("Company updated successfully.");
                        sap.ui.getCore().byId("editCompanyInput").setValue("");
                        sap.ui.getCore().byId("editBukrsInput").setValue("");
                        sap.ui.getCore().byId("editCompanyDescInput").setValue("");
                        this._editCompanyCodeDialog.close();
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageBox.error("Failed to update the company.");
                        this._editCompanyCodeDialog.close();
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }
            
            
            

            
            
            
            
            














        });
    });
