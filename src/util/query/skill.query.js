import { gql } from "@apollo/client";

export const skillQuery = gql`
query{
    getSkills{
      _id
      skill
      categoryId
      description
      hardSkill
      createdBy
      digitalFields
      dateFields
      digitalCertificate
      anyDate
      fields
      createdBy
      createdAt
    }
}
`;