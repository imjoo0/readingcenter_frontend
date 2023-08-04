import { gql } from "@apollo/client";

export const GET_STUDENT = gql`
  query userDetails($userId: Int!) {
    userDetails(userId: $userId) {
      id
      username
      email
      userCategory
      isStaff
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
      lectures {
        id
        date
        startTime
        endTime
        lectureInfo
        teacher {
          korName
          engName
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
