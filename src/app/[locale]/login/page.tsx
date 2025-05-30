"use client";

import { useActionState, useState } from "react";
import {
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginUser } from "@/db/auth";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Register() {
  const [state, action, pending] = useActionState(loginUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const enhancedAction = async (formData: FormData) => {
    formData.append("callbackUrl", window.location.href);
    return action(formData);
  };

  const text = useTranslations("Signin");
  const btnText = useTranslations("Button");

  return (
    <main className="p-4">
      <div className="m-[20px] w-fit place-self-center rounded border border-[#927d2b] bg-[var(--primary)] p-[20px]">
        <h1 className="text-center text-2xl font-bold">{text("login")}</h1>
        <form className="flex flex-col items-center gap-4 py-4" action={enhancedAction}>
          <input type="hidden" name="returnTo" value={returnTo} />
          <TextField
            id="login-email"
            name="email"
            label={text("email")}
            variant="filled"
            className="w-full rounded bg-[var(--inputbg)]"
            required
          />
          <FormControl variant="outlined">
            <FilledInput
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full bg-[var(--inputbg)]"
              placeholder={text("password")}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ?
                      <EyeSlashIcon width={24} height={24} />
                    : <EyeIcon width={24} height={24} />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button variant="contained" disabled={pending} type="submit" className="w-full">
            {btnText("submit")}
          </Button>
          {state?.message && <span>{state.message}</span>}
        </form>
      </div>
    </main>
  );
}
