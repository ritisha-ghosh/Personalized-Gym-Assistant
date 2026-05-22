const axios = require('axios');
const WorkoutPlan = require('../models/WorkoutPlan');
const UserDietPlan = require('../models/UserDietPlan');
const dietCalculator = require('./dietCalculator');
const { generateDietPlan } = require('./dietPlanCalculator');

const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:5001';

const experienceMap = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

const goalMap = {
  'fat loss': 1,
  'muscle gain': 2,
  'maintenance': 3
};

const normalizeGoal = (goal) => {
  if (!goal) return 'maintenance';
  const lower = goal.toLowerCase();
  if (lower.includes('weight')) return 'fat loss';
  if (lower.includes('muscle')) return 'muscle gain';
  return 'maintenance';
};

const normalizeGoalLabel = (goal) => {
  const normalized = normalizeGoal(goal);
  if (normalized === 'fat loss') return 'Weight Loss';
  if (normalized === 'muscle gain') return 'Muscle Gain';
  return 'Maintenance';
};

const normalizeExperience = (experience) => {
  if (!experience) return 'intermediate';
  return experience.toLowerCase();
};

const normalizeExperienceLabel = (experience) => {
  const normalized = normalizeExperience(experience);
  if (normalized === 'beginner') return 'Beginner';
  if (normalized === 'advanced') return 'Advanced';
  return 'Intermediate';
};

const normalizeActivityLevel = (activityLevel) => {
  const normalized = (activityLevel || 'moderate').toLowerCase().replace(/\s+/g, '_');
  if (['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(normalized)) {
    return normalized;
  }
  if (normalized.includes('very')) return 'very_active';
  return 'moderate';
};

const normalizeDietType = (dietType) => {
  if (!dietType) return 'vegetarian';
  const d = String(dietType).toLowerCase().trim();
  if (d.includes('vegan')) return 'vegan';
  if (d.includes('non') || d.includes('meat') || d.includes('omnivore') || d.includes('non-veg') || d.includes('nonveget')) return 'non-vegetarian';
  if (d.includes('veget')) return 'vegetarian';
  return 'vegetarian';
};

const getMondayStart = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const diff = (day + 6) % 7; // Monday = 0, Sunday = 6
  result.setDate(result.getDate() - diff);
  return result;
};

const getMealDescription = (food, preferences, dietType) => {
  let updated = food;
  const type = normalizeDietType(dietType);

  // Dietary substitutions
  if (preferences.lactoseFree || type === 'vegan') {
    updated = updated.replace(/Greek yogurt/gi, 'coconut yogurt');
    updated = updated.replace(/cottage cheese/gi, 'tofu scramble');
    updated = updated.replace(/(?<!almond )\bmilk\b/gi, 'almond milk');
    updated = updated.replace(/cheese/gi, 'dairy-free cheese');
  }

  if (preferences.nutAllergy) {
    updated = updated.replace(/almond|walnut|cashew|peanut|nut/gi, 'seed');
  }

  if (preferences.sugarFree) {
    updated = updated.replace(/honey|maple syrup|brown sugar|sweet chili/gi, 'cinnamon');
  }

  if (preferences.noOnion || preferences.noGarlic) {
    updated = updated.replace(/with garlic|with onion|sautéed onions|garlic/gi, 'savory herbs');
  }

  // Ensure vegetarian/vegan safety: replace obvious animal items if type is vegetarian/vegan
  if (type === 'vegetarian' || type === 'vegan') {
    updated = updated.replace(/chicken|beef|pork|bacon|turkey|sausage|shrimp|salmon|tuna|fish/gi, (match) => {
      const lower = match.toLowerCase();
      if (type === 'vegan') return 'tofu';
      // vegetarian: keep eggs/dairy but replace meat with plant protein
      return lower.includes('salmon') || lower.includes('tuna') || lower.includes('shrimp') ? 'grilled tempeh' : 'tofu';
    });
  }

  // For non-vegetarian, avoid suggesting clearly vegetarian-only items when user prefers meat
  // (No-op for now, templates are chosen accordingly)

  return updated.replace(/\s+\s+/g, ' ').trim();
};

