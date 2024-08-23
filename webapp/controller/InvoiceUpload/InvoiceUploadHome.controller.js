sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.InvoiceUpload.InvoiceUploadHome", {
            onInit: function () {
                this.getView().setModel(this.getOwnerComponent().getModel("API_PURCHASEORDER_PROCESS_SRV"))
            },
            handlePO_RowClick: function (oEvent) {
                let oRouter = this.getOwnerComponent().getRouter();
                let sPO = oEvent.getSource().getBindingContext().getObject().PurchaseOrder
                oRouter.navTo('InvoiceUploadDetails', { po: sPO })
            }


        });
    });
