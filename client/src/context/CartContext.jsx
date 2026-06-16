import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product, size, color) => {
    setItems((prev) => {
      const exists = prev.find(
        (i) => i._id === product._id && i.size === size && i.color === color,
      );
      if (exists) {
        return prev.map((i) =>
          i._id === product._id && i.size === size && i.color === color
            ? { ...i, qty: i.qty + 1 }
            : i,
        );
      }
      return [...prev, { ...product, size, color, qty: 1 }];
    });
  };

  const removeItem = (id, size, color) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i._id === id && i.size === size && i.color === color),
      ),
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
