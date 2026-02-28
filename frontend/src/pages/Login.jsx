import React, { useState } from 'react';
import Layout from '../components/Layout';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.login({ username, password });
            login(data);
            toast.success('Successfully logged in');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-200 w-full max-w-md">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-100">
                            <Lock className="w-8 h-8 text-amber-800" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-amber-900">Admin Login</h2>
                        <p className="text-stone-500 text-center mt-2">Enter your credentials to manage the schedule</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Admin username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center py-3"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
