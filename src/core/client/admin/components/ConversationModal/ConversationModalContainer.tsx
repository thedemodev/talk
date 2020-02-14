import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import {
  Button,
  Counter,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import { ConversationModalContainer_comment } from "coral-admin/__generated__/ConversationModalContainer_comment.graphql";
import { ConversationModalContainerPaginationQueryVariables } from "coral-admin/__generated__/ConversationModalContainerPaginationQuery.graphql";

import { Circle } from "../Timeline";
import ConversationModalComment from "./ConversationModalCommentContainer";

import styles from "./ConversationModalContainer.css";

interface Props {
  relay: RelayPaginationProp;
  comment: ConversationModalContainer_comment;
  onClose: () => void;
  onUsernameClicked: (id?: string) => void;
}

const ConversationModalContainer: FunctionComponent<Props> = ({
  comment,
  relay,
  onUsernameClicked,
}) => {
  const [loadMore] = useLoadMore(relay, 5);
  const parents = comment.parents.edges.map(edge => edge.node);
  return (
    <HorizontalGutter className={styles.root}>
      {comment.parentCount > parents.length && (
        <div>
          <Flex alignItems="center">
            <Circle hollow={true} className={styles.topCircle} />
            <Button underline variant="text" onClick={loadMore}>
              <Localized id="conversation-modal-show-more-parents">
                <span>Show more of this conversation</span>
              </Localized>
              <Counter>{comment.parentCount}</Counter>
            </Button>
          </Flex>
          <Flex
            direction="column"
            alignItems="center"
            className={styles.bottomCircleContainer}
          >
            <Circle color="light" size="small" />
          </Flex>
        </div>
      )}
      {parents.map(parent => (
        <ConversationModalComment
          key={parent.id}
          isParent={true}
          comment={parent}
          onUsernameClick={onUsernameClicked}
          isHighlighted={false}
        />
      ))}
      <ConversationModalComment
        comment={comment}
        onUsernameClick={onUsernameClicked}
        isHighlighted={true}
      />
    </HorizontalGutter>
  );
};

// TODO: (cvle) If this could be autogenerated.
type FragmentVariables = ConversationModalContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ConversationModalContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment ConversationModalContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 1 }
          cursor: { type: "Cursor" }
        ) {
        id
        ...ConversationModalCommentContainer_comment
        rootParent {
          id
        }
        parents(last: $count, before: $cursor)
          @connection(key: "ConversationModal_parents") {
          edges {
            node {
              id
              ...ConversationModalCommentContainer_comment
            }
          }
        }
        parentCount
      }
    `,
  },
  {
    direction: "backward",
    getConnectionFromProps(props) {
      return props.comment && props.comment.parents;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }) {
      return {
        count,
        cursor,
        // commentID isn't specified as an @argument for the fragment, but it should be a
        // variable available for the fragment under the query root.
        commentID: props.comment.id,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ConversationModalContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...ConversationModalContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(ConversationModalContainer);

export default enhanced;
