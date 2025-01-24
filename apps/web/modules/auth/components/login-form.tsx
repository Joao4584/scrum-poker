'use client';

import { cn } from '@/modules/shared/utils';
import { Button } from '@/modules/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/shared/ui/card';
import { Input } from '@/modules/shared/ui/input';
import { Label } from '@/modules/shared/ui/label';

import GitHubSvg from '@/assets/svg/github.svg';
import GoogleSvg from '@/assets/svg/google.svg';
import Image from 'next/image';
import { useI18n } from '@/locales/client';
import { signIn } from 'next-auth/react'; // Importa o método signIn

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const t = useI18n();

  const handleSocialLogin = async (provider: string) => {
    const result = await signIn(provider, { redirect: false }); // Evita redirecionamento imediato
    console.log(result); // Exibe o resultado no console
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário
    console.log('Form submitted!');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('auth.welcome')}</CardTitle>
          <CardDescription>{t('auth.integration.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {' '}
            {/* Previne o comportamento padrão */}
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('github')}
                >
                  <Image
                    src={GitHubSvg}
                    width={18}
                    height={18}
                    alt="Github Icon"
                  />
                  {t('auth.integration.login.github')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
                >
                  <Image
                    src={GoogleSvg}
                    width={18}
                    height={18}
                    alt="Google Icon"
                  />
                  {t('auth.integration.login.google')}
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {t('auth.integration.orContinue')}
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {' '}
                      {t('auth.field.password')}
                    </Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t('auth.label.passwordForgot')}
                    </a>
                  </div>
                  <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
