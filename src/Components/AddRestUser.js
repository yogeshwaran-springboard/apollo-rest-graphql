import { useMutation } from "@apollo/client";
import { useState } from "react";
import { RestClient } from "..";
import { ADD_USER_REST } from "../Query";
export const AddRestUser = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [addUser, { data, loading, error }] = useMutation(ADD_USER_REST, {
    client: RestClient,
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <p>Add User Rest</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser({ variables: { input: { name, age } } });
          setName("");
          setAge("");
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={age} onChange={(e) => setAge(e.target.value)} />
        <button type="submit">Add User by Rest</button>
      </form>
    </div>
  );
};
