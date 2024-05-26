import validator from 'express-validator';

const validationMiddleware = {

   RegistrationValidation: [
      validator.check('name').not().isEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
      validator.check('email').not().isEmpty().withMessage('Email is required'),
      validator.check('password').not().isEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
   ],
   LoginValidation: [
      validator.check('email').not().isEmpty().withMessage('email is required'),
      validator.check('password').not().isEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
   ]
}
export default validationMiddleware;// import validator from 'express-validator';