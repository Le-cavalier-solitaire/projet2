import { AppDispatch } from "../../store";
import { setCredentials, logout } from "./authSlice";
import { authApi } from "./authApi";

export const loginUser =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await dispatch(
        authApi.endpoints.login.initiate(credentials)
      ).unwrap();

      dispatch(
        setCredentials({
          token: response.access_token,
          refreshToken: response.refresh_token,
          user: response.user,
        })
      );

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await dispatch(authApi.endpoints.logout.initiate({})).unwrap();
  } finally {
    dispatch(logout());
  }
};
