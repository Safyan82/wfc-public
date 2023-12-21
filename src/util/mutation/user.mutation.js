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