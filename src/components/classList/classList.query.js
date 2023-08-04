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

export const GET_CLASS = gql`
  query getLecturesByAcademyAndDate($academyId: Int!, $date: Date!) {
    getLecturesByAcademyAndDate(academyId: $academyId, date: $date) {
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
      bookReservations {
        student {
          id
        }
      }
      students {
        # 여기에서 학생들의 정보를 가져옵니다.
        id
        korName
        engName
        origin
        pmobileno
        mobileno
        birthDate
        gender
        reservedBooksCount
        attendances {
          lecture {
            id
          }
          status
          statusDisplay
          entryTime
          exitTime
        }
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
