import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Trophy, CheckCircle2, Clock, Mail, MessageCircle, AlertCircle, ArrowRight } from "lucide-react";

// Registration form schema
const registrationSchema = z.object({
  phaseId: z.number().optional(), // Made optional - will be assigned by admin later
  yearId: z.number().optional(), // Made optional - will use active season
  schoolName: z.string().min(3, "School name is required"),
  state: z.string().min(2, "State is required"),
  schoolAddress: z.string().min(10, "Full address is required"),
  principalName: z.string().min(3, "Principal name is required"),
  coordinatorName: z.string().min(3, "Coordinator name is required"),
  coordinatorPhone: z.string().min(7, "Valid phone number required"),
  whatsappNumber: z.string().min(7, "Valid WhatsApp number required"),
  email: z.string().email("Valid email required"),
  athleteCount: z.coerce.number().int().positive("Must be at least 1"),
  category: z.enum(["junior", "senior", "both"]),
  eventsCategories: z.string().optional(),
  logoUrl: z.string().optional(),
  additionalNotes: z.string().optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must give consent to proceed",
  }),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function InterschoolRegister() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredSchoolName, setRegisteredSchoolName] = useState("");

  // Fetch active phases
  const { data: phases = [] } = useQuery<any[]>({
    queryKey: ["/api/championship-phases"],
    enabled: false, // We'll fetch based on selected year
  });

  // Fetch active season
  const { data: seasons = [] } = useQuery<any[]>({
    queryKey: ["/api/interschool-years"],
  });

  // Fetch site settings for the disciplines YouTube link
  const { data: siteSettings = [] } = useQuery<any[]>({
    queryKey: ["/api/site-settings"],
  });
  const disciplinesYoutubeUrl = siteSettings.find(
    (s: any) => s.key === "interschool_disciplines_youtube_url"
  )?.value || "";

  const activeSeason = seasons.find((s) => s.isActive) || seasons[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      category: "both",
      consentGiven: false,
    },
  });

  // Set yearId when seasons are loaded
  React.useEffect(() => {
    if (activeSeason?.id) {
      setValue("yearId", activeSeason.id);
    }
  }, [activeSeason, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const res = await apiRequest("POST", "/api/school-registrations", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      setRegisteredSchoolName(data?.schoolName || watchedValues.schoolName || "Your school");
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    // Strip phaseId and yearId — the server auto-assigns both from the state field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phaseId: _phaseId, yearId: _yearId, ...rest } = data;

    // Build a clean payload — remove any undefined/null keys so JSON.stringify
    // doesn't accidentally pass them through
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null && value !== '') {
        payload[key] = value;
      }
    }

    registerMutation.mutate(payload as any);
  };

  const nextStep = async () => {
    // Step 5 (Readiness Check) — block unless all 6 questions answered
    if (currentStep === 5) {
      try {
        const answers = watchedValues.eventsCategories
          ? JSON.parse(watchedValues.eventsCategories)
          : {};
        const required = ["knowsYCourt", "knows9Disciplines", "hasTrainedAthletes", "hasJudge", "canTravelToVenue", "attendedBefore"];
        const allAnswered = required.every((k) => answers[k] === "yes" || answers[k] === "no");
        if (!allAnswered) {
          toast({
            title: "Please answer all questions",
            description: "You must answer Yes or No for every question before proceeding.",
            variant: "destructive",
          });
          return;
        }
      } catch {
        toast({
          title: "Please answer all questions",
          description: "You must answer Yes or No for every question before proceeding.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      return;
    }

    const fieldsToValidate = stepFields[currentStep];
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const watchedValues = watch();

  // Define steps
  const steps = [
    { title: "Select State", description: "Choose your state" },
    { title: "School Information", description: "Tell us about your school" },
    { title: "Contact Person", description: "Principal and coordinator details" },
    { title: "Contact Information", description: "Email and phone numbers" },
    { title: "Participation Details", description: "Athletes and categories" },
    { title: "Readiness Check", description: "A few quick questions about your school" },
    { title: "Consent & Submit", description: "Review and confirm" },
  ];

  const stepFields = [
    ["state"],
    ["schoolName", "schoolAddress"],
    ["principalName", "coordinatorName"],
    ["email", "coordinatorPhone", "whatsappNumber"],
    ["athleteCount", "category"],
    ["eventsCategories", "additionalNotes"],
    ["consentGiven"],
  ];

  const nigerianStates = [
    "Delta",
    "Ondo", 
    "Kwara"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
      <SEO
        title="Interschool Championship Registration"
        description="Register your school for the NRSA Interschool Rope Skipping Championship. Open to junior and senior students from state member schools across Nigeria."
        path="/interschool/register"
        breadcrumbs={[
          { name: "Interschool", url: "/interschool" },
          { name: "Register", url: "/interschool/register" },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interschool Championship Registration
          </h1>
          <p className="text-gray-600">
            Register your school for the NRSA 2026 National Championship
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 0: Select State */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <Label>Select Your State *</Label>
                  <select
                    {...register("state")}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">-- Choose State --</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              )}

              {/* Step 1: School Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      {...register("schoolName")}
                      placeholder="Enter full school name"
                    />
                    {errors.schoolName && (
                      <p className="text-sm text-red-600">{errors.schoolName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="schoolAddress">School Address *</Label>
                    <Textarea
                      id="schoolAddress"
                      {...register("schoolAddress")}
                      placeholder="Full address including city and state"
                      rows={3}
                    />
                    {errors.schoolAddress && (
                      <p className="text-sm text-red-600">{errors.schoolAddress.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Contact Persons */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="principalName">Principal/Head Teacher Name *</Label>
                    <Input
                      id="principalName"
                      {...register("principalName")}
                      placeholder="Full name of school principal"
                    />
                    {errors.principalName && (
                      <p className="text-sm text-red-600">{errors.principalName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="coordinatorName">Games Master/Coordinator Name *</Label>
                    <Input
                      id="coordinatorName"
                      {...register("coordinatorName")}
                      placeholder="Person coordinating this registration"
                    />
                    {errors.coordinatorName && (
                      <p className="text-sm text-red-600">{errors.coordinatorName.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="school@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="coordinatorPhone">Coordinator Phone Number *</Label>
                    <Input
                      id="coordinatorPhone"
                      {...register("coordinatorPhone")}
                      placeholder="080XXXXXXXX"
                    />
                    {errors.coordinatorPhone && (
                      <p className="text-sm text-red-600">{errors.coordinatorPhone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      {...register("whatsappNumber")}
                      placeholder="080XXXXXXXX"
                    />
                    {errors.whatsappNumber && (
                      <p className="text-sm text-red-600">{errors.whatsappNumber.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Participation Details */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="athleteCount">Number of Athletes *</Label>
                    <Input
                      id="athleteCount"
                      type="number"
                      {...register("athleteCount")}
                      placeholder="e.g., 15"
                      min="1"
                    />
                    {errors.athleteCount && (
                      <p className="text-sm text-red-600">{errors.athleteCount.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <RadioGroup
                      value={watchedValues.category}
                      onValueChange={(value) => setValue("category", value as any)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="junior" id="junior" />
                        <Label htmlFor="junior" className="font-normal">
                          Junior (Ages 6-12)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="senior" id="senior" />
                        <Label htmlFor="senior" className="font-normal">
                          Senior (Ages 13-18)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="font-normal">
                          Both Junior and Senior
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.category && (
                      <p className="text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Knowledge Check — Yes/No Question Bank */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-500">
                    Please answer each question honestly — this helps NRSA understand your school's readiness.
                  </p>

                  {[
                    {
                      key: "knowsYCourt",
                      question: "Does your school understand the Y-Court competition concept?",
                      extra: null,
                    },
                    {
                      key: "knows9Disciplines",
                      question: "Are your athletes familiar with the 9 competition disciplines (SRSS, SRSE, SROF, SRCC, SRDU, SRSR, DDSR, DSS, LMS)?",
                      extra: null,
                    },
                    {
                      key: "hasTrainedAthletes",
                      question: "Do you know that all 9 disciplines are accessible and can be learned on YouTube?",
                      extra: disciplinesYoutubeUrl ? (
                        <a
                          href={disciplinesYoutubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 underline mt-1"
                        >
                          ▶ Watch all 9 discipline videos here
                        </a>
                      ) : null,
                    },
                    {
                      key: "hasJudge",
                      question: "Does your school have a teacher or coach who can serve as an on-site judge?",
                      extra: null,
                    },
                    {
                      key: "canTravelToVenue",
                      question: "Can your school confirm that athletes will physically be present at the venue on competition day?",
                      extra: null,
                    },
                    {
                      key: "attendedBefore",
                      question: "Has your school participated in any previous NRSA competition or event?",
                      extra: null,
                    },
                  ].map(({ key, question, extra }) => {
                    const current = (() => {
                      try {
                        const val = watchedValues.eventsCategories;
                        return val ? JSON.parse(val)[key] : undefined;
                      } catch { return undefined; }
                    })();

                    const setAnswer = (answer: "yes" | "no") => {
                      try {
                        const existing = watchedValues.eventsCategories
                          ? JSON.parse(watchedValues.eventsCategories)
                          : {};
                        setValue("eventsCategories", JSON.stringify({ ...existing, [key]: answer }));
                      } catch {
                        setValue("eventsCategories", JSON.stringify({ [key]: answer }));
                      }
                    };

                    return (
                      <div key={key} className="border rounded-lg p-4 bg-white space-y-3">
                        <p className="text-sm font-medium text-gray-800">{question}</p>
                        {extra && <div>{extra}</div>}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setAnswer("yes")}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold border-2 transition-all ${
                              current === "yes"
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400"
                            }`}
                          >
                            ✓ Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setAnswer("no")}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold border-2 transition-all ${
                              current === "no"
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
                            }`}
                          >
                            ✗ No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 6: Consent & Submit */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">Review Your Information</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <p><strong>School:</strong> {watchedValues.schoolName}</p>
                      <p><strong>State:</strong> {watchedValues.state}</p>
                      <p><strong>Address:</strong> {watchedValues.schoolAddress}</p>
                      <p><strong>Principal:</strong> {watchedValues.principalName}</p>
                      <p><strong>Coordinator:</strong> {watchedValues.coordinatorName}</p>
                      <p><strong>Email:</strong> {watchedValues.email}</p>
                      <p><strong>Phone:</strong> {watchedValues.coordinatorPhone}</p>
                      <p><strong>WhatsApp:</strong> {watchedValues.whatsappNumber}</p>
                      <p><strong>Athletes:</strong> {watchedValues.athleteCount}</p>
                      <p><strong>Category:</strong> {watchedValues.category}</p>
                    </div>

                    {/* Readiness answers summary */}
                    {(() => {
                      try {
                        const answers = watchedValues.eventsCategories
                          ? JSON.parse(watchedValues.eventsCategories)
                          : {};
                        const labels: Record<string, string> = {
                          knowsYCourt: "Understands Y-Court concept",
                          knows9Disciplines: "Knows all 9 disciplines",
                          hasTrainedAthletes: "Athletes to compete in all 9 disciplines",
                          hasJudge: "Has an on-site judge/coach",
                          canTravelToVenue: "Can attend venue on competition day",
                          attendedBefore: "Participated in previous NRSA event",
                        };
                        return (
                          <div className="mt-3 pt-3 border-t">
                            <p className="font-semibold text-sm mb-2">Readiness Check</p>
                            <div className="grid grid-cols-1 gap-1">
                              {Object.entries(labels).map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{label}</span>
                                  <span className={`font-semibold ${answers[key] === "yes" ? "text-emerald-600" : "text-red-500"}`}>
                                    {answers[key] === "yes" ? "Yes" : answers[key] === "no" ? "No" : "—"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      } catch { return null; }
                    })()}
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={watchedValues.consentGiven}
                      onCheckedChange={(checked) => setValue("consentGiven", checked as boolean)}
                    />
                    <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                      I confirm that all information provided is accurate and I have the authority
                      to register this school. I understand that NRSA will review this submission
                      and communicate the selection results via email and WhatsApp.
                    </Label>
                  </div>
                  {errors.consentGiven && (
                    <p className="text-sm text-red-600">{errors.consentGiven.message}</p>
                  )}
                </div>
              )}

              {/* Navigation Buttons - Inside Form */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending || !watchedValues.consentGiven}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {registerMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact us at{" "}
          <a href="mailto:rsfederationng@gmail.com" className="text-emerald-600 hover:underline">
            rsfederationng@gmail.com
          </a>
        </p>
      </div>

      {/* ── Success Modal ─────────────────────────────────────────── */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Green header band */}
            <div className="bg-emerald-600 px-8 py-6 text-white text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-3">
                <CheckCircle2 className="h-9 w-9 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Registration Received!</h2>
              <p className="text-emerald-100 text-sm mt-1">
                {registeredSchoolName} has been successfully submitted
              </p>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-5">
              {/* Important notice */}
              <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Please note:</strong> Submitting this form does <strong>not</strong> guarantee
                  participation. NRSA will review all submissions and select schools based on
                  available slots, eligibility, and state representation.
                </p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">What happens next:</p>
                <ol className="space-y-3">
                  {[
                    {
                      icon: <Mail className="h-4 w-4 text-emerald-600" />,
                      title: "Confirmation email sent",
                      detail: "Check your inbox (and spam) for a confirmation from NRSA.",
                    },
                    {
                      icon: <Clock className="h-4 w-4 text-emerald-600" />,
                      title: "Review period",
                      detail: "NRSA reviews all registrations from your state and selects participating schools.",
                    },
                    {
                      icon: <MessageCircle className="h-4 w-4 text-emerald-600" />,
                      title: "Selection notification",
                      detail: "Selected schools are contacted via email and WhatsApp with further instructions.",
                    },
                    {
                      icon: <Trophy className="h-4 w-4 text-emerald-600" />,
                      title: "Championship day",
                      detail: "Selected schools receive full event details including venue, schedule, and rules.",
                    },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 shrink-0 mt-0.5">
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contact line */}
              <p className="text-xs text-center text-gray-400">
                Questions? Email us at{" "}
                <a href="mailto:rsfederationng@gmail.com" className="text-emerald-600 underline">
                  rsfederationng@gmail.com
                </a>
              </p>
            </div>

            {/* Footer button */}
            <div className="px-8 pb-6">
              <Button
                onClick={() => navigate("/interschool")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
              >
                Back to Interschool Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