const getWeeklyDietTemplates = (dietType, preferences) => {
  const type = normalizeDietType(dietType);
  const vegetarianBreakfasts = [
    'Oatmeal with berries and almond milk',
    'Avocado toast with tomato and seeds',
    'Greek yogurt parfait with granola',
    'Vegetable omelette with spinach and mushrooms',
    'Chia pudding with mixed berries',
    'Banana pancakes with cinnamon',
    'Smoothie bowl with spinach and mango'
  ];
  const nonVegetarianBreakfasts = [
    'Egg scramble with spinach and whole grain toast',
    'Greek yogurt parfait with berries',
    'Smoked salmon and avocado toast',
    'Chicken sausage breakfast burrito bowl',
    'Scrambled eggs with veggies and turkey bacon',
    'Breakfast quesadilla with eggs and cheese',
    'Protein smoothie with banana and peanut butter'
  ];

  const vegetarianLunches = [
    'Quinoa and chickpea salad with roasted vegetables',
    'Lentil curry with brown rice',
    'Vegetable stir-fry with tofu and broccoli',
    'Hummus bowl with falafel and greens',
    'Sweet potato and black bean tacos',
    'Vegetarian buddha bowl with quinoa',
    'Spinach and feta stuffed peppers'
  ];
  const nonVegetarianLunches = [
    'Grilled chicken salad with mixed greens',
    'Turkey and avocado wrap',
    'Salmon bowl with brown rice and greens',
    'Chicken stir-fry with vegetables',
    'Beef and vegetable quinoa bowl',
    'Shrimp and avocado salad',
    'Chicken burrito bowl with salsa'
  ];

  const vegetarianSnacks = [
    'Apple slices with almond butter',
    'Cottage cheese with cucumber and herbs',
    'Mixed berries with Greek yogurt',
    'Hummus with carrot sticks',
    'Trail mix with seeds and dried fruits',
    'Celery with peanut butter',
    'Edamame with sea salt'
  ];
  const nonVegetarianSnacks = [
    'Hard-boiled eggs with pepper',
    'Turkey roll-ups with veggies',
    'Greek yogurt with berries',
    'Tuna salad cucumber boats',
    'Smoked salmon on crispbread',
    'Chicken salad lettuce cups',
    'Protein shake with fruit'
  ];

  const vegetarianDinners = [
    'Baked tofu with roasted vegetables',
    'Mushroom and lentil shepherd’s pie',
    'Zucchini noodles with tomato basil sauce',
    'Vegetable curry with chickpeas',
    'Stuffed bell peppers with quinoa',
    'Butternut squash risotto',
    'Portobello mushroom burger with salad'
  ];
  const nonVegetarianDinners = [
    'Baked salmon with asparagus',
    'Turkey chili with mixed beans',
    'Grilled chicken with sweet potato',
    'Beef stir-fry with broccoli',
    'Shrimp tacos with avocado salsa',
    'Chicken breast with quinoa and greens',
    'Pork tenderloin with roasted vegetables'
  ];

  if (type === 'vegan') {
    return {
      breakfasts: vegetarianBreakfasts.map(s => s.replace(/Greek yogurt|Cottage cheese|egg|omelette/gi, (m) => {
        if (/Greek yogurt|Cottage cheese/gi.test(m)) return 'coconut yogurt';
        return 'tofu scramble';
      })),
      lunches: vegetarianLunches.map(s => s.replace(/paneer|cottage cheese|egg/gi, 'tofu')),
      snacks: vegetarianSnacks.map(s => s.replace(/Greek yogurt|cottage cheese|peanut butter/gi, (m) => m.toLowerCase().includes('peanut') ? 'seed butter' : 'coconut yogurt')),
      dinners: vegetarianDinners.map(s => s.replace(/paneer|cheese|egg/gi, 'tofu')),
      preferences,
      type
    };
  }

  if (type === 'vegetarian') {
    return {
      breakfasts: vegetarianBreakfasts,
      lunches: vegetarianLunches,
      snacks: vegetarianSnacks,
      dinners: vegetarianDinners,
      preferences,
      type
    };
  }

  return {
    breakfasts: nonVegetarianBreakfasts,
    lunches: nonVegetarianLunches,
    snacks: nonVegetarianSnacks,
    dinners: nonVegetarianDinners,
    preferences,
    type
  };
};

const createDailyDietDay = (dayIndex, calories, dietType, preferences, macros) => {
  const template = getWeeklyDietTemplates(dietType, preferences);
  const breakfast = getMealDescription(template.breakfasts[dayIndex % template.breakfasts.length], preferences, template.type);
  const lunch = getMealDescription(template.lunches[dayIndex % template.lunches.length], preferences, template.type);
  const snack = getMealDescription(template.snacks[dayIndex % template.snacks.length], preferences, template.type);
  const dinner = getMealDescription(template.dinners[dayIndex % template.dinners.length], preferences, template.type);

  const ratios = [0.25, 0.35, 0.15, 0.25];
  const mealCalories = ratios.map((r) => Math.round(calories * r));
  const caloriesTotal = mealCalories.reduce((sum, val) => sum + val, 0);

  return {
    day: `Day ${dayIndex + 1}`,
    totalCalories: caloriesTotal,
    macros,
    meals: [
      { type: 'Breakfast', food: breakfast, cal: `${mealCalories[0]} kcal` },
      { type: 'Lunch', food: lunch, cal: `${mealCalories[1]} kcal` },
      { type: 'Snack', food: snack, cal: `${mealCalories[2]} kcal` },
      { type: 'Dinner', food: dinner, cal: `${mealCalories[3]} kcal` }
    ]
  };
};

