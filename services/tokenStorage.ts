import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
	async saveToken(token: string) {
		if (Platform.OS === 'web') {
			localStorage.setItem(TOKEN_KEY, token);
		} else {
			await SecureStore.setItemAsync(TOKEN_KEY, token);
		}
	},

	async getToken() {
		if (Platform.OS === 'web') {
			return localStorage.getItem(TOKEN_KEY);
		} else {
			return await SecureStore.getItemAsync(TOKEN_KEY);
		}
	},

	async removeToken() {
		if (Platform.OS === 'web') {
			localStorage.removeItem(TOKEN_KEY);
		} else {
			await SecureStore.deleteItemAsync(TOKEN_KEY);
		}
	},
};
