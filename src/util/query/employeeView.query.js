import { gql } from "@apollo/client";

export const employeeViewQuery = gql `
query{
    employeeView {
      response
    }
}
`;