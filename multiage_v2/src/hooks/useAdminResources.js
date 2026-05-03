import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useAdminResources(token, { products = false, orders = false, messages = false } = {}) {
  const [state, setState] = useState({
    products: [],
    orders: [],
    messages: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setState((current) => ({ ...current, loading: true, error: "" }));

        const tasks = [];

        if (products) {
          tasks.push(api.getProducts({ limit: 50 }));
        }
        if (orders) {
          tasks.push(api.getOrders(token));
        }
        if (messages) {
          tasks.push(api.getMessages(token));
        }

        const responses = await Promise.all(tasks);
        let cursor = 0;

        const nextState = {
          products: [],
          orders: [],
          messages: [],
        };

        if (products) {
          nextState.products = responses[cursor]?.items || [];
          cursor += 1;
        }
        if (orders) {
          nextState.orders = responses[cursor] || [];
          cursor += 1;
        }
        if (messages) {
          nextState.messages = responses[cursor] || [];
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

    load();
    return () => { active = false; };
  }, [messages, orders, products, token]);

  return state;
}
