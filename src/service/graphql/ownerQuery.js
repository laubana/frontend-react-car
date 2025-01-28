import { gql } from "@apollo/client";

export const GET_OWNERS = gql`
  query GetOwners {
    getOwners {
      id
      firstName
      lastName
    }
  }
`;
export const GET_OWNER = gql`
  query GetOwner($id: String!) {
    getOwner(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const ADD_OWNER = gql`
  mutation AddOwner($firstName: String!, $lastName: String!) {
    addOwner(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const REMOVE_OWNER = gql`
  mutation RemoveOwner($id: String!) {
    removeOwner(id: $id) {
      id
    }
  }
`;

export const UPDATE_OWNER = gql`
  mutation UpdateOwner($id: String!, $firstName: String!, $lastName: String!) {
    updateOwner(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;
