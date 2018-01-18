import { gql } from 'react-apollo';
import FlaggedUser from '../components/FlaggedUser';
import { withFragments } from 'plugin-api/beta/client/hocs';

export default withFragments({
  root: gql`
    fragment TalkAdminCommunity_FlaggedUser_root on RootQuery {
      __typename
    }
  `,
  me: gql`
    fragment TalkAdminCommunity_FlaggedUser_me on User {
      id
    }
  `,
  user: gql`
    fragment TalkAdminCommunity_FlaggedUser_user on User {
      id
      username
      created_at
      state {
        status {
          username {
            status
            history {
              status
              assigned_by {
                id
              }
              created_at
            }
          }
          banned {
            status
          }
          suspension {
            until
          }
        }
      }
      role
      actions {
        id
        created_at
        ... on FlagAction {
          reason
          message
          user {
            id
            username
          }
        }
      }
      action_summaries {
        count
        ... on FlagActionSummary {
          reason
        }
      }
    }
  `,
})(FlaggedUser);
