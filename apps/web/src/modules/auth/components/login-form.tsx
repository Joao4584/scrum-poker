"use client";

import { cn } from "@/modules/shared/utils";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";

import GitHubSvg from "@/assets/svg/github.svg";
import GoogleSvg from "@/assets/svg/google.svg";
import Image from "next/image";
import { useI18n } from "@/locales/client";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSocialLogin = async (provider: string) => {
    const result = await signIn(provider, { redirect: false });
    if (result && !result.error) {
      router.push(callbackUrl || "/app");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted!");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.welcome")}</CardTitle>
          <CardDescription>{t("auth.integration.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("github")}
                >
                  <Image
                    src={GitHubSvg}
                    width={18}
                    height={18}
                    alt="Github Icon"
                  />
                  {t("auth.integration.login.github")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                  onClick={() => handleSocialLogin("google")}
                >
                  <Image
                    src={GoogleSvg}
                    width={18}
                    height={18}
                    alt="Google Icon"
                  />
                  {t("auth.integration.login.google")}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
