import { gql } from "@apollo/client";

export const deactiveSessionMutation = gql`
mutation($deactiveSessionId: String!){
  deactiveSession(id: $deactiveSessionId) {
    message
  }
}
`;