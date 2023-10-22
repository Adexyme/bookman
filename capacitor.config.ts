import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bookman',
  appName: 'bookman',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
