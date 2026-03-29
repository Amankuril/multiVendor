import { Router } from 'express';
import { register, vendorRegister, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema, vendorRegisterSchema, updateProfileSchema } from '../middlewares/validators/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/vendor-register', validate(vendorRegisterSchema), vendorRegister);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
