import { ActionButton } from "@/shared/ui/ActionButton";
import { MonitorSmartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAddToHomeScreen } from "../hooks/useAddToHomeScreen";

export function AddToHomeScreenButton() {
    const { t } = useTranslation();
    const { isVisible, handleAddToHomeScreen } = useAddToHomeScreen();

    return (
        <ActionButton
            icon={
                <MonitorSmartphone
                    style={{ width: "2rem", height: "2rem" }}
                    className="lg:w-10 lg:h-10"
                />
            }
            label={t("authSection_install")}
            onClick={handleAddToHomeScreen}
            disabled={!isVisible}
        />
    );
}
