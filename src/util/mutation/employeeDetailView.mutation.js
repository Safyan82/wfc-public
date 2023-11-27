import { gql } from "@apollo/client";

export const AddEmployeeDetailView = gql `mutation($input: EmployeeDetailViewInput!){
    addEmployeeBranchDetailView(input: $input) {
      response
    }
  }`;