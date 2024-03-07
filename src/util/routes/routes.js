export const routes = {
    setting: "/setting",
    propertySetting: "/setting/module",
    addUser: "/setting/adduser",
    userRole: "/setting/userRole",
    userAccess: "/setting/useraccess",
    userDetail: "/setting/user/:employeeId",
    employeeEditForm: "/setting/employee/editform",
    editskill: "/setting/employee/editskill",
    forms: "/setting/forms",
    branchEditForm: "/setting/branch/editform",

    // Finance module
    paylevel: "/setting/finance/paylevel",
    paybillcol: "/setting/finance/paybillcol",
    shifttype: "/setting/finance/shifttype",
    paytable: "/setting/finance/paytable",


    // module objects
    module:"/setting/module/config",

    // billing
    service:"/setting/billing/service",
    payment:"/setting/billing/payment",
    billingNotification:"/setting/billing/billingNotification"
}

export const publicRoutes = ["/", "/pwd/*", "/classic/*"];