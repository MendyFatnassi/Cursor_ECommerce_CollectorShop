import { Link } from 'react-router-dom';
import RecommendationPanel from '@components/recommendations/RecommendationPanel';
import usePortalStore from '@store/usePortalStore';

const HomePage = () => {
  const profile = usePortalStore((state) => state.profile);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="card p-8 flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Accueil</p>
          <h1 className="text-3xl font-bold text-slate-900">Découvrez les boutiques et les articles</h1>
          <p className="text-slate-600 mt-2">
            Explorez le catalogue public et retrouvez vos recommandations personnalisées.
          </p>
        </div>
        {!profile && (
          <div className="flex flex-wrap gap-3">
            <Link to="/auth" className="btn-primary">
              Se connecter / Créer un compte
            </Link>
            <span className="text-sm text-slate-500 self-center">
              Aucun compte requis pour parcourir l&apos;accueil.
            </span>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Articles du moment</h2>
        <RecommendationPanel />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Boutiques publiques</h2>
        <div className="card p-6 text-sm text-slate-500">
          Les boutiques publiques seront listées ici dès que disponibles.
        </div>
      </section>
    </div>
  );
};

export default HomePage;
