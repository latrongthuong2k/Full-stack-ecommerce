"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "@/api/services/AuthService";
import { useRouter } from "next/navigation";
import { AuthTokens } from "@/lib/types";
import { useLoginContextHolder } from "@/context/LoginContextHolder";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUserToken } = useLoginContextHolder();

  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(6, "Username must be at least 6 characters")
      .max(100, "Username must be maximum 100 characters")
      .required("User name can't be blank"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required Confirm Password"),
  });

  const formData = {
    userName: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    gender: "OTHER",
  };
  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const edit = { ...values, fullName: values.userName };
      const { confirmPassword, ...takeValue } = edit;
      const sighUpRes = await register(takeValue);
      if (sighUpRes) {
        if (sighUpRes.error) {
          toast.error("登録エラー: " + sighUpRes.error);
        } else if (sighUpRes.authToken) {
          console.log(sighUpRes.authToken);
          setUserToken(sighUpRes.authToken);
          toast.success("登録が成功しました！");
          const returnUrl = localStorage.getItem("returnUrl") || "/";
          router.push(`/${returnUrl}`);
        }
      }
    },
  });

  const togglePasswordVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowPassword(e.target.checked);
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={formik.handleSubmit}
          className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
        >
          <p className={"mb-4 text-3xl"}>登録</p>
          <hr />
          <p className={"my-5 "}>
            メールアドレスとパスワードを入力してください。
          </p>
          {/* UserName field */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="userName"
            >
              ユーサー名 ※
            </label>
            <input
              type="userName"
              name="userName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="userName"
              placeholder="sotaro"
            />
            {formik.touched.userName && formik.errors.userName ? (
              <p className="text-xs text-red-500">{formik.errors.userName}</p>
            ) : null}
          </div>
          {/* Email field */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              メールアドレス ※
            </label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              placeholder="xxx@uniqlo.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          {/* Password field */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              パスワード ※
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="password"
              placeholder="******************"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-xs text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          {/* Password confirm field */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="confirmPassword"
            >
              パスワード確認 ※
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              name="confirmPassword"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="もう一度パスワードを入力してください。"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-xs text-red-500">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
          </div>
          <div className="mb-4">
            <p className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                onChange={togglePasswordVisibility}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                パスワードを表示する
              </label>
            </p>
          </div>
          <div className="mb-6">
            <fieldset>
              <legend className="mb-2 block text-sm font-bold text-gray-700">
                性別
              </legend>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                男性
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                女性
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="OTHER"
                  defaultChecked
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                その他
              </label>
            </fieldset>
          </div>
          {/* Submit button */}
          <button
            className="focus:shadow-outline rounded bg-black px-20 py-4 font-bold text-white hover:bg-gray-800 focus:outline-none"
            type="submit"
          >
            登録
          </button>
          {/*<div className="flex items-center justify-between">*/}

          {/*</div>*/}
        </form>
      </div>
    </div>
  );
};
export default Register;