const isFlatWeeklyPlan = (weeklyPlan) => {
  if (!Array.isArray(weeklyPlan) || weeklyPlan.length !== 7) return true;
  const reference = JSON.stringify(weeklyPlan[0]?.meals || []);
  return weeklyPlan.every((day) => JSON.stringify(day.meals || []) === reference);
};

const getMLWorkoutRecommendation = async (user) => {
  try {
    const response = await axios.post(`${ML_API_URL}/recommend-plan`, {
      age: Number(user.age) || 25,
      weight_kg: Number(user.weight) || 70,
      experience_level: experienceMap[normalizeExperience(user.experience)] || 2,
      goal_type: goalMap[normalizeGoal(user.goal)] || 3,
      exhausted_muscles: []
    }, { timeout: 6000 });

    // 🔥 DEBUG: SEE EXACT ML OUTPUT
    console.log("==== RAW ML RESPONSE ====");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("========================");

    const data = response.data;
    if (!data) {
      throw new Error("Empty ML response");
    }
    return {
      recommendationId: data.recommended_plan_id || data.recommendation_id || null,

      suggestion:
        data.exercise_suggestion ||
        data.suggestion ||
        data.workout ||
        data.plan ||
        data.data?.suggestion ||
        data.data?.workout ||
        null,

      planMeta: data.plan_meta || data.meta || null
    };

  } catch (error) {
    console.warn(
      'Workout plan recommendation service unavailable:',
      error.message || error
    );

    return {
      recommendationId: null,
      suggestion: null,
      planMeta: null
    };
  }
};

const inferMuscleGroup = (text) => {
  const lower = String(text || '').toLowerCase();
  if (/chest|pec|bench/.test(lower)) return 'chest';
  if (/back|row|pull|lat/.test(lower)) return 'back';
  if (/shoulder|press|overhead|lateral/.test(lower)) return 'shoulders';
  if (/bicep|curl/.test(lower)) return 'biceps';
  if (/tricep|dip|pushdown/.test(lower)) return 'triceps';
  if (/squat|quad|leg|lunge|press/.test(lower)) return 'quads';
  if (/deadlift|hamstring|romanian|glute/.test(lower)) return 'hamstrings';
  if (/calf|heel/.test(lower)) return 'calves';
  if (/core|plank|crunch|twist|ab|sit-up/.test(lower)) return 'core';
  if (/yoga|stretch|mobility|walking|jog|cycle|run/.test(lower)) return 'full body';
  return 'full body';
};

