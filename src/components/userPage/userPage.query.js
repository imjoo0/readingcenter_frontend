import gql from "graphql-tag";

export const GET_USER_PROFILE = gql`
  query {
    me {
      id
      username
      email
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

export const ADD_ACADEMY = gql`
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
