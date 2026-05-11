import {
    validateEmail,
    validatePassword,
    validateFullName,
    validatePhone,
    validateCaptcha,
    validateConfirmPassword,
} from "./userValidation";

export const AuthValidation = {
    email: validateEmail,
    password: validatePassword,
    fullName: validateFullName,
    phone: validatePhone,
    captchaToken: validateCaptcha,
    confirmPassword: validateConfirmPassword,
};