import { resetArchivePropertyFilteredData } from "./reducers/archiveProperty.reducer";
import { resetBranch } from "./reducers/branch.reducer";
import { resetBranchData } from "./reducers/branchData.reducer";
import { resetBranchView } from "./reducers/branchView.reducer";
import { resetCreateField } from "./reducers/createField.reducer";
import { resetEditProperty } from "./reducers/editProperty.reducer";
import { resetEditUserData } from "./reducers/editUser.reducer";
import { resetGroupState } from "./reducers/group.reducer";
import { resetModuleCustomPermission } from "./reducers/moduleCustomPermission.reducer";
import { resetTogglenewCreateView } from "./reducers/newView.reducer";
import { resetNoteState } from "./reducers/note.reducer";
import { resetNotification } from "./reducers/notification.reducer";
import { resetPermission } from "./reducers/permission.reducer";
import { resetPropertyState } from "./reducers/properties.reducer";
import { resetAllFilter } from "./reducers/quickFilter";
import { resetUserState } from "./reducers/user.reducer";
import { resetAuthUserDetail } from "./reducers/userAuth.reducer";
import { resetUserRoleState } from "./reducers/userRole.reducer";
import store from "./store"

export const resetAllReducerState = ()=>{
   
    store.dispatch(resetArchivePropertyFilteredData());
    store.dispatch(resetBranch());
    store.dispatch(resetBranchData());
    store.dispatch(resetBranchView());
    // store.dispatch(resetCreateField());
    store.dispatch(resetEditProperty());
    store.dispatch(resetEditUserData());
    store.dispatch(resetGroupState());
    store.dispatch(resetModuleCustomPermission());
    store.dispatch(resetNoteState());
    store.dispatch(resetNotification());
    store.dispatch(resetPermission());
    store.dispatch(resetPropertyState());
    store.dispatch(resetAllFilter());
    store.dispatch(resetUserState())
    store.dispatch(resetAuthUserDetail());
    store.dispatch(resetUserRoleState());
    store.dispatch(resetTogglenewCreateView());
    sessionStorage.clear();
    localStorage.clear();
}