import { gql } from "@apollo/client";

export const newPayLevelMutation = gql`
mutation($input: PayLevelInput!){
    newPayLevel(input: $input) {
      response
      message
    }
}
`;

export const updatePayLevelMutation = gql`
mutation($input: PayLevelInput!){
    updatePayLevel(input: $input) {
      response
      message
    }
}
`;


export const deletePayLevelMutation = gql`
mutation($deletePayLevelId: String!){
    deletePayLevel(id: $deletePayLevelId) {
      response
      message
    }
}
`;