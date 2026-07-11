import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../componenets/layout/Layout'; 
import { Play, BarChart2, Filter } from 'lucide-react';
import { DarkModeContext } from '../context/DarkModeContext';

const Tutorial = () => {
  const [activeTab, setActiveTab] = useState('All Tutorials');
  const { isDarkMode } = useContext(DarkModeContext);
  
  // 1. Get search query from URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- Categories Configuration ---
  const categories = [
    "All Tutorials",
    "Chest",
    "Back",
    "Legs",
    "Arms",
    "Shoulders",
    "Core",
    "Cardio",
    "Yoga"
  ];

  // --- Mock Data for 118 Tutorials (Matched topic to specific valid video links) ---
  const tutorials = [
    {
      id: 1,
      title: "Ab Wheel Rollout",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=rqi8CAusCqM" // Ab wheel specific
    },
    {
      id: 2,
      title: "Aqua Aerobics",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=8M2mK2aC4Xg" // Aqua aerobics
    },
    {
      id: 3,
      title: "Arnold Press",
      category: "Shoulders",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=6Z15_WdXmVw" // Arnold press
    },
    {
      id: 4,
      title: "Band Pull-Apart",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=fo3jbQ4-qkc" // Band pull apart
    },
    {
      id: 5,
      title: "Barbell Bench Press",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=rT7DgCr-3pg" // Bench press
    },
    {
      id: 6,
      title: "Barbell Bicep Curl",
      category: "Arms",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=kwG2ipFRgfo" // Barbell curl
    },
    {
      id: 7,
      title: "Barbell Squat",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=gcNh17Ckjgg" // Squat
    },
    {
      id: 8,
      title: "Battle Ropes",
      category: "Cardio",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=Qzzm_W3yHjQ" // Battle ropes
    },
    {
      id: 9,
      title: "Bent-Over Barbell Row",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=G8l_8chR5BE" // Barbell row
    },
    {
      id: 10,
      title: "Bicycle Crunches",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=9FGilxCbdz8" // Bicycle crunch
    },
    {
      id: 11,
      title: "Bird Dog",
      category: "Yoga",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=wiF5FOUy__Y" // Bird dog
    },
    {
      id: 12,
      title: "Box Jumps",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=52r_Ul5k03g" // Box jumps
    },
    {
      id: 13,
      title: "Breathing Exercises",
      category: "Yoga",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=8VwFS5OEYeo" // Breathing
    },
    {
      id: 14,
      title: "Brisk Walking 30min",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=enYITYwvPAQ" // Walking indoor
    },
    {
      id: 15,
      title: "Bulgarian Split Squat",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=2C-uNgKwPLE" // Bulgarian split
    },
    {
      id: 16,
      title: "Burpees",
      category: "Cardio",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=TU8QYVW0gDU" // Burpees specific
    },
    {
      id: 17,
      title: "Cable Bicep Curl",
      category: "Arms",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=NFzTWpysU8E" // Cable curl
    },
    {
      id: 18,
      title: "Cable Chest Fly",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=Iwe6AmxVf7o" // Cable fly
    },
    {
      id: 19,
      title: "Cable Crunch",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=LLcgCwAQXbk" // Cable crunch
    },
    {
      id: 20,
      title: "Cable Kickback",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=NLJkE44_1aQ" // Glute kickback
    },
    {
      id: 21,
      title: "Cable Lateral Raise",
      category: "Shoulders",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=lQq_kM9eI8o" // Cable lateral
    },
    {
      id: 22,
      title: "Calf Raises",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=-M4-G8p8fmc" // Calf raise
    },
    {
      id: 23,
      title: "Chest-Supported Row",
      category: "Chest",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=0UBRfiNREJ0" // Chest support row
    },
    {
      id: 24,
      title: "Close-Grip Bench Press",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=nEF0bv2FW94" // Close grip bench
    },
    {
      id: 25,
      title: "Concentration Curl",
      category: "Arms",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=0AUGkcgD4g0" // Concentration curl
    },
    {
      id: 26,
      title: "Crunches",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" // Crunches
    },
    {
      id: 27,
      title: "Cycling Sprint",
      category: "Cardio",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=p4M1Fv-0-Ew" // Cycling sprint
    },
    {
      id: 28,
      title: "Dead Bug",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=4XkHbBaXEU" // Dead bug
    },
    {
      id: 29,
      title: "Decline Push-Ups",
      category: "Chest",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=SKPab2YC8BE" // Decline pushups
    },
    {
      id: 30,
      title: "Decline Sit-Ups",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=S01Ztyy0W5g" // Decline situp
    },
    {
      id: 31,
      title: "Diamond Push-Ups",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=J0DnG1_S92I" // Diamond pushup
    },
    {
      id: 32,
      title: "Dips",
      category: "Chest",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=2z8JmcrW-As" // Dips
    },
    {
      id: 33,
      title: "Donkey Kicks",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=SJ1XBPjumjA" // Donkey kicks
    },
    {
      id: 34,
      title: "Dragon Flag",
      category: "Core",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=vJ0hTusM2iM" // Dragon flag
    },
    {
      id: 35,
      title: "Dumbbell Chest Press",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=YQ2s_Y7g5Qk" // Db chest press
    },
    {
      id: 36,
      title: "Dumbbell Lateral Raise",
      category: "Shoulders",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=WJm9ZZCQBbE" // Db lateral raise
    },
    {
      id: 37,
      title: "Dumbbell Row",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=pYcpY20QaE8" // Db row
    },
    {
      id: 38,
      title: "EZ Bar Curl",
      category: "Arms",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=hwjY_pA4u24" // EZ bar curl
    },
    {
      id: 39,
      title: "Elliptical Trainer 20min",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=1TjK6oQYlOQ" // Elliptical workout
    },
    {
      id: 40,
      title: "Face Pulls",
      category: "Back",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=rep-qVOkqgk" // Face pulls
    },
    {
      id: 41,
      title: "Flutter Kicks",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=ANVdMDNapeI" // Flutter kicks
    },
    {
      id: 42,
      title: "Front Raise",
      category: "Shoulders",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=-t7fuZ0KhDA" // Front raise
    },
    {
      id: 43,
      title: "Gentle Yoga",
      category: "Yoga",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=sTANio_2E0Q" // Gentle yoga
    },
    {
      id: 44,
      title: "Glute Bridge",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=8bbE64NuDTU" // Glute bridge
    },
    {
      id: 45,
      title: "Goblet Squat",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=MeIiIdhgPgl" // Goblet squat
    },
    {
      id: 46,
      title: "HIIT Sprints",
      category: "Cardio",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=xfYJEAQ7qbo" // Sprints
    },
    {
      id: 47,
      title: "Hack Squat",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=0tn5K9NlCfo" // Hack squat
    },
    {
      id: 48,
      title: "Hammer Curl",
      category: "Arms",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=zC3nLlEvin4" // Hammer curl
    },
    {
      id: 49,
      title: "Hanging Knee Raise",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=RD_z4hMka1M" // Hanging knee raise
    },
    {
      id: 50,
      title: "High Knees",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=ZNDnFTtOoqw" // High knees
    },
    {
      id: 51,
      title: "Hip Abduction Machine",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=GkE2-aHk8gM" // Hip abduction
    },
    {
      id: 52,
      title: "Hip Thrust",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=Zp26q4BY5CE" // Hip thrust
    },
    {
      id: 53,
      title: "Hollow Body Hold",
      category: "Core",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=LlDNef_ZtsU" // Hollow body hold
    },
    {
      id: 54,
      title: "Incline Dumbbell Fly",
      category: "Chest",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=bDaJL_MbkKQ" // Incline fly
    },
    {
      id: 55,
      title: "Incline Dumbbell Press",
      category: "Chest",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8" // Incline press
    },
    {
      id: 56,
      title: "Incline Dumbbell Row",
      category: "Back",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=tLZjsGEkXXw" // Incline db row
    },
    {
      id: 57,
      title: "Inner Thigh Machine",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=2e6i-x-m1G0" // Inner thigh
    },
    {
      id: 58,
      title: "Jump Rope 10min",
      category: "Cardio",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=FJmRQ5iTXCE" // Jump rope
    },
    {
      id: 59,
      title: "Lat Pulldown",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc" // Lat pulldown
    },
    {
      id: 60,
      title: "Lateral Band Walk",
      category: "Cardio",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=5zCZNMEk0E0" // Lateral band walk
    },
    {
      id: 61,
      title: "Leg Curl",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=F488k67BTNo" // Leg curl
    },
    {
      id: 62,
      title: "Leg Extension",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=YyvSfVjQeL0" // Leg extension
    },
    {
      id: 63,
      title: "Leg Press",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=IZxyjW7OSvc" // Leg press
    },
    {
      id: 64,
      title: "Leg Raises",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=l4kQd9eFSBc" // Leg raises
    },
    {
      id: 65,
      title: "Light Swimming",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=pFN2n7CRqhw" // Swimming
    },
    {
      id: 66,
      title: "Low-Impact Aerobics",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=50kH47ZztHs" // Low impact aerobics
    },
    {
      id: 67,
      title: "Lying Glute Bridge",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=8bbE64NuDTU" // Lying glute bridge
    },
    {
      id: 68,
      title: "Lying Hip Abduction",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=A2P3iRdoFbw" // Hip abduction
    },
    {
      id: 69,
      title: "Lying Quad Stretch",
      category: "Yoga",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=n-d1k10tQAE" // Quad stretch
    },
    {
      id: 70,
      title: "Machine Chest Press",
      category: "Chest",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=xUm0BiZCWlQ" // Machine chest press
    },
    {
      id: 71,
      title: "Machine Row",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=GZbfZ033f74" // Machine row
    },
    {
      id: 72,
      title: "Mountain Climbers",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=nmwgirgXLYM" // Mountain climbers
    },
    {
      id: 73,
      title: "Nordic Walking",
      category: "Cardio",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=T_E5ZpY_sGE" // Nordic walking
    },
    {
      id: 74,
      title: "Outer Thigh Machine",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=2e6i-x-m1G0" // Outer thigh machine
    },
    {
      id: 75,
      title: "Overhead Shoulder Press",
      category: "Shoulders",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=qEwKCR5jcSY" // Overhead press
    },
    {
      id: 76,
      title: "Pallof Press",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=AH_QZLm_0-s" // Pallof press
    },
    {
      id: 77,
      title: "Plank",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=pSHjTRCQxIw" // Plank
    },
    {
      id: 78,
      title: "Preacher Curl",
      category: "Arms",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=fIWP-FRFNU0" // Preacher curl
    },
    {
      id: 79,
      title: "Pull-Ups",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=eGo4IYbUHxs" // Pullups
    },
    {
      id: 80,
      title: "Push-Ups",
      category: "Chest",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=IODxNxXPW6o" // Pushups
    },
    {
      id: 81,
      title: "Rear Delt Fly",
      category: "Shoulders",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=0GjzEFOYgJk" // Rear delt fly
    },
    {
      id: 82,
      title: "Resistance Band Rows",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=uC0_5rO7P0k" // Band rows
    },
    {
      id: 83,
      title: "Reverse Crunch",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=gT83bO6a3O4" // Reverse crunch
    },
    {
      id: 84,
      title: "Reverse Fly",
      category: "Shoulders",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=9520DZiaZFA" // Reverse fly
    },
    {
      id: 85,
      title: "Romanian Deadlift",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=JCXUYuzwNrM" // RDL
    },
    {
      id: 86,
      title: "Rowing Machine 15min",
      category: "Back",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=oXjV_TfRk4Y" // Rowing
    },
    {
      id: 87,
      title: "Russian Twists",
      category: "Core",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=wkD8rjkodUI" // Russian twist
    },
    {
      id: 88,
      title: "Seated Arnold Press",
      category: "Shoulders",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=6Z15_WdXmVw" // Seated arnold
    },
    {
      id: 89,
      title: "Seated Bicep Curl",
      category: "Arms",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=mEJOE2oRzO0" // Seated bicep curl
    },
    {
      id: 90,
      title: "Seated Cable Row",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=GZbfZ033f74" // Seated cable row
    },
    {
      id: 91,
      title: "Seated Calf Raise",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=JbyjNymZOt0" // Seated calf raise
    },
    {
      id: 92,
      title: "Seated Dumbbell Press",
      category: "Shoulders",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=qEwKCR5jcSY" // Seated db press
    },
    {
      id: 93,
      title: "Seated Face Pulls",
      category: "Back",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=rep-qVOkqgk" // Face pulls
    },
    {
      id: 94,
      title: "Seated Hip Flexor Stretch",
      category: "Legs",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=v7AYKMP6rOE" // Hip stretch
    },
    {
      id: 95,
      title: "Seated Lat Pulldown",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc" // Lat pulldown
    },
    {
      id: 96,
      title: "Seated Leg Curl",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=F488k67BTNo" // Leg curl
    },
    {
      id: 97,
      title: "Seated Leg Extension",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=YyvSfVjQeL0" // Leg extension
    },
    {
      id: 98,
      title: "Seated Shoulder Press",
      category: "Shoulders",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=qEwKCR5jcSY" // Shoulder press
    },
    {
      id: 99,
      title: "Seated Tricep Extension",
      category: "Arms",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=nRiJVZDpdL0" // Tricep extension
    },
    {
      id: 100,
      title: "Side Plank",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=NXr4Fw8q60o" // Side plank
    },
    {
      id: 101,
      title: "Skull Crushers",
      category: "Arms",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=d_KZxkY_0cM" // Skull crushers
    },
    {
      id: 102,
      title: "Slow Jogging 15min",
      category: "Cardio",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=cu0Cc5bsn7A" // Jogging/Cardio
    },
    {
      id: 103,
      title: "Stair Climbing",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=ml6cT4AZdqI" // Stair/Cardio
    },
    {
      id: 104,
      title: "Stationary Cycling 20min",
      category: "Cardio",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=p4M1Fv-0-Ew" // Cycling
    },
    {
      id: 105,
      title: "Step-Ups",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=9ZPCOE6Tz1I" // Step ups
    },
    {
      id: 106,
      title: "Stretching Routine",
      category: "Yoga",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=L_xrDAtykMI" // Stretching
    },
    {
      id: 107,
      title: "Sumo Deadlift",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=op9kVnSso6Q" // Sumo deadlift
    },
    {
      id: 108,
      title: "Supine Hamstring Stretch",
      category: "Yoga",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=v7AYKMP6rOE" // Hamstring stretch
    },
    {
      id: 109,
      title: "T-Bar Row",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=jDzgOA8bJ2w" // T bar row
    },
    {
      id: 110,
      title: "Treadmill Running 20min",
      category: "Cardio",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=enYITYwvPAQ" // Treadmill
    },
    {
      id: 111,
      title: "Tricep Overhead Extension",
      category: "Arms",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=nRiJVZDpdL0" // Tricep extension
    },
    {
      id: 112,
      title: "Tricep Pushdown",
      category: "Arms",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=2-LAMcpzODU" // Tricep pushdown
    },
    {
      id: 113,
      title: "V-Ups",
      category: "Core",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=7UVcsjwJPEo" // V ups
    },
    {
      id: 114,
      title: "Walking Lunges",
      category: "Legs",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=L8fvypPrzzs" // Walking lunges
    },
    {
      id: 115,
      title: "Wall Sit",
      category: "Legs",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=y-wV4Venusw" // Wall sit
    },
    {
      id: 116,
      title: "Wide-Grip Lat Pulldown",
      category: "Back",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc" // Wide grip pulldown
    },
    {
      id: 117,
      title: "Wood Chops",
      category: "Core",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true,
      youtubeLink: "https://www.youtube.com/watch?v=p4M1Fv-0-Ew" // Wood chops
    },
    {
      id: 118,
      title: "Yoga 30min",
      category: "Yoga",
      level: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1526506114881-36b1d4dc55ab?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false,
      youtubeLink: "https://www.youtube.com/watch?v=v7AYKMP6rOE" // Yoga
    }
  ];

  // --- 2. Smart Auto-Switch Logic ---
  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      const matchedCategory = categories.find(cat => 
        cat.toLowerCase().includes(lowerQuery) || lowerQuery.includes(cat.toLowerCase())
      );

      if (matchedCategory && matchedCategory !== 'All Tutorials') {
        if (activeTab !== matchedCategory) setActiveTab(matchedCategory);
        return; 
      }

      const matchedVideo = tutorials.find(t => 
        t.title.toLowerCase().includes(lowerQuery)
      );

      if (matchedVideo) {
        if (activeTab !== matchedVideo.category) setActiveTab(matchedVideo.category);
      }
    }
  }, [searchQuery, activeTab]); 

  // --- 3. Filter Logic ---
  const filteredTutorials = tutorials.filter(t => {
    const matchesCategory = activeTab === 'All Tutorials' || t.category === activeTab;
    
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
        `}
      </style>

      {/* Wrapper to manage width and padding */}
      <div className="text-slate-900 w-full max-w-[1400px] px-4 mx-auto space-y-8 pb-10" style={{ fontFamily: "'Libre Baskerville', serif" }}>
        
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Master Your Form</h1>
          <p className="text-slate-500 font-medium">High-quality guides designed to help you reach your peak potential.</p>
          
          {searchQuery && (
             <p className="text-sm font-bold text-[#df20af] mt-2 animate-pulse transition-all">
               Searching for "{searchQuery}"... <span className="text-slate-400 font-normal">Found in {activeTab}</span>
             </p>
          )}
        </div>

        {/* --- Filter Tabs (Scrollable) --- */}
        <div className="flex gap-3 overflow-x-auto py-2 pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                activeTab === cat
                  ? 'bg-[#df20af] text-white shadow-lg shadow-[#df20af]/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Video Grid (5 columns on large screens) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTutorials.map((video) => (
            <div 
              key={video.id} 
              onClick={() => window.open(video.youtubeLink, '_blank', 'noopener,noreferrer')} 
              className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay & Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                    <Play className="fill-white text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-1 pb-1 flex flex-col justify-between flex-grow">
                <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-[#df20af] transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                
                <div className="flex items-center justify-start border-t border-slate-100 pt-3 mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                    <BarChart2 size={12} className={`
                      ${video.level === 'Beginner' ? 'text-teal-400' : ''}
                      ${video.level === 'Intermediate' ? 'text-orange-400' : ''}
                      ${video.level === 'Advanced' ? 'text-red-400' : ''}
                    `} />
                    {video.level}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Empty State --- */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tutorials found</h3>
            <p className="text-slate-500 mt-2">
              {searchQuery 
                ? `No results for "${searchQuery}" in ${activeTab}`
                : "Try selecting a different category."}
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Tutorial;