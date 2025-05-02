import { create } from "zustand";

type AuthStoreState = {
  authData: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  type: string;
};

type AuthStoreReducer = {
  setAuthData: (authData: AuthStoreState["authData"]) => void;
  clearAuthData: () => void;
  setType: (type: string) => void;
};

type AuthStore = AuthStoreState & AuthStoreReducer;

const INITIAL_STATE: AuthStoreState["authData"] = {
  email: "",
  username: "",
  firstName: "",
  lastName: "",
};

export const useAuthStore = create<AuthStore>((set) => ({
  authData: INITIAL_STATE,
  type: "",
  setType: (type: string) => set(() => ({ type })),
  setAuthData: (authData) => set(() => ({ authData })),
  clearAuthData: () => set(() => ({ authData: { ...INITIAL_STATE } })),
}));