const parseSuggestionToExercises = (suggestion) => {
  if (!suggestion || typeof suggestion !== 'string') return [];
  const cleaned = suggestion
    .replace(/[“”]/g, '"')
    .replace(/\s*\/\s*/g, ' + ')
    .replace(/\s*;\s*/g, ' + ')
    .replace(/\s*:\s*/g, ': ');

  const parts = cleaned
    .split(/\s*\+\s*|,\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((text) => !/split|rotation|program|protocol|cycle/i.test(text));

  const items = parts.length > 0 ? parts : [suggestion.trim()];

  return items.map((item) => {
    const cleanText = item.replace(/\[.*?\]/g, '').trim();
    const repMatch = cleanText.match(/(.+?)\s+(\d+)\s*x\s*(\d+)/i);
    const timeMatch = cleanText.match(/(.+?)\s+(\d+)\s*min/i);
    const rangeMatch = cleanText.match(/(.+?)\s+(\d+)\s*-\s*(\d+)\s*reps/i);

    if (repMatch) {
      return {
        name: repMatch[1].trim(),
        sets: Number(repMatch[2]),
        reps: Number(repMatch[3]),
        muscleGroup: inferMuscleGroup(repMatch[1].trim())
      };
    }

    if (timeMatch) {
      return {
        name: `${timeMatch[1].trim()} (${timeMatch[2]} min)`,
        sets: 1,
        reps: Number(timeMatch[2]),
        muscleGroup: inferMuscleGroup(timeMatch[1].trim())
      };
    }

    if (rangeMatch) {
      return {
        name: rangeMatch[1].trim(),
        sets: 3,
        reps: Number(rangeMatch[2]),
        muscleGroup: inferMuscleGroup(rangeMatch[1].trim())
      };
    }

    return {
      name: cleanText,
      sets: 3,
      reps: 12,
      muscleGroup: inferMuscleGroup(cleanText)
    };
  });
};

const buildWeeklyWorkoutPlanFromSuggestion = (user, suggestion) => {
  const baseExercises = parseSuggestionToExercises(suggestion);
  let finalExercises = baseExercises;

  if (!finalExercises || finalExercises.length === 0) {
    finalExercises = [
      { name: "Push Ups", sets: 3, reps: 12, muscleGroup: "chest" },
      { name: "Squats", sets: 3, reps: 12, muscleGroup: "legs" },
      { name: "Plank", sets: 3, reps: "30 sec", muscleGroup: "core" }
    ];
  }
  const normalizedText = (suggestion || '').toLowerCase();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const useAlternateRest = /ppl|push-pull-legs|split|tabata|circuit|hypertrophy|crossfit|functional|training/.test(normalizedText);

  const muscleCategory = (muscleGroup) => {
    if (['chest', 'shoulders', 'triceps'].includes(muscleGroup)) return 'push';
    if (['back', 'biceps'].includes(muscleGroup)) return 'pull';
    if (['quads', 'hamstrings', 'glutes', 'calves'].includes(muscleGroup)) return 'legs';
    if (['core'].includes(muscleGroup)) return 'core';
    return 'fullBody';
  };

  const buildDayExercises = (pattern, dayIndex) => {
    let filtered = (baseExercises || []).filter((exercise) => {
      const category = muscleCategory(exercise.muscleGroup || '');
      if (pattern === 'fullBody') return true;
      if (pattern === 'upper') return ['push', 'pull'].includes(category);
      return category === pattern;
    });


    if (filtered.length === 0) {
      filtered = [
        {
          name: "Push Ups",
          sets: 3,
          reps: 12,
          muscleGroup: "chest"
        },
        {
          name: "Squats",
          sets: 3,
          reps: 12,
          muscleGroup: "legs"
        },
        {
          name: "Plank",
          sets: 3,
          reps: "30 sec",
          muscleGroup: "core"
        }
      ];
    }

    const offset = dayIndex % filtered.length;
    const rotated = filtered.slice(offset).concat(filtered.slice(0, offset));
    const selected = rotated.slice(0, Math.min(4, rotated.length));

    return selected.map((exercise) => ({
      ...exercise,
      name: exercise.name,
      sets: exercise.sets || 3,
      reps: exercise.reps || 12,
      muscleGroup: exercise.muscleGroup || inferMuscleGroup(exercise.name)
    }));
  };

  const dayPatterns = useAlternateRest
    ? ['push', 'pull', 'rest', 'legs', 'push', 'pull', 'rest']
    : ['fullBody', 'upper', 'lower', 'core', 'fullBody', 'upper', 'rest'];

  const planTemplate = days.map((day, idx) => {
    const pattern = dayPatterns[idx];
    const isRestDay = pattern === 'rest';
    const patternLabel = pattern === 'fullBody' ? 'Full Body' : pattern.charAt(0).toUpperCase() + pattern.slice(1);
    const title = isRestDay ? 'Active Recovery' : `${patternLabel} Workout`;
    const exercises = isRestDay ? [] : buildDayExercises(pattern, idx);
    const notePrefix = isRestDay ? 'Rest and recovery day.' : 'ML workout suggestion:';

    return {
      title,
      type: isRestDay ? 'rest' : 'strength',
      focusMuscles: exercises.length > 0 ? Array.from(new Set(exercises.map((ex) => ex.muscleGroup))) : ['rest'],
      exercises,
      notes: isRestDay ? 'Recovery day based on the ML workout recommendation.' : `${notePrefix} ${suggestion || ''}`.trim()
    };
  });

  const weekStart = getMondayStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return planTemplate.map((item, idx) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + idx);
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      date: isoDate,
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      isToday: isoDate === today.toISOString().slice(0, 10),
      dayIndex: idx,
      ...item,
      completed: false,
      completedExercises: []
    };
  });
};

