import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query getBooksByBl(
    $minBl: Float
    $maxBl: Float
    $maxWc: Int
    $minWc: Int
    $maxLex: Int
    $minLex: Int
    $academyId: Int!
    $lectureDate: Date!
    $studentId: ID
  ) {
    getBooksByBl(
      minBl: $minBl
      maxBl: $maxBl
      maxWc: $maxWc
      minWc: $minWc
      maxLex: $maxLex
      minLex: $minLex
      academyId: $academyId
      lectureDate: $lectureDate
      studentId: $studentId
    ) {
      titleAr
      titleLex
      bl
      arQuiz
      id
      kplbn
      authorAr
      lexileLex
      wcAr
      arPts
      books {
        isbn
        id
        place
        plbn
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
