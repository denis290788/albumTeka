"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import React, { ReactNode } from "react";

interface ActionButtonProps {
    icon: ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const ActionButton = ({
    icon,
    label,
    href,
    onClick,
    disabled,
    className,
    ...props
}: ActionButtonProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
            {icon}
            <span className="text-xs lg:text-sm text-center">{label}</span>
        </div>
    );

    if (href) {
        return (
            <Button
                variant="heroAlt"
                className={cn("h-24 lg:h-30", className)}
                disabled={disabled}
                {...props}
            >
                <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 p-2"
                >
                    {content}
                </Link>
            </Button>
        );
    }

    return (
        <Button
            variant="heroAlt"
            className={cn("h-24 lg:h-30", className)}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {content}
        </Button>
    );
};
