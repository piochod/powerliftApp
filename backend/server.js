const express = require('express');
const {User, Workout, WorkoutExercise, Exercise, Set, sequelize} = require('./models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


sequelize.sync().then(() =>{
    console.log('Database synced');
}).catch(err => console.error('Error syncing', err));





app.post('/register', async(req,res) =>{
    try{
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({username, password: hashedPassword});
        res.status(201).json({message: 'User registered successfully', user});
    }
    catch (error){
        console.error('Cannot register', error);
        res.status(500).json({message: 'Server error'});
    }
});

app.post('/login',  async(req,res) =>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const doPasswordsMatch = await bcrypt.compare(password,user.password);
        if (!doPasswordsMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({userId: user.id},'your_secret_key_here',{expiresIn: '1h'});
        res.json({message: 'Login successfull',token});

    }
    catch(error){
        console.error('Error logging in', error);
        res.status(500).json({message: 'Server Error'});
    }
});

const verifyToken = (req,res,next) =>{
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({message: 'Access denied'});
    }
    try{
        const decoded = jwt.verify(token.split(' ')[1], 'your_secret_key_here');
        req.user = decoded;
        next();
    } catch(error){
        console.error('Error verifying token', error);
        res.status(401).json({message: 'Invalid Token'});
    }
};

app.get('/userInfo', verifyToken, async(req,res) =>{
    try{
        const user = await User.findByPk(req.user.userId);
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.json({user});
    } catch(error){
        console.error('Error fetching data', error);
        res.status(500).json({message: 'Server error'});
    }
});


app.get('/exercises', verifyToken, async(req,res) =>{
    try{
        const exercices = await Exercise.findAll();
        res.json(exercices);
    } catch(error){
        console.error('Error fetching data', error);
        res.status(500).json({message: 'Server error'});
    }
});

app.post('/workout', async (req, res) => {
    try {
      const { userId, workoutName, exercises } = req.body;
  
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${userId} not found` });
      }
  
      // Create new workout for the user
      const workout = await Workout.create({
        name: workoutName || 'Unnamed Workout',
        createdAt: new Date(),      // Set the current date
        userId: user.id        // Associate workout with the user
      });
  
      console.log(`Workout created for user ${user.username}: ${workout.name}`);
  
      // Loop through exercises sent in the request body and add them to the workout
      for (const exercise of exercises) {
        const existingExercise = await Exercise.findByPk(exercise.id);  // Fetch exercise by ID
  
        if (!existingExercise) {
          return res.status(404).json({ message: `Exercise with ID ${exercise.id} not found` });
        }
  
        console.log(`Exercise fetched: ${existingExercise.name}`);
  
        // Add sets for each exercise
        for (const set of exercise.sets) {
          await Set.create({
            exerciseId: existingExercise.id,  
            reps: set.reps,              
            weight: set.weight,          
            rpe: set.rpe,
            workoutId: workout.id                 
          });
  
          console.log(`Set created for ${existingExercise.name}: Reps ${set.reps}, Weight ${set.weight}, RPE ${set.rpe}`);
        }
      }
  
      // Send the created workout as a response
      res.status(201).json({
        message: 'Workout created successfully!',
        workout
      });
  
    } catch (error) {
      console.error('Error creating workout:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.get('/workouts/:userId', verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find all workouts for the given user
      const userWorkouts = await Workout.findAll({
        where: { userId: userId },
        include: [
          {
            model: Set,  // Include sets (which link workouts to exercises)
            include: [{
              model: Exercise,  // Include exercises related to sets
              attributes: ['id', 'muscle_group', 'exercise'],  // Specify exercise fields to return
            }],
            attributes: ['id', 'reps', 'weight', 'rpe']  // Specify set fields to return
          }
        ]
      });
  
      // If no workouts are found
      if (!userWorkouts || userWorkouts.length === 0) {
        return res.status(404).json({ message: `No workouts found for user with ID ${userId}` });
      }
  
      // Return the workouts with their associated exercises and sets
      res.status(200).json({
        message: `Workouts found for user with ID ${userId}`,
        workouts: userWorkouts
      });
  
    } catch (error) {
      console.error('Error fetching workouts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})

