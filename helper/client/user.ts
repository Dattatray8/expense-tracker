import { AppDispatch } from "@/redux/store";
import { setAuthUser, setUserData } from "@/redux/userSliece";
import axios from "axios";
import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getUser = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get("/api/user", { withCredentials: true });
    dispatch(setUserData(res?.data.user));
  } catch (error: any) {
    console.log(error);
  }
};

export const handleSignOut = async (
  router: AppRouterInstance,
  dispatch: AppDispatch,
) => {
  try {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    dispatch(setAuthUser(null));
    router.replace("/");
  } catch (error) {
    console.log(error);
  }
};