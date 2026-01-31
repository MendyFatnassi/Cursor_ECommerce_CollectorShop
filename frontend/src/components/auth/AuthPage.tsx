import { useState } from 'react';
import client, { setAuthToken } from '@api/client';
import usePortalStore from '@store/usePortalStore';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

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
    roles: ['BUYER'] as Array<'BUYER' | 'SELLER'>,
    acceptedTerms: false,
  });

  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');

  const toggleRole = (role: 'BUYER' | 'SELLER') => {
    setRegisterData((prev) => {
      const exists = prev.roles.includes(role);
      const roles = exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const clearAuthMessages = () => {
    setVerificationToken(null);
    setVerificationMessage(null);
    setForgotMessage(null);
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

      if (response.data.profile && response.data.token) {
        setAuthToken(response.data.token);
        setProfile(response.data.profile);
        const roles = response.data.profile.roles ?? [];
        const redirectPath = roles.includes('ADMIN')
          ? '/admin'
          : roles.includes('SELLER')
            ? '/acceuil'
            : '/buyer';
        navigate(redirectPath);
      } else {
        setError('Connexion impossible. Vérifiez votre email avant de vous connecter.');
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

    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(registerData.password);
    if (!passwordValid) {
      setError('Le mot de passe doit contenir 8 caractères minimum avec lettre et chiffre');
      setLoading(false);
      return;
    }

    if (!registerData.roles.length) {
      setError('Sélectionnez au moins un rôle');
      setLoading(false);
      return;
    }

    if (!registerData.acceptedTerms) {
      setError('Vous devez accepter les conditions RGPD');
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

      if (response.data.token && response.data.profile) {
        setAuthToken(response.data.token);
        setProfile(response.data.profile);
        const redirectPath = registerData.roles.includes('SELLER') ? '/acceuil' : '/buyer';
        navigate(redirectPath);
        return;
      }

      setVerificationToken(response.data.verificationToken ?? null);
      setVerificationMessage(
        "Inscription réussie. Vérifiez votre email avant de vous connecter."
      );
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationToken) return;
    setLoading(true);
    setError(null);
    try {
      await client.post('/auth/verify-email', { token: verificationToken });
      setVerificationMessage('Email vérifié. Vous pouvez maintenant vous connecter.');
      setVerificationToken(null);
      setMode('login');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || "Impossible de vérifier l'email");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForgotMessage(null);
    try {
      const response = await client.post('/auth/password/forgot', { email: forgotEmail });
      setForgotMessage(response.data?.message ?? "Si l'email existe, un lien a été envoyé");
      if (response.data?.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (resetPassword !== resetConfirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(resetPassword);
    if (!passwordValid) {
      setError('Le mot de passe doit contenir 8 caractères minimum avec lettre et chiffre');
      setLoading(false);
      return;
    }

    try {
      await client.post('/auth/password/reset', { token: resetToken, newPassword: resetPassword });
      setForgotMessage('Mot de passe mis à jour. Vous pouvez vous connecter.');
      setResetPassword('');
      setResetConfirm('');
      setMode('login');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Erreur lors de la réinitialisation');
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
              clearAuthMessages();
              setForgotMode(false);
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
              clearAuthMessages();
              setForgotMode(false);
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

        {verificationMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm space-y-2">
            <p>{verificationMessage}</p>
            {verificationToken && (
              <div className="space-y-2">
                <p className="text-xs text-amber-600">
                  Mode dev : token de validation <span className="font-mono">{verificationToken}</span>
                </p>
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="text-sm font-medium text-amber-700 hover:text-amber-800 underline"
                >
                  Valider mon email
                </button>
              </div>
            )}
          </div>
        )}

        {/* Formulaire de connexion */}
        {mode === 'login' && (
          <div className="space-y-4">
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

            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotMode((prev) => !prev)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {forgotMode && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email de récupération
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-all"
                >
                  {loading ? 'Envoi...' : 'Recevoir le lien'}
                </button>
              </form>
            )}

            {forgotMode && resetToken && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label htmlFor="reset-token" className="block text-sm font-medium text-slate-700 mb-1">
                    Token de réinitialisation
                  </label>
                  <input
                    id="reset-token"
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reset-password" className="block text-sm font-medium text-slate-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    required
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reset-confirm" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="reset-confirm"
                    type="password"
                    required
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition-all"
                >
                  {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            )}

            {forgotMode && forgotMessage && (
              <p className="text-sm text-slate-500">{forgotMessage}</p>
            )}
          </div>
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
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registerData.roles.includes('BUYER')}
                    onChange={() => toggleRole('BUYER')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Acheteur
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={registerData.roles.includes('SELLER')}
                    onChange={() => toggleRole('SELLER')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
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
                minLength={8}
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
                minLength={8}
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={registerData.acceptedTerms}
                onChange={(e) =>
                  setRegisterData({ ...registerData, acceptedTerms: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              J'accepte les conditions et la politique RGPD.
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
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
                  clearAuthMessages();
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                S'inscrire
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
                  clearAuthMessages();
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
