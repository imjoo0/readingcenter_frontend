import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query getBooksByBl(
    $minBl: Float
    $maxBl: Float
    $maxWc: Int
    $minWc: Int
    $maxLex: Int
    $minLex: Int
    $studentId: ID
    $academyIds: [ID]!
    $lectureDate: Date!
    $arQn: Int
  ) {
    getBooksByBl(
      minBl: $minBl
      maxBl: $maxBl
      maxWc: $maxWc
      minWc: $minWc
      maxLex: $maxLex
      minLex: $minLex
      academyIds: $academyIds
      lectureDate: $lectureDate
      studentId: $studentId
      arQn: $arQn
    ) {
      titleAr
      titleLex
      bl
      ilStatus
      litproStatus
      fnfStatus
      arQuiz
      id
      kplbn
      authorAr
      lexileAr
      lexileLex
      wcAr
      arPts
      books(academyIds: $academyIds) {
        isbn
        id
        place
        plbn
        bookStatus
        boxNumber
        academy {
          id
          name
          location
        }
        updatetime
      }
    }
  }
`;

export const EDIT_BOOK_PLACE = gql`
  mutation bookInventoryUpdate($id: ID!, $newPlace: String!) {
    bookInventoryUpdate(id: $id, newPlace: $newPlace) {
      bookInfo {
        id
        kplbn
        titleAr
        authorAr
      }
    }
  }
`;

export const GET_ME = gql`
  query {
    me {
      id
      username
      userCategory
      profile {
        ... on StudentType {
          id
          korName
          engName
          registerDate
          origin
          pmobileno
          birthDate
          academies {
            id
            name
            location
          }
        }
        ... on TeacherType {
          id
          korName
          engName
          registerDate
          birthDate
          academy {
            id
            name
            location
          }
        }
        ... on ManagerType {
          id
          korName
          engName
          registerDate
          birthDate
          academies {
            id
            name
            location
          }
        }
      }
    }
  }
`;

export const UPDATE_BOOK_INVENTORY = gql`
  mutation bookInventoryUpdate(
    $id: ID!
    $academyId: ID
    $newBoxNumber: String
    $bookStatus: Int
  ) {
    bookInventoryUpdate(
      id: $id
      academyId: $academyId
      newBoxNumber: $newBoxNumber
      bookStatus: $bookStatus
    ) {
      result {
        id
        plbn
        academy {
          name
        }
        boxNumber
        isbn
        bookStatus
        academy {
          id
        }
        # ... 필요한 다른 필드들 ...
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBookInventory($bookId: ID!, $academyId: ID!, $boxNum: String) {
    addBookInventory(bookId: $bookId, academyId: $academyId, boxNum: $boxNum) {
      result {
        id
        plbn
        academy {
          name
        }
        boxNumber
        isbn
        bookStatus
        # ... 필요한 다른 필드들 ...
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBookInventory($bookInvenId: ID!) {
    deleteBookInventory(bookInvenId: $bookInvenId) {
      success
    }
  }
`;
