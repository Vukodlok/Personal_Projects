const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: String,
  exercises: [
    {
      description: String,
      duration: Number,
      date: String
    }
  ]
});
const User = mongoose.model('User', userSchema);
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json()) //for parsing json data
app.use(express.urlencoded({ extended: true })) //for parsing form data
app.use(express.static('public'))

// user post route
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.json({ error: 'Username is required' });
    const newUser = new User({ username });
    const savedUser = await newUser.save();
    res.json({ username: savedUser.username, _id: savedUser.id })
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// user get route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id'); //retrieve username and id of all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// excercise post route
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const exercise = {
      description,
      duration: Number(duration),
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  user.exercises.push(exercise);
  await user.save();

  //return updated user object with exercise
  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
    });
  } catch (err) {
  res.status(500).json({ error: 'Database error' });
  }
});
// logs get route
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    let exercises = user.exercises;

    // filter by date range if provided
    if (from || to) {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();

      exercises = exercises.filter(ex => {
        const exerciseDate = new Date(ex.date);
        return exerciseDate >= fromDate && exerciseDate <= toDate;
      });
    }

    // apply limit if provided
    if (limit) {
      exercises = exercises.slice(0, Number(limit));
    }

    // return user log
    res.json({
      username: user.username,
      _id: user._id,
      count: exercises.length,
      log: exercises,
    });

  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// contect to mongoose database
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to MongoDB - exercise_tracker"))
.catch(err => console.error("Database connection error:", err));

// root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
