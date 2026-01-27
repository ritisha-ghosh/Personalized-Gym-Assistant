import React from 'react'

const ProgressRing = ({percent}) => {
const dash = 251.2;
  const offset = dash - (dash * percent) / 100;

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#eee"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#00BDC7"
        strokeWidth="8"
        fill="none"
        strokeDasharray={dash}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}

export default ProgressRing
