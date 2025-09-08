import { AuthForm } from "@/features/auth";

export default function AuthPage() {
    return (
        <div className="min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-90px)] pt-30 lg:pt-40 pb-4 px-4 ">
            <div className="w-full">
                <AuthForm />
            </div>
        </div>
    );
}
