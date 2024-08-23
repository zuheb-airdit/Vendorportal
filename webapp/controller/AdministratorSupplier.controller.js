sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.AdministratorSupplier", {
            onInit: function () {
                var oData = {
                    POs: [
                        {
                            PONumber: "PO123456",
                            POAmount: "1000 USD",
                            DateOfApproved: "2024-07-01"
                        },
                        {
                            PONumber: "PO123457",
                            POAmount: "2000 USD",
                            DateOfApproved: "2024-07-02"
                        },
                        {
                            PONumber: "PO123458",
                            POAmount: "3000 USD",
                            DateOfApproved: "2024-07-03"
                        },
                        {
                            PONumber: "PO123458",
                            POAmount: "3000 USD",
                            DateOfApproved: "2024-07-03"
                        },
                        {
                            PONumber: "PO123458",
                            POAmount: "3000 USD",
                            DateOfApproved: "2024-07-03"
                        }
                    ]
                };
    
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);

            }
           

        });
    });
