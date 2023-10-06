import { gql } from "@apollo/client";

// export const GET_CLASS = gql`
//   query getLecturesByAcademyAndDate($academyId: Int!, $date: Date!) {
//     getLecturesByAcademyAndDate(academyId: $academyId, date: $date) {
//       id
//       date
//       startTime
//       endTime
//       # lectureInfo {
//       #   about
//       #   repeatDay
//       #   repeatWeeks
//       # }
//       bookReservations {
//         student {
//           id
//         }
//       }
//       teacher {
//         id
//         korName
//         engName
//       }
//       students {
//         # 여기에서 학생들의 정보를 가져옵니다.
//         id
//         korName
//         engName
//         origin
//         pmobileno
//         mobileno
//         birthDate
//         gender
//         reservedBooksCount
//         attendances {
//           lecture {
//             id
//           }
//           status
//           statusDisplay
//           entryTime
//           exitTime
//         }
//       }
//     }
//   }
// `;

export const GET_CLASSES = gql`
  query allLectures($academyId: Int!) {
    allLectures(academyId: $academyId) {
      id
      date
      startTime
      endTime
      lectureInfo {
        about
      }
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
    $lectureMemo: String!
    $about: String!
    $teacherId: Int!
    $repeatDays: String!
    $repeatWeeks: Int!
    $autoAdd: Boolean!
  ) {
    createLecture(
      academyId: $academyId
      date: $date
      startTime: $startTime
      endTime: $endTime
      about: $about
      teacherId: $teacherId
      repeatDays: $repeatDays
      repeatWeeks: $repeatWeeks
      autoAdd: $autoAdd
      lectureMemo: $lectureMemo
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
        date
        startTime
        endTime
        lectureMemo
        lectureInfo {
          about
        }
      }
      attendanceStatus {
        id
        entryTime
        exitTime
        statusDisplay
        memo
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
      lectureInfo {
        about
      }
      # repeatDay
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

export const GET_MEMO = gql`
  query getStudentLectureHistory($academyId: Int!, $studentId: Int!) {
    getStudentLectureHistory(academyId: $academyId, studentId: $studentId) {
      lecture {
        teacher {
          korName
        }
        date
        id
      }
      statusDisplay
      memo
    }
  }
`;

export const CREATE_MEMO = gql`
  mutation createLectureMemo(
    $lectureId: Int!
    $studentId: Int!
    $memo: String!
  ) {
    createLectureMemo(
      lectureId: $lectureId
      studentId: $studentId
      memo: $memo
    ) {
      attendance {
        id
        lecture {
          id
        }
        student {
          id
        }
        status
        memo
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

export const UPDATE_LECTURE = gql`
  mutation updateLectureStudents(
    $lectureId: Int!
    $date: Date!
    $studentId: ID!
    $startTime: Time!
    $endTime: Time!
    $academyId: Int!
    $teacherId: Int!
    $lectureMemo: String
  ) {
    updateLectureStudents(
      lectureId: $lectureId
      date: $date
      studentId: $studentId
      startTime: $startTime
      endTime: $endTime
      academyId: $academyId
      teacherId: $teacherId
      lectureMemo: $lectureMemo
    ) {
      success
      message
    }
  }
`;

export const GET_MONTH_CLASS = gql`
  query getLecturesByAcademyAndMonth($academyId: Int!, $month: Int!) {
    getLecturesByAcademyAndMonth(academyId: $academyId, month: $month) {
      id
      date
      startTime
      endTime
      lectureInfo {
        about
        repeatDay
        repeatWeeks
      }
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
