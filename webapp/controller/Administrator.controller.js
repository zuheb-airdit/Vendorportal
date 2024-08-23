sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
],
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("com.air.vp.lnchpage.controller.Administrator", {
            onInit: function () {
                // let oModel = this.getOwnerComponent().getModel();
                // this.getView().setModel(oModel);
                // this.getOwnerComponent().getRouter().getRoute("Administrator").attachPatternMatched(this.patternMatch,this);
                let dataModel = this.getOwnerComponent().getModel("registration-manage");
                this.getView().setModel(dataModel)
                let mmModel = this.getView().getModel()
                // this.getView().setModel(dataModel)
                this.loadData("ONE_WEEK");
                debugger;
                mmModel.read("/Reqstatus", {
                    success: function (oData) {
                        debugger;
                        var results = oData.results;

                        // Assuming results is an array with a single object as shown in the example
                        var data = results[0];

                        // Calculate the required values
                        var total = data.CREATE_SUPPLIER + data.CREATE_BUYER;
                        var approved = data.STATUS5;
                        var rejected = data.STATUS3;
                        var inprogress = total - (approved + rejected);


                        var oCalculatedModel = new sap.ui.model.json.JSONModel({
                            total: total,
                            approved: approved,
                            rejected: rejected,
                            inprogress: inprogress
                        });


                        this.getView().setModel(oCalculatedModel, "calculatedModel");
                        debugger;
                    }.bind(this),
                    error: function (err) {
                        debugger;
                    }
                })
                // var oData = {
                //     "STATUS2": 0,
                //     "STATUS3": 0,
                //     "STATUS4": 16,
                //     "STATUS5": 1,
                //     "STATUS6": 1
                // };
                // var dataJsonModel = new JSONModel();
                // dataJsonModel.setData(oData);
                // this.getView().setModel(dataJsonModel, "dataJsonModel");
                // let json = this.getView().getModel("dataJsonModel");
                // let aData = json.getData();
                //  var totalStatus = 0;
                //  debugger;
                //  for (var key in aData) {
                //     if (oData.hasOwnProperty(key)) {
                //         totalStatus += oData[key];
                //     }
                // }
                // var oTotalStatusModel = new JSONModel({ totalStatus: totalStatus });
                // this.getView().setModel(oTotalStatusModel, "totalStatusModel");
                // var aStatusCounts = [];
                // for (var key in oData) {
                //     if (oData.hasOwnProperty(key)) {
                //         aStatusCounts.push({
                //             Status: key,
                //             Count: oData[key]
                //         });
                //     }
                // }

                // // Create a new JSON model with the transformed data
                // var oJsonModel = new JSONModel({
                //     statusCounts: aStatusCounts
                // });

                // // Set the new JSON model to the view
                // this.getView().setModel(oJsonModel,"StatusCount");
                debugger;

                // let donutChartobj ={
                //     "Create Buyer": 11,
                //     "Crete Supplier":8,
                // }
                // let createCount=[];
                // for(let key in donutChartobj){
                //     if(donutChartobj.hasOwnProperty(key)){
                //         createCount.push({
                //             type: key,
                //             count: donutChartobj[key]
                //         })
                //     }
                // }
                // var oJsonModel2 = new JSONModel({
                //     typecount: createCount
                // });

                // // Set the new JSON model to the view
                // this.getView().setModel(oJsonModel2,"typeCount");



            },
            patternMatch: function () {
                var oToolPage = sap.ui.getCore().byId("container-com.airdit.agpp.agp---App--toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();
                oToolPage.setSideExpanded(true);
                // sap.ui.getCore().byId("container-com.airdit.agpp.agp---App--sideNavigationToggleButton").firePress()
            },
            handleZoomOut: function (oEvent) {
                oEvent.getSource().getParent().getParent()._zoom()
                oEvent.getSource().getParent().getParent()._zoom()
                oEvent.getSource().getParent().getParent()._zoom()
                oEvent.getSource().getParent().getParent()._zoom()
                oEvent.getSource().getParent().getParent()._zoom()
                // oEvent.getSource().getParent().getParent()._zoom()
            },
            onUserMaster: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteUserMaster");
            },
            onApprovalMatrix: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteApprovalMatrix");
            },
            onFilterChange: function (oEvent) {
                // var sKey = oEvent.getParameter("selectedItem").getKey();
                // let mmModel= this.getView().getModel()
                // let aFilters = [
                //     new Filter("selectedTime","EQ", sKey)
                // ];
                // mmModel.read("/RequestsStuckInApprovalForOverMonths",{
                //     filters :aFilters,
                //     success: function(res){
                //         let oJsonModel = new sap.ui.model.json.JSONModel(res.results);
                //         this.getView().setModel(oJsonModel, "approvalData");

                //         // Assuming your table has the ID "approvalTable"
                //         let oTable = this.getView().byId("approvalTable");
                //         oTable.setModel(oJsonModel);
                //         oTable.bindItems({
                //             path: "approvalData>/",
                //             template: oTable.getBindingInfo("items").template
                //         });
                //     }.bind(this),
                //     error: function(err){
                //         debugger;
                //     }
                // }) 
                var sKey = oEvent.getParameter("selectedItem").getKey();
                this.loadData(sKey);

            },


            loadData: function (sKey) {
                let mmModel = this.getView().getModel();
                let aFilters = [
                    new Filter("selectedTime", "EQ", sKey)
                ];

                mmModel.read("/RequestsStuckInApprovalForOverMonths", {
                    filters: aFilters,
                    success: function (res) {
                        let oJsonModel = new sap.ui.model.json.JSONModel(res.results);
                        this.getView().setModel(oJsonModel, "approvalData");

                        // Assuming your table has the ID "approvalTable"
                        let oTable = this.getView().byId("reqPendingTable");
                        oTable.setModel(oJsonModel);
                        oTable.bindItems({
                            path: "approvalData>/",
                            template: oTable.getBindingInfo("items").template
                        });
                    }.bind(this),
                    error: function (err) {
                        // Handle error
                        console.error("Error loading data:", err);
                    }
                });
            },

            onNavIndashboard : function(oEvent){
                debugger;
                var oButton = oEvent.getSource();
                var oBindingContext = oButton.getBindingContext("approvalData");
                let reqNo = oBindingContext.getObject().REQUEST_NO;
                this.getOwnerComponent().getRouter().navTo("RegisterObjPage", { id: reqNo })
            }

        });
    });
