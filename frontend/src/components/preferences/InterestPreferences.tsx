import { useState } from 'react';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

const InterestPreferences = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);
  const [tag, setTag] = useState('');

  if (!profile) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">🔒</span>
        </div>
        <p className="text-sm text-slate-500">Connectez-vous pour gérer vos centres d&apos;intérêt.</p>
      </div>
    );
  }

  const addTag = async () => {
    if (!tag.trim()) return;
    const response = await client.post('/profiles/interests', { tag });
    setProfile({ ...profile, interestTags: response.data });
    setTag('');
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">❤️</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Centres d&apos;intérêt</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tag}
          placeholder="Ajouter un tag..."
          onChange={(event) => setTag(event.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
        />
        <button onClick={addTag} className="btn-primary">
          Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[60px]">
        {profile.interestTags.map((interest) => (
          <span
            key={interest}
            className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-semibold border border-pink-200 hover:from-pink-200 hover:to-rose-200 transition-all cursor-pointer"
          >
            {interest}
          </span>
        ))}
        {!profile.interestTags.length && (
          <p className="text-sm text-slate-500 w-full text-center py-4">Pas d&apos;intérêts déclarés.</p>
        )}
      </div>
    </div>
  );
};

export default InterestPreferences;




