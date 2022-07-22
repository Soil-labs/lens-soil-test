import { gql } from "@apollo/client";

export const FIND_MEMBERS = gql`
  query ($fields: findMembersInput) {
    findMembers(fields: $fields) {
      _id
      archiveProjects
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
      bio
      discordAvatar
      discordName
      discriminator
      hoursPerWeek
      previusProjects {
        description
        endDate
        link
        picture
        startDate
        title
      }
      tweets
      registeredAt
      projects {
        champion
        favorite
        phase
      }
    }
  }
`;
