import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.my.dsa.dkrh',
  appName: 'DKRH App',
  webDir: 'www',

	server: {
		url: "https://dwanga.com",
		cleartext: false,
	},
};

export default config;
