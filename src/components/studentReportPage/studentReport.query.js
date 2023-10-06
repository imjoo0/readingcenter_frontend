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
  query getSummaryReport($studentId: Int!) {
    getSummaryReport(studentId: $studentId) {
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
    }
  }
`;

export const GET_MONTH_REPORT = gql`
  query getMonthReports($studentId: Int!) {
    getMonthReports(studentId: $studentId) {
      month
      bc
      wc
      ar
      wcPerBook
      correct
      updateTime
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
