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

// Схема валидации для формы
const formSchema = z.object({
    email: z.string().email({ message: "Неверный формат почты." }),
    password: z.string().min(6, { message: "Пароль должен быть не менее 6 символов." }),
});

export function AuthForm() {
    const { register: authRegister, login: authLogin, loading, user } = useAuth();
    const router = useRouter(); // Хук для навигации в Next.js

    const [isRegistering, setIsRegistering] = useState(true);

    // Если пользователь уже вошел, перенаправляем на главную
    React.useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        form.clearErrors("root.serverError"); // Очищаем предыдущие ошибки сервера
        try {
            if (isRegistering) {
                await authRegister(values.email, values.password);
            } else {
                await authLogin(values.email, values.password);
            }
            // После успешной регистрации/входа useAuth хук обновит состояние user,
            // и useEffect выше перенаправит пользователя.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Устанавливаем ошибку, чтобы отобразить ее пользователю
            form.setError("root.serverError", {
                type: "manual",
                message: error.message || "Произошла неизвестная ошибка. Попробуйте еще раз.",
            });
            console.error("Ошибка аутентификации:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">
                {isRegistering ? "Регистрация" : "Вход"}
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Почта</FormLabel>
                                <FormControl>
                                    <Input placeholder="ваша@почта.ком" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="минимум 6 символов"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Отображение ошибок от сервера (Firebase) */}
                    {form.formState.errors.root?.serverError && (
                        <p className="text-red-500 text-sm">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting || loading}
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
