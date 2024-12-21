const brzyckiFormula = (weight, reps, rpe) =>{
    reps = Math.floor(10-rpe) + reps;
    if(reps > 12) reps = 12;
    return Math.floor(weight*36/(37-reps));
};

module.exports = {brzyckiFormula};
