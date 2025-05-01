import { create } from "zustand";

type OTPStore = {
  email: string;
  setEmail: (email: string) => void;
};

export const useOTPStore = create<OTPStore>((set) => ({
  email: "",
  setEmail: (email: string) => set(() => ({ email })),
}));
