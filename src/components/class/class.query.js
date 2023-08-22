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
      plbn
      place
      book {
        arQuiz
        arPts
        lexileAr
        lexileLex
        wcAr
        wcLex
        titleAr
        authorAr
        bl
      }
    }
  }
`;

export const GET_BOOKS = gql`
  query getBooksByBl(
    $minBl: Float
    $maxBl: Float
    $maxWc: Int
    $minWc: Int
    $maxLex: Int
    $minLex: Int
    $studentId: ID
    $academyId: Int!
    $lectureDate: Date!
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
  query studentsInAcademy($academyId: Int!) {
    studentsInAcademy(academyId: $academyId) {
      id
      korName
      engName
      gender
      mobileno
      registerDate
      birthDate
      origin
      pmobileno
      academies {
        id
        branchName
        name
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
    $repeatDays: [Int]!
    $repeatWeeks: Int!
  ) {
    createLecture(
      academyId: $academyId
      date: $date
      startTime: $startTime
      endTime: $endTime
      lectureInfo: $lectureInfo
      teacherId: $teacherId
      repeatDays: $repeatDays
      repeatWeeks: $repeatWeeks
    ) {
      lectureIds
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

export const DELETE_STUDENT_FROM_LECTURE = gql`
  mutation removeStudentFromLecture($lectureId: ID!, $studentIds: [ID]!) {
    removeStudentFromLecture(lectureId: $lectureId, studentIds: $studentIds) {
      lecture {
        id
        students {
          id
          korName
          engName
        }
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

export const GET_ATTENDANCE = gql`
  query getAttendance(
    $academyId: Int!
    $date: Date!
    $startTime: String
    $endtime: String
  ) {
    getAttendance(
      academyId: $academyId
      date: $date
      startTime: $startTime
      endtime: $endtime
    ) {
      id
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

export const GET_BOOK_COUNT = gql`
  query getLecturesBookCount($academyId: Int!) {
    getLecturesBookCount(academyId: $academyId) {
      lecture {
        id
      }
      student {
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

export const GET_ACADEMY_SETTING = gql`
  query academyInfo($academyId: ID!) {
    academyInfo(academyId: $academyId) {
      id
      notificationInterval
      endNotificationCustom
    }
  }
`;

export const EDIT_ACADEMY_SETTING = gql`
  mutation updateAcademy(
    $academyId: ID!
    $notificationInterval: Int
    $endNotificationCustom: Boolean
  ) {
    updateAcademy(
      academyId: $academyId
      notificationInterval: $notificationInterval
      endNotificationCustom: $endNotificationCustom
    ) {
      academy {
        id
        notificationInterval
        endNotificationCustom
      }
    }
  }
`;

export const GET_CUSTOM_ATTENDANCE = gql`
  query getCustomattendance(
    $academyId: Int!
    $date: Date!
    $entryTime: String!
    $endTime: String!
  ) {
    getCustomattendance(
      academyId: $academyId
      date: $date
      entryTime: $entryTime
      endTime: $endTime
    ) {
      id
      korName
    }
  }
`;
