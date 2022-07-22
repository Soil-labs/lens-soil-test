import { gql } from "@apollo/client";

export const FIND_MEMBER = gql`
  query ($fields: findMemberInput) {
    findMember(fields: $fields) {
      _id
      archiveProjects
      bio
      discordAvatar
      discordName
      discriminator
      hoursPerWeek
      registeredAt
      tweets
      attributes {
        collaboration
        decisiveness
        empathy
        flexibility
        leadership
        management
        organization
        ownership
      }
      projects {
        champion
        favorite
        phase
      }
      previusProjects {
        description
        endDate
        link
        picture
        startDate
        title
      }
    }
  }
`;
