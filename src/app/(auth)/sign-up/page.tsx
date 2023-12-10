"use client";

import { Icons } from "@/components/navbar/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credential-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

type Props = {};

function Page({}: Props) {
  /**
   * Validates the authentication credentials.
   *
   * @remarks
   * This validator is used to validate the email and password fields for authentication.
   *
   * @typeParam T - The type of the authentication credentials object.
   */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { data } = trpc.anyApiRoute.useQuery();
  console.log(data, "data");

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // TODO: send the credentials to the server
  };

  return (
    <>
      <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20"></Icons.logo>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "link",
              })}
            >
              Already have an account? Sign in
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email", { required: true })}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password", { required: true })}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Password"
                  />
                </div>
                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
