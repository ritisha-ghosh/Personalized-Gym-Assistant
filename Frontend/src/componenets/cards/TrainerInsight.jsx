import { Brain } from "lucide-react";
import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const TrainerInsight = ({
  title = "Trainer Insight",
  message = `You're 200 calories short of your protein goal for today.
Consider a whey shake before your Push session to maximize recovery.`,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border
        p-6
        backdrop-blur-md
        ${isDarkMode ? 'bg-teal-500/20 border-teal-500/30' : 'bg-teal-50/60 border-teal-100/60'}
      `}
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
