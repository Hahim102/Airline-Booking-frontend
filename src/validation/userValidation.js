export const validateEmail = (email) => {
    if (!email) return "Email must not be empty.";

    const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!regex.test(email)) return "Email is not in the correct format.";

    return null;
};

export const validatePassword = (password) => {
    if (!password) return "Password must not be empty.";

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
        return "The password must have at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.";
    }

    return null;
};

export const validateFullName = (fullName) => {
    if (!fullName || fullName.trim().length === 0) {
        return "The full name must not be left blank.";
    }

    if (/^\s*$/.test(fullName)) {
        return "Invalid name";
    }

    return null;
};

export const validatePhone = (phone) => {
    if (!phone) return "Phone must not be empty.";

    const regex = /^(0(3|5|7|8|9))[0-9]{8}$/;
    if (!regex.test(phone)) return "Invalid phone number";

    return null;
};

export const validateConfirmPassword = (
    password,
    confirmPassword
) => {
    if (!confirmPassword) {
        return "Confirm password must not be empty.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }

    return null;
};

export const validateCaptcha = (captchaToken) => {
    if (!captchaToken) return "Captcha is required.";

    return null;
};