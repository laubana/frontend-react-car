import { gql } from "@apollo/client";

export const GET_OWNERS = gql`
  query GetOwners {
    getOwners {
      _id
      firstName
      lastName
    }
  }
`;
export const GET_OWNER = gql`
  query GetOwner($ownerId: ID!) {
    getOwner(ownerId: $ownerId) {
      _id
      firstName
      lastName
    }
  }
`;

export const ADD_OWNER = gql`
  mutation AddOwner($firstName: String!, $lastName: String!) {
    addOwner(firstName: $firstName, lastName: $lastName) {
      _id
      firstName
      lastName
    }
  }
`;

export const REMOVE_OWNER = gql`
  mutation RemoveOwner($ownerId: ID!) {
    removeOwner(ownerId: $ownerId)
  }
`;

export const UPDATE_OWNER = gql`
  mutation UpdateOwner($ownerId: ID!, $firstName: String!, $lastName: String!) {
    updateOwner(ownerId: $ownerId, firstName: $firstName, lastName: $lastName) {
      _id
      firstName
      lastName
    }
  }
`;
