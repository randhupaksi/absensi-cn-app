"use client";

import { loginSchema, type LoginSchema } from "@/lib/validations/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleOptions } from "@/lib/constants/site";

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      role: "siswa",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    toast.success("Form login siap dihubungkan ke backend", {
      description: `${values.role.toUpperCase()} akan dikirim melalui auth service.`,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="identifier">NIS / Username / Email</Label>
        <Input
          id="identifier"
          placeholder="Masukkan identitas akun"
          {...form.register("identifier")}
        />
        {form.formState.errors.identifier ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.identifier.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          defaultValue={form.getValues("role")}
          onValueChange={(value) =>
            form.setValue("role", value as LoginSchema["role"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-2xl"
        disabled={form.formState.isSubmitting}
      >
        Masuk ke Dashboard
      </Button>
    </form>
  );
}
