import { SignInButton } from "@/app/auth/sign-in/sign-in-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/admin/pos");
  }

  return (
    <div
      className={
        "w-full h-screen flex flex-col items-center justify-center p-4"
      }
    >
      <div
        className={
          "bg-white p-4 rounded-xl flex flex-col items-center justify-center w-full max-w-4xl gap-4"
        }
      >
        <h1 className={"text-3xl font-bold"}>Sign In</h1>
        <SignInButton />
      </div>
    </div>
  );
}
