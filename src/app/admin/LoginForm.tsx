"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="label">Admin password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.error && <p className="font-bold text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
