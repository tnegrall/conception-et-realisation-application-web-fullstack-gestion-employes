import axios from 'axios';

// Configure default axios instance
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Ne pas afficher d’erreur si status 200 ou téléchargement réussi
    if (error.response && error.response.status === 200) {
      return Promise.resolve(error.response);
    }

    // 2. Ignorer les erreurs liées aux réponses binaires (blobs)
    // Cela arrive parfois quand le navigateur interrompt le téléchargement ou quand axios malinterprète le format
    if (
      error.config &&
      error.config.responseType === 'blob' &&
      (!error.response || error.response.status === 200)
    ) {
      // On retourne un objet vide ou un blob vide pour éviter de déclencher le catch global
      return Promise.resolve({ data: new Blob(), status: 200, statusText: 'OK' });
    }

    return Promise.reject(error);
  }
);

export default axios;
