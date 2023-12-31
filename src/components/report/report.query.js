import { gql } from "@apollo/client";

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

export const GET_STUDENTS_REPORT_LIST = gql`
  query studentsInAcademyWithConsulting($academyId: Int!) {
    studentsInAcademyWithConsulting(academyId: $academyId) {
      student {
        id
        origin
        korName
        engName
        registerDate
        birthDate
        user {
          isActive
        }
      }
      consultingCount
      lastConsultingDate
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
