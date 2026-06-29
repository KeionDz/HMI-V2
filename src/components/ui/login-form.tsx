import { Card, CardContent, CardTitle } from "./card";
import { Input } from "./input";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { type loginFormData } from "@/schemas/login-schema";
import { type UseFormReturn } from "react-hook-form";

interface LoginFormProps {
  form: UseFormReturn<loginFormData>;
  onSubmit: (data: loginFormData) => void;
}

const LoginForm = ({ form, onSubmit }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="w-full max-w-2xl gap-10">
      <Card className="w-full shadow-sm">
        <CardTitle className="px-8 pt-8 text-center text-3xl font-semibold sm:px-10 sm:pt-10">
          Eastworks HMI
        </CardTitle>
        <CardContent className="px-8 pb-8 pt-0 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  className="h-10 px-3"
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register("username")}
                />
                {errors.username && (
                  <FieldError>{errors.username.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  className="h-10 px-3"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-full bg-blue-500 text-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {isSubmitting ? "Logging in..." : "Login as Administrator"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
