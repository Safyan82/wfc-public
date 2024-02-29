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
    module:"/setting/module/config",
    service:"/setting/billing/service",
    payment:"/setting/billing/payment",
    billingNotification:"/setting/billing/billingNotification"
}

export const publicRoutes = ["/", "/pwd/*", "/classic/*"];