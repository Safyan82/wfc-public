import { gql } from "@apollo/client";

export const ThemeMutation = gql `
mutation($input: ThemeInput!){
    newTheme(input: $input) {
      color
    }
}
`;