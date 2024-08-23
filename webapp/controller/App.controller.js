sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, Fragment, JSONModel) {
    "use strict";

    return BaseController.extend("com.air.vp.lnchpage.controller.App", {

      onInit: function () {
        let oModel = this.getOwnerComponent().getModel("navigationApps");
        const selectedKey = window.location.href.split("#/")[1];
        this.getView().getModel("navigationApps").oData.selectedKey = selectedKey || "test";
        this.getView().setModel(oModel);

        this.oMyAvatar = this.getView().byId("myAvatar");
        this._oPopover = Fragment.load({
          id: this.getView().getId(),
          name: "com.air.vp.lnchpage.fragments.Admins.ProfilePopover",
          controller: this
        }).then(function (oPopover) {
          this.getView().addDependent(oPopover);
          this._oPopover = oPopover;
        }.bind(this));
      },
      onItemSelect: function (oEvent) {
        debugger;
        var oItem = oEvent.getSource().getSelectedKey();
        var oToolPages = this.byId("toolPage");
        if (oItem == "RouteApprovalMatrix" && oToolPages.setSideExpanded().mProperties.sideExpanded == true) {
          this.onSideNavButtonPress()
        }
        this.getOwnerComponent().getRouter().navTo(oItem);
      },
      onSideNavButtonPress: function () {
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();
        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },
      onPress: function (oEvent) {
        var oEventSource = oEvent.getSource(),
          bActive = this.oMyAvatar.getActive();

        this.oMyAvatar.setActive(!bActive);

        if (bActive) {
          this._oPopover.close();
        } else {
          this._oPopover.openBy(oEventSource);
        }
      },
      onPopoverClose: function () {
        this.oMyAvatar.setActive(false);
      },
      onListItemPress: function () {
        this.oMyAvatar.setActive(false);
        this._oPopover.close();
      },
      onMyProfilePress: function (oEvent) {
        if (!this._myProfile) {
          this._myProfile = Fragment.load({
            id: this.getView().getId(),
            name: "com.airdit.agpp.agp.fragments.MyProfile",
            controller: this
          }).then(function (oPopover) {
            this.getView().addDependent(oPopover);
            this._myProfile = oPopover;
            this._oPopover.close();
            this._myProfile.open();
          }.bind(this));
        } else {
          this._oPopover.close();
          this._myProfile.open();
        }

      },
      onCancelProfile: function (oEvent) {
        this._oPopover.close();
      },
      onPressLogout: function (oevent) {
        window.location.replace("/do/logout");
        //window.location.reload();
        // jQuery.ajax({
        //     type: "GET",
        //     url: 'do/logout',
        //     headers: {
        //       "X-CSRF-Token": 'fetch',
        //       contentType: "application/json",
        //     },
        //     success: function(data, textStatus, request){
        //       //resolve(request.getResponseHeader('X-CSRF-Token'));
        //     }
        //    });
      },
      onAvatarProfile: function () {
        this.byId("fileUploaderEditProfile").openFilePicker();
      },
      onFileSelectionChangeEditProfile: function (oEvent) {
        var oFileUploader = oEvent.getSource();
        var oAvatar = this.byId("userAvatarEditProfile");
        var oFile = oEvent.getParameter("files")[0];
        var oReader = new FileReader();
        var oFileUploader = this.byId("fileUploaderEditProfile");
        oFileUploader.clear();

        oReader.onload = function (e) {
          var sUrl = e.target.result;
          oAvatar.setSrc(sUrl);
        };

        oReader.readAsDataURL(oFile);
        this.byId('resetImage').setVisible(true);
      },
      onResetImageProfile: function () {
        var nameSpacePath = this.getView().getModel('imageModel').getData().path;
        var imageSrc = nameSpacePath + '/images/cpy.png';
        var oAvatar = this.byId("userAvatarEditProfile");
        oAvatar.setSrc("");
        setTimeout(function () {
          oAvatar.setSrc(imageSrc);
        }, 100);
        this.byId('resetImage').setVisible(false);
      }

    });
  }
);

