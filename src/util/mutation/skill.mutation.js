import { gql } from "@apollo/client";

export const SkillMutation = gql`
mutation($input: SkillInput!){
    newSkill(input: $input) {
      _id
    }
}
`;

export const SkillDeleteMutation = gql`
mutation($deleteSkills: BulkInput!){
  deleteSkill(deleteSkills: $deleteSkills) {
    message
  }
}
`;