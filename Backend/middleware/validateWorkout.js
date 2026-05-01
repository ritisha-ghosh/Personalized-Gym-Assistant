const validatePlan = (req, res, next) => {

    const { title, goal, exercises, daysPerWeek } = req.body;

    // Validate title (only if provided)
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid title: Must be a non-empty string."
            });
        }
    }

    // Validate goal
    const validGoals = ["Weight Loss", "Muscle Gain", "Maintenance"];

    if (goal !== undefined) {
        if (!validGoals.includes(goal)) {
            return res.status(400).json({
                error: `Invalid goal. Allowed: ${validGoals.join(", ")}`
            });
        }
    }

    // Validate exercises
    if (exercises !== undefined) {

        if (!Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({
                error: "Plan must contain at least one exercise."
            });
        }

        const validMuscleGroups = [
            "chest",
            "back",
            "shoulders",
            "biceps",
            "triceps",
            "quads",
            "hamstrings",
            "glutes",
            "calves",
            "core"
        ];

        for (let ex of exercises) {

            if (!ex.name || typeof ex.name !== 'string') {
                return res.status(400).json({
                    error: "Exercise name is required."
                });
            }

            // FIXED FIELD NAME
            if (!validMuscleGroups.includes(ex.muscleGroup)) {
                return res.status(400).json({
                    error: `Invalid muscle group for exercise ${ex.name}`
                });
            }

            if (ex.sets <= 0 || ex.reps <= 0) {
                return res.status(400).json({
                    error: "Sets and Reps must be positive numbers."
                });
            }
        }
    }

    // Validate daysPerWeek
    if (daysPerWeek !== undefined) {
        if (daysPerWeek < 1 || daysPerWeek > 7) {
            return res.status(400).json({
                error: "Days per week must be between 1 and 7."
            });
        }
    }

    next();
};

module.exports = { validatePlan };