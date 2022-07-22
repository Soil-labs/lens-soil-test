import { gql } from "@apollo/client";

export const FIND_PROJECT = gql`
  query ($fields: findProjectInput) {
    findProject(fields: $fields) {
      _id
      description
      title
      team {
        roleID
        memberInfo {
          _id
          discordAvatar
          discordName
        }
      }
      champion {
        _id
        discordName
        discordAvatar
        bio
      }
      dates {
        complition
        kickOff
      }
      tweets {
        _id
        approved
        content
        registeredAt
        author {
          discordName
          discordAvatar
        }
      }
    }
  }
`;
