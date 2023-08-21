import { gql } from "@apollo/client";

export const GET_STUDENT = gql`
  query userDetails($userId: Int!, $academyId: Int!) {
    userDetails(userId: $userId, academyId: $academyId) {
      id
      username
      email
      userCategory
      isStaff
      isActive
      memos {
        memo
        academy {
          id
        }
      }
      profile {
        ... on StudentType {
          korName
          engName
          origin
          pmobileno
          mobileno
          birthDate
          gender
          registerDate
          lectures(academyId: $academyId) {
            id
            date
            startTime
            endTime
            lectureInfo
            attendanceStatus(studentId: $userId) {
              id
              entryTime
              exitTime
              statusDisplay
            }
            teacher {
              korName
              engName
            }
          }
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query {
    allUsers {
      id
      username
      userCategory
      profile {
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
      }
    }
  }
`;

export const EDIT_STUDENT = gql`
  mutation createStudentProfile(
    $userId: Int!
    $korName: String
    $engName: String
    $gender: String
    $mobileno: String
    $birthDate: Date
    $registerDate: Date
    $pmobileno: String
    $origin: String
  ) {
    createStudentProfile(
      userId: $userId
      korName: $korName
      engName: $engName
      gender: $gender
      mobileno: $mobileno
      birthDate: $birthDate
      registerDate: $registerDate
      pmobileno: $pmobileno
      origin: $origin
    ) {
      studentProfile {
        korName
        engName
        gender
        mobileno
        pmobileno
        birthDate
        origin
        registerDate
        academies {
          id
          name
        }
      }
    }
  }
`;

export const ADD_MEMO = gql`
  mutation createRemark($userId: Int!, $academyId: Int!, $memo: String!) {
    createRemark(userId: $userId, academyId: $academyId, memo: $memo) {
      remark {
        memo
      }
    }
  }
`;

export const CREATE_ATTENDANCE = gql`
  mutation createAttendance(
    $lectureId: Int!
    $studentId: Int!
    $statusInput: String!
    $entryTime: DateTime
    $exitTime: DateTime
  ) {
    createAttendance(
      lectureId: $lectureId
      studentId: $studentId
      statusInput: $statusInput
      entryTime: $entryTime
      exitTime: $exitTime
    ) {
      attendance {
        id
      }
    }
  }
`;

export const CREATE_MAKE_UP = gql`
  mutation createMakeup(
    $academyId: Int!
    $date: Date!
    $startTime: Time!
    $endTime: Time!
    $lectureInfo: String!
    $teacherId: Int!
    $repeatDays: [Int]!
    $repeatWeeks: Int!
    $studentIds: [Int]!
  ) {
    createMakeup(
      academyId: $academyId
      date: $date
      startTime: $startTime
      endTime: $endTime
      lectureInfo: $lectureInfo
      teacherId: $teacherId
      repeatDays: $repeatDays
      repeatWeeks: $repeatWeeks
      studentIds: $studentIds # 이 부분을 추가하려는 학생들의 ID 목록으로 교체하세요.
    ) {
      lectureIds
    }
  }
`;

export const GET_STUDENTS_BY_DATE = gql`
  query getLecturesByAcademyAndDateStudents($academyId: Int!, $date: Date!) {
    getLecturesByAcademyAndDateStudents(academyId: $academyId, date: $date) {
      student {
        id
        korName
        engName
        origin
        pmobileno
        birthDate
        reservedBooksCount
      }
      lecture {
        id
        startTime
        endTime
        lectureInfo
        date
      }
      attendanceStatus {
        id
        entryTime
        exitTime
        statusDisplay
      }
    }
  }
`;
