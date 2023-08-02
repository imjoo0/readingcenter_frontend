import { gql } from "@apollo/client";

export const GET_ALL_LECTURES = gql`
  query allLectures($academyId: Int!) {
    allLectures(academyId: $academyId) {
      id
      date
      startTime
      endTime
      lectureInfo
      repeatDay
      teacher {
        id
        korName
        engName
      }
      students {
        id
        korName
        engName
        gender
        registerDate
        origin
        pmobileno
        birthDate
      }
    }
  }
`;

export const DELETE_LECTURE = gql`
  mutation deleteLecture($id: ID!) {
    deleteLecture(id: $id) {
      success
    }
  }
`;
