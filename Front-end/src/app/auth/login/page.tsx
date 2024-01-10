import React from "react";
import LoginForm from "@/components/Client/loginForm";

const Login = () => {
  return (
    <div>
      {/*<Image*/}
      {/*  src="/login-bg.jpg"*/}
      {/*  alt="Background"*/}
      {/*  fill={true}*/}
      {/*  className="absolute -z-10" // Ensure the image is in the background*/}
      {/*  priority={true}*/}
      {/*/>*/}
      <div className="mx-auto flex h-screen items-center justify-center">
        <div className={"rounded-xl bg-white p-8 shadow-2xl"}>
          <div className="w-full space-y-8">
            <div className="">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
