import { gql } from "@apollo/client";

export const SkillCategoryQuery = gql`
query{
    getSkillCategories {
      category
      createdBy
      createdAt
      skillsnumber
      _id
    }
}
`;