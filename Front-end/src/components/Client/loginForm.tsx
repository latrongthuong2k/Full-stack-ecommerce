"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { login } from "@/api/services/AuthService";
import * as Yup from "yup";
import clsx from "clsx";
import { useLoginContextHolder } from "@/context/LoginContextHolder";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { setUserToken } = useLoginContextHolder();

  const validationSchema = Yup.object({
    email: Yup.string()
      .max(255, "Maximum limit character for email is 255")
      .email("Wrong email format")
      .required("Email cannot be blank"),
    password: Yup.string()
      .max(255, "Maximum limit character for password is 255")
      .matches(
        /^(?=.*[A-Z])(?=.*[@#$%^&+=!]).+$/,
        "Password must have a capital letter and at least one special character",
      )
      .required("Password cannot be blank"),
  });

  const formData = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: async (formInputs) => {
      const sighInRes = await login(formInputs);
      if (sighInRes) {
        if (sighInRes.error) {
          toast.error("ログインエラー: " + sighInRes.error);
        } else if (sighInRes.authToken) {
          console.log(sighInRes.authToken);
          toast.success("Login successfully");
          setUserToken(sighInRes.authToken);
          const returnUrl = localStorage.getItem("returnUrl") || "/";
          router.push(`/${returnUrl}`);
        }
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center p-10">
      <div
        className={clsx("mb-4 w-1/2 rounded bg-white px-8 pb-8 pt-6", {
          "w-full": pathName === "/management/auth/login",
        })}
      >
        <p className={"mb-4 text-3xl"}>ログイン</p>
        <hr />
        <p className={"my-5"}>
          ログインご登録のメールアドレスとパスワードをご入力ください。
        </p>
        <form onSubmit={formik.handleSubmit} className="mb-4">
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              メールアドレス ※
            </label>
            <input
              name={"email"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="focus:shadow-outline mb-2 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              type="email"
              placeholder="xxx@uniqlo.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              パスワード ※
            </label>
            <input
              name={"password"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="focus:shadow-outline mb-2 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="パスワードを入力してください。"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-xs text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="togglePassword" className="mb-4 flex gap-2">
              <input
                id="togglePassword"
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />{" "}
              <p>パスワードを表示する</p>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-gray-800 px-20 py-4 font-bold text-white hover:bg-gray-700 focus:outline-none"
              type="submit"
            >
              ログイン
            </button>
          </div>
        </form>
        {pathName === "/auth/login" && (
          <div className="mt-6 space-y-4 py-[35px]">
            <p className={"text-center text-gray-500"}>Or Sign Up Using</p>
            <a
              href={`${process.env.NEXT_PUBLIC_BE_URL}/oauth2/authorization/google`}
              className="block rounded-[5px] border-gray-500 bg-red-500 px-4 py-2 text-center text-white hover:bg-red-600"
            >
              Login with Google
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_BE_URL}/oauth2/authorization/google`}
              className="block rounded-[5px] border-gray-500 bg-gray-700 px-4 py-2 text-center text-white hover:bg-gray-900"
            >
              Login with GitHub
            </a>
          </div>
        )}
      </div>
      {pathName !== "/management/auth/login" && (
        <div className=" mb-4 w-1/2 rounded px-8 pb-8 pt-6">
          <div>
            <p className={"mb-4 text-3xl"}>新規会員の登録</p>
            <hr />
          </div>
          <p className={"my-4 w-[30rem]"}>
            オンラインストアをご利用いただくには、会員登録が必要です。
            新規会員登録でクーポンをプレゼントします。
          </p>
          <button
            className="focus:shadow-outline rounded bg-gray-800 px-20 py-4 font-bold text-white hover:bg-gray-700 focus:outline-none"
            onClick={() => router.push("/account/register")}
          >
            新規会員の登録
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
