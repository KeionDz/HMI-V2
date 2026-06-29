import LoginForm from "../ui/login-form";
import { type loginFormData } from "@/schemas/login-schema";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/client/mutations/auth-mutation";
import { setStoredAuthUserId } from "@/lib/auth-storage";

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: loginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      const state = location.state as LoginLocationState | null;

      setStoredAuthUserId(response.user.id);
      navigate(state?.from?.pathname ?? "/admin", { replace: true });
    } catch {
      form.setError("username", { message: " " });
      form.setError("password", { message: "Invalid username or password." });
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-10">
      <LoginForm form={form} onSubmit={onSubmit} />
    </main>
  );
};

export default LoginPage;
