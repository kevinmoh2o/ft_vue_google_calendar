import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/styles.scss'

// Cargar los scripts de Google de forma asíncrona
const googleScriptPromise = new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.async = true;
  script.defer = true;
  script.onload = resolve;
  document.body.appendChild(script);
});

const gsiScriptPromise = new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = resolve;
  document.body.appendChild(script);
});

// Esperar a que ambos scripts de Google se hayan cargado antes de iniciar la aplicación Vue
Promise.all([googleScriptPromise, gsiScriptPromise]).then(() => {
  createApp(App).mount('#app');
});


/* import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/styles.scss'

createApp(App)
    .mount('#app') */