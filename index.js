import { registerRootComponent } from 'expo';
import App from './src/App'
import { initFirebase } from './src/firebase'

initFirebase();

registerRootComponent(App);