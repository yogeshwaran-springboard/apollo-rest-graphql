import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GraphqlClient, RestClient } from "..";
import { GET_TODO_ID} from "../Query";
export const DisplayGraphqlTodo = () => {
  const [graphqlId, setGraphqlId] = useState("");

  const [getTodoGraphqlData, { data: todoData }] = useLazyQuery(GET_TODO_ID, {
    client: GraphqlClient,
    variables: { id: graphqlId },
  });
  const GraphqlTodoDetails = () => {
    return (
      <div>
        <p>
          <b>Id: </b>
          {todoData?.getTodo?.id}
        </p>
        <p>
          <b>Title: </b>
          {todoData?.getTodo?.title}
        </p>
        <p>
          <b>Description: </b>
          {todoData?.getTodo?.description}
        </p>
        <br />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Todo Detail Graphql</p>
      <input
        value={graphqlId}
        placeholder="Todo Id for Graphql"
        onChange={(e) => setGraphqlId(e.target.value)}
      />
      <button onClick={() => getTodoGraphqlData()}>
        Get Todo Data By Id Graphql
      </button>

      <GraphqlTodoDetails />
    </div>
  );
};
