import { Card, CardContent } from "./card";
import { Input } from "./input";
import { Field, FieldGroup, FieldLabel } from "./field";

const LoginForm = () => {
  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-sm">
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
