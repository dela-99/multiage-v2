import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "multiage_cart";
const CartContext = createContext(null);

function getCartItemKey(item) {
  return item.cartKey || `${item._id}${item.storage ? `:${item.storage}` : ""}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      setItems(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((current) => {
      const normalizedItem = {
        ...product,
        image: product.image || product.images?.[0] || "",
        cartKey: getCartItemKey(product),
      };
      const existing = current.find((item) => getCartItemKey(item) === normalizedItem.cartKey);
      if (existing) {
        return current.map((item) =>
          getCartItemKey(item) === normalizedItem.cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...normalizedItem, quantity: 1 }];
    });
  };

  const removeItem = (itemKey) => {
    setItems((current) => current.filter((item) => getCartItemKey(item) !== itemKey));
  };

  const updateQuantity = (itemKey, quantity) => {
    setItems((current) => current.flatMap((item) => {
      if (getCartItemKey(item) !== itemKey) {
        return [item];
      }

      if (quantity <= 0) {
        return [];
      }

      return [{ ...item, quantity }];
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = Math.round(
    items.reduce(
      (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)),
      0
    ) * 100
  ) / 100;

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }), [items, totalItems, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return value;
}
