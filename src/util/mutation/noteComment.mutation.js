import { gql } from "@apollo/client";

export const NewNoteCommentMutation = gql`
mutation($input: NoteCommentInput!){
    newNoteComment(input: $input) {
      response
      message
    }
  }
`;


export const UpdateNoteCommentMutation = gql `
mutation($input: NoteCommentInput!){
    updateNoteComment(input: $input) {
      response
      message
    }
}
`;


export const DeleteNoteCommentMutation = gql `
mutation($commentId: String!){
    deleteNoteComment(commentId: $commentId) {
      message
    }
}
`;
