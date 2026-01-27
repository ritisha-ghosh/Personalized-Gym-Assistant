import { Brain } from "lucide-react";
import React from "react";

const TrainerInsight = ({
  title = "Trainer Insight",
  message = `You're 200 calories short of your protein goal for today.
Consider a whey shake before your Push session to maximize recovery.`,
}) => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        bg-teal-50
        border border-teal-100
        p-6
      "
    >
      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div
          className="
            bg-teal-500
            p-2.5
            rounded-xl
            text-white
            shadow-lg shadow-teal-500/30
          "
        >
          <span className="material-symbols-outlined text-xl">
            <Brain />
          </span>
        </div>

        {/* Text */}
        <div>
          <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-teal-600">
            {title}
          </h4>
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            {message}
          </p>
        </div>
      </div>

      {/* Glow */}
      <div
        className="
          pointer-events-none
          absolute -bottom-8 -right-8
          h-24 w-24
          rounded-full
          bg-teal-300/30
          blur-3xl
        "
      />
    </div>
  );
};

export default TrainerInsight;
