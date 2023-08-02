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
        birthDate
        gender
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

export const GET_CLASSES = gql`
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

export const GET_RESERVATION_BOOKS = gql`
  query studentReservedBooks($studentId: Int!) {
    studentReservedBooks(studentId: $studentId) {
      boxNumber
      booktitle
      id
    }
  }
`;

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
      authorAr
      lexileLex
      wcAr
      arPts
      books {
        id
        place
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

export const GET_ALL_STUDENTS = gql`
  query {
    allStudents {
      id
      username
      userCategory

      profile {
        ... on StudentType {
          id
          korName
          engName
          origin
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

export const ADD_STUDENTS = gql`
  mutation addStudentsToLecture($lectureId: Int!, $studentIds: [Int]!) {
    addStudentsToLecture(lectureId: $lectureId, studentIds: $studentIds) {
      lecture {
        id
        students {
          id
        }
      }
    }
  }
`;

export const RESERVATION_BOOKS = gql`
  mutation reserveBooks(
    $studentId: ID!
    $lectureId: ID!
    $bookInventoryIds: [ID]!
  ) {
    reserveBooks(
      studentId: $studentId
      lectureId: $lectureId
      bookInventoryIds: $bookInventoryIds
    ) {
      bookReservation {
        id
        student {
          id
        }
        lecture {
          id
        }
        books {
          id
        }
      }
    }
  }
`;

export const DELETE_TOTAL_BOOKS = gql`
  mutation deleteStudentBookReservations($studentId: ID!) {
    deleteStudentBookReservations(studentId: $studentId) {
      deletedBookIds
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBookReservations($bookId: [Int]!) {
    deleteBookReservations(bookId: $bookId) {
      deletedBookIds
    }
  }
`;
