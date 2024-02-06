import { gql } from "@apollo/client";

export const ActiveDeviceSession  = gql `
query($userId: String!){
    getActiveDevice(userId: $userId) {
      platform
      ip
      isActive
    }
}
`;