import keycloak from '@auth/keycloak';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-3xl">🛍️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Collector Shop
          </h1>
          <p className="text-slate-600 text-sm">
            Connectez-vous avec Keycloak pour continuer
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => keycloak.login()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => keycloak.register()}
            className="w-full border-2 border-indigo-200 text-indigo-700 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