const buildWeeklyWorkoutPlan = (user, recommendationId) => {
  const experience = normalizeExperience(user.experience);
  const goal = normalizeGoal(user.goal);

  const defaultPlans = {
    beginner: [
      {
        title: 'Upper Body A', focusMuscles: ['chest', 'back', 'biceps'], exercises: [
          { name: 'Push-ups', sets: 3, reps: '10-12', muscleGroup: 'chest' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-12', muscleGroup: 'back' },
          { name: 'Bicep Curls', sets: 3, reps: '12-15', muscleGroup: 'biceps' }
        ]
      },
      {
        title: 'Lower Body A', focusMuscles: ['quads', 'glutes'], exercises: [
          { name: 'Squats', sets: 3, reps: '10-12', muscleGroup: 'quads' },
          { name: 'Lunges', sets: 3, reps: '10-12', muscleGroup: 'glutes' }
        ]
      },
      {
        title: 'Active Recovery', type: 'recovery', focusMuscles: ['general'], exercises: [
          { name: 'Walking or Cycling', sets: 1, reps: '30 mins', muscleGroup: 'core' }
        ]
      },
      {
        title: 'Upper Body B', focusMuscles: ['shoulders', 'triceps'], exercises: [
          { name: 'Overhead Press', sets: 3, reps: '10-12', muscleGroup: 'shoulders' },
          { name: 'Tricep Dips', sets: 3, reps: '10-12', muscleGroup: 'triceps' }
        ]
      },
      {
        title: 'Lower Body B', focusMuscles: ['hamstrings', 'calves'], exercises: [
          { name: 'Deadlifts', sets: 3, reps: '8-10', muscleGroup: 'hamstrings' },
          { name: 'Calf Raises', sets: 3, reps: '15-20', muscleGroup: 'calves' }
        ]
      },
      {
        title: 'Core & Conditioning', focusMuscles: ['core'], exercises: [
          { name: 'Plank', sets: 3, reps: '30-45 secs', muscleGroup: 'core' },
          { name: 'Russian Twists', sets: 3, reps: '15-20', muscleGroup: 'core' }
        ]
      },
      { title: 'Rest Day', type: 'rest', focusMuscles: ['rest'], exercises: [] }
    ],
    intermediate: [
      {
        title: 'Chest & Triceps', focusMuscles: ['chest', 'triceps'], exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', muscleGroup: 'chest' },
          { name: 'Dumbbell Flyes', sets: 3, reps: '10-12', muscleGroup: 'chest' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '10-12', muscleGroup: 'triceps' }
        ]
      },
      {
        title: 'Back & Biceps', focusMuscles: ['back', 'biceps'], exercises: [
          { name: 'Barbell Rows', sets: 4, reps: '8-10', muscleGroup: 'back' },
          { name: 'Pull-ups', sets: 3, reps: '8-12', muscleGroup: 'back' },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', muscleGroup: 'biceps' }
        ]
      },
      {
        title: 'Active Recovery', type: 'recovery', focusMuscles: ['general'], exercises: [
          { name: 'Light Jog', sets: 1, reps: '30 mins', muscleGroup: 'core' }
        ]
      },
      {
        title: 'Shoulders & Abs', focusMuscles: ['shoulders', 'core'], exercises: [
          { name: 'Military Press', sets: 4, reps: '8-10', muscleGroup: 'shoulders' },
          { name: 'Lateral Raises', sets: 3, reps: '12-15', muscleGroup: 'shoulders' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', muscleGroup: 'core' }
        ]
      },
      {
        title: 'Leg Day', focusMuscles: ['quads', 'hamstrings', 'glutes'], exercises: [
          { name: 'Squats', sets: 4, reps: '8-10', muscleGroup: 'quads' },
          { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', muscleGroup: 'hamstrings' }
        ]
      },
      {
        title: 'Full Body Conditioning', focusMuscles: ['full body'], exercises: [
          { name: 'Circuit Training', sets: 1, reps: '30 mins', muscleGroup: 'core' }
        ]
      },
      { title: 'Rest Day', type: 'rest', focusMuscles: ['rest'], exercises: [] }
    ],
    advanced: [
      {
        title: 'Upper Power', focusMuscles: ['chest', 'back'], exercises: [
          { name: 'Barbell Bench Press', sets: 5, reps: '5-6', muscleGroup: 'chest' },
          { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', muscleGroup: 'back' }
        ]
      },
      {
        title: 'Lower Power', focusMuscles: ['quads', 'hamstrings'], exercises: [
          { name: 'Back Squats', sets: 5, reps: '5-6', muscleGroup: 'quads' },
          { name: 'Romanian Deadlifts', sets: 4, reps: '6-8', muscleGroup: 'hamstrings' }
        ]
      },
      {
        title: 'Recovery & Mobility', type: 'recovery', focusMuscles: ['general'], exercises: [
          { name: 'Yoga Flow', sets: 1, reps: '30 mins', muscleGroup: 'core' }
        ]
      },
      {
        title: 'Push Strength', focusMuscles: ['shoulders', 'triceps'], exercises: [
          { name: 'Overhead Press', sets: 4, reps: '6-8', muscleGroup: 'shoulders' },
          { name: 'Dips', sets: 4, reps: '8-10', muscleGroup: 'triceps' }
        ]
      },
      {
        title: 'Leg Hypertrophy', focusMuscles: ['quads', 'glutes'], exercises: [
          { name: 'Front Squats', sets: 4, reps: '8-10', muscleGroup: 'quads' },
          { name: 'Leg Press', sets: 4, reps: '10-12', muscleGroup: 'quads' }
        ]
      },
      {
        title: 'Core & Conditioning', focusMuscles: ['core'], exercises: [
          { name: 'Weighted Planks', sets: 4, reps: '45-60 secs', muscleGroup: 'core' }
        ]
      },
      { title: 'Rest Day', type: 'rest', focusMuscles: ['rest'], exercises: [] }
    ]
  };

  const baseTemplates = defaultPlans[experience] || defaultPlans.intermediate;
  const variant = parseInt(String(recommendationId || '').replace(/\D/g, ''), 10) || 1;
  const dailyAdjust = variant % 3;

  const plan = baseTemplates.map((day, index) => {
    const newExercises = day.exercises?.map(exercise => {
      const sets = Math.max(2, exercise.sets + (dailyAdjust === 1 ? 0 : dailyAdjust));
      let reps = exercise.reps;
      if (typeof reps === 'string' && reps.includes('-')) {
        const [low, high] = reps.split('-').map(Number);
        reps = `${Math.max(5, low + dailyAdjust)}-${Math.max(6, high + dailyAdjust)}`;
      } else if (typeof reps === 'number') {
        reps = Math.max(5, reps + dailyAdjust);
      }

      return {
        ...exercise,
        sets,
        reps
      };
    });

    const notes = [];
    if (goal === 'fat loss') {
      notes.push('Higher rep range to keep heart rate elevated.');
    } else if (goal === 'muscle gain') {
      notes.push('Use controlled tempo and progressive overload.');
    }

    if (dailyAdjust === 2) {
      notes.push('ML variant recommends slightly heavier sets this week.');
    }

    return {
      ...day,
      exercises: newExercises,
      notes: notes.join(' ')
    };
  });

  const weekStart = getMondayStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return plan.map((item, idx) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + idx);
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      date: isoDate,
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      isToday: isoDate === today.toISOString().slice(0, 10),
      dayIndex: idx,
      ...item,
      completed: false,
      completedExercises: []
    };
  });
};

