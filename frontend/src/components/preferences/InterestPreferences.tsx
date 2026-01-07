import { useState } from 'react';
import client from '@api/client';
import usePortalStore from '@store/usePortalStore';

const InterestPreferences = () => {
  const profile = usePortalStore((state) => state.profile);
  const setProfile = usePortalStore((state) => state.setProfile);
  const [tag, setTag] = useState('');

  if (!profile) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-sm text-slate-500">Connectez-vous pour gérer vos centres d’intérêt.</p>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Centres d’intérêt</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={tag}
          placeholder="Ajouter un tag..."
          onChange={(event) => setTag(event.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2"
        />
        <button onClick={addTag} className="px-3 py-2 bg-slate-900 text-white rounded-lg">
          Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.interestTags.map((interest) => (
          <span key={interest} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
            {interest}
          </span>
        ))}
        {!profile.interestTags.length && <p className="text-sm text-slate-500">Pas d’intérêts déclarés.</p>}
      </div>
    </div>
  );
};

export default InterestPreferences;




