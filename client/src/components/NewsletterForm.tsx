import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export function NewsletterForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { error } = await supabase
                .from("subscribers")
                .insert([{ email: values.email }]);

            if (error) throw error;

            toast({
                title: "Subscribed!",
                description: "Thank you for subscribing to our newsletter.",
                variant: "default",
                className: "bg-green-600 text-white border-none",
            });

            form.reset();
        } catch (error) {
            console.error("Error subscribing:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    placeholder="Your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                    {...form.register("email")}
                    data-testid="input-newsletter-email"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#009739] hover:bg-[#007a2e] text-white whitespace-nowrap"
                    data-testid="button-subscribe"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Subscribe"
                    )}
                </Button>
            </div>
            {form.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">
                    {form.formState.errors.email.message}
                </p>
            )}
        </form>
    );
}
