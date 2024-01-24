import { gql } from "@apollo/client";

export const newUserMutation = gql `
mutation($input: userInput!){
    newUser(input: $input) {
      response
      success
      message
    }
}
`;

export const verifyPasswordMutation = gql `
mutation($input: userInput!){
  verifyPassword(input: $input) {
    response
    message
  }
}`;


export const updateUserMutation = gql`
mutation($input: userInput!){
  updateUser(input: $input) {
    response
  }
}
`;

