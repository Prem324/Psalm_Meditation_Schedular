import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { meditationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Calendar, Filter, User } from 'lucide-react';
import MeditationForm from '../components/MeditationForm';
import { getSundayDate, formatSundayNumber, countSundaysInMonth } from '../utils/dateHelpers';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
    const { admin, loading: authLoading } = useAuth();

    const currentMonth = months[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMeditation, setEditingMeditation] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const fetchMeditations = async () => {
        setLoading(true);
        try {
            const data = await meditationService.getMeditations(month, year);
            setMeditations(data);
        } catch (error) {
            toast.error('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin) fetchMeditations();
    }, [admin, month, year]);

    if (authLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-xl font-serif text-amber-900 animate-pulse">Verifying credentials...</div>
                </div>
            </Layout>
        );
    }

    if (!admin) return <Navigate to="/login" />;

    const handleAdd = async (formData) => {
        setFormLoading(true);
        try {
            await meditationService.createMeditation(formData);
            toast.success('Meditation added successfully');
            setIsFormOpen(false);
            fetchMeditations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add meditation');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (formData) => {
        setFormLoading(true);
        try {
            await meditationService.updateMeditation(editingMeditation._id, formData);
            toast.success('Meditation updated successfully');
            setIsFormOpen(false);
            setEditingMeditation(null);
            fetchMeditations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update meditation');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;

        const loadingToast = toast.loading('Deleting meditation...');
        try {
            await meditationService.deleteMeditation(id);
            toast.success('Meditation deleted', { id: loadingToast });
            fetchMeditations();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete meditation', { id: loadingToast });
        }
    };

    const openEdit = (meditation) => {
        setEditingMeditation(meditation);
        setIsFormOpen(true);
    };

    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        years.push(i);
    }

    const getNextSunday = () => {
        const totalSundays = countSundaysInMonth(year, month);
        if (meditations.length === 0) return 1;
        const maxSunday = Math.max(...meditations.map(m => m.sundayNumber));
        return maxSunday < totalSundays ? maxSunday + 1 : totalSundays;
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">Admin Dashboard</h1>
                        <p className="text-stone-500">Manage the monthly Bible meditation schedule</p>
                    </div>
                    <button
                        onClick={() => { setEditingMeditation(null); setIsFormOpen(true); }}
                        disabled={meditations.length >= countSundaysInMonth(year, month)}
                        className={`flex items-center gap-2 self-start md:self-center px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg ${meditations.length >= countSundaysInMonth(year, month)
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                            : 'bg-amber-800 text-white hover:bg-amber-900 shadow-amber-900/10'
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        {meditations.length >= countSundaysInMonth(year, month) ? 'Month Full' : 'Add New Entry'}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex items-center gap-2 text-amber-800">
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">Filter Schedule:</span>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50/50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-stone-500">Sunday Order (Desc)</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-stone-500">Psalm</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-stone-500">Person</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-stone-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-stone-400 font-medium">Loading entries...</td></tr>
                            ) : meditations.length > 0 ? (
                                meditations.map((meditation) => (
                                    <tr key={meditation._id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-amber-700" />
                                                    <span className="font-semibold text-stone-800">{formatSundayNumber(meditation.sundayNumber)}</span>
                                                </div>
                                                <span className="text-xs text-stone-400 mt-1 ml-6">
                                                    {getSundayDate(meditation.year, meditation.month, meditation.sundayNumber)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-[Crimson_Text] text-2xl text-amber-900">Psalm {meditation.psalmChapter}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-stone-600 italic font-serif">{meditation.personName}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(meditation)}
                                                    className="p-2 text-stone-400 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(meditation._id)}
                                                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-stone-400 font-serif italic">
                                        No meditations found for {month} {year}. Click "Add New Entry" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-4 px-1">
                    {loading ? (
                        <div className="bg-white/70 backdrop-blur-md p-8 text-center text-stone-400 rounded-2xl border border-white/50">
                            Loading dashboard details...
                        </div>
                    ) : meditations.length > 0 ? (
                        meditations.map((meditation) => (
                            <div key={meditation._id} className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/50 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 h-full w-1.5 bg-amber-800/20 group-hover:bg-amber-800 transition-colors"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-amber-700" />
                                            <span className="text-amber-900 font-bold font-serif text-lg">{formatSundayNumber(meditation.sundayNumber)}</span>
                                        </div>
                                        <span className="text-xs text-stone-400 mt-1 ml-6">
                                            {getSundayDate(meditation.year, meditation.month, meditation.sundayNumber)}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 relative z-50">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEdit(meditation);
                                            }}
                                            className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 shadow-sm active:bg-amber-100 active:scale-90 transition-all cursor-pointer"
                                            aria-label="Edit meditation"
                                        >
                                            <Edit2 className="w-6 h-6 pointer-events-none" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(meditation._id);
                                            }}
                                            className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 shadow-sm active:bg-red-100 active:scale-90 transition-all cursor-pointer"
                                            aria-label="Delete meditation"
                                        >
                                            <Trash2 className="w-6 h-6 pointer-events-none" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="text-stone-900 font-[Crimson_Text] text-3xl font-medium tracking-tight">
                                        Psalm {meditation.psalmChapter}
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-600 font-serif italic pt-3 border-t border-stone-100/50">
                                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {meditation.personName}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/70 backdrop-blur-md p-12 text-center text-stone-400 rounded-2xl border border-white/50">
                            <Calendar className="w-10 h-10 mb-4 mx-auto opacity-10" />
                            <p>No meditations scheduled.</p>
                        </div>
                    )}
                </div>
            </div>

            <MeditationForm
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingMeditation(null); }}
                onSubmit={editingMeditation ? handleUpdate : handleAdd}
                initialData={editingMeditation}
                defaultValues={{
                    month,
                    year,
                    sundayNumber: getNextSunday()
                }}
                loading={formLoading}
            />
        </Layout>
    );
};

export default Dashboard;
