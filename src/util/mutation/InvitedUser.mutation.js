import { gql } from "@apollo/client";

export const  setPasswordForInvitedUserMutation = gql`
mutation($input: userInput!){
    setPasswordForInvitedUser(input: $input) {
      success
      message
    }
  }
`;