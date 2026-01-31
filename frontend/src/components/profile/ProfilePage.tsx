import { useEffect, useMemo, useState } from 'react';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

type SaveStatus = { type: 'success' | 'error'; message: string } | null;

const ProfilePage = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);
  const [fullName, setFullName] = useState('');
  const [locales, setLocales] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SaveStatus>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName ?? '');
    setLocales(profile.preferredLocales?.join(', ') ?? '');
  }, [profile]);

  const parsedLocales = useMemo(
    () =>
      locales
        .split(',')
        .map((locale) => locale.trim())
        .filter(Boolean),
    [locales]
  );

  const handleReset = () => {
    if (!profile) return;
    setFullName(profile.fullName ?? '');
    setLocales(profile.preferredLocales?.join(', ') ?? '');
    setStatus(null);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setStatus(null);
    try {
      const payload: { fullName?: string; preferredLocales?: string[] } = {};
      const normalizedName = fullName.trim();
      if (normalizedName) {
        payload.fullName = normalizedName;
      }
      if (parsedLocales.length) {
        payload.preferredLocales = parsedLocales;
      }
      const response = await client.patch('/profiles/me', payload);
      setProfile(response.data);
      setStatus({ type: 'success', message: 'Profil mis à jour avec succès.' });
    } catch {
      setStatus({ type: 'error', message: 'Impossible de mettre à jour le profil.' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="card p-6 text-center text-sm text-slate-500">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Profil
        </h1>
        <p className="text-slate-600">
          Visualisez vos informations de connexion et mettez-les à jour.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Informations de connexion</h2>
                <p className="text-xs text-slate-500">
                  Votre email est utilisé pour vous connecter.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-500"
                />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.emailVerified
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {profile.emailVerified ? 'Vérifié' : 'À vérifier'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="full-name" className="block text-sm font-medium text-slate-700">
                Nom complet
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Préférences</h2>
                <p className="text-xs text-slate-500">
                  Langues préférées séparées par une virgule.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="preferred-locales" className="block text-sm font-medium text-slate-700">
                Locales préférées
              </label>
              <input
                id="preferred-locales"
                type="text"
                value={locales}
                onChange={(event) => setLocales(event.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="fr-FR, en-GB"
              />
              {parsedLocales.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsedLocales.map((locale) => (
                    <span
                      key={locale}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700"
                    >
                      {locale}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {status && (
                <span className={status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}>
                  {status.message}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                Réinitialiser
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏷️</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Rôles & statut</h2>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Rôles actifs</div>
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
              {!profile.roles.length && (
                <p className="text-sm text-slate-500">Aucun rôle assigné.</p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Réputation</span>
                <span className="font-semibold text-slate-800">{profile.reputation.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Centres d&apos;intérêt</span>
                <span className="font-semibold text-slate-800">{profile.interestTags.length}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
