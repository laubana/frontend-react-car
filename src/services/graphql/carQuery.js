import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars($ownerId: ID!) {
    getCars(ownerId: $ownerId) {
      _id
      year
      make
      model
      price
      owner {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const ADD_CAR = gql`
  mutation AddCar(
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $ownerId: ID!
  ) {
    addCar(
      year: $year
      make: $make
      model: $model
      price: $price
      ownerId: $ownerId
    ) {
      _id
      year
      make
      model
      price
      owner {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const REMOVE_CAR = gql`
  mutation RemoveCar($carId: ID!) {
    removeCar(carId: $carId)
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar(
    $carId: ID!
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $ownerId: ID!
  ) {
    updateCar(
      carId: $carId
      year: $year
      make: $make
      model: $model
      price: $price
      ownerId: $ownerId
    ) {
      _id
      year
      make
      model
      price
      owner {
        _id
        firstName
        lastName
      }
    }
  }
`;
