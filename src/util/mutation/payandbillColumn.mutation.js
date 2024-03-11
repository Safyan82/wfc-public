import { gql } from "@apollo/client";

export const newPayandBillColumnMutation = gql`
mutation($input: PayandBillColumnInput!){
    newPayandBillColumn(input: $input) {
      response
      message
    }
}
`;

export const updatePayandBillColumnMutation = gql`
mutation($input: PayandBillColumnInput!){
    updatePayandBillCoulmn(input: $input) {
      response
      message
    }
}
`;


export const deletePayandBillColumnMutation = gql `
mutation($deletePayandBillCoulmnId: String!){
    deletePayandBillCoulmn(id: $deletePayandBillCoulmnId) {
      response
      message
    }
}
`;