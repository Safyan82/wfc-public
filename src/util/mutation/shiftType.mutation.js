import { gql } from "@apollo/client";

export const newShiftTypeMutation = gql `
mutation($input: ShiftTypeInput!){
    newShiftType(input: $input) {
      response
      message
    }
}
`;

export const updateShiftTypeMutation = gql `
mutation($input: ShiftTypeInput!){
    updateShiftType(input: $input) {
      response
      message
    }
}
`;

export const deleteShiftTypeMutation = gql `
mutation($input: ShiftTypeInput!){
    deleteShiftType(input: $input) {
      response
      message
    }
}
`;