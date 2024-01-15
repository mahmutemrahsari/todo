import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query tasks {
    tasks {
      id
      title
      completed
      user_id
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: Int!) {
    deleteTask(id: $id) {
      id
      title
      completed
      user_id
    }
  }
`;

export const DELETE_ALL_TASKS = gql`
  mutation deleteAllTasks {
    deleteAllTasks
  }
`;

export const ADD_TASK = gql`
  mutation addTask($id: Int!, $title: String!) {
    addTask(task: { id: $id, title: $title, completed: false, user_id: 1 }) {
      id
      title
      completed
      user_id
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($id: Int!, $edits: EditTaskInput!) {
    updateTask(id: $id, edits: $edits) {
      id
      title
      completed
      user_id
    }
  }
`;
