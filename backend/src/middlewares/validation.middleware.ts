import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';


export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};


export const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .escape(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom((value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];


export const validateUpdateDetails = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .escape(),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email'),
    handleValidationErrors
];

export const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    handleValidationErrors
];


export const validateMessage = [
    body('chatId')
        .trim()
        .notEmpty()
        .withMessage('Chat ID is required')
        .isMongoId()
        .withMessage('Invalid chat ID format'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Message content is required')
        .isLength({ max: 5000 })
        .withMessage('Message cannot exceed 5000 characters')
        .escape(),
    handleValidationErrors
];


export const validateCreateChat = [
    body('participantIds')
        .isArray({ min: 1 })
        .withMessage('At least one participant is required'),
    body('participantIds.*')
        .isMongoId()
        .withMessage('Invalid participant ID format'),
    body('isGroupChat')
        .optional()
        .isBoolean()
        .withMessage('isGroupChat must be a boolean'),
    body('groupName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Group name must be between 1 and 50 characters')
        .escape(),
    handleValidationErrors
];
