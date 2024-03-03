import { gql } from "@apollo/client";

export const NewNoteMutation = gql`
mutation($input: NoteInput!){
  newNote(input: $input) {
    response
    message
  }
}`;


export const UpdateNoteMutation = gql`
mutation($input: NoteInput!){
  updateNote(input: $input) {
    response
    message
  }
}
`;

export const DeleteNoteMutation = gql`
mutation($noteId: String!){
  deleteNote(noteId: $noteId) {
    response
    message
  }
}
`;