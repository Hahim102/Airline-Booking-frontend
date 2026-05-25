import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Search, Trash2, Mail, Shield, UserX, CheckCircle2,
    ChevronUp, ChevronDown, Filter, Phone, Edit2, Check,
    X as CloseIcon, User as UserIcon, ChevronLeft, ChevronRight, Loader, Download, Eye
} from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { validateFullName, validatePhone } from '../../validation/userValidation';
import ExportReportModal from './ExportReportModal';
import Modal from '../ui/Modal';

const ROLES = ['ROLE_USER', 'ROLE_SYSTEM_ADMIN', 'ROLE_AIRLINE_OWNER'];
const ROLE_LABELS = { 'ROLE_USER': 'ROLE_USER', 'ROLE_SYSTEM_ADMIN': 'ADMIN', 'ROLE_AIRLINE_OWNER': 'OWNER' };
const ROLE_STYLES = {
    'ROLE_AIRLINE_OWNER': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'ROLE_SYSTEM_ADMIN': 'bg-amber-50 text-amber-700 border border-amber-200',
    'ROLE_USER': 'bg-slate-50 text-slate-700 border border-slate-200',
};

export default function UserManagementModal({ onClose }) {
    const {
        users, loading, error, searchAndFilterUsers,
        updateUserStatus, deleteUserById, updateUserProfile, fetchUserProfile
    } = useUsers();

    const [allUsers, setAllUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', phone: '', role: 'ALL' });
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showExportModal, setShowExportModal] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [viewingUserProfile, setViewingUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            const filterParams = {};
            if (filters.name) filterParams.fullName = filters.name;
            if (filters.email) filterParams.email = filters.email;
            if (filters.phone) filterParams.phone = filters.phone;
            if (filters.role !== 'ALL') filterParams.role = filters.role;

            const sortByMap = { name: 'fullName', email: 'email', role: 'role' };
            const result = await searchAndFilterUsers(filterParams, {
                pageNumber: currentPage,
                pageSize: pageSize,
                sortBy: sortByMap[sortConfig.key] || 'fullName',
                sortOrder: sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
            });
            setAllUsers(result.users);
            setTotalPages(result.totalPages);
            setTotalElements(result.totalElements);
        } catch (err) { 
            console.error('Failed to load users:', err?.message || err);
            setAllUsers([]);
        }
    }, [filters, currentPage, sortConfig, pageSize, searchAndFilterUsers]);

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(0);
    };
    const handleBlur = () => {
        let value = Number(pageSize);

        if (isNaN(value) || value < 1) {
            value = 1;
        }

        setPageSize(value);
    };

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(0);
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(0);
    };

    const handleViewProfile = async (userEmail) => {
        setProfileLoading(true);
        try {
            const profile = await fetchUserProfile(userEmail);
            setViewingUserProfile(profile);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        const targetUser = allUsers.find((user) => user.id === String(userId));

        if (targetUser?.role === 'ROLE_SYSTEM_ADMIN') {
            console.warn('Cannot delete another admin');
            return;
        }

        setActionLoading(userId);
        try {
            await deleteUserById(userId);
            setDeleteConfirm(null);
            loadUsers();
        } catch {
            console.error('Failed to delete user:', err?.message || err);
         }
        setActionLoading(null);
    };

    const toggleStatus = async (userId, currentActive) => {
        const targetUser = allUsers.find((user) => user.id === String(userId));

        if (targetUser?.role === 'ROLE_SYSTEM_ADMIN') {
            console.warn('Cannot change admin status');
            return;
        }

        setActionLoading(userId);
        try {
            await updateUserStatus(userId, !currentActive);
            loadUsers();
        } catch {
            console.error('Failed to update user status:', err?.message || err);
          }
        setActionLoading(null);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        if (editingUser.role === 'ROLE_SYSTEM_ADMIN') {
            console.warn('Cannot update another admin');
            return;
        }

        const errors = {};
        const nameErr = validateFullName(editingUser.name);
        const phoneErr = editingUser.phone ? validatePhone(editingUser.phone) : null;
        if (nameErr) errors.name = nameErr;
        if (phoneErr) errors.phone = phoneErr;

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors({});
        setEditLoading(true);
        try {
            await updateUserProfile(editingUser.id, {
                fullName: editingUser.name,
                phone: editingUser.phone,
                role: editingUser.role,
            });
            setEditingUser(null);
            loadUsers();
        } catch {
            console.error('Failed to update user:', err?.message || err);
        }
        setEditLoading(false);
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-20" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="text-primary" />
            : <ChevronDown size={14} className="text-primary" />;
    };

    const clearFilters = () => {
        setFilters({ name: '', email: '', phone: '', role: 'ALL' });
        setCurrentPage(0);
    };
    const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== 'ALL');

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible);
        if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
        for (let i = start; i < end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-col h-full space-y-5 relative">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant shadow-sm">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Search Name</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                        <input type="text" placeholder="e.g. John Doe" value={filters.name}
                            onChange={(e) => updateFilter('name', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-xs" />
                    </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Search Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                        <input type="text" placeholder="e.g. john@sky.com" value={filters.email}
                            onChange={(e) => updateFilter('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-xs" />
                    </div>
                </div>
                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Search Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                        <input type="text" placeholder="e.g. +84..." value={filters.phone}
                            onChange={(e) => updateFilter('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-xs" />
                    </div>
                </div>
                {/* Role */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Filter Role</label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                        <select value={filters.role} onChange={(e) => updateFilter('role', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-[10px] uppercase tracking-wider appearance-none cursor-pointer">
                            <option value="ALL">All Roles</option>
                            <option value="ROLE_USER">User Only</option>
                            <option value="ROLE_SYSTEM_ADMIN">Admin Only</option>
                            <option value="ROLE_AIRLINE_OWNER">Owner Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Record Count */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
                            {totalElements} Active Records
                        </span>
                    </div>
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="px-4 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-full border border-primary/10 transition-colors flex items-center gap-2"
                    >
                        <Download size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
                            Export
                        </span>
                    </button>
                    {hasActiveFilters && (
                        <button onClick={clearFilters}
                            className="text-[10px] font-black text-outline hover:text-primary uppercase tracking-widest transition-colors">
                            Clear All Filters
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-white border border-outline-variant rounded-2xl px-3 py-2 shadow-sm">
                    <input
                        type="number"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        onBlur={handleBlur}
                        className="w-16 bg-transparent text-center font-bold outline-none"
                    />

                    <span className="px-3 py-2 rounded-xl border border-outline-variant bg-white text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20">
                        Rows/Page
                    </span>

                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden border border-outline-variant rounded-[2rem] bg-white shadow-sm flex flex-col min-h-[300px]">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest cursor-pointer hover:bg-surface-container-low transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">User Profile <SortIcon column="name" /></div>
                                </th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest cursor-pointer hover:bg-surface-container-low transition-colors" onClick={() => handleSort('email')}>
                                    <div className="flex items-center gap-2">Contact Details <SortIcon column="email" /></div>
                                </th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest cursor-pointer hover:bg-surface-container-low transition-colors" onClick={() => handleSort('role')}>
                                    <div className="flex items-center gap-2">Designation <SortIcon column="role" /></div>
                                </th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            <AnimatePresence mode="popLayout">
                                {allUsers.map((user) => {
                                    const isAdminUser = user.role === 'ROLE_SYSTEM_ADMIN';

                                    return (
                                    <motion.tr key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="group hover:bg-surface-container-low/30 transition-colors relative">
                                        {/* Profile */}
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-outline-variant shadow-sm" alt={user.name} />
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-outline">ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Contact */}
                                        <td className="p-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-on-surface">
                                                    <Mail size={14} className="text-outline-variant" />{user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-outline">
                                                        <Phone size={14} className="text-outline-variant" />{user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {/* Role */}
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${ROLE_STYLES[user.role] || ROLE_STYLES['ROLE_USER']}`}>
                                                {ROLE_LABELS[user.role] || user.role}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="p-5">
                                            <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${user.active ? 'text-green-600' : 'text-outline/50'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500 animate-pulse' : 'bg-outline-variant'}`} />
                                                {user.active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {actionLoading === user.id ? (
                                                    <Loader size={18} className="animate-spin text-primary" />
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setViewingUser(user);
                                                                handleViewProfile(user.email);
                                                            }}
                                                            className="p-2 rounded-xl transition-all text-outline hover:bg-blue-50 hover:text-blue-600"
                                                            title="View profile"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            disabled={isAdminUser}
                                                            onClick={() => !isAdminUser && setEditingUser({ ...user })}
                                                            className={`p-2 rounded-xl transition-all ${isAdminUser
                                                                    ? 'text-outline/30 cursor-not-allowed'
                                                                    : 'text-outline hover:bg-primary/10 hover:text-primary'
                                                                }`}
                                                            title={isAdminUser ? 'Cannot edit another admin' : 'Edit'}
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            disabled={isAdminUser}
                                                            onClick={() => !isAdminUser && toggleStatus(user.id, user.active)}
                                                            className={`p-2 rounded-xl transition-all ${isAdminUser
                                                                    ? 'text-outline/30 cursor-not-allowed'
                                                                    : user.active
                                                                        ? 'text-outline hover:bg-amber-50 hover:text-amber-600'
                                                                        : 'text-green-600 hover:bg-green-50'
                                                                }`}
                                                            title={isAdminUser ? 'Cannot change admin status' : user.active ? 'Suspend' : 'Activate'}
                                                        >
                                                            {user.active ? <UserX size={18} /> : <CheckCircle2 size={18} />}
                                                        </button>
                                                        <button
                                                            disabled={isAdminUser}
                                                            onClick={() => !isAdminUser && setDeleteConfirm(user.id)}
                                                            className={`p-2 rounded-xl transition-all ${isAdminUser
                                                                    ? 'text-outline/30 cursor-not-allowed'
                                                                    : 'text-outline hover:bg-red-50 hover:text-red-600'
                                                                }`}
                                                            title={isAdminUser ? 'Cannot delete another admin' : 'Delete'}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {/* Delete confirm overlay */}
                                            <AnimatePresence>
                                                {deleteConfirm === user.id && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="absolute inset-0 bg-white/95 rounded-lg flex items-center justify-end px-10 gap-6 z-10 border border-red-200">
                                                        <div className="flex items-center gap-3">
                                                            <Shield className="text-red-500" size={24} />
                                                            <p className="text-sm font-black text-on-surface uppercase tracking-tight">Confirm Deletion of {user.name}?</p>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => setDeleteConfirm(null)}
                                                                className="px-5 py-2 text-xs font-bold text-outline hover:bg-surface-container rounded-xl border border-outline-variant">Cancel</button>
                                                            <button onClick={() => handleDelete(user.id)}
                                                                className="px-6 py-2 text-xs font-bold bg-red-600 text-white rounded-xl shadow-lg shadow-red-200">
                                                                {actionLoading === user.id ? <Loader size={14} className="animate-spin" /> : 'Delete Forever'}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {!loading && allUsers.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 bg-surface-container-low/20">
                        <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-outline-variant mb-4">
                            <Search size={48} className="text-outline-variant/30" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">No users found</h3>
                        <p className="text-sm text-outline font-medium mt-1">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                        className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft size={16} />
                    </button>
                    {pageNumbers[0] > 0 && (
                        <>
                            <button onClick={() => setCurrentPage(0)} className="w-9 h-9 rounded-xl text-xs font-bold border border-outline-variant hover:bg-surface-container-low transition-all">1</button>
                            {pageNumbers[0] > 1 && <span className="text-outline text-xs px-1">...</span>}
                        </>
                    )}
                    {pageNumbers.map(p => (
                        <button key={p} onClick={() => setCurrentPage(p)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${p === currentPage
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'border border-outline-variant hover:bg-surface-container-low'}`}>
                            {p + 1}
                        </button>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && <span className="text-outline text-xs px-1">...</span>}
                            <button onClick={() => setCurrentPage(totalPages - 1)} className="w-9 h-9 rounded-xl text-xs font-bold border border-outline-variant hover:bg-surface-container-low transition-all">{totalPages}</button>
                        </>
                    )}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}
                        className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-10">
                        <motion.form onSubmit={handleUpdateUser} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-outline-variant p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-2xl"><Edit2 size={24} className="text-primary" /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Edit Profile</h3>
                                        <p className="text-xs text-outline font-bold uppercase tracking-widest">User ID: #{editingUser.id}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setEditingUser(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                                    <CloseIcon size={24} className="text-outline" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                                        <input required type="text" value={editingUser.name}
                                            onChange={(e) => { setEditingUser({ ...editingUser, name: e.target.value }); setValidationErrors(prev => ({ ...prev, name: null })); }}
                                            className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm ${validationErrors.name ? 'border-red-400' : 'border-outline-variant'}`} />
                                    </div>
                                    {validationErrors.name && <p className="text-[10px] font-bold text-red-500 px-1">{validationErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Email Address <span className="text-outline-variant">(read-only)</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant/50" size={18} />
                                        <input type="email" value={editingUser.email} disabled
                                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/50 rounded-2xl outline-none font-bold text-sm text-outline cursor-not-allowed" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                                        <input type="tel" value={editingUser.phone || ''}
                                            onChange={(e) => { setEditingUser({ ...editingUser, phone: e.target.value }); setValidationErrors(prev => ({ ...prev, phone: null })); }}
                                            className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm ${validationErrors.phone ? 'border-red-400' : 'border-outline-variant'}`} />
                                    </div>
                                    {validationErrors.phone && <p className="text-[10px] font-bold text-red-500 px-1">{validationErrors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Role</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {ROLES.map((role) => (
                                            <button key={role} type="button" onClick={() => setEditingUser({ ...editingUser, role })}
                                                className={`py-3 px-4 rounded-2xl border text-[10px] font-black tracking-widest uppercase transition-all ${editingUser.role === role
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                    : 'bg-surface-container-low text-outline border-outline-variant hover:border-primary/50'}`}>
                                                {ROLE_LABELS[role] || role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setEditingUser(null)}
                                    className="flex-1 py-4 bg-surface border border-outline-variant text-[10px] font-black uppercase tracking-widest text-on-surface rounded-2xl hover:bg-surface-container-low transition-all">
                                    Discard Changes
                                </button>
                                <button type="submit" disabled={editLoading}
                                    className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                    {editLoading ? <Loader size={16} className="animate-spin" /> : <><Check size={16} /> Save Identity</>}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error display */}
            {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
                    {error}
                </div>
            )}

            {/* Export Modal */}
            <Modal 
                isOpen={showExportModal} 
                onClose={() => setShowExportModal(false)} 
                title="Export Users"
            >
                <ExportReportModal 
                    exportType="users"
                    onClose={() => setShowExportModal(false)} 
                />
            </Modal>

            {/* View User Profile Modal */}
            <AnimatePresence>
                {viewingUser && viewingUserProfile && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-10">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-outline-variant overflow-hidden">
                            {/* Header */}
                            <div className="p-8 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={viewingUserProfile.avatar} alt={viewingUserProfile.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20" />
                                    <div>
                                        <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">{viewingUserProfile.name}</h3>
                                        <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">User ID: #{viewingUserProfile.id}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => {
                                    setViewingUser(null);
                                    setViewingUserProfile(null);
                                }} className="p-2 hover:bg-white rounded-full transition-colors">
                                    <CloseIcon size={24} className="text-outline" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Email Address</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <p className="text-sm font-bold text-on-surface">{viewingUserProfile.email}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Phone Number</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <p className="text-sm font-bold text-on-surface">{viewingUserProfile.phone || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Role</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${ROLE_STYLES[viewingUserProfile.role] || ROLE_STYLES['ROLE_USER']}`}>
                                                {ROLE_LABELS[viewingUserProfile.role] || viewingUserProfile.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Status</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <span className={`flex items-center gap-2 text-sm font-bold ${viewingUserProfile.active ? 'text-green-600' : 'text-outline/50'}`}>
                                                <div className={`w-2 h-2 rounded-full ${viewingUserProfile.active ? 'bg-green-500' : 'bg-outline-variant'}`} />
                                                {viewingUserProfile.active ? 'Active' : 'Suspended'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    {(viewingUserProfile.createdAt || viewingUserProfile.created_at) && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Created Date</label>
                                            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                                <p className="text-sm font-bold text-on-surface">
                                                    {new Date(viewingUserProfile.createdAt || viewingUserProfile.created_at).toLocaleDateString()} • {new Date(viewingUserProfile.createdAt || viewingUserProfile.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Updated Date */}
                                    {(viewingUserProfile.updatedAt || viewingUserProfile.updated_at) && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Updated Date</label>
                                            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                                <p className="text-sm font-bold text-on-surface">
                                                    {new Date(viewingUserProfile.updatedAt || viewingUserProfile.updated_at).toLocaleDateString()} • {new Date(viewingUserProfile.updatedAt || viewingUserProfile.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Last Login */}
                                    {viewingUserProfile.lastLoginAt && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Last Login</label>
                                            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                                <p className="text-sm font-bold text-on-surface">
                                                    {new Date(viewingUserProfile.lastLoginAt).toLocaleDateString()} • {new Date(viewingUserProfile.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Full Name */}
                                {viewingUserProfile.fullName && viewingUserProfile.fullName !== viewingUserProfile.name && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Full Name</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <p className="text-sm font-bold text-on-surface">{viewingUserProfile.fullName}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Deleted Status */}
                                {viewingUserProfile.isDeleted !== undefined && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] px-1">Status</label>
                                        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl">
                                            <p className="text-sm font-bold text-on-surface">{viewingUserProfile.isDeleted ? 'Deleted' : 'Active'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-center">
                                <button
                                    onClick={() => {
                                        setViewingUser(null);
                                        setViewingUserProfile(null);
                                    }}
                                    className="px-10 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
