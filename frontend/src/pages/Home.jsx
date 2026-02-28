import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { meditationService } from '../services/api';
import { Calendar, BookOpen, User } from 'lucide-react';
import { getSundayDate, formatSundayNumber } from '../utils/dateHelpers';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Home = () => {
    const currentMonth = months[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMeditations = async () => {
        setLoading(true);
        try {
            const data = await meditationService.getMeditations(month, year);
            setMeditations(data);
        } catch (error) {
            console.error("Error fetching meditations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeditations();
    }, [month, year]);

    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        years.push(i);
    }

    return (
        <Layout>
            <Hero />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm border border-stone-100">
                    <h2 className="text-2xl font-serif font-bold text-amber-900">Schedule Viewer</h2>
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

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50/50 border-b border-stone-200">
                            <tr>
                                <th className="px-6 py-5 text-sm font-serif font-bold text-amber-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Sunday
                                </th>
                                <th className="px-6 py-5 text-sm font-serif font-bold text-amber-900">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> Psalm Chapter
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-sm font-serif font-bold text-amber-900">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> Person Name
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-stone-400">
                                        <div className="animate-pulse">Loading schedule...</div>
                                    </td>
                                </tr>
                            ) : meditations.length > 0 ? (
                                meditations.map((meditation) => (
                                    <tr key={meditation._id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col text-stone-700 font-medium">
                                                <span className="text-amber-900">{formatSundayNumber(meditation.sundayNumber)}</span>
                                                <span className="text-xs text-stone-400 font-normal mt-1">
                                                    {getSundayDate(meditation.year, meditation.month, meditation.sundayNumber)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-stone-900 font-[Crimson_Text] text-2xl">Psalm {meditation.psalmChapter}</td>
                                        <td className="px-6 py-5 text-stone-600 italic font-serif">{meditation.personName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center text-stone-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <BookOpen className="w-12 h-12 mb-4 opacity-10" />
                                            <p>No meditations scheduled for {month} {year}.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="bg-white/70 p-8 text-center text-stone-400 rounded-2xl border border-white/50">
                            Loading schedule...
                        </div>
                    ) : meditations.length > 0 ? (
                        meditations.map((meditation) => (
                            <div key={meditation._id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-amber-900 font-bold font-serif text-lg">{formatSundayNumber(meditation.sundayNumber)}</span>
                                        <span className="text-xs text-stone-400 mt-0.5">
                                            {getSundayDate(meditation.year, meditation.month, meditation.sundayNumber)}
                                        </span>
                                    </div>
                                    <div className="bg-amber-50 px-3 py-1 rounded-full text-amber-900 font-bold font-[Crimson_Text] text-2xl border border-amber-100">
                                        Psalm {meditation.psalmChapter}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600 pt-3 border-t border-stone-100">
                                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="italic font-serif">{meditation.personName}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/70 p-12 text-center text-stone-400 rounded-2xl border border-white/50">
                            <BookOpen className="w-10 h-10 mb-4 mx-auto opacity-10" />
                            <p>No schedule found.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
