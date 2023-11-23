import { Router } from 'express';
import { getAllUsers, login, signup } from '../controllers/user-controllers.js';
import { validate, signupValidator, loginValidator } from '../utils/validators.js';
import { verifyToken } from '../utils/token-manager.js';
const userRoutes = Router();
userRoutes.get('/', getAllUsers);
userRoutes.post('/signup', validate(signupValidator), signup);
userRoutes.post('/login', validate(loginValidator), login);
userRoutes.post('/auth-status', verifyToken);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map