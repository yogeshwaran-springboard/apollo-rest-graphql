import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GraphqlClient } from "..";
import { GET_USER_ID } from "../Query";

export const DisplayGraphqlUser = () => {
  const [graphqlId, setGraphqlId] = useState("");

  const [getUserRestData, { data: userRestData }] = useLazyQuery(GET_USER_ID, {
    client: GraphqlClient,
    variables: { id: graphqlId },
  });
  const GraphqlUserDetails = () => {
    return (
      <div>
        <p>
          <b>Id: </b>
          {userRestData?.getUser?.id}
        </p>
        <p>
          <b>Name: </b>
          {userRestData?.getUser?.name}
        </p>
        <p>
          <b>Age: </b>
          {userRestData?.getUser?.age}
        </p>
        <br />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>User Detail Graphql</p>

      <input
        value={graphqlId}
        placeholder="User Id for Graphql"
        onChange={(e) => setGraphqlId(e.target.value)}
      />
      <button onClick={() => getUserRestData()}>
        Get User Data By Id Graphql
      </button>
      <GraphqlUserDetails />
    </div>
  );
};