const generateAndSaveWorkoutPlan = async (user) => {

  const mlRecommendation =
    await getMLWorkoutRecommendation(user);

  console.log("==== ML WORKOUT DEBUG ====");

  console.log(
    "Full ML response:",
    mlRecommendation
  );

  console.log(
    "Suggestion:",
    mlRecommendation.suggestion
  );

  console.log("==========================");
  // ===================================================
  // 🧠 GET ML SUGGESTION
  // ===================================================

  const suggestionText =
    mlRecommendation?.suggestion ||
    mlRecommendation?.planMeta?.suggestion ||
    '';

  // ===================================================
  // 🏋️ BUILD 7-DAY PLAN
  // ===================================================

  const weeklyPlan =
    buildWeeklyWorkoutPlanFromSuggestion(
      user,
      suggestionText
    );

  // ===================================================
  // 📦 DB FILTER
  // ===================================================

  const filter = {
    user: user._id,
    isAutoGenerated: true
  };

  // ===================================================
  // 💾 SAVE PAYLOAD
  // ===================================================

  const payload = {
    user: user._id,
    title:
      `${user.name || 'User'} Weekly Workout Plan`,
    goal:
      normalizeGoalLabel(user.goal),
    experienceLevel:
      normalizeExperienceLabel(user.experience),
    durationWeeks: 4,
    daysPerWeek: 5,
    isAutoGenerated: true,
    weeklyPlan,
    generatedAt: new Date(),
    planSource: 'ml',
    recommendationId:
      mlRecommendation.recommendationId
        ? String(
          mlRecommendation.recommendationId
        )
        : null,
    // =================================================
    // 🧠 SNAPSHOT FOR PERSISTENCE
    // =================================================

    profileSnapshot: {
      goal: user.goal,
      experience: user.experience,
      injury: user.injury,
      medicalState: user.medicalState
    }

  };

  // ===================================================
  // 🔄 UPSERT PLAN
  // ===================================================

  const updatedPlan =
    await WorkoutPlan.findOneAndUpdate(
      filter,
      payload,
      {
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

  // ===================================================
  // 🚨 SAFETY CHECK
  // ===================================================

  if (
    !updatedPlan.weeklyPlan ||
    updatedPlan.weeklyPlan.length !== 7
  ) {
    throw new Error(
      "Invalid weeklyPlan generated by ML layer"
    );
  }
  console.log("✅ WORKOUT PLAN SAVED");
  return updatedPlan;
};

// =====================================================
// 🔁 GET OR CREATE WORKOUT PLAN
// =====================================================

const getOrCreateWorkoutPlan = async (user) => {

  let plan =
    await WorkoutPlan.findOne({

      user: user._id,

      isAutoGenerated: true

    });

  // ===================================================
  // 🧠 REGENERATION LOGIC
  // ===================================================

  const shouldRegenerate =

    !plan ||

    !Array.isArray(plan.weeklyPlan) ||

    plan.weeklyPlan.length !== 7 ||

    !plan.profileSnapshot ||

    // Goal changed
    plan.profileSnapshot.goal !== user.goal ||

    // Experience changed
    plan.profileSnapshot.experience !==
    user.experience ||

    // Injury changed
    plan.profileSnapshot.injury !==
    user.injury ||

    // Medical state changed
    plan.profileSnapshot.medicalState !==
    user.medicalState;

  // ===================================================
  // 🔄 REGENERATE ONLY IF NEEDED
  // ===================================================

  if (shouldRegenerate) {
    console.log(
      "♻️ Regenerating workout plan..."
    );
    plan =
      await generateAndSaveWorkoutPlan(user);
  } else {
    console.log(
      "✅ Existing workout plan reused"
    );
  }
  return plan;
};

const generateAndSaveDietPlan = async (user) => {

  let recommendationId = null;

  let weeklyPlan = [];

  // ===================================================
  // 🧠 NORMALIZATION
  // ===================================================

  const activityLevel =
    normalizeActivityLevel(
      user.activityLevel
    );

  const dietTypeNormalized =
    normalizeDietType(
      user.dietType
    );

  // ===================================================
  // 🔥 BMR + TDEE
  // ===================================================

  const bmr =
    dietCalculator.calculateBMR({

      gender: user.gender,

      weight:
        Number(user.weight) || 70,

      height:
        Number(user.height) || 170,

      age:
        Number(user.age) || 30

    });

  // ===================================================
  // 🩺 MEDICAL STATE ADAPTIVE TDEE
  // ===================================================

  const tdee =
    dietCalculator.calculateTDEE(

      bmr,

      activityLevel,

      user.medicalState || "healthy"

    );

  // ===================================================
  // 🍽️ DAILY NUTRITION
  // ===================================================

  const dailyNutrition =
    generateDietPlan({

      tdee,

      weight:
        Number(user.weight) || 70,

      goal:
        normalizeGoal(user.goal)

    });

  // ===================================================
  // 🤖 ML DIET RECOMMENDATION
  // ===================================================

  try {

    const response =
      await axios.post(

        `${ML_API_URL}/diet-recommendation`,

        {

          dietType:
            dietTypeNormalized,

          noOnion:
            !!user.noOnion,

          noGarlic:
            !!user.noGarlic,

          glutenFree:
            !!user.glutenFree,

          lactoseFree:
            !!user.lactoseFree,

          nutAllergy:
            !!user.nutAllergy,

          sugarFree:
            !!user.sugarFree,

          calories:
            dailyNutrition.calories,

          activityLevel,

          // ✅ NEW
          goal:
            user.goal,

          // ✅ NEW
          medicalState:
            user.medicalState || "healthy"

        },

        { timeout: 6000 }

      );

    weeklyPlan =
      response.data.weekly_plan || [];

    recommendationId =
      response.data.recommendation_id || null;

    console.log(
      "✅ ML DIET PLAN GENERATED"
    );

  } catch (error) {

    console.warn(

      'Diet recommendation service unavailable:',

      error.message || error

    );

  }

  // ===================================================
  // 🛡️ FALLBACK GENERATOR
  // ===================================================

  if (

    !Array.isArray(weeklyPlan) ||

    weeklyPlan.length !== 7 ||

    isFlatWeeklyPlan(weeklyPlan)

  ) {

    console.log(
      "⚠️ Using fallback diet generator"
    );

    weeklyPlan =

      Array.from({ length: 7 })

        .map((_, index) =>

          createDailyDietDay(

            index,

            dailyNutrition.calories,

            dietTypeNormalized,

            {

              noOnion:
                !!user.noOnion,

              noGarlic:
                !!user.noGarlic,

              glutenFree:
                !!user.glutenFree,

              lactoseFree:
                !!user.lactoseFree,

              nutAllergy:
                !!user.nutAllergy,

              sugarFree:
                !!user.sugarFree

            },

            dailyNutrition

          )

        );

  }

  // ===================================================
  // 📦 SAVE FILTER
  // ===================================================

  const filter = {

    userId: user._id

  };

  // ===================================================
  // 💾 SAVE PAYLOAD
  // ===================================================

  const payload = {

    userId: user._id,

    goal:
      normalizeGoal(user.goal),

    dietType:
      dietTypeNormalized,

    activityLevel,

    preferences: {

      noOnion:
        !!user.noOnion,

      noGarlic:
        !!user.noGarlic,

      glutenFree:
        !!user.glutenFree,

      lactoseFree:
        !!user.lactoseFree,

      nutAllergy:
        !!user.nutAllergy,

      sugarFree:
        !!user.sugarFree

    },

    weeklyPlan,

    generatedAt:
      new Date(),

    planSource: 'ml',

    recommendationId:

      recommendationId

        ? String(recommendationId)

        : null,

    // =================================================
    // 🧠 PROFILE SNAPSHOT
    // =================================================

    profileSnapshot: {

      goal: user.goal,

      dietType: user.dietType,

      noOnion: user.noOnion,

      noGarlic: user.noGarlic,

      glutenFree: user.glutenFree,

      lactoseFree: user.lactoseFree,

      nutAllergy: user.nutAllergy,

      sugarFree: user.sugarFree,

      medicalState:
        user.medicalState

    }

  };

  // ===================================================
  // 🔄 UPSERT PLAN
  // ===================================================

  const updatedPlan =
    await UserDietPlan.findOneAndUpdate(

      filter,

      payload,

      {

        returnDocument: 'after',

        upsert: true,

        setDefaultsOnInsert: true

      }

    );

  console.log(
    "✅ DIET PLAN SAVED"
  );

  return updatedPlan;

};

// =====================================================
// 🔁 GET OR CREATE DIET PLAN
// =====================================================

const getOrCreateDietPlan = async (user) => {

  let dietPlan =
    await UserDietPlan.findOne({

      userId: user._id

    }).lean();

  // ===================================================
  // 🧠 REGENERATION LOGIC
  // ===================================================

  const shouldRegenerateDiet =

    !dietPlan ||

    !Array.isArray(
      dietPlan.weeklyPlan
    ) ||

    dietPlan.weeklyPlan.length !== 7 ||

    !dietPlan.profileSnapshot ||

    // Goal changed
    dietPlan.profileSnapshot.goal !==
    user.goal ||

    // Diet changed
    dietPlan.profileSnapshot.dietType !==
    user.dietType ||

    // Onion preference changed
    dietPlan.profileSnapshot.noOnion !==
    user.noOnion ||

    // Garlic preference changed
    dietPlan.profileSnapshot.noGarlic !==
    user.noGarlic ||

    // Gluten changed
    dietPlan.profileSnapshot.glutenFree !==
    user.glutenFree ||

    // Lactose changed
    dietPlan.profileSnapshot.lactoseFree !==
    user.lactoseFree ||

    // Nut allergy changed
    dietPlan.profileSnapshot.nutAllergy !==
    user.nutAllergy ||

    // Sugar changed
    dietPlan.profileSnapshot.sugarFree !==
    user.sugarFree ||

    // Medical state changed
    dietPlan.profileSnapshot.medicalState !==
    user.medicalState;

  // ===================================================
  // 🔄 REGENERATE IF NEEDED
  // ===================================================

  if (shouldRegenerateDiet) {

    console.log(
      "♻️ Regenerating diet plan..."
    );

    dietPlan =
      await generateAndSaveDietPlan(user);

  } else {

    console.log(
      "✅ Existing diet plan reused"
    );

  }

  return dietPlan;

};

// =====================================================
// 🔁 FORCE REGENERATE BOTH PLANS
// ===================================================

const regenerateUserPlans = async (user) => {

  console.log(
    "♻️ Regenerating ALL plans..."
  );

  const workoutPlan =
    await generateAndSaveWorkoutPlan(user);

  const dietPlan =
    await generateAndSaveDietPlan(user);

  return {

    workoutPlan,

    dietPlan

  };

};

module.exports = {
  getOrCreateWorkoutPlan,
  getOrCreateDietPlan,
  regenerateUserPlans,
  createDailyDietDay,
  normalizeDietType
};
