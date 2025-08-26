"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useAuth } from "../hooks/useAuth";

const formSchema = z.object({
    email: z.string().email({ message: "Неверный формат почты." }),
    password: z.string().min(6, { message: "Пароль должен быть не менее 6 символов." }),
});

export function AuthForm() {
    const { register: authRegister, login: authLogin, loading, user } = useAuth();
    const router = useRouter();

    const [isRegistering, setIsRegistering] = useState(true);

    React.useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        form.clearErrors("root.serverError");
        try {
            if (isRegistering) {
                await authRegister(values.email, values.password);
            } else {
                await authLogin(values.email, values.password);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            form.setError("root.serverError", {
                type: "manual",
                message: error.message || "Произошла неизвестная ошибка. Попробуйте еще раз.",
            });
            console.error("Ошибка аутентификации:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">
                {isRegistering ? "Регистрация" : "Вход"}
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <div className="flex gap-2 items-baseline">
                                    <FormLabel className="w-[70px]">Почта</FormLabel>
                                    <div className="w-full">
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="ваша@почта.ком"
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="min-h-[16px]">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex gap-2 items-baseline">
                                    <FormLabel className="w-[70px]">Пароль</FormLabel>
                                    <div className="w-full">
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="минимум 6 символов"
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="min-h-[16px]">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    {form.formState.errors.root?.serverError && (
                        <p className="text-destructive text-sm">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    )}
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={!form.formState.isValid || form.formState.isSubmitting || loading}
                    >
                        {form.formState.isSubmitting
                            ? "Загрузка..."
                            : isRegistering
                            ? "Зарегистрироваться"
                            : "Войти"}
                    </Button>
                </form>
            </Form>
            <Button
                variant="link"
                onClick={() => setIsRegistering(!isRegistering)}
                className="mt-6 w-full text-blue-600"
            >
                {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </Button>
        </div>
    );
}
