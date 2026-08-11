"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Phone, Heart, Plus, Trash2, Save } from "lucide-react";

interface ICEContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
}

interface MedicalInfo {
    bloodType: string;
    allergies: string;
    medications: string;
    conditions: string;
}

export default function ProfilePage() {
    const t = useTranslations("profile");
    const user = useAuthStore((s) => s.user);
    const [iceContacts, setIceContacts] = useState<ICEContact[]>([]);
    const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
        bloodType: "",
        allergies: "",
        medications: "",
        conditions: "",
    });
    const [showContactForm, setShowContactForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });

    const handleAddContact = () => {
        if (!newContact.name || !newContact.phone) return;
        setIceContacts([...iceContacts, { ...newContact, id: Date.now().toString() }]);
        setNewContact({ name: "", phone: "", relationship: "" });
        setShowContactForm(false);
    };

    const handleRemoveContact = (id: string) => {
        setIceContacts(iceContacts.filter((c) => c.id !== id));
    };

    const handleSaveMedical = () => {
        toast.success(t("saved"));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
            >
                {t("title")}
            </motion.h1>

            {/* Personal Info */}
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" /> {t("personalInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg font-semibold">{user?.name || "Guest User"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{user?.email || "Not signed in"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <Badge variant="secondary" className="capitalize">{user?.role || "citizen"}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Info */}
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" /> {t("medicalInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t("bloodType")}</label>
                            <Input
                                placeholder="A+, B-, O+, AB-"
                                value={medicalInfo.bloodType}
                                onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t("allergies")}</label>
                            <Input
                                placeholder="Penicillin, peanuts, etc."
                                value={medicalInfo.allergies}
                                onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t("medications")}</label>
                            <Input
                                placeholder="Insulin, aspirin, etc."
                                value={medicalInfo.medications}
                                onChange={(e) => setMedicalInfo({ ...medicalInfo, medications: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t("conditions")}</label>
                            <Input
                                placeholder="Diabetes, asthma, etc."
                                value={medicalInfo.conditions}
                                onChange={(e) => setMedicalInfo({ ...medicalInfo, conditions: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveMedical} className="w-full md:w-auto">
                        <Save className="h-4 w-4 mr-2" /> {t("save")}
                    </Button>
                </CardContent>
            </Card>

            {/* ICE Contacts */}
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" /> {t("iceContacts")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {iceContacts.map((contact) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveContact(contact.id)}
                                className="text-red-500"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))}

                    {showContactForm ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3 p-4 rounded-lg border"
                        >
                            <Input
                                placeholder={t("name")}
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            />
                            <Input
                                placeholder={t("phone")}
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            />
                            <Input
                                placeholder={t("relationship")}
                                value={newContact.relationship}
                                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <Button onClick={handleAddContact} size="sm">{t("addContact")}</Button>
                                <Button variant="outline" size="sm" onClick={() => setShowContactForm(false)}>Cancel</Button>
                            </div>
                        </motion.div>
                    ) : (
                        <Button variant="outline" onClick={() => setShowContactForm(true)} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> {t("addContact")}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
