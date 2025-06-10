"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { AppStoreType, storeConfig } from "./storeConfig";

interface IAppStoreProps {
    children: ReactNode;
}

export const AppStore = ({ children }: IAppStoreProps) => {
    const storeRef = useRef<AppStoreType | null>(null);

    if (!storeRef.current) {
        storeRef.current = storeConfig();
    }

    return <Provider store={storeRef.current!}>{children}</Provider>;
};
