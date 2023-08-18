import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query getBooksByBl(
    $minBl: Float!
    $maxBl: Float!
    $academyId: Int!
    $lectureDate: Date!
  ) {
    getBooksByBl(
      minBl: $minBl
      maxBl: $maxBl
      academyId: $academyId
      lectureDate: $lectureDate
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
