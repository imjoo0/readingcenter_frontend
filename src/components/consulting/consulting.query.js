import { gql } from "@apollo/client";

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

export const GET_TEACHER_CONSULTING = gql`
  query getAllConsulting($userId: ID!) {
    getAllConsulting(userId: $userId) {
      id
      title
      contents
      createdAt
      student {
        id
        origin
        korName
        engName
        pmobileno
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
      user {
        isActive
      }
      academies {
        id
        branchName
        name
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
