import LoginForm from "../ui/login-form";
import { type loginFormData } from "@/schemas/login-schema";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// ── Dummy admin credentials (replace when backend is ready) ──────────────────
const ADMIN_USER = {
  email: "admin",
  password: "admin123",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: loginFormData) => {
    if (data.email === ADMIN_USER.email && data.password === ADMIN_USER.password) {
      navigate("/admin");
    } else {
      form.setError("email", { message: " " }); // blank — just triggers red border
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