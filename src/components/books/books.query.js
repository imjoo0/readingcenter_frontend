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
      }
    }
  }
`;
