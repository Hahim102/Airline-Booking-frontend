import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, Shield, UserX, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsers } from '../../hooks/useUsers';

export default function UserManagementModel({ onClose }) {
    const { users, loading, error, fetchUsers, updateUserStatus, deleteUserById, searchUsers } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // Track which action is loading

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = searchUsers(searchTerm);

    /**
     * Handle user deletion with API call
     */
    const handleDelete = async (userId) => {
        try {
            setActionLoading(`delete-${userId}`);
            await deleteUserById(userId);
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting user:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const toggleStatus = async (userId) => {
        try {
            setActionLoading(`status-${userId}`);
            const user = users.find(u => u.id === userId);
            await updateUserStatus(userId, !user.active);
        } catch (err) {
            console.error('Error updating user status:', err);
        } finally {
            setActionLoading(null);
        }
    };


    return (
        <div className="space-y-6">
            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-error/10 border border-error/30 rounded-2xl flex items-start gap-3"
                    >
                        <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-error">Error</p>
                            <p className="text-xs text-error/80 mt-1">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    />
                </div>
                <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {loading ? 'Loading...' : `${filteredUsers.length} Users Found`}
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader size={32} className="text-primary animate-spin" />
                    <p className="text-outline font-medium">Loading users...</p>
                </div>
            )}

            {/* Users List */}
            {!loading && (
                <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 bg-white border border-outline-variant rounded-2xl flex items-center justify-between group hover:bg-surface-container-low transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover border border-outline-variant" alt={user.name} />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.active ? 'bg-green-500' : 'bg-outline-variant'}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
                                            {user.name}
                                            <span className="text-[10px] font-bold text-outline uppercase tracking-tighter bg-surface-container-high px-1.5 py-0.5 rounded">ID: #{user.id}</span>
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-[11px] text-outline font-medium">
                                                <Mail size={12} /> {user.email}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${user.active ? 'text-green-600 bg-green-50' : 'text-outline bg-surface-container-high'}`}>
                                                {user.active ? 'Active' : 'Suspended'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleStatus(user.id)}
                                        disabled={actionLoading === `status-${user.id}`}
                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            user.active ? 'text-outline hover:bg-amber-50 hover:text-amber-600' : 'text-green-600 hover:bg-green-50'
                                        }`}
                                        title={user.active ? "Suspend User" : "Activate User"}
                                    >
                                        {actionLoading === `status-${user.id}` ? (
                                            <Loader size={18} className="animate-spin" />
                                        ) : user.active ? (
                                            <UserX size={18} />
                                        ) : (
                                            <CheckCircle2 size={18} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(user.id)}
                                        disabled={actionLoading === `delete-${user.id}`}
                                        className="p-2 text-outline hover:bg-error-container hover:text-error rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete User"
                                    >
                                        {actionLoading === `delete-${user.id}` ? (
                                            <Loader size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* Delete Confirmation Overlay */}
                                {/* Delete Confirmation Overlay */}
                                <AnimatePresence>
                                    {deleteConfirm === user.id && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-between px-6 z-10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Shield className="text-error" size={20} />
                                                <p className="text-sm font-bold text-on-surface">Permanently delete {user.name}?</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    disabled={actionLoading === `delete-${user.id}`}
                                                    className="px-4 py-2 text-xs font-bold text-outline hover:bg-surface-container rounded-lg disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={actionLoading === `delete-${user.id}`}
                                                    className="px-4 py-2 text-xs font-bold bg-error text-white rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {actionLoading === `delete-${user.id}` ? (
                                                        <>
                                                            <Loader size={12} className="animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        'Confirm Delete'
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredUsers.length === 0 && !loading && (
                        <div className="py-20 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-surface-container-low rounded-full">
                                    <Search size={32} className="text-outline-variant" />
                                </div>
                            </div>
                            <p className="text-outline font-medium">No users found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}

            <div className="pt-6 border-t border-outline-variant flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">
                <span>User Management Panel</span>
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all text-on-surface disabled:opacity-50"
                >
                    Close Manager
                </button>
            </div>
        </div>
    );
}
