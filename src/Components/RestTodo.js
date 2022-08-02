import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GraphqlClient, RestClient } from "..";
import {
  DELETE_GRAPHQL,
  DELETE_REST,
  GET_GRAPHQL_TODOS,
  GET_REST_TODOS,
  UPDATE_TODO,
} from "../Query";

export const RestTodo = ({ data }) => {
  const [editable, setEditable] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState({});
  const [toDeleteId, setToDeleteId] = useState(null);

  // edit
  const [updateTodo, { data: data1, loading: loading1, error: error1 }] =
    useMutation(UPDATE_TODO, {
      client: GraphqlClient,
      //       refetchQueries: [
      //   {query: GET_GRAPHQL_TODOS}, // DocumentNode object parsed with gql
      // ],
      update: (cache, { data: { updateTodo } }) => {
        const res = cache.readQuery({ query: GET_GRAPHQL_TODOS });
        // const toUpdateIndex=updateTodo.findIndex((data)=>data.id===updateTodo.id)
        // update the cache with new data
        cache.writeQuery({
          query: GET_GRAPHQL_TODOS,
          data: {
            getTodos: [...res?.getTodos],
          },
        });
        setEditable(null);
      },
    });
  const editRest = (id) => {
    const toUpdate = data?.getTodos.find((data) => data.id === id);
    // console.log("Toup", toUpdate);
    setSelectedTodo(toUpdate);
    setEditable(id);
  };

  // delete
  const [deleteTodo, { data: data2, loading: loading2, error: error2 }] =
    useMutation(DELETE_GRAPHQL, {
      client: GraphqlClient,
      update: (cache, { data:{ deleteTodo } }) => {
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
            id: deleteTodo.id,
          }),
        });
      },
    });
  const deleteTodoById = (id) => {
    console.log("DLE Rest called", id);
    setToDeleteId(id);
    deleteTodo({
      variables: {
        id,
      },
    });
  };

  return data?.getTodos?.map(({ id, title, completed, description, user }) =>
    editable !== id ? (
      <div key={title}>
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
        <button onClick={() => editRest(id)}>Edit</button>
        <button onClick={() => deleteTodoById(id)}>Delete Todo</button>
      </div>
    ) : (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("SLE", selectedTodo);
            updateTodo({
              variables: {
                id: selectedTodo.id,
                completed: selectedTodo.completed,
                title: selectedTodo.title,
                description: selectedTodo.description,
                user: selectedTodo.user?.id,
              },
            });
            editable(null);
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
      </>
    )
  );
};
