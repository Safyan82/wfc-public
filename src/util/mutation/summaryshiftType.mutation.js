import { gql } from "@apollo/client";

export const newSummaryShiftTypeMutation = gql `
mutation($input: SummaryShiftTypeInput!){
    newSummaryShiftType(input: $input) {
      response
      message
    }
}
`;


export const updateSummaryShiftTypeMutation = gql `
mutation($input: SummaryShiftTypeInput!){
    updateSummaryShiftType(input: $input) {
      response
      message
    }
}
`;


export const deleteSummaryShiftTypeMutation = gql `
mutation($input: SummaryShiftTypeInput!){
    deleteSummaryShiftType(input: $input) {
      response
      message
    }
}
`;