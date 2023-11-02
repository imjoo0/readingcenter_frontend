import gql from "graphql-tag";

export const STUDENT_RECORD = gql`
  query studentBookRecord($studentId: Int!) {
    studentBookRecord(studentId: $studentId) {
      book {
        id
        kplbn
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
      month
      arDate
      litDate
      arCorrect
      litCorrect
    }
  }
`;

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
        }
      }
    }
  }
`;

export const GET_SUMMARY_REPORT = gql`
  query getSummaryReport($studentId: Int!, $date: Date!) {
    getSummaryReport(studentId: $studentId, date: $date) {
      origin
      recentStudyDate
      thisMonthAr
      lastMonthAr
      arDiff
      thisMonthWc
      lastMonthWc
      totalWc
      thisMonthCorrect
      lastMonthCorrect
      totalCorrect
      thisMonthBc
      lastMonthBc
      totalBc
      thisMonthStudyDays
      lastMonthStudyDays
      totalStudyDays
      updateTime
      thisMonthSr
      lastMonthSr
      thisPerWc
      lastPerWc
    }
  }
`;

export const GET_MONTH_REPORT = gql`
  query getMonthReports($studentId: Int!, $date: Date!) {
    getMonthReports(studentId: $studentId, date: $date) {
      month
      bc
      wc
      ar
      wcPerBook
      correct
      updateTime
      sr
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

export const GET_OPINION = gql`
  query getOpinion($studentId: ID!, $userId: ID!, $date: Date!) {
    getOpinion(studentId: $studentId, userId: $userId, date: $date) {
      id
      contents
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

export const GET_MEMOS = gql`
  query getLectureMemoByStudent($studentId: ID!, $academyIds: [ID]!) {
    getLectureMemoByStudent(studentId: $studentId, academyIds: $academyIds) {
      lecture {
        id
        teacher {
          korName
        }
        students {
          id
          korName
        }
        date
      }
      student {
        id
        origin
        korName
        engName
      }
      statusDisplay
      memo
    }
  }
`;

export const CREATE_OPINION = gql`
  mutation createOpinion(
    $contents: String!
    $writerId: ID!
    $studentId: ID!
    $date: Date!
    $opinionId: ID
  ) {
    createOpinion(
      contents: $contents
      writerId: $writerId
      studentId: $studentId
      date: $date
      opinionId: $opinionId
    ) {
      opinion {
        id
      }
    }
  }
`;
