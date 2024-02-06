import { gql } from "@apollo/client";

export const themeQuery = gql `
query($userId: String!){
    getThemeByUserId(userId: $userId) {
      color
      userId
      _id
    }
}
`;
