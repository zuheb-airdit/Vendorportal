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
        this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
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
        // if (oItem == "RouteApprovalMatrix" && oToolPages.setSideExpanded().mProperties.sideExpanded == true) {
        //   this.onSideNavButtonPress()
        // }
        this.getOwnerComponent().getRouter().navTo(oItem);
      },
      onRouteMatched: function () {
        debugger;
        let oModel = this.getOwnerComponent().getModel("lpadData");

        if (window.location.href.split("#/")[1]) {
          this.getOwnerComponent().getRouter().navTo(window.location.href.split("#/")[1] || "")
          this.getView().byId("idSelectedKey").setSelectedKey(window.location.href.split("#/")[1] || "")
        } else if (oModel) {
          this.getOwnerComponent().getRouter().navTo(oModel.getData().navigation[0].appId || "")
          this.getView().byId("idSelectedKey").setSelectedKey(oModel.getData().navigation[0].appId || "")
        }
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
            name: "com.air.vp.lnchpage.fragments.Admins.ProfileView",
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
      onCancelProfileView: function (oEvent) {
        this._myProfile.close();
      },

     
      onPressChangePassword: function () {
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          newPassword: "",
          confirmPassword: "",
          isNewPasswordVisible: false,
          isConfirmPasswordVisible: false,
          passwordText: ''
        }), "changepassword");
        if (!this.ChangePassword) {
          this.ChangePassword = sap.ui.xmlfragment("com.air.vp.lnchpage.fragments.Admins.ChangePassword", this);
          this.getView().addDependent(this.ChangePassword);
        }
        this.ChangePassword.open();
      },
      onCloseChangePassWord: function () {
        this.ChangePassword.close();
      },
      onToggleNewPasswordVisibility: function () {
        var oModel = this.getView().getModel("changepassword");
        var isNewPasswordVisible = oModel.getProperty("/isNewPasswordVisible");

        var newPasswordInput = sap.ui.getCore().byId("newPassword");

        if (isNewPasswordVisible) {
          newPasswordInput.setType(sap.m.InputType.Password);
          oModel.setProperty("/isNewPasswordVisible", false);
        } else {
          newPasswordInput.setType(sap.m.InputType.Text);
          oModel.setProperty("/isNewPasswordVisible", true);
        }
      },

      onToggleConfirmPasswordVisibility: function () {
        var oModel = this.getView().getModel("changepassword");
        var isConfirmPasswordVisible = oModel.getProperty("/isConfirmPasswordVisible");

        var confirmPasswordInput = sap.ui.getCore().byId("confirmPassword");

        if (isConfirmPasswordVisible) {
          confirmPasswordInput.setType(sap.m.InputType.Password);
          oModel.setProperty("/isConfirmPasswordVisible", false);
        } else {
          confirmPasswordInput.setType(sap.m.InputType.Text);
          oModel.setProperty("/isConfirmPasswordVisible", true);
        }
      },

      onChangePassword: function () {
        var oModel = this.getView().getModel("changepassword");
        var newPassword = oModel.getProperty("/newPassword");
        var confirmPassword = oModel.getProperty("/confirmPassword");

        if (newPassword.length < 1) {
          sap.m.MessageToast.show("Please input your Password.");
          oModel.setProperty("/passwordText", "*Please input your Password*");
          return;
        }

        if (newPassword.length < 8) {
          sap.m.MessageToast.show("Please choose a longer password.");
          oModel.setProperty("/passwordText", "*Please choose a longer password*");
          return;
        }

        if (newPassword !== confirmPassword) {
          sap.m.MessageToast.show("Passwords do not match.");
          oModel.setProperty("/passwordText", "*Passwords does not match*");
          return;
        }

        oModel.setProperty("/passwordText", "");

        sap.m.MessageToast.show("Password changed successfully.");
        this.ChangePassword.close();
      },
      onPressLogout: function (oevent) {
        window.location.replace("do/logout");
       
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

