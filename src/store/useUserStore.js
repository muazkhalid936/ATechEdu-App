import { create } from "zustand";

export const useUserStore = create((set) => ({
  role: null,
  isLogin: false,
  firstName: null,
  lastName: null,
  setFirstName: (newFirstName) =>
    set((state) => ({
      ...state,
      firstName: newFirstName,
    })),
  setLastName: (newLastName) =>
    set((state) => ({
      ...state,
      lastName: newLastName,
    })),
  setRole: (newRole) =>
    set((state) => ({
      ...state,
      role: newRole,
    })),
  setIsLogin: (loginState) =>
    set((state) => ({
      ...state,
      isLogin: loginState,
    })),
}));
