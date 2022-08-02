import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { RestClient } from "..";
import { GET_USER_ID_REST } from "../Query";
export const DisplayRestUser = () => {
  const [restId, setRestId] = useState("");

  const [getUserRestData, { data: userRestData }] = useLazyQuery(
    GET_USER_ID_REST,
    {
      client: RestClient,
      variables: { id: restId },
    }
  );
  const RestUserDetails = () => {
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
      <p>User Detail Rest</p>
      <input
        value={restId}
        placeholder="User Id for Rest"
        onChange={(e) => setRestId(e.target.value)}
      />
      <button onClick={() => getUserRestData()}>
        Get User Data By Id Rest
      </button>
      <RestUserDetails />
    </div>
  );
};
