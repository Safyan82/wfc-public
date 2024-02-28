import { gql } from "@apollo/client";

export const EmployeeeSkillMutation = gql`
mutation($input: EmployeeSkillInput!){
    newEmployeeSkill(input: $input) {
      message
    }
}
`;

export const DeleteEmployeeSkillMutation = gql`
mutation($input: EmployeeDeleteInput!){
  deleteEmployeeSkill(input: $input) {
    message
  }
}
`;


export const UpdateEmployeeSkillMutation = gql`
mutation($input: EmployeeSkillInput!){
  updateEmployeeSkill(input: $input) {
    message
    response
  }
}
`;