import React, { useState, useEffect } from 'react';
import { X, Calendar, Hash } from 'lucide-react';
import { getSundayDate, formatSundayNumber } from '../utils/dateHelpers';

const MeditationForm = ({ isOpen, onClose, onSubmit, initialData = null, defaultValues = null, loading = false }) => {
    const [formData, setFormData] = useState({
        month: '',
        year: '',
        sundayNumber: 1,
        psalmChapter: '',
        personName: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                month: initialData.month,
                year: initialData.year,
                sundayNumber: initialData.sundayNumber,
                psalmChapter: initialData.psalmChapter,
                personName: initialData.personName,
            });
        } else if (defaultValues) {
            setFormData({
                ...formData,
                month: defaultValues.month,
                year: defaultValues.year,
                sundayNumber: defaultValues.sundayNumber,
                psalmChapter: '',
                personName: '',
            });
        }
    }, [initialData, defaultValues, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
                    <h3 className="text-xl font-serif font-bold text-amber-900">
                        {initialData ? 'Edit Meditation' : 'Add New Meditation'}
                    </h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Auto-populated Context (ReadOnly for clarity) */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                                <Calendar className="w-5 h-5 text-amber-800" />
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Scheduled For</p>
                                <p className="text-stone-800 font-bold">
                                    {formatSundayNumber(formData.sundayNumber)} • {formData.month} {formData.year}
                                </p>
                                <p className="text-xs text-amber-700/60 italic">
                                    {getSundayDate(formData.year, formData.month, formData.sundayNumber) ||
                                        <span className="text-red-500 font-medium">⚠ This Sunday does not exist in {formData.month}</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-stone-400" /> Psalm Chapter (1-150)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="150"
                                required
                                className="input-field text-lg font-serif"
                                value={formData.psalmChapter}
                                onChange={(e) => setFormData({ ...formData, psalmChapter: Number(e.target.value) })}
                                placeholder="Enter chapter number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Assigned Person</label>
                            <select
                                required
                                className="input-field"
                                value={formData.personName}
                                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                            >
                                <option value="" disabled>Select a member</option>
                                {["Samuel Victor", "Stanley", "Thomas", "Aruna Sowjanya", "Naveen"].map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-3 shadow-lg shadow-amber-900/10"
                        >
                            {loading ? 'Saving...' : initialData ? 'Update Schedule' : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeditationForm;
