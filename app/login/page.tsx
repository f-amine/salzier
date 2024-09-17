import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/subpabase/server";
import LoginForm from "./LoginForm";

export type AuthResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

export default async function LoginPage() {
  const signIn = async (formData: FormData): Promise<AuthResult> => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Could not authenticate user" };
    }

    return { success: true };
  };

  const signUp = async (formData: FormData): Promise<AuthResult> => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      return { error: "Could not create user" };
    }

    return {
      success: true,
      message: "Check email to continue sign in process",
    };
  };

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/protected");
  } else {
    return (
      <div className="flex flex-col gap-4">
        <LoginForm signIn={signIn} signUp={signUp} />
      </div>
    );
  }
}
