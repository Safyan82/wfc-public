import { gql } from "@apollo/client";

export const EmployeeSkillQuery = gql`
query($condition: String!, $employeeId: String!){
  getEmployeeSkill(condition: $condition, employeeId: $employeeId) {
      response
      message
    }
}
`;