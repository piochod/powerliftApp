const express = require("express");
const {
  User,
  Workout,
  Exercise,
  Set,
  sequelize,
} = require("./models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {brzyckiFormula} = require("./utils");

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => console.error("Error syncing", err));

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: "Username is already used." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Cannot register", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const doPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!doPasswordsMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, "your_secret_key_here", {
      expiresIn: "5h",
    });
    res.json({ message: "Login successfull", token });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], "your_secret_key_here");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

app.get("/userInfo", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId,{
      attributes: {exclude: ['password']}
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/exercises", verifyToken, async (req, res) => {
  try {
    const exercices = await Exercise.findAll({
      order: [['exercise','ASC']],
    });
    res.json(exercices);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/exercise/:id", async(req,res) =>{
  try{
    const { id } = req.params;
    const exercice = await Exercise.findOne({
      where: {id: id},
      attributes: ['id', 'exercise', 'muscle_group'],
    })
    if(!exercice){
      return res.status(404).json({message: 'Exercise not found.'});
    }
    res.status(200).json(exercice);
  }
  catch(error){
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Server error" });
  }
})

app.post("/workout", async (req, res) => {
  try {
    const { userId, workoutName, exercises } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }

    const workout = await Workout.create({
      name: workoutName || "Unnamed Workout",
      createdAt: new Date(),
      userId: user.id,
    });

    console.log(`Workout created for user ${user.username}: ${workout.name}`);

    for (const exercise of exercises) {
      const existingExercise = await Exercise.findByPk(exercise.id);

      if (!existingExercise) {
        return res
          .status(404)
          .json({ message: `Exercise with ID ${exercise.id} not found` });
      }

      console.log(`Exercise fetched: ${existingExercise.name}`);

      for (const set of exercise.sets) {
        await Set.create({
          exerciseId: existingExercise.id,
          reps: set.reps,
          weight: set.weight,
          rpe: set.rpe,
          workoutId: workout.id,
        });

        console.log(
          `Set created for ${existingExercise.name}: Reps ${set.reps}, Weight ${set.weight}, RPE ${set.rpe}`
        );
      }
    }

    res.status(201).json({
      message: "Workout created successfully!",
      workout,
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/workouts", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const userWorkouts = await Workout.findAll({
      where: { userId: userId },
      order: [["date", "DESC"]],
    });

    if (!userWorkouts || userWorkouts.length === 0) {
      return res
        .status(404)
        .json({ message: `No workouts found for user with ID ${userId}` });
    }

    res.status(200).json({
      message: `Workouts found for user with ID ${userId}`,
      workouts: userWorkouts,
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/workout/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await Workout.findOne({
      where: { id: id },
      include: [
        {
          model: Set,
          include: [
            {
              model: Exercise,
              attributes: ["id", "muscle_group", "exercise"],
            },
          ],
          attributes: ["id", "reps", "weight", "rpe"],
        },
      ],
      order: [[{ model: Set }, "id", "ASC"]],
    });

    if (!workout) {
      return res
        .status(404)
        .json({ message: `No workout with that id found.` });
    }

    const exercises = [];
    const exerciseMap = {};

    workout.Sets.forEach((set) => {
      const exerciseId = set.exercise.id;

      if (!exerciseMap[exerciseId]) {
        const newExercise = {
          id: set.exercise.id,
          muscle_group: set.exercise.muscle_group,
          exercise: set.exercise.exercise,
          sets: [],
        };
        exerciseMap[exerciseId] = newExercise;
        exercises.push(newExercise);
      }

      exerciseMap[exerciseId].sets.push({
        id: set.id,
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
        orm: brzyckiFormula(set.weight, set.reps, set.rpe)
      });
    });

    res.status(200).json({
      message: `Workout found successfully!`,
      workout: { name: workout.name, exercises: exercises },
    });
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/exercise/:exerciseId/workout-stats', verifyToken, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { userId } = req.user;

    const sets = await Set.findAll({
      include: [
        {
          model: Exercise,
          where: { id: exerciseId }, 
          attributes: ['exercise'], 
        },
        {
          model: Workout,
          where: { userId: userId }, 
          attributes: ['id', 'name', 'date'], 
        },
      ],
      attributes: ['id', 'reps','rpe', 'weight', 'workoutId'], 
    });

    if (sets.length === 0) {
      return res.status(404).json({ message: 'No sets found for this exercise.' });
    }

    const workoutStats = sets.reduce((acc, set) => {
      const workoutId = set.workoutId;
      const workoutName = set.workout.name;
      const volume = set.reps * set.weight; 
      const oneRepMax = brzyckiFormula(set.weight, set.reps, set.rpe); 

      if (!acc[workoutId]) {
        acc[workoutId] = { volume: 0, orm: 0, workoutName: workoutName };
      }

      acc[workoutId].volume += volume; 
      acc[workoutId].orm = Math.max(acc[workoutId].orm, oneRepMax); 

      return acc;
    }, {});

    const statsArray = Object.keys(workoutStats).map(workoutId => ({
      workoutId: parseInt(workoutId),
      workoutName: workoutStats[workoutId].workoutName,
      volume: workoutStats[workoutId].volume,
      orm: workoutStats[workoutId].orm,
    }));

    res.json(statsArray);
  } catch (error) {
    console.error('Error fetching workout stats:', error);
    res.status(500).json({ message: 'An error occurred while fetching workout stats.' });
  }
});

app.post("/exercise", verifyToken, async (req, res) => {
  try {
    const { exercise, muscle_group } = req.body;

    if (!exercise || !muscle_group) {
      return res.status(400).json({ message: "Exercise name and muscle group are required" });
    }

    const existingExercise = await Exercise.findOne({ where: { exercise } });
    if (existingExercise) {
      return res.status(400).json({ message: "An exercise with this name already exists." });
    }

    const newExercise = await Exercise.create({
      exercise,
      muscle_group,
    });

    res.status(201).json({
      message: "Exercise created successfully",
      exercise: newExercise,
    });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: "Server error" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
