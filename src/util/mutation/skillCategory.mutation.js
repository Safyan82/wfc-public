import { gql } from "@apollo/client";

export const SkillCategoryMutation = gql `
mutation($input: SkillCategoryInput!){
    newSkillCategory(input: $input) {
      _id
      category
    }
}`;