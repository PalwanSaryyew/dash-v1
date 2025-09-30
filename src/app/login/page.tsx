// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Sayfa yönlendirmesini manuel yapacağız
        nick,
        password,
      });

      if (result?.error) {
        setError("Giriş maglumatlaryňyz ýalňyş.");
        console.error(result.error);
      } else if (result?.ok) {
        // Giriş başarılı, ana sayfaya yönlendir
        router.push("/");
      }
    } catch (error) {
      setError("Ýalňyşyk ýüze çykdy. Gaýtadan synanyşyň.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Girişi</CardTitle>
            <CardDescription>
              Dowam etmek üçin nickname ve parolyňyzy giriziň.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="nick">Nickname</Label>
              <Input
                id="nick"
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full">
              Giriş
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}