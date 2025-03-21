"use client";

import { useActionState, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { registerUser } from "@/db/auth";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(registerUser, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">Register</h1>
      <form className="flex flex-col items-center gap-4 py-4" action={action}>
        <TextField id="register-name" name="name" label="Name" variant="outlined" />
        <TextField id="register-email" name="email" label="Email" variant="outlined" />
        <TextField id="register-phone" name="phone" label="Phone" variant="outlined" />
        <FormControl variant="outlined">
          <InputLabel htmlFor="register-password">Password</InputLabel>
          <OutlinedInput
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "hide the password" : "display the password"}
                  onClick={() => {
                    setShowPassword((show) => !show);
                  }}
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
            label="Password"
          />
        </FormControl>
        <Button variant="contained" disabled={pending} type="submit">
          Submit
        </Button>
      </form>
    </main>
  );
}
