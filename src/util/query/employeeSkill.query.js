import { gql } from "@apollo/client";

export const EmployeeSkillQuery = gql`
query($employeeId: String!){
    getEmployeeSkill(employeeId: $employeeId) {
      response
      message
    }
}
`;