sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
    "use strict";
    return {
        removeCommas: function (sValue, reqType) {

            if (!sValue) {
                return "";
            }
            var oNumberFormat = NumberFormat.getIntegerInstance({
                groupingEnabled: false
            });
            return oNumberFormat.format(sValue) + " " + reqType;

        },

        statusFormatter: function (status, role) {
            console.log("alpha")
            switch (status) {
                case 15:
                    return "Not Invited"
                case 2:
                    return "Invited"

                case 3:
                    return "Rejected"
                case 4:
                    return `Form in Progress-${role}`
                case 9:
                    return "Send Back"
                default:
                    return "No Data"
            }
        },

        statusColorFormatter: function (status) {
            console.log("test")
            switch (status) {
                case 15:
                    return "Indication13"
                case 2:
                    return "Indication14"

                case 3:
                    return "Indication11"
                default:
                    return "None"
            }
        },

        createdOnAndByFormatter: function (createdOn) {
          
            if (!createdOn) {
                return "";
            }

            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd-MM-yyyy"
            });
            var formattedDate = oDateFormat.format(new Date(createdOn));

            return formattedDate;
        }
    };
});
