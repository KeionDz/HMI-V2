import { Card, CardContent, CardTitle } from "./card";
import { Input } from "./input";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { type loginFormData } from "@/schemas/login-schema";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "./button";

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
    <div className="w-full max-w-md">
      <Card className="w-full shadow-sm">
        <CardTitle className="px-8 pt-8 text-center text-3xl font-semibold sm:px-10 sm:pt-10">
          HMI
        </CardTitle>
        <CardContent className="px-8 pb-8 pt-0 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  className="h-10 px-3"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
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
            <Button
              className="h-10 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
