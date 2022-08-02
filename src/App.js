import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { AddGraphqlTodo } from "./Components/AddGraphqlTodo";
import { AddGraphqlUser } from "./Components/AddGraphqlUser";
import { AddRestUser } from "./Components/AddRestUser";
import { AddRestTodo } from "./Components/AddRestTodo";
import { RestTodo } from "./Components/RestTodo";
import { GraphqlTodo } from "./Components/GraphqlTodo";
import { RestClient, GraphqlClient, sharedCache } from "./index";
import { GET_GRAPHQL_TODOS, GET_REST_TODOS, UPDATE_TODO } from "./Query";
import { DisplayGraphqlUser } from "./Components/DisplayGraphqlUser";
import { DisplayGraphqlUsers } from "./Components/DisplayGraphqlUsers";
import { DisplayRestUser } from "./Components/DisplayRestUser";
import { DisplayRestUsers } from "./Components/DisplayRestUsers";
import { DisplayGraphqlTodo } from "./Components/DisplayGraphqlTodo";
import { DisplayRestTodo } from "./Components/DisplayRestTodo";
import { Tabs } from "antd";
import React from "react";

const { TabPane } = Tabs;

function DisplayTodo() {
    // const { data: restData } = useQuery(GET_REST_TODOS, { client: RestClient });
    const { data: graphqlData } = useQuery(GET_GRAPHQL_TODOS, {
      client: GraphqlClient,
    });
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ backgroundColor: "#A6D1E6", width: "350px", padding: "10px" }}
      >
        <p>Rest Todo</p>
        {/* <RestTodo data={restData} /> */}
      </div>
      <div
        style={{ backgroundColor: "#FEFBF6", width: "350px", padding: "10px" }}
      >
        <p>Graphql Todo</p>
        <GraphqlTodo data={graphqlData} />
      </div>
    </div>
  );
}

function DisplayUpdatedTodo() {
  const [getUpdatedRestData, { data: restData }] = useLazyQuery(
    GET_REST_TODOS,
    {
      client: RestClient,
      update: (cache, { data: { updateTodo } }) => {
        // read data from cache
        const res = cache.readQuery({ query: GET_GRAPHQL_TODOS });
        console.log("ssss", res, res?.getTodos, updateTodo);
        // update the cache with new data
        cache.writeQuery({
          query: GET_GRAPHQL_TODOS,
          data: {
            getTodos: [...res?.getTodos, updateTodo],
          },
        });
      },
    }
  );
  const [getUpdatedGraphqlData, { loading, error, data: graphqlData }] =
    useLazyQuery(GET_GRAPHQL_TODOS, {
      client: GraphqlClient,
      update: (cache, { data: { updateTodo } }) => {
        // read data from cache
        const res = cache.readQuery({ query: GET_REST_TODOS });
        console.log("ssss", res, res?.getTodos, updateTodo);
        // update the cache with new data
        cache.writeQuery({
          query: GET_REST_TODOS,
          data: {
            getTodos: [...res?.getTodos, updateTodo],
          },
        });
      },
    });

  const [editable, setEditable] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState({});
  const [updateTodo, { data: data1, loading: loading1, error: error1 }] =
    useMutation(UPDATE_TODO, {
      client: GraphqlClient,
      variables: {
        selectedTodo,
      },
    });

  const editRest = (id) => {
    const toUpdate = restData?.getTodos.find((data) => data.id === id);
    setSelectedTodo(toUpdate);
    setEditable(id);
  };
  const editGraphql = (id) => {
    const toUpdate = graphqlData?.getTodos.find((data) => data.id === id);
    setSelectedTodo(toUpdate);
    setEditable(id);
  };

  const RestTodo = () => {
    return restData?.getTodos?.map(({ id, title, completed, description }) =>
      editable !== id ? (
        <div key={title}>
          <p>
            <b>Id: </b>
            {id}
          </p>
          <h3>{title}</h3>
          <p>
            Completed
            {completed}
          </p>
          <p>
            <b>Description: </b>
            {description}
          </p>
          <br />
          <button onClick={() => editRest(id)}>Edit</button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("SLE", selectedTodo);
            updateTodo({ variables: { ...selectedTodo } });
            // setSelectedTodo({})
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
              setSelectedTodo({
                ...selectedTodo,
                description: e.target.value,
              })
            }
          />
          <input
            type="checkbox"
            value={selectedTodo.completed}
            onChange={(e) =>
              setSelectedTodo({
                ...selectedTodo,
                description: e.target.checked,
              })
            }
          />
          <button type="submit">Update Todo</button>
        </form>
      )
    );
  };

  const GraphqlTodo = () => {
    return graphqlData?.getTodos?.map(({ id, title, completed, description }) =>
      editable !== id ? (
        <div key={title}>
          <p>
            <b>Id: </b>
            {id}
          </p>
          <h3>{title}</h3>
          <p>
            Completed
            {completed}
          </p>
          <p>
            <b>Description: </b>
            {description}
          </p>
          <br />
          <button onClick={() => editGraphql(id)}>Edit</button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("SLE", selectedTodo);
            updateTodo({ variables: { ...selectedTodo } });
            // setSelectedTodo({})
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
                description: e.target.checked,
              })
            }
          />
          <button type="submit">Update Todo</button>
        </form>
      )
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={() => getUpdatedRestData()}>getUpdatedRest</button>
      <button onClick={() => getUpdatedGraphqlData()}>
        getUpdatedGraphqlData
      </button>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor: "#A6D1E6",
            width: "300px",
            padding: "10px",
          }}
        >
          <p>Rest Todo</p>
          <RestTodo />
        </div>
        <div
          style={{
            backgroundColor: "#FEFBF6",
            width: "300px",
            padding: "10px",
          }}
        >
          <p>Graphql Todo</p>
          <GraphqlTodo />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("1");


  return (
    <div style={{ margin: "20px" }}>
      <Tabs onChange={(key) => setTab(key)} activeKey={tab}>
        <TabPane tab="Todo" key="1">
          <DisplayTodo  />
        </TabPane>
        <TabPane tab="Refetch Todo" key="2">
          <DisplayUpdatedTodo />
        </TabPane>
        <TabPane tab="Get Todo By Id" key="3">
          <DisplayGraphqlTodo />
          <DisplayRestTodo />
        </TabPane>
        <TabPane tab="Add Todo" key="4">
          <AddRestTodo  />
          <AddGraphqlTodo  />
        </TabPane>
        <TabPane tab="User" key="5">
          <DisplayRestUsers />
          <DisplayGraphqlUsers />
        </TabPane>
        <TabPane tab="Get User By Id" key="6">
          <DisplayRestUser />
          <DisplayGraphqlUser />
        </TabPane>
        <TabPane tab="Add User" key="7">
          <AddRestUser />
          <AddGraphqlUser />
        </TabPane>
      </Tabs>
    </div>
  );
}
