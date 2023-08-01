import { gql } from "@apollo/client";

export const GET_STUDENT = gql`
  query userDetails($userId: Int!) {
    userDetails(userId: $userId) {
      id
      username
      email
      userCategory
      isStaff
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
