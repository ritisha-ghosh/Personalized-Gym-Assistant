import React from "react";
import ProgressRing from "../common/ProgressRing";

const WorkoutCard = () => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-8
        shadow-sm
        border border-slate-100
        flex flex-col md:flex-row
        items-center
        justify-between
        gap-8
        w-full
      "
    >
      {/* Left Content */}
      <div className="flex-1">
        {/* Tag */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="
              bg-pink-50
              text-pink-500
              text-[10px]
              font-black
              px-2.5 py-1
              rounded-lg
              uppercase
              tracking-widest
            "
          >
            Intense
          </span>
          <span className="text-sm font-medium text-slate-400">
            Hypertrophy Session
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-3xl font-bold text-slate-900">
          Push Day – Chest &amp; Shoulders
        </h3>

        {/* Description */}
        <p className="mb-6 max-w-xl text-slate-500 leading-relaxed">
          Bench Press, OHP, Incline Flyes, Lateral Raises.
          Focus on controlled tempo and full range of motion.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            className="
              flex items-center gap-2
              rounded-xl
              bg-pink-500
              px-8 py-3.5
              font-bold
              text-white
              shadow-lg shadow-pink-500/30
              transition-transform
              active:scale-95
            "
          >
            Start Session
          </button>

          <button
            className="
              rounded-xl
              border border-slate-100
              bg-slate-50
              px-8 py-3.5
              text-sm
              font-bold
              text-slate-900
              hover:bg-slate-100
              transition-colors
            "
          >
            View Routine
          </button>
        </div>
      </div>

      {/* Right Progress */}
      <div className="flex flex-col items-center">
        <ProgressRing percent={60} />
        <span className="mt-2 text-2xl font-bold text-slate-900">
          60%
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Complete
        </span>
      </div>
    </div>
  );
};

export default WorkoutCard;
