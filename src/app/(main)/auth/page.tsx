import { AuthForm } from "@/features/auth";

export default function AuthPage() {
    return (
        // <div className="max-w-4xl mx-auto pt-[130px] lg:pt-[155px] px-4 xl:px-16">
        //     <AuthForm />
        // </div>

        <div className="min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-90px)] grid place-items-center px-4">
            <div className="w-full">
                <AuthForm />
            </div>
        </div>
    );
}
