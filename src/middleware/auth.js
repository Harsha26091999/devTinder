const auth = (req,res,next) => {
    const token = '123456';
    if(token === '123456') {
        next();
    } else {
        res.status(401).send('Un Authorized');
    }
}

module.exports = {auth};