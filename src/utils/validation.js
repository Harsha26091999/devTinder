const validateSignup = (req) =>{
    const areSkillsPresent = Object.keys(req.body).includes('skills');
    if(areSkillsPresent && req.body.skills.length >3) {
        throw new Error('Skills cannot be more than 3');
    }
}

const validateLogin = (req) => {
    const {emailId, password} = req.body;

    if(!emailId) throw new Error('Email Id is required');
    if(!password) throw new Error('Password is required');
}

module.exports = {validateSignup, validateLogin};