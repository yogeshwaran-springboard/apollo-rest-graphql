import { useMutation ,gql} from "@apollo/client";
import { useState } from "react";
import { GraphqlClient } from "../index";
import { ADD_USER } from "../Query";
export const AddGraphqlUser = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [addUser, { data, loading, error }] = useMutation(ADD_USER, {
    client: GraphqlClient,
    //Auto Updation
    update(cache, { data: { createUser } }) {
        cache.modify({
          fields: {
            getUsers(existingUsers = []) {
              const newUserRef = cache.writeFragment({
                data: createUser,
                fragment: gql`
                  fragment NewUser on User {
                    id
                    age
                    name
                  }
                `
              });
              return [...existingUsers, newUserRef];
            }
          }
        });
      }
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <p>Add User Graphql</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser({ variables: { name, age } });
          setName("");
          setAge("");
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={age} onChange={(e) => setAge(e.target.value)} />
        <button type="submit">Add User by Graphql</button>
      </form>
    </div>
  );
};
