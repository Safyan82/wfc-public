import { gql } from "@apollo/client";

export const NoteMutation = gql`
mutation($input: NoteInput!){
    upsertNote(input: $input) {
      message
      success
    }
}`;