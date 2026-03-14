"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-card-foreground">Entrar na sua conta</CardTitle>
        <CardDescription>Use seu email e senha para acessar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="bg-secondary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              className="bg-secondary"
            />
          </div>
          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
            ou continue com
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" type="button">
            Google
          </Button>
          <Button variant="outline" className="flex-1" type="button">
            Facebook
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Nao tem conta?{" "}
          <Link href="/registro" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
