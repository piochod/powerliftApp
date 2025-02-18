const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('restapi','postgres','admin',{
    host: 'localhost',
    dialect: 'postgres'
});


const Set = sequelize.define('Set', {
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  rpe: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  workoutId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'workouts',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'exercises',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'sets',
  timestamps: false
});


const User = sequelize.define('user',{
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Exercise = sequelize.define('exercise',{
    muscle_group:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    exercise:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
},{
    tablename: "exercises",
    timestamps: false
});
 
const Workout = sequelize.define('workout',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    date:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
        model: 'users',
        key: 'id'
    }
    }
},{
    tableName: 'workouts',
    timestamps: false
});

Workout.hasMany(Set, { foreignKey: 'workoutId' }); 
Set.belongsTo(Workout, {foreignKey: 'workoutId'});
Exercise.hasMany(Set, { foreignKey: 'exerciseId' });

Set.belongsTo(Exercise, { foreignKey: 'exerciseId' });
User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });

module.exports = {User, Workout, Set, Exercise, sequelize};