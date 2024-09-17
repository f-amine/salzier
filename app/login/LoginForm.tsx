"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthResult } from "@/app/login/page";
import { SubmitButton } from "./SubmitButton";

interface LoginFormProps {
  signIn: (formData: FormData) => Promise<AuthResult>;
  signUp: (formData: FormData) => Promise<AuthResult>;
  message?: string;
}

export default function LoginForm({ signIn, signUp }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMessage("");
  }, [isLogin]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = isLogin ? await signIn(formData) : await signUp(formData);

    if (result.error) {
      setMessage(result.error);
    } else if (result.success) {
      if (isLogin) {
        router.push("/protected");
      } else {
        setMessage(
          result.message || "Sign up successful. Please check your email.",
        );
      }
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Link
        href="/mainpage"
        className="site-name no-underline cursor-pointer transition-opacity hover:opacity-80"
      >
        <h1 className="text-4xl mb-5">
          <span className="text-white">HIDEIN</span>
          <span className="text-primary">CUP</span>
        </h1>
      </Link>
      <div className="bg-[#1E1E1E] rounded-2xl p-5 w-80">
        <div className="relative bg-black rounded-full flex justify-between items-center mb-5 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 z-[1] text-center py-2 font-semibold transition-colors duration-300 ${isLogin ? "text-black" : "text-gray-400"}`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 z-[1] text-center py-2 font-semibold transition-colors duration-300 ${!isLogin ? "text-black" : "text-gray-400"}`}
          >
            SIGN UP
          </button>
          <div
            className={`absolute inset-1 rounded-full w-[calc(50%-0.25rem)] bg-primary transition-transform duration-300 ${!isLogin && "translate-x-full"}`}
          ></div>
        </div>
        {message && (
          <div className="bg-red-500 text-white p-2 rounded-xl mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <>
              {/* Login form fields */}
              <div className="relative">
                <svg
                  className="size-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  name="email"
                  placeholder="EMAIL"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <div className="relative">
                <svg
                  className="size-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="PASSWORD"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>

              <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
            </>
          ) : (
            <>
              {/* Sign up form fields */}
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="text"
                  name="username"
                  placeholder="USERNAME"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="PASSWORD"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="CONFIRM PASSWORD"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <div className="relative">
                <i className="fas fa-wallet absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="text"
                  name="wallet"
                  placeholder="WALLET"
                  className="w-full py-2 pl-10 pr-3 bg-black border-none rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
              <SubmitButton pendingText="Signing Up...">Sign Up</SubmitButton>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
