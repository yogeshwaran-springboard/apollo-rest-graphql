import { useLazyQuery } from "@apollo/client";
import { GraphqlClient } from "..";
import {  GET_USER_GRAPHQL } from "../Query";
export const DisplayGraphqlUsers = () => {
   
    const [getUsersData, { data: usersGraphqlData }] = useLazyQuery(GET_USER_GRAPHQL, {
      client: GraphqlClient,
    });
    
    const UsersDetails = () => {
      return usersGraphqlData?.getUsers.map(({ id, name, age }) => (
        <div key={name}>
          <p>
            <b>Id: </b>
            {id}
          </p>
          <p>
            <b>Name: </b>
            {name}
          </p>
          <p>
            <b>Age: </b>
            {age}
          </p>
          <br />
        </div>
      ));
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={() => getUsersData()}>Get Users Data by Graphql</button>
        <UsersDetails/>
      </div>
    );
  };
  