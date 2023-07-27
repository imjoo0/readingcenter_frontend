import { gql } from "@apollo/client";

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
      students {
        # 여기에서 학생들의 정보를 가져옵니다.
        id
        korName
        engName
        origin
        pmobileno
        mobileno
        birthYear
        gender
      }
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation CreateLecture(
    $academyId: Int!
    $date: Date!
    $startTime: Time!
    $endTime: Time!
    $lectureInfo: String!
    $teacherId: Int!
    $repeatDay: Int!
  ) {
    createLecture(
      academyId: $academyId
      date: $date
      startTime: $startTime
      endTime: $endTime
      lectureInfo: $lectureInfo
      teacherId: $teacherId
      repeatDay: $repeatDay
    ) {
      lecture {
        id
        academy {
          id
          name
          branchName
        }
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
      }
    }
  }
`;
