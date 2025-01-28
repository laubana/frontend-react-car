import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars($ownerId: String!) {
    getCars(ownerId: $ownerId) {
      id
      year
      make
      model
      price
      ownerId
    }
  }
`;

export const ADD_CAR = gql`
  mutation AddCar(
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $ownerId: String!
  ) {
    addCar(
      year: $year
      make: $make
      model: $model
      price: $price
      ownerId: $ownerId
    ) {
      id
      year
      make
      model
      price
      ownerId
    }
  }
`;

export const REMOVE_CAR = gql`
  mutation RemoveCar($id: String!) {
    removeCar(id: $id) {
      id
    }
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar(
    $id: String!
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $ownerId: String!
  ) {
    updateCar(
      id: $id
      year: $year
      make: $make
      model: $model
      price: $price
      ownerId: $ownerId
    ) {
      id
      year
      make
      model
      price
      ownerId
    }
  }
`;
