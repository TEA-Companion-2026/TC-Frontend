const TOKEN_KEY = "auth_token";

export const tokenStorage = {
	async saveToken(token: string) {
		return await localStorage.setItem("token", token);
	},

	async getToken() {
		return await localStorage.getItem("token");
	},

	async removeToken() {
		await localStorage.removeItem("token");
	},
};
