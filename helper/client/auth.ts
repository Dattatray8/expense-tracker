import { AppDispatch } from "@/redux/store";
import { setAuthLoad, setUserData } from "@/redux/userSliece";
import { IUserLogin, IUserRegister } from "@/types/auth.types";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export const handleSignUp = async ({
  formValue,
  dispatch,
}: {
  formValue: IUserRegister;
  dispatch: AppDispatch;
}) => {
  for (const key in formValue) {
    if (formValue[key as keyof IUserRegister] === "") {
      toast.error(`${key} is empty`);
      return;
    }
  }
  dispatch(setAuthLoad(true));
  try {
    const res = await axios.post("/api/signup", formValue, {
      withCredentials: true,
    });
    console.log(res.data);
    toast.success(res?.data?.message);
    dispatch(setUserData(res?.data?.user));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      toast.error(error.response?.data?.message || error.message);
    } else {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
    dispatch(setAuthLoad(false));
  } finally {
    dispatch(setAuthLoad(false));
  }
};

export const handleLogin = async ({
  formValue,
  dispatch,
}: {
  formValue: IUserLogin;
  dispatch: AppDispatch;
}) => {
  for (const key in formValue) {
    if (formValue[key as keyof IUserLogin] === "") {
      toast.error(`${key} is empty`);
      return;
    }
  }
  dispatch(setAuthLoad(true));
  try {
    const res = await signIn("credentials", {
      email: formValue.email,
      password: formValue.password,
      redirect: false,
    });
    if (res?.ok) {
      toast.success("Login Successful!");
    } else {
      toast.error(res?.error || "Invalid Credentials");
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error));
    dispatch(setAuthLoad(false));
  } finally {
    dispatch(setAuthLoad(false));
  }
};

export const handleGoogleAuth = async () => {
  const res = await signIn("google", { callbackUrl: "/" });
  console.log(res)
};
