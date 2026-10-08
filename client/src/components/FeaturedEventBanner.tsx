import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FeaturedBanner } from "@/types/schema";

interface Phase {
  id: number;
  stateName: string;
  competitionDate: string | null;
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

const PHASE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getPillStatus(competitionDate: string | null): "tba" | "upcoming" | "ongoing" | "completed" {
  if (!competitionDate) return "tba";
  const start = new Date(competitionDate).getTime();
  const end = start + PHASE_DURATION_MS;
  const now = Date.now();
  if (now < start) return "upcoming";
  if (now < end) return "ongoing";
  return "completed";
}

function PhasePill({ phase, isNext }: { phase: Phase; isNext: boolean }) {
  const status = getPillStatus(phase.competitionDate);
  const targetDate = phase.competitionDate ? new Date(phase.competitionDate) : null;
  const countTarget = status === "ongoing"
    ? new Date(targetDate!.getTime() + PHASE_DURATION_MS)
    : targetDate;

  const [timeLeft, setTimeLeft] = useState(
    countTarget && status !== "completed" && status !== "tba" ? calcTimeLeft(countTarget) : null
  );

  useEffect(() => {
    if (!countTarget || status === "completed" || status === "tba") return;
    setTimeLeft(calcTimeLeft(countTarget));
    const id = setInterval(() => {
      const t = calcTimeLeft(countTarget);
      setTimeLeft(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [countTarget?.getTime(), status]);

  const isOngoing = status === "ongoing";
  const highlight = isNext || isOngoing;

  return (
    <div className={`flex-1 rounded-xl px-3 py-2 text-center ${
      isOngoing ? "bg-green-400/20 ring-1 ring-green-400"
      : highlight ? "bg-yellow-400/20 ring-1 ring-yellow-400"
      : status === "completed" ? "bg-black/10 opacity-50"
      : "bg-black/20"
    }`}>
      <p className={`text-[9px] font-black tracking-widest uppercase mb-1 ${
        isOngoing ? "text-green-300" : highlight ? "text-yellow-300" : "text-white/50"
      }`}>
        {isOngoing ? "🔴 LIVE" : isNext ? "▶ Next" : ""} {phase.stateName}
      </p>
      {timeLeft ? (
        <>
          <p className="text-[8px] text-white/50 uppercase mb-0.5">{isOngoing ? "ends in" : "starts in"}</p>
          <div className="flex justify-center gap-1.5">
            {[{ l: "D", v: timeLeft.days }, { l: "H", v: timeLeft.hours }, { l: "M", v: timeLeft.minutes }, { l: "S", v: timeLeft.seconds }].map(({ l, v }) => (
              <div key={l} className="flex flex-col items-center">
                <span className="text-base font-black tabular-nums leading-none">{pad(v)}</span>
                <span className="text-[8px] text-yellow-200/70 uppercase">{l}</span>
              </div>
            ))}
          </div>
        </>
      ) : status === "completed" ? (
        <span className="text-[10px] text-green-300 font-bold">✓ Done</span>
      ) : (
        <span className="text-[10px] text-white/40">TBA</span>
      )}
    </div>
  );
}

function BannerCountdown() {
  const { data: years = [] } = useQuery<any[]>({
    queryKey: ["/api/interschool-years"],
    staleTime: 0,
  });
  const activeYear = Array.isArray(years)
    ? years.find((y: any) => y.isActive) || years[0]
    : undefined;

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ["/api/championship-phases", { yearId: activeYear?.id }],
    enabled: !!activeYear?.id,
    staleTime: 0,
  });

  const phaseList = Array.isArray(phases) ? phases : [];
  if (!phaseList.length) return null;

  const now = Date.now();
  const nextIndex = phaseList.findIndex((p) => {
    if (!p.competitionDate) return false;
    return now < new Date(p.competitionDate).getTime(); // strictly before start
  });

  return (
    <div className="mt-4">
      <p className="text-[9px] font-black tracking-widest text-yellow-300 uppercase mb-2 text-center">
        Competition Countdowns
      </p>
      <div className="flex gap-2">
        {phaseList.map((phase, i) => (
          <PhasePill key={phase.id} phase={phase} isNext={i === nextIndex} />
        ))}
      </div>
    </div>
  );
}

export const featuredEventConfig = {
  label: "REGISTRATION OPEN",
  heading: "NRSA National Interschool Championship 2026",
  subtext: "3 Zones • Delta • Ondo • Kwara — Registration Now Open",
  primaryCta: "Register Your School",
  primaryHref: "/interschool/register",
  secondaryCta: "Learn More",
  secondaryHref: "/interschool",
} as const;

const DISMISSAL_COOKIE = "nrsa_interschool_banner_dismissed";
const DISMISSAL_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function hasDismissalCookie() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${DISMISSAL_COOKIE}=`));
}

function setDismissalCookie() {
  document.cookie = `${DISMISSAL_COOKIE}=true; Max-Age=${DISMISSAL_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function FeaturedEventBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const { data: activeBanners = [] } = useQuery<FeaturedBanner[]>({
    queryKey: ["/api/featured-banners/active"],
    retry: false,
  });
  const banners = Array.isArray(activeBanners) ? activeBanners : [];
  const eligibleBanners = banners.filter((item) => {
    if (item.isEmergency) return true;
    const raw = localStorage.getItem(`nrsa_featured_banner_${item.id}`);
    const record = raw ? JSON.parse(raw) as { count?: number; dismissedAt?: number } : {};
    if (item.displayFrequency === "once") return !record.count;
    if (item.displayFrequency === "twice") return (record.count || 0) < 2;
    if (item.displayFrequency === "weekly") return !record.dismissedAt || Date.now() - record.dismissedAt >= 7 * 24 * 60 * 60 * 1000;
    return true;
  });
  const activeBanner = eligibleBanners[bannerIndex % Math.max(eligibleBanners.length, 1)];
  const databaseBanner = activeBanner || (banners.length ? banners[0] : undefined);
  const banner = databaseBanner || featuredEventConfig;
  const backgroundStyle = "backgroundStyle" in banner ? banner.backgroundStyle : "red";
  const imageUrl = databaseBanner?.imageUrl || null;
  const secondaryHref = databaseBanner ? databaseBanner.secondaryButtonLink : featuredEventConfig.secondaryHref;
  const secondaryText = databaseBanner ? databaseBanner.secondaryButtonText : featuredEventConfig.secondaryCta;
  const hasMultipleBanners = eligibleBanners.length > 1;
  const currentBannerNumber = hasMultipleBanners ? (bannerIndex % eligibleBanners.length) + 1 : 1;

  useEffect(() => {
    if (eligibleBanners.length || (!banners.length && !hasDismissalCookie())) {
      setIsVisible(true);
    }
  }, [eligibleBanners.length]);

  useEffect(() => {
    if (eligibleBanners.length < 2 || !isVisible) return;
    const id = window.setInterval(() => setBannerIndex((index) => (index + 1) % eligibleBanners.length), 7000);
    return () => window.clearInterval(id);
  }, [eligibleBanners.length, isVisible]);

  const dismiss = () => {
    if (activeBanner) {
      const key = `nrsa_featured_banner_${activeBanner.id}`;
      const raw = localStorage.getItem(key);
      const record = raw ? JSON.parse(raw) as { count?: number } : {};
      localStorage.setItem(key, JSON.stringify({ count: (record.count || 0) + 1, dismissedAt: Date.now() }));
      if (hasMultipleBanners) {
        setBannerIndex((index) => index + 1);
        return;
      }
    } else {
      setDismissalCookie();
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="featured-event-heading"
        >
          <motion.div
            className={`relative w-full max-w-2xl overflow-hidden rounded-2xl text-white shadow-2xl ${
              backgroundStyle === "green"
                ? "bg-gradient-to-br from-green-700 via-green-700 to-green-950"
                : "bg-gradient-to-br from-red-700 via-red-700 to-green-800"
            }`}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {imageUrl && (
              <>
                <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/50" />
              </>
            )}
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-black/10" />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close featured event announcement"
              className="absolute right-3 top-3 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative space-y-5 p-6 pr-14 sm:p-10 sm:pr-16">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-[0.2em] text-yellow-300 sm:text-sm">
                  {databaseBanner ? databaseBanner.badgeText : featuredEventConfig.label}
                </p>
                {hasMultipleBanners && (
                  <span className="text-[10px] font-bold tracking-widest text-white/70">
                    ANNOUNCEMENT {currentBannerNumber} OF {eligibleBanners.length}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <h2
                  id="featured-event-heading"
                  className="max-w-xl text-2xl font-extrabold leading-tight sm:text-4xl"
                >
                  {databaseBanner ? databaseBanner.title : featuredEventConfig.heading}
                </h2>
                <p className="text-sm font-medium text-white/90 sm:text-base">
                  {databaseBanner ? databaseBanner.subtitle : featuredEventConfig.subtext}
                </p>
              </div>

              {(!databaseBanner || databaseBanner.showCountdown) && <BannerCountdown />}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link
                  href={databaseBanner ? databaseBanner.primaryButtonLink : featuredEventConfig.primaryHref}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-red-700 shadow-lg transition-colors hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-700"
                >
                  {databaseBanner ? databaseBanner.primaryButtonText : featuredEventConfig.primaryCta}
                </Link>
                <Link
                  href={secondaryHref || "#"}
                  className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:bg-white/10 hover:decoration-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {secondaryText}
                </Link>
              </div>
              {hasMultipleBanners && (
                <div className="flex items-center justify-between border-t border-white/15 pt-4">
                  <button
                    type="button"
                    onClick={() => setBannerIndex((index) => (index - 1 + eligibleBanners.length) % eligibleBanners.length)}
                    className="text-xs font-semibold text-white/80 underline underline-offset-4 hover:text-white"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1.5" aria-label="Available announcements">
                    {eligibleBanners.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`View announcement ${index + 1}`}
                        onClick={() => setBannerIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === bannerIndex % eligibleBanners.length ? "w-6 bg-yellow-300" : "w-2 bg-white/40 hover:bg-white/70"}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBannerIndex((index) => (index + 1) % eligibleBanners.length)}
                    className="text-xs font-semibold text-white/80 underline underline-offset-4 hover:text-white"
                  >
                    Next announcement
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
