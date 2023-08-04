import { atom, selector } from "recoil";
import { refreshToken } from "../library/refreshToken";

export const accessTokenState = atom({
  key: "accessTokenState",
  default: "",
});

export const refreshTokenState = selector({
  key: "refreshTokenState",
  get: async () => {
    const newAccessToken = await refreshToken();
    return newAccessToken;
  },
})