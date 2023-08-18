import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
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

export const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $password: String!
    $userCategory: String!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      userCategory: $userCategory
    ) {
      user {
        id
        username
        email
        userCategory
      }
    }
  }
`;

export const CREATE_STUDENT_PROFILE = gql`
  mutation createStudentProfile(
    $userId: Int!
    $korName: String!
    $engName: String!
    $gender: String!
    $mobileno: String!
    $birthDate: Date!
    $registerDate: Date!
    $origin: String!
    $pmobileno: String!
  ) {
    createStudentProfile(
      userId: $userId
      korName: $korName
      engName: $engName
      gender: $gender
      mobileno: $mobileno
      birthDate: $birthDate
      registerDate: $registerDate
      origin: $origin
      pmobileno: $pmobileno
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
