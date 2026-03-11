import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './Admin.css';

function Admin() {
    const [users, setUsers] = useState([]);
    const [courseSignups, setCourseSignups] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' ou 'signups'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Sécurité supplémentaire côté frontend
        const adminEmails = ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'];
        if (!isAuthenticated || !adminEmails.includes(user?.email)) {
            navigate('/');
            return;
        }

        loadData();
    }, [isAuthenticated, user, navigate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersRes, signupsRes] = await Promise.all([
                apiService.getAdminUsers(),
                apiService.getAdminCourseSignups()
            ]);

            if (usersRes.success) {
                setUsers(usersRes.data);
            }
            if (signupsRes.success) {
                setCourseSignups(signupsRes.data);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const adminEmails = ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'];
    if (!isAuthenticated || !adminEmails.includes(user?.email)) {
        return null;
    }

    return (
        <div className="admin-page">
            <div className="admin-left">
                <div className="admin-branding">
                    <img src="/logo.jpeg" alt="Logo" className="admin-logo-img" />
                    <h1>Conseilux<br />Language Academy</h1>
                </div>

                <div className="admin-security-info">
                    <h2>🔒 Sécurité & Confidentialité</h2>
                    <p>
                        La sécurité des données de nos utilisateurs est notre priorité absolue.
                        En tant qu'administrateur, vous avez accès à des informations sensibles.
                    </p>
                    <ul>
                        <li>Toutes les données sont chiffrées au repos et en transit.</li>
                        <li>L'accès est strictement réservé au personnel autorisé.</li>
                        <li>Conformité stricte avec le RGPD.</li>
                        <li>Les mots de passe ne sont jamais stockés en clair.</li>
                    </ul>
                    <div className="security-status">
                        <span className="status-dot"></span>
                        Système de surveillance actif
                    </div>
                </div>

                <button onClick={() => navigate('/')} className="btn-back-home">
                    ← Retour à la plateforme
                </button>
            </div>

            <div className="admin-right">
                <div className="admin-header">
                    <h2>Tableau de bord Administrateur</h2>
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            Utilisateurs inscrits ({users.length})
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'signups' ? 'active' : ''}`}
                            onClick={() => setActiveTab('signups')}
                        >
                            Intéressés par les cours ({courseSignups.length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">Chargement des données...</div>
                ) : error ? (
                    <div className="admin-error">{error}</div>
                ) : (
                    <div className="admin-table-container">
                        {activeTab === 'users' ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom / Prénom</th>
                                        <th>Email</th>
                                        <th>Date d'inscription</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.full_name}</td>
                                            <td>{u.email}</td>
                                            <td>{new Date(u.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom / Prénom</th>
                                        <th>Email</th>
                                        <th>Pays</th>
                                        <th>Date d'inscription</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseSignups.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.first_name} {s.last_name}</td>
                                            <td>{s.email}</td>
                                            <td>{s.country}</td>
                                            <td>{new Date(s.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
