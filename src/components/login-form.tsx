import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/AuthSlice";
import { baseUrl } from "../App";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // Write Login function

  const navigate = useNavigate();
  // Normal Login Logic
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();

  //   Normal Login
  const handleNormalLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/auth/login`;
      const response = await axios.post(
        url,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response ", response);

    
      // Call Redux
      dispatch(login({ user: response.data.data, token: response.data.token }));

      // Then Redirect
      navigate("/");
    } catch (error) {
      console.log("Error while Login ", error);
    }
  };

  return (
    <form
      onSubmit={handleNormalLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div> */}
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <NavLink className="underline underline-offset-4" to="/register">
          Sign up
        </NavLink>
      </div> */}
    </form>
  );
}
