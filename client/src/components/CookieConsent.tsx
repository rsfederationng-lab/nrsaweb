import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Link } from "wouter";

const COOKIE_KEY = "nrsa_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl"
        >
          <div className="rounded-2xl bg-primary text-primary-foreground shadow-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <Cookie className="h-6 w-6 shrink-0 text-yellow-300" />
            <p className="flex-1 text-sm text-primary-foreground/90">
              We use cookies to improve your experience on our website. By continuing, you agree to our{" "}
              <Link href="/privacy-policy" className="underline font-semibold text-yellow-300 hover:text-yellow-200">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={decline}
                className="rounded-lg border border-primary-foreground/40 px-4 py-2 text-sm font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-950 hover:bg-yellow-300 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
