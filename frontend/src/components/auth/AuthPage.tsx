import { useState } from 'react';
import client, { setAuthToken } from '@api/client';
import usePortalStore from '@store/usePortalStore';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { UserRole } from '@shared/index';

type AuthMode = 'login' | 'register';

interface ApiErrorResponse {
  message?: string;
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setProfile = usePortalStore((state) => state.setProfile);
  const resolveRedirect = (roles: UserRole[] = []) => {
    if (roles.includes('SELLER')) {
      return '/seller';
    }
    if (roles.includes('BUYER')) {
      return '/buyer';
    }
    return '/accueil';
  };

  // Formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['BUYER'] as UserRole[],
    acceptedTerms: false,
  });

  const toggleRegisterRole = (role: UserRole) => {
    setRegisterData((current) => {
      const nextRoles = current.roles.includes(role)
        ? current.roles.filter((value) => value !== role)
        : [...current.roles, role];
      return { ...current, roles: nextRoles };
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await client.post('/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      if (response.data.profile) {
        setProfile(response.data.profile);
        navigate(resolveRedirect(response.data.profile.roles));
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (registerData.roles.length === 0) {
      setError('Sélectionnez au moins un rôle');
      setLoading(false);
      return;
    }

    if (!registerData.acceptedTerms) {
      setError('Vous devez accepter les conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await client.post('/auth/register', {
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        roles: registerData.roles,
        acceptedTerms: registerData.acceptedTerms,
      });

      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      if (response.data.profile) {
        setProfile(response.data.profile);
        navigate(resolveRedirect(response.data.profile.roles));
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Erreur lors de l&apos;inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-3xl">🛍️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Collector Shop
          </h1>
          <p className="text-slate-600 text-sm">
            {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'register'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Formulaire de connexion */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* Formulaire d'inscription */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet
              </label>
              <input
                id="register-name"
                type="text"
                required
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">Rôles</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registerData.roles.includes('BUYER')}
                    onChange={() => toggleRegisterRole('BUYER')}
                    className="accent-blue-600"
                  />
                  Acheteur
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registerData.roles.includes('SELLER')}
                    onChange={() => toggleRegisterRole('SELLER')}
                    className="accent-emerald-600"
                  />
                  Vendeur
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                id="register-password"
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="register-confirm"
                type="password"
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={registerData.acceptedTerms}
                onChange={(event) =>
                  setRegisterData({ ...registerData, acceptedTerms: event.target.checked })
                }
                className="mt-1 accent-blue-600"
              />
              J&apos;accepte les conditions d&apos;utilisation.
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'S&apos;inscrire'}
            </button>
          </form>
        )}

        {/* Lien de bas de page */}
        <div className="text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                S&apos;inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
