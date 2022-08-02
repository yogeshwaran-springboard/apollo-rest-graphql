import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { RestClient } from "..";
import {
  ADD_TODO,
  ADD_TODO_REST,
  GET_GRAPHQL_TODOS,
  GET_REST_TODOS,
} from "../Query";
export const AddRestTodo = ({ restData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addTodo, { loading, error }] = useMutation(ADD_TODO_REST, {
    client: RestClient,
    // refetchQueries: [
    //   {query: GET_GRAPHQL_TODOS}, // DocumentNode object parsed with gql
    // ],
    update: (cache, { data: { createTodo } }) => {
      //   cache.modify({
      //     fields: {
      //       getTodos(existingTodos = []) {
      //         console.log("iiii", existingTodos, createTodo);
      //         const newTodoRef = cache.writeFragment({
      //           data: createTodo,
      //           fragment: gql`
      //             fragment NewTodo on Todo {
      //               id
      //               description
      //               title
      //               completed
      //               user {
      //                 id
      //                 name
      //                 age
      //               }
      //             }
      //           `,
      //         });
      //         return [...existingTodos, newTodoRef];
      //       },
      //     },
      //   });
      // read data from cache
      const res = cache.readQuery({ query: GET_REST_TODOS });
      // update the cache with new data
      cache.writeQuery({
        query: GET_REST_TODOS,
        data: {
          getTodos: [...res?.getTodos, createTodo],
        },
      });
    },
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      <p>Add Todo Rest</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo({
            variables: {
              input: {
                title,
                description,
                completed: false,
                user: "62e268d648eec0eced01e163",
              },
            },
          });
          setDescription("");
          setTitle("");
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo Data by Rest </button>
      </form>
    </div>
  );
};
