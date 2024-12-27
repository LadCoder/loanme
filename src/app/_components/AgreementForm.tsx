import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { scheduleEnum } from "~/server/db/schema";

interface AgreementFormProps {
    onSubmit: (data: {
        interestRate: number;
        paymentSchedule: typeof scheduleEnum.enumValues[number];
        terms: string;
    }) => void;
}

export function AgreementForm({ onSubmit }: AgreementFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        interestRate: 0,
        paymentSchedule: "MONTHLY" as typeof scheduleEnum.enumValues[number],
        terms: "",
    });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else onSubmit(formData);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {step === 1 && (
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                >
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                        id="interestRate"
                        type="number"
                        step="0.01"
                        value={formData.interestRate}
                        onChange={(e) =>
                            setFormData({ ...formData, interestRate: parseFloat(e.target.value) })
                        }
                        className="text-lg"
                    />
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                >
                    <Label htmlFor="paymentSchedule">Payment Schedule</Label>
                    <Select
                        value={formData.paymentSchedule}
                        onValueChange={(value: typeof scheduleEnum.enumValues[number]) =>
                            setFormData({ ...formData, paymentSchedule: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            {scheduleEnum.enumValues.map((schedule) => (
                                <SelectItem key={schedule} value={schedule}>
                                    {schedule.charAt(0) + schedule.slice(1).toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="space-y-4"
                >
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                        id="terms"
                        value={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                        className="min-h-[200px]"
                        placeholder="Enter the terms and conditions for this loan agreement..."
                    />
                </motion.div>
            )}

            <motion.div
                className="flex justify-between pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <button
                    onClick={handleBack}
                    className={`px-4 py-2 text-sm ${step === 1 ? "invisible" : ""}`}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                    {step === 3 ? "Create Agreement" : "Next"}
                </button>
            </motion.div>

            <div className="flex justify-center space-x-2">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === step ? "bg-primary" : "bg-gray-300"
                            }`}
                        animate={{
                            scale: i === step ? 1.2 : 1,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
} 