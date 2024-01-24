import { gql } from "@apollo/client";

export const LogoutAllSessionMutation = gql`
mutation($employeeId: String!){
    logoutAllDevices(employeeId: $employeeId) {
      message
    }
}
`; 