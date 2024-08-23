sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.InvoiceUpload.InvoiceUploadDetails", {
            onInit: function () {
                this.getView().setModel(this.getOwnerComponent().getModel("API_PURCHASEORDER_PROCESS_SRV"))
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("InvoiceUploadDetails").attachPatternMatched(this._PatternMatched, this);
            },
            _PatternMatched: function (oEvent) {
                const oModel = this.getOwnerComponent().getModel("API_PURCHASEORDER_PROCESS_SRV")
                this.PO = oEvent.getParameter("arguments").po
                oModel.read('/A_PurchaseOrder', {
                    filters: [new sap.ui.model.Filter("PurchaseOrder", "EQ", this.PO)],
                    success: function (oData, oRes) {
                        let oHeaderDetails = new sap.ui.model.json.JSONModel(oData.results[0])
                        this.getView().setModel(oHeaderDetails, "HeaderDetails")
                    }.bind(this),
                    error: function (oErr) { debugger },
                })
                oModel.read('/A_PurchaseOrderItem', {
                    filters: [new sap.ui.model.Filter("PurchaseOrder", "EQ", this.PO)],
                    success: function (oData, oRes) {
                        let oItemDetails = new sap.ui.model.json.JSONModel(oData.results)
                        this.getView().setModel(oItemDetails, "ItemDetails")
                    }.bind(this),
                    error: function (oErr) { debugger },
                })
                //this.byId('idSmartTable').rebindTable()
            },
            onExit: function(){
                debugger
            },
            handleBeforeRebindTable: function (oEvent) {
                let oFilter = new sap.ui.model.Filter("PurchaseOrder", "EQ", this.PO)
                oEvent.getParameter("bindingParams").filters.push(oFilter);
            },
            onUploadCompleted: function (oEvent) {
                // var oResponse = JSON.parse(oEvent.getParameter("response").responseText);
                // if (oResponse.success) {
                //     this._showPreview(oResponse.filePath);
                // } else {
                //     MessageToast.show("File upload failed.");
                // }
                debugger;
                this.byId('idSubmitButton').setEnabled(true)
                this.byId('attachmentUpl').setUploadEnabled(false)
            },

            _showPreview: function (sFilePath) {
                var oPdfViewer = this.getView().byId("pdfViewer");
                oPdfViewer.setSource(sFilePath);
                oPdfViewer.setVisible(true);
            },
            handleInvoiceSubmit: function (oEvent) {
                sap.m.MessageBox.confirm('Do you want to sumbit changes?', {
                    emphasizedAction: sap.m.MessageBox.Action.CLOSE,
                    onClose: function (sAction) {
                        sap.m.MessageBox.success('Changes saved successfully');
                    }
                })

            }
        });
    });
