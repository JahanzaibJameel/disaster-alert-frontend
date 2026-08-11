"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Bell, Volume2, Vibrate, Contrast, Shield } from "lucide-react";

export default function SettingsPage() {
    const t = useTranslations("settings");
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [soundAlerts, setSoundAlerts] = useState(true);
    const [vibrationAlerts, setVibrationAlerts] = useState(true);
    const [highContrast, setHighContrast] = useState(false);
    const [emergencyAlertsOnly, setEmergencyAlertsOnly] = useState(false);

    const handleSave = () => {
        toast.success(t("saved"));
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
            >
                {t("title")}
            </motion.h1>

            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" /> {t("notifications")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t("pushNotifications")}</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t("emailNotifications")}</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t("smsNotifications")}</p>
                        </div>
                        <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <Volume2 className="h-4 w-4" /> {t("soundAlerts")}
                            </p>
                        </div>
                        <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <Vibrate className="h-4 w-4" /> {t("vibrationAlerts")}
                            </p>
                        </div>
                        <Switch checked={vibrationAlerts} onCheckedChange={setVibrationAlerts} />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Contrast className="h-5 w-5" /> Accessibility
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t("highContrast")}</p>
                        </div>
                        <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" /> {t("emergencyAlertsOnly")}
                            </p>
                        </div>
                        <Switch checked={emergencyAlertsOnly} onCheckedChange={setEmergencyAlertsOnly} />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">
                Save Settings
            </Button>
        </div>
    );
}
