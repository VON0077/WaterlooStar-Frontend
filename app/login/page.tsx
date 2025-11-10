import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";

import { title } from "@/components/primitives";

export default function LoginPage() {
  return (
    <section className="flex w-full justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2">
          <h1 className={title({ size: "sm" })}>Login</h1>
          <p className="text-sm text-default-500">Sign in you little shit</p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4">
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="you@example.com"
              type="email"
              variant="bordered"
            />
            <Input
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="••••••••"
              type="password"
              variant="bordered"
            />
            <div className="flex items-center justify-between">
              <Switch name="remember" size="sm">
                Remember me
              </Switch>
              <Link href="/forgot-password" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button color="primary" type="submit">
              Sign in
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center text-sm text-default-500">
          <span>Don&apos;t have an account?</span>
          <Link className="ml-1" href="/register" size="sm">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
