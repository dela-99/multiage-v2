import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useAdminResources(token, { messages = false, users = false } = {}) {
  const [state, setState] = useState({
    messages: [],
    users: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setState((current) => ({ ...current, loading: true, error: "" }));

        const tasks = [];

        if (messages) {
          tasks.push(api.getMessages(token));
        }
        if (users) {
          tasks.push(api.getUsers(token));
        }

        const responses = await Promise.all(tasks);
        let cursor = 0;

        const nextState = {
          messages: [],
          users: [],
        };

        if (messages) {
          nextState.messages = responses[cursor] || [];
          cursor += 1;
        }
        if (users) {
          nextState.users = responses[cursor] || [];
        }

        if (active) {
          setState({
            ...nextState,
            loading: false,
            error: "",
          });
        }
      } catch (err) {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: err.message || "Failed to load admin data",
          }));
        }
      }
    }

    if (!token && (messages || users)) {
      setState({
        messages: [],
        users: [],
        loading: false,
        error: "",
      });
      return undefined;
    }

    load();
    return () => { active = false; };
  }, [messages, users, token]);

  return state;
}
