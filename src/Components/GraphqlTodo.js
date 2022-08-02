import { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

import {
  DELETE_GRAPHQL,
  DELETE_REST,
  GET_GRAPHQL_TODOS,
  GET_REST_TODOS,
  UPDATE_TODO,
  UPDATE_TODO_REST,
} from "../Query";
import { GraphqlClient, RestClient } from "..";

export const GraphqlTodo = ({ data }) => {
  const [editable, setEditable] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState({});
  const [toDeleteId, setToDeleteId] = useState(null);


  // edit
  const [updateTodo, { data: data1, loading: loading1, error: error1 }] =
    useMutation(UPDATE_TODO_REST, {
      client: RestClient,
      //       refetchQueries: [
      //   {query: GET_GRAPHQL_TODOS}, // DocumentNode object parsed with gql
      // ],
      // manual modify
      update: (cache, { data: { updateTodo } }) => {
        // read data from cache
        const res = cache.readQuery({ query: GET_REST_TODOS });
        // const toUpdateIndex=updateTodo.findIndex((data)=>data.id===updateTodo.id)
        // update the cache with new data
        cache.writeQuery({
          query: GET_REST_TODOS,
          data: {
            getTodos: [...res?.getTodos],
          },
        });
        setEditable(null);
      },
    });

  const editGraphql = (id) => {
    const toUpdate = data?.getTodos.find((data) => data.id === id);
    setSelectedTodo(toUpdate);
    setEditable(id);
  };

  // delete
  const [deleteTodo, { data: data2, loading: loading2, error: error2 }] =
    useMutation(DELETE_REST, {
      client: RestClient,
      update: (cache, { data: { deleteTodo } }) => {
        // // read data from cache
        // const res = cache.readQuery({ query: GET_GRAPHQL_TODOS });
        // const updatedTodo = res?.getTodos.filter((e) => e.id !== deleteTodo.id);
        // console.log(
        //   "Delete From cache",
        //   res?.getTodos,
        //   deleteTodo.id,
        //   updatedTodo
        // );

        // // update the cache
        // cache.writeQuery({
        //   query: GET_GRAPHQL_TODOS,
        //   data: {
        //     getTodos: updatedTodo,
        //   },
        // });
        cache.evict({
          id: cache.identify({
            __typename: "Todo",
            id: toDeleteId,
          }),
        });
      },
    });
  const deleteTodoById = async(id) => {
    console.log("DLE called", id);
    await setToDeleteId(id)
    deleteTodo({
      variables: {
        id,
      },
    });
  };

  return data?.getTodos?.map(({ id, title, completed, description, user }) =>
    editable !== id ? (
      <div key={id}>
        <p>
          <b>Id: </b>
          {id}
        </p>
        <p>
          <b>Title: </b>
          {title}
        </p>
        <p>
          Completed
          <input type="checkbox" checked={completed} disabled />
        </p>
        <p>
          <b>Description: </b>
          {description}
        </p>
        <p>
          <b>Created By : </b>
          {user.id}
        </p>
        <br />
        <button onClick={() => editGraphql(id)}>Edit</button>
        <button onClick={() => deleteTodoById(id)}>Delete Todo</button>
      </div>
    ) : (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("SLE", selectedTodo);
            // updateTodo({
            //   variables: {
            //     id: selectedTodo.id,
            //     completed: selectedTodo.completed,
            //     title: selectedTodo.title,
            //     description: selectedTodo.description,
            //     user: selectedTodo.user?.id,
            //   },
            // });
            updateTodo({
              variables: {
                input: {
                  id: selectedTodo.id,
                  completed: selectedTodo.completed,
                  title: selectedTodo.title,
                  description: selectedTodo.description,
                  user: selectedTodo.user?.id,
                },
                id: selectedTodo.id,
              },
            });
            setSelectedTodo({});
          }}
        >
          <input
            value={selectedTodo.title}
            onChange={(e) =>
              setSelectedTodo({ ...selectedTodo, title: e.target.value })
            }
          />
          <input
            value={selectedTodo.description}
            onChange={(e) =>
              setSelectedTodo({ ...selectedTodo, description: e.target.value })
            }
          />
          <input
            type="checkbox"
            value={selectedTodo.completed}
            onChange={(e) =>
              setSelectedTodo({
                ...selectedTodo,
                completed: e.target.checked,
              })
            }
          />
          <button type="submit">Update Todo</button>
        </form>
        <button onClick={() => deleteTodoById(id)}>Delete Todo</button>
      </div>
    )
  );
};
