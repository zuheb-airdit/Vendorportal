sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.SupplierReportObject", {
            onInit: function () {
                debugger;
                this.getView().setBusy(true)
                let oModels = this.getOwnerComponent().getModel("zapi-business-partnersample");
                this.getView().setModel(oModels)
                this.getOwnerComponent().getRouter().getRoute("SupplierReportObject").attachPatternMatched(this.onObjectMatched, this);
               
                // this.getView().setModel(oModels)


                // oModels.read("/Supplier", {
                //     success: function (res) {
                //         debugger;
                //         if (res && res.results && res.results.length > 0) {
                //             // Access the first object in the array
                //             var supplierData = res.results[0];

                //             // Map the complete supplier data into different sections
                //             var oData = {
                //                 businessPartnerDetails: supplierData.businessPartnerDetails,
                //                 addressDetails: supplierData.addressDetails.map(function (address) {
                //                     return {
                //                         BusinessPartner: address.BusinessPartner,
                //                         AddressID: address.AddressID,
                //                         ValidityStartDate: address.ValidityStartDate,
                //                         ValidityEndDate: address.ValidityEndDate,
                //                         AuthorizationGroup: address.AuthorizationGroup,
                //                         AddressUUID: address.AddressUUID,
                //                         AdditionalStreetPrefixName: address.AdditionalStreetPrefixName,
                //                         CityName: address.CityName,
                //                         Country: address.Country,
                //                         PostalCode: address.PostalCode,
                //                         Region: address.Region,
                //                         StreetName: address.StreetName,
                //                         StreetPrefixName: address.StreetPrefixName,
                //                         District: address.District
                //                     };
                //                 }),
                //                 bankDetails: supplierData.bankDetails.map(function (bankDetail) {
                //                     return {
                //                         BusinessPartner: bankDetail.BusinessPartner,
                //                         BankName: bankDetail.BankName,
                //                         BankAccount: bankDetail.BankAccount,
                //                         BankNumber: bankDetail.BankNumber,
                //                         BankCountryKey: bankDetail.BankCountryKey,
                //                         BankIdentification: bankDetail.BankIdentification
                //                     };
                //                 }),
                //                 supplierDetails: {
                //                     SupplierName: supplierData.supplierDetails.SupplierName,
                //                     SupplierAccountGroup: supplierData.supplierDetails.SupplierAccountGroup,
                //                     GSTNumber: supplierData.supplierDetails.GSTNumber,
                //                     PANNumber: supplierData.supplierDetails.PANNumber,
                //                     CreationDate: supplierData.supplierDetails.CreationDate
                //                 },
                //                 phoneDetails: supplierData.phoneDetails.map(function (phoneDetail) {
                //                     return {
                //                         AddressID: phoneDetail.AddressID,
                //                         PhoneNumber: phoneDetail.PhoneNumber,
                //                         InternationalPhoneNumber: phoneDetail.InternationalPhoneNumber,
                //                         IsDefaultPhoneNumber: phoneDetail.IsDefaultPhoneNumber
                //                     };
                //                 }),
                //                 partnerFunctions: supplierData.partnerFunctions.map(function (partnerFunction) {
                //                     return {
                //                         Supplier: partnerFunction.Supplier,
                //                         PurchasingOrganization: partnerFunction.PurchasingOrganization,
                //                         PartnerFunction: partnerFunction.PartnerFunction,
                //                         DefaultPartner: partnerFunction.DefaultPartner,
                //                         CreationDate: partnerFunction.CreationDate,
                //                         CreatedByUser: partnerFunction.CreatedByUser
                //                     };
                //                 }),
                //                 relatedVendors: supplierData.relatedVendors.map(function (vendor) {
                //                     return {
                //                         ReferenceSupplier: vendor.ReferenceSupplier,
                //                         CityName: vendor.Address.CityName,
                //                         StreetName: vendor.Address.StreetName,
                //                         PostalCode: vendor.Address.PostalCode,
                //                         Region: vendor.Address.Region,
                //                         Country: vendor.Address.Country
                //                     };
                //                 })
                //             };

                //             // Create a JSONModel with the mapped data
                //             var oModel = new sap.ui.model.json.JSONModel(oData);

                //             // Set the model to the view with a name, e.g., "supplierDetailsModel"
                //             this.getView().setModel(oModel, "supplierDetailsModel");
                //             this.getView().setBusy(false)
                //             debugger;
                //         } else {
                //             sap.m.MessageToast.show("No data found.");
                //             this.getView().setBusy(false)
                //         }
                //     }.bind(this),
                //     error: function (err) {
                //         debugger;
                //         // Handle error - show a message or handle the error case
                //         sap.m.MessageBox.error("Error fetching supplier data.");
                //         this.getView().setBusy(fasle)
                //     }
                // });

                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel);

            },

            onObjectMatched: function (oEvent) {
                debugger;
                let oModel = this.getView().getModel(); // OData model
                let sBusinessPartner = oEvent.getParameter("arguments").id; // Assuming the id (BusinessPartner) is passed in route
                this.getView().setBusy(true); // Set the view to busy while fetching data
                var aFilters = [];
                // Add filters (you can add multiple filters as needed)
                aFilters.push(new sap.ui.model.Filter("BusinessPartner", sap.ui.model.FilterOperator.EQ, sBusinessPartner));
                // Read from OData with filter for BusinessPartner
                oModel.read("/SupplierDetails", {
                    filters: aFilters,
                    success: function (res) {
                        
                        if (res && res.results && res.results.length > 0) {
                            // Access the first object in the array
                            var supplierData = res.results[0];
            
                            // Map the complete supplier data into different sections
                            var oData = {
                                businessPartnerDetails: supplierData.businessPartnerDetails,
                                addressDetails: supplierData.addressDetails.map(function (address) {
                                    return {
                                        BusinessPartner: address.BusinessPartner,
                                        AddressID: address.AddressID,
                                        ValidityStartDate: address.ValidityStartDate,
                                        ValidityEndDate: address.ValidityEndDate,
                                        AuthorizationGroup: address.AuthorizationGroup,
                                        AddressUUID: address.AddressUUID,
                                        AdditionalStreetPrefixName: address.AdditionalStreetPrefixName,
                                        CityName: address.CityName,
                                        Country: address.Country,
                                        PostalCode: address.PostalCode,
                                        Region: address.Region,
                                        StreetName: address.StreetName,
                                        StreetPrefixName: address.StreetPrefixName,
                                        District: address.District
                                    };
                                }),
                                bankDetails: supplierData.bankDetails.map(function (bankDetail) {
                                    return {
                                        BusinessPartner: bankDetail.BusinessPartner,
                                        BankName: bankDetail.BankName,
                                        BankAccount: bankDetail.BankAccount,
                                        BankNumber: bankDetail.BankNumber,
                                        BankCountryKey: bankDetail.BankCountryKey,
                                        BankIdentification: bankDetail.BankIdentification
                                    };
                                }),
                                supplierDetails: {
                                    SupplierName: supplierData.supplierDetails.SupplierName,
                                    SupplierAccountGroup: supplierData.supplierDetails.SupplierAccountGroup,
                                    GSTNumber: supplierData.supplierDetails.GSTNumber,
                                    PANNumber: supplierData.supplierDetails.PANNumber,
                                    CreationDate: supplierData.supplierDetails.CreationDate
                                },
                                phoneDetails: supplierData?.phoneDetails?.map(function (phoneDetail) {
                                    return {
                                        AddressID: phoneDetail.AddressID,
                                        PhoneNumber: phoneDetail.PhoneNumber,
                                        InternationalPhoneNumber: phoneDetail.InternationalPhoneNumber,
                                        IsDefaultPhoneNumber: phoneDetail.IsDefaultPhoneNumber
                                    };
                                }),
                                partnerFunctions: supplierData.partnerFunctions.map(function (partnerFunction) {
                                    return {
                                        Supplier: partnerFunction.Supplier,
                                        PurchasingOrganization: partnerFunction.PurchasingOrganization,
                                        PartnerFunction: partnerFunction.PartnerFunction,
                                        DefaultPartner: partnerFunction.DefaultPartner,
                                        CreationDate: partnerFunction.CreationDate,
                                        CreatedByUser: partnerFunction.CreatedByUser
                                    };
                                }),
                                // relatedVendors: supplierData.relatedVendors.map(function (vendor) {
                                //     return {
                                //         ReferenceSupplier: vendor.ReferenceSupplier,
                                //         CityName: vendor.Address.CityName,
                                //         StreetName: vendor.Address.StreetName,
                                //         PostalCode: vendor.Address.PostalCode,
                                //         Region: vendor.Address.Region,
                                //         Country: vendor.Address.Country
                                //     };
                                // })
                                vendors1000 : supplierData.relatedVendors
                                .filter(vendor => vendor.PurchasingOrganization === "1000")
                                .map(function (vendor) {
                                    return {
                                        ReferenceSupplier: vendor.ReferenceSupplier,
                                        CityName: vendor.Address.CityName,
                                        StreetName: vendor.Address.StreetName,
                                        PostalCode: vendor.Address.PostalCode,
                                        Region: vendor.Address.Region,
                                        Country: vendor.Address.Country,
                                        date: vendor.CreationDate,
                                        partnerFunction: vendor.PartnerFunction
                                    };
                                }),

                            vendors2000 :supplierData.relatedVendors
                                .filter(vendor => vendor.PurchasingOrganization === "2000")
                                .map(function (vendor) {
                                    return {
                                        ReferenceSupplier: vendor.ReferenceSupplier,
                                        CityName: vendor.Address.CityName,
                                        StreetName: vendor.Address.StreetName,
                                        PostalCode: vendor.Address.PostalCode,
                                        Region: vendor.Address.Region,
                                        Country: vendor.Address.Country,
                                        date: vendor.CreationDate,
                                        partnerFunction: vendor.PartnerFunction
                                    };
                                })
                            };
            
                            // Create a JSONModel with the mapped data
                            var oSupplierDataModel = new sap.ui.model.json.JSONModel(oData);
            
                            // Set the model to the view with a different name, e.g., "supplierDataModel"
                            this.getView().setModel(oSupplierDataModel, "supplierDataModel");
                            this.getView().setBusy(false); // Remove busy state
                        }
                    }.bind(this),
                    error: function (err) {
                        this.getView().setBusy(false); // Remove busy state in case of an error
                        sap.m.MessageBox.error("Error fetching supplier data.");
                    }.bind(this)
                });
            },
            onNavBack: function () {
                history.go(-1)
            },
            
            onPurchasingOrgChange: function(oEvent) {
                debugger;
                let selectedKey = oEvent.getParameter("selectedItem").getKey();
                let oTable = this.byId("vendorTable2");
            
                // Define the template for each row
                let oTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{supplierDataModel>ReferenceSupplier}" }),
                        new sap.m.Text({ text: "{supplierDataModel>partnerFunction}" }),
                        new sap.m.Text({ text: "{supplierDataModel>CityName}" }),
                        new sap.m.Text({ text: "{supplierDataModel>StreetName}" }),
                        new sap.m.Text({ text: "{supplierDataModel>PostalCode}" }),
                        new sap.m.Text({ text: "{supplierDataModel>date}" }),
                        new sap.m.Text({ text: "{supplierDataModel>Region}" }),
                        new sap.m.Text({ text: "{supplierDataModel>Country}" })
                    ]
                });
            
                // Set the table binding according to the selected purchasing organization
                if (selectedKey === "1000") {
                    oTable.bindItems({
                        path: "supplierDataModel>/vendors1000",
                        template: oTemplate
                    });
                } else if (selectedKey === "2000") {
                    oTable.bindItems({
                        path: "supplierDataModel>/vendors2000",
                        template: oTemplate
                    });
                }
            }
            


        });
    });
