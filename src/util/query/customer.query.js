import { gql } from "@apollo/client";

export const CustomerObjectQuery = gql `
query{
    getCustomerObject {
      response
    }
}
`;

export const getCustomerQuery = gql `
query($input: CustomerFilter!){
  customers(input: $input) {
    _id
    customername
    metadata
    createdAt
    updatedAt
    createdBy
    updatedBy
  }
}
`;

export const getSingleCustomerQuery = gql `
query($id: String!){
  customer(_id: $id) {
    _id
    customername
    metadata
  }
}
`;