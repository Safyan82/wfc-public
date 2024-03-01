import { gql } from "@apollo/client";

export const NewNoteMutation = gql`
mutation($input: NoteInput!){
  newNote(input: $input) {
    response
    message
  }
}`;