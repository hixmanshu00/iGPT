import { Router } from 'express';
import { getAllUsers, login, logout, signup, verifyUser } from '../controllers/user-controllers.js';
import { validate, signupValidator, loginValidator } from '../utils/validators.js';
import { verifyToken } from '../utils/token-manager.js';
const userRoutes = Router();
userRoutes.get('/', getAllUsers);
userRoutes.post('/signup', validate(signupValidator), signup);
userRoutes.post('/login', validate(loginValidator), login);
userRoutes.get('/auth-status', verifyToken, verifyUser);
userRoutes.get('/logout', verifyToken, logout);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map