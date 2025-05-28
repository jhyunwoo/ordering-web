import { signIn } from "@/auth";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className={
          "p-2 px-4 rounded-lg bg-neutral-950 text-white font-semibold text-lg text-center"
        }
      >
        Sign in with Google
      </button>
    </form>
  );
}
