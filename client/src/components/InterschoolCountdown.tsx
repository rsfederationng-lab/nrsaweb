import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Timer, MapPin } from "lucide-react";

interface Phase {
  id: number;
  stateName: string;
  competitionDate: string | null;
  isActive: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// A phase runs for 7 days from competitionDate
const PHASE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getPhaseStatus(competitionDate: string | null): "tba" | "upcoming" | "ongoing" | "completed" {
  if (!competitionDate) return "tba";
  const start = new Date(competitionDate).getTime();
  const end = start + PHASE_DURATION_MS;
  const now = Date.now();
  if (now < start) return "upcoming";
  if (now >= start && now < end) return "ongoing";
  return "completed";
}

function PhaseCountdown({ phase, isNext }: { phase: Phase; isNext: boolean }) {
  const status = getPhaseStatus(phase.competitionDate);
  const targetDate = phase.competitionDate ? new Date(phase.competitionDate) : null;
  const endDate = targetDate ? new Date(targetDate.getTime() + PHASE_DURATION_MS) : null;

  // Count down to start if upcoming, count down to end if ongoing
  const countTarget = status === "ongoing" ? endDate : targetDate;

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    countTarget ? calcTimeLeft(countTarget) : null
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
  const isCompleted = status === "completed";
  const cardHighlight = isNext || isOngoing;

  return (
    <div
      className={`relative flex flex-col items-center gap-3 rounded-2xl px-6 py-5 text-center transition-all ${
        cardHighlight
          ? "bg-white text-red-700 shadow-2xl scale-105 ring-4 ring-yellow-400"
          : isCompleted
          ? "bg-white/5 text-white/50"
          : "bg-white/10 text-white"
      }`}
    >
      {/* Status badge */}
      {isOngoing && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-400 px-3 py-0.5 text-[10px] font-black tracking-widest text-green-900 uppercase shadow animate-pulse">
          🔴 Live Now
        </span>
      )}
      {isNext && !isOngoing && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-3 py-0.5 text-[10px] font-black tracking-widest text-red-800 uppercase shadow">
          Next Up
        </span>
      )}
      {isCompleted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-0.5 text-[10px] font-black tracking-widest text-white uppercase shadow">
          ✓ Completed
        </span>
      )}

      <div className={`flex items-center gap-1.5 font-bold text-sm ${
        cardHighlight ? "text-red-700" : isCompleted ? "text-white/40" : "text-yellow-300"
      }`}>
        <MapPin className="h-3.5 w-3.5" />
        {phase.stateName} Phase
      </div>

      {targetDate && (
        <p className={`text-xs ${
          cardHighlight ? "text-red-500" : isCompleted ? "text-white/30" : "text-white/70"
        }`}>
          {targetDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          {" – "}
          {endDate!.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
        </p>
      )}

      {timeLeft && !isCompleted ? (
        <>
          <p className={`text-[9px] font-bold tracking-widest uppercase ${
            isOngoing ? "text-green-600" : cardHighlight ? "text-red-400" : "text-yellow-200/70"
          }`}>
            {isOngoing ? "Ends in" : "Starts in"}
          </p>
          <div className="flex gap-3">
            {[{ l: "Days", v: timeLeft.days }, { l: "Hrs", v: timeLeft.hours }, { l: "Min", v: timeLeft.minutes }, { l: "Sec", v: timeLeft.seconds }].map(({ l, v }) => (
              <div key={l} className="flex flex-col items-center">
                <span className={`text-2xl font-black tabular-nums leading-none ${
                  cardHighlight ? "text-red-700" : "text-white"
                }`}>{pad(v)}</span>
                <span className={`text-[9px] font-semibold tracking-widest uppercase mt-0.5 ${
                  cardHighlight ? "text-red-400" : "text-yellow-200"
                }`}>{l}</span>
              </div>
            ))}
          </div>
        </>
      ) : isCompleted ? (
        <span className="text-xs text-white/30">Season phase ended</span>
      ) : (
        <span className={`text-xs ${cardHighlight ? "text-red-400" : "text-white/50"}`}>Date TBA</span>
      )}
    </div>
  );
}

export function InterschoolCountdown() {
  const { data: years = [] } = useQuery<any[]>({ queryKey: ["/api/interschool-years"] });
  const activeYear = years.find((y) => y.isActive) || years[0];

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ["/api/championship-phases", activeYear?.id],
    enabled: !!activeYear?.id,
    queryFn: async () => {
      const res = await fetch(`/api/championship-phases?yearId=${activeYear.id}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (!phases.length) return null;

  // "Next Up" = first phase that hasn't started yet
  const now = Date.now();
  const nextIndex = phases.findIndex((p) => {
    if (!p.competitionDate) return false;
    const start = new Date(p.competitionDate).getTime();
    return now < start; // strictly before start = upcoming
  });

  return (
    <div className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-800 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-center">
          <Timer className="h-5 w-5 text-yellow-300 animate-pulse" />
          <p className="text-xs font-black tracking-[0.2em] text-yellow-300 uppercase">
            Countdown to NRSA Interschool Championship {activeYear?.year}
          </p>
          <Timer className="h-5 w-5 text-yellow-300 animate-pulse" />
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {phases.map((phase, i) => (
            <PhaseCountdown key={phase.id} phase={phase} isNext={i === nextIndex} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/interschool/register"
            className="rounded-xl bg-yellow-400 px-8 py-3 text-sm font-black text-red-800 hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Register Your School Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
