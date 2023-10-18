import { useLocalObservable } from "mobx-react";

export const useCartStore = () => {
  return useLocalObservable(() => ({
    cart: [],
    addCartItem(item) {
      this.cart.push(item);
    },
  }));
};
