import { useLazyQuery } from "@apollo/client";
import { RestClient } from "..";
import {  GET_USER_REST } from "../Query";
export const DisplayRestUsers = () => {
   
    const [getUsersData, { data: usersRestData }] = useLazyQuery(GET_USER_REST, {
      client: RestClient,
    });
    
    const UsersDetails = () => {
      return usersRestData?.getUsers.map(({ id, name, age }) => (
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
        <button onClick={() => getUsersData()}>Get Users Data by Rest</button>
        <UsersDetails/>
      </div>
    );
  };
  