const validatePlan = (req, res, next) => {
    const { title, goal, exercises, daysPerWeek } = req.body;

    // 1. Sanitize & Check Title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: "Invalid title: Must be a non-empty string." });
    }

    // 2. Validate Goal (Security against Enum injection)
    const validGoals = ["Weight Loss", "Muscle Gain", "Maintenance"];
    if (!validGoals.includes(goal)) {
        return res.status(400).json({ error: `Invalid goal. Allowed: ${validGoals.join(", ")}` });
    }

    // 3. Validate Exercises Structure
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ error: "Plan must contain at least one exercise." });
    }

    // 4. Deep check of exercises (Prevent negative numbers)
    for (let ex of exercises) {
        if (!ex.name || typeof ex.name !== 'string') {
            return res.status(400).json({ error: "Exercise name is required." });
        }
        if (ex.sets <= 0 || ex.reps <= 0) {
            return res.status(400).json({ error: "Sets and Reps must be positive numbers." });
        }
    }

    // 5. Validate Schedule
    if (daysPerWeek < 1 || daysPerWeek > 7) {
        return res.status(400).json({ error: "Days per week must be between 1 and 7." });
    }

    next(); // Pass control to the controller
};

module.exports = { validatePlan };