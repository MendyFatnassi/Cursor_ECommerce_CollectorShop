import RecommendationPanel from '@components/recommendations/RecommendationPanel';
import usePortalStore from '@store/usePortalStore';

const HomePage = () => {
  const profile = usePortalStore((state) => state.profile);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Accueil
        </h1>
        <p className="text-slate-600">
          {profile
            ? `Bienvenue ${profile.fullName}. Découvrez les boutiques et les nouveautés.`
            : "Parcourez les articles. Connectez-vous pour accéder à votre espace."}
        </p>
      </div>
      <RecommendationPanel />
      {!profile && (
        <div className="card p-6 text-center text-sm text-slate-500">
          Créez un compte pour accéder à vos achats, notifications et préférences.
        </div>
      )}
    </div>
  );
};

export default HomePage;
