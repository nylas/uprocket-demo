import { initializeApp } from 'firebase/app'
import { FIREBASE_CONFIG } from './constants'


function createFirebaseApp() {
  const app = initializeApp(FIREBASE_CONFIG, 'nylas-app')
  return app
}
export default createFirebaseApp()
