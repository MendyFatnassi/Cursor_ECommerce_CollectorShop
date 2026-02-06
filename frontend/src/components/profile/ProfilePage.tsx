import { useEffect, useMemo, useState } from 'react';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';
import { UserRole } from '@shared/index';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

const ProfilePage = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [locales, setLocales] = useState(profile?.preferredLocales?.join(', ') ?? '');
  const [roles, setRoles] = useState<Set<UserRole>>(new Set(profile?.roles ?? []));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setFullName(profile.fullName ?? '');
    setLocales(profile.preferredLocales?.join(', ') ?? '');
    setRoles(new Set(profile.roles ?? []));
  }, [profile]);

  const canSave = useMemo(() => roles.size > 0 && !loading, [roles, loading]);

  const toggleRole = (role: UserRole) => {
    setRoles((current) => {
      const next = new Set(current);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (roles.size === 0) {
      setError('Sélectionnez au moins un rôle.');
      setLoading(false);
      return;
    }

    const preferredLocales = locales
      .split(',')
      .map((locale) => locale.trim())
      .filter(Boolean);

    try {
      const response = await client.patch('/profiles/me', {
        fullName,
        roles: Array.from(roles),
        preferredLocales
      });
      setProfile(response.data);
      setMessage('Profil mis à jour.');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profil</h1>
        <p className="text-slate-600">Gérez vos informations de connexion et vos rôles.</p>
      </div>

      <div className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="text"
              value={profile?.email ?? ''}
              readOnly
              className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {profile?.emailVerified ? 'Email vérifié' : 'Email non vérifié'}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Langues préférées</label>
            <input
              type="text"
              placeholder="fr-FR, en-GB"
              value={locales}
              onChange={(event) => setLocales(event.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Rôles</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={roles.has('BUYER')}
                onChange={() => toggleRole('BUYER')}
                className="accent-blue-600"
              />
              Acheteur
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={roles.has('SELLER')}
                onChange={() => toggleRole('SELLER')}
                className="accent-emerald-600"
              />
              Vendeur
            </label>
          </div>
        </div>

        {message && <div className="text-sm text-emerald-600">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
