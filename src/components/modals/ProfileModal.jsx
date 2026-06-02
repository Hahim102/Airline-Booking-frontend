import { useState } from 'react';
import { Mail, Phone, MapPin, User, Save, IdCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthValidation } from '../../validation';
import { userService } from '../../api/userService';
import { tokenStorage } from '../../api/authService';

export default function ProfileModal({ onClose }) {
    const { user, setUser } = useAuth();
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: user?.fullName,
        email: user?.email || "user@example.com",
        phone: user?.phone || "",
        // passPort: user?.passport || "ABC123456",
    });

    const validate = () => {
        const newErrors = {};

        newErrors.fullName =
            AuthValidation.fullName(formData.fullName);

        newErrors.email =
            AuthValidation.email(formData.email);

        newErrors.phone =
            AuthValidation.phone(formData.phone);

        Object.keys(newErrors).forEach((key) => {
            if (newErrors[key] === null) {
                delete newErrors[key];
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        let validationError = null;

        switch (field) {
            case "fullName":
                validationError =
                    AuthValidation.fullName(value);
                break;

            case "email":
                validationError =
                    AuthValidation.email(value);
                break;

            case "phone":
                validationError =
                    AuthValidation.phone(value);
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [field]: validationError,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!validate()) return;

        setIsLoading(true);
        try {
            let avatarUrl = null;
            if (selectedAvatarFile) {
                const avatarResult = await userService.uploadAvatar(selectedAvatarFile);
                avatarUrl = avatarResult.avatarUrl;
                console.log("Avatar uploaded successfully:", avatarResult);
            }

    
            const updatedUserData = await userService.updateProfile(formData);
            console.log("Profile updated successfully:", updatedUserData);

            
            const finalUserData = avatarUrl ? { ...updatedUserData, avatarUrl } : updatedUserData;
            
            setUser(finalUserData);
            tokenStorage.setUser(finalUserData);
            setSelectedAvatarFile(null);
            setAvatarPreview("");
            onClose();
        }
        catch (error) {
            console.error("Error updating profile:", error?.message || error);

            setFormError(
                error?.message ||
                "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadAvatar = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setFormError('Only JPEG, PNG, and WebP images are allowed');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setFormError('Image size must be less than 5MB');
            return;
        }

        setSelectedAvatarFile(file);
        setFormError('');

        const reader = new FileReader();
        reader.onload = (event) => {
            setAvatarPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="p-4 bg-error/10 border border-error rounded-xl">
                    <p className="text-sm font-medium text-error">{formError}</p>
                </div>
            )}
            <div className="flex flex-col items-center mb-8">
                <label className="h-24 w-24 rounded-3xl bg-primary/10 overflow-hidden border-4 border-white custom-shadow relative group">
                    <img
                        src={avatarPreview || user?.avatarUrl || "/default-avatar.png"}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-[10px] font-bold uppercase">Change</span>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleUploadAvatar}
                    />
                </label>
                <h4 className="mt-4 font-bold text-on-surface text-lg">{formData.fullName}</h4>
                <p className="text-xs text-outline font-bold uppercase tracking-widest">Premium Member</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                                handleChange("fullName", e.target.value)
                            }
                            className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl
                                focus:ring-2 focus:ring-primary focus:border-transparent outline-none
                                transition-all text-sm font-medium
                                ${errors.fullName
                                    ? "border-red-500"
                                    : "border-outline-variant"
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                        )}
                    </div>
                </div>

            
                {/* <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl
                            focus:ring-2 focus:ring-primary focus:border-transparent outline-none
                            transition-all text-sm font-medium
                                ${errors.email
                                    ? "border-red-500"
                                    : "border-outline-variant"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div> */}

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                                handleChange("phone", e.target.value)
                            }
                            placeholder="e.g., 0912345678"
                            className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl
                            focus:ring-2 focus:ring-primary focus:border-transparent outline-none
                            transition-all text-sm font-medium
                                ${errors.phone
                                    ? "border-red-500"
                                    : "border-outline-variant"
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                {/* <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Passpost</label>
                    <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                        <input
                            type="text"
                            value={formData.passport}
                            onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div> */}
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-outline hover:bg-surface-container-low transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all custom-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={16} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
