import LoginForm from "../ui/login-form";
import { type loginFormData } from "@/schemas/login-schema";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginPage = () => {
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  // Logic placeholder for now
  const onSubmit = async (loginFormData: loginFormData) => {
    try {
      console.log("Submitting to API:", loginFormData);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <LoginForm form={form} onSubmit={onSubmit} />
    </main>
  );
};

export default LoginPage;
