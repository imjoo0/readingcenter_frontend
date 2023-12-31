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
          academies {
            id
            branchName
            name
          }
          lectures(academyId: $academyId) {
            id
            date
            startTime
            endTime
            lectureMemo
            lectureInfo {
              id
              autoAdd
              repeatDay
              repeatWeeks
              about
              repeatTimes
            }
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

export const EDIT_USER = gql`
  mutation updateUserInfo($email: String, $userId: ID!, $categoryId: Int!) {
    updateUserInfo(categoryId: $categoryId, userId: $userId, email: $email) {
      user {
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
            lectures {
              id
              date
              startTime
              endTime
              attendanceStatus {
                id
                lectureId
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
    $lectureId: Int!
    $date: Date!
    $startTime: Time!
    $endTime: Time!
    $lectureMemo: String
    $teacherId: Int!
    $studentIds: [Int]!
  ) {
    createMakeup(
      lectureId: $lectureId
      date: $date
      startTime: $startTime
      endTime: $endTime
      lectureMemo: $lectureMemo
      teacherId: $teacherId
      studentIds: $studentIds # 이 부분을 추가하려는 학생들의 ID 목록으로 교체하세요.
    ) {
      lecture {
        students {
          id
        }
      }
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

export const GET_MEMO = gql`
  query getStudentLectureHistory($academyId: Int!, $studentId: Int!) {
    getStudentLectureHistory(academyId: $academyId, studentId: $studentId) {
      lecture {
        teacher {
          korName
        }
        startTime
        endTime
        date
        id
        lectureInfo {
          about
        }
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

export const STOP_ACADEMY = gql`
  mutation updateUser($userId: ID!) {
    updateUser(userId: $userId) {
      user {
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
            lectures {
              id
              date
              startTime
              endTime
              attendanceStatus {
                id
                lectureId
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
  }
`;

export const UPDATE_LECTURE = gql`
  mutation updateLectureStudents(
    $lectureId: Int!
    $date: Date!
    $studentIds: [Int]!
    $startTime: Time!
    $endTime: Time!
    $academyId: Int!
    $teacherId: Int!
    $lectureMemo: String
  ) {
    updateLectureStudents(
      lectureId: $lectureId
      date: $date
      studentIds: $studentIds
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

export const CREATE_ACADEMY_TO_USER = gql`
  mutation addAcademyToUser($userIds: [Int]!, $academyId: Int!) {
    addAcademyToUser(userIds: $userIds, academyId: $academyId) {
      studentProfile {
        id
        korName
        engName
        origin
        pmobileno
        mobileno
        birthDate
        gender
        academies {
          id
          name
        }
      }
    }
  }
`;

export const EDIT_ACADEMY_LIST = gql`
  mutation updateAcademyToUser($userId: ID!, $academyIds: [Int]!) {
    updateAcademyToUser(userId: $userId, academyIds: $academyIds) {
      studentProfile {
        id
        korName
        engName
        origin
        pmobileno
        mobileno
        birthDate
        gender
        academies {
          id
          name
        }
      }
    }
  }
`;

export const GET_CONSULTING = gql`
  query getConsulting($studentId: ID!, $userId: ID!) {
    getConsulting(studentId: $studentId, userId: $userId) {
      id
      title
      contents
      createdAt
      student {
        id
        korName
        engName
        pmobileno
        origin
      }
      writer {
        userCategory
        profile {
          ... on TeacherType {
            id
            korName
            engName
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
            academies {
              id
              name
              location
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CONSULTING = gql`
  mutation createConsulting(
    $title: String!
    $contents: String!
    $writerId: ID!
    $studentId: ID!
    $createdAt: Date!
  ) {
    createConsulting(
      title: $title
      contents: $contents
      writerId: $writerId
      studentId: $studentId
      createdAt: $createdAt
    ) {
      consulting {
        id
        contents
        createdAt
      }
    }
  }
`;

export const UPDATE_CONSULTING = gql`
  mutation updateConsulting(
    $title: String!
    $contents: String!
    $writerId: ID!
    $consultingId: ID!
    $createdAt: Date!
  ) {
    updateConsulting(
      title: $title
      contents: $contents
      writerId: $writerId
      consultingId: $consultingId
      createdAt: $createdAt
    ) {
      consulting {
        id
        contents
        createdAt
      }
    }
  }
`;

export const DELETE_CONSULTING = gql`
  mutation deleteConsulting($consultingId: ID!) {
    deleteConsulting(consultingId: $consultingId) {
      success
    }
  }
`;

export const GET_LECTURE_INFO = gql`
  query studentLectures($academyIds: [ID]!, $studentId: ID!) {
    studentLectures(academyIds: $academyIds, studentId: $studentId) {
      student {
        id
        korName
      }
      lecture {
        date
        startTime
        endTime
        id
        academy {
          id
          name
        }
        lectureInfo {
          about
          repeatDay
          repeatWeeks
          repeatTimes
          id
          autoAdd
        }

        teacher {
          id
        }
        lectureMemo
      }
      attendanceStatus {
        statusDisplay
        entryTime
        exitTime
      }
    }
  }
`;

export const GET_TEACHER = gql`
  query staffInAcademy($academyId: Int!) {
    staffInAcademy(academyId: $academyId) {
      ... on ManagerType {
        id
        user {
          isActive
          userCategory
        }
        korName
        engName
      }
      ... on TeacherType {
        id
        user {
          isActive
          userCategory
        }
        korName
        engName
      }
    }
  }
`;

export const EDIT_LECTURE_INFO = gql`
  mutation updateLectureInfo(
    $lectureInfoId: Int!
    $date: Date!
    $about: String!
    $repeatDays: String!
    $repeatWeeks: Int!
    $autoAdd: Boolean!
    $studentIds: [Int]!
    $startTime: Time!
    $endTime: Time!
    $academyId: Int!
    $teacherId: Int!
    $repeatTimes: Int
  ) {
    updateLectureInfo(
      repeatTimes: $repeatTimes
      lectureInfoId: $lectureInfoId
      date: $date
      about: $about
      repeatDays: $repeatDays
      repeatWeeks: $repeatWeeks
      autoAdd: $autoAdd
      studentIds: $studentIds
      startTime: $startTime
      endTime: $endTime
      academyId: $academyId
      teacherId: $teacherId
    ) {
      success
      message
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
      user {
        isActive
      }
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
    $studentIds: [Int]!
    $repeatTimes: Int
  ) {
    createLecture(
      repeatTimes: $repeatTimes
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
      studentIds: $studentIds
    ) {
      lectureIds
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

export const DELETE_LECTURE_INFO = gql`
  mutation deleteLectureInfo($id: ID!, $date: Date!) {
    deleteLectureInfo(id: $id, date: $date) {
      success
    }
  }
`;
