import AsyncStorage from '@react-native-async-storage/async-storage';
import DataStore from 'react-native-local-mongodb';


export default abstract class DefaultDataStore {
	abstract get db(): DataStore;

	protected abstract store: string | undefined;

	async countAsync(query: object) {
		return new Promise<number>((resolve, reject) => {
			this.db.count(query, (err, count) => {
				if (err)
					reject(err);
				resolve(count);
			});
		});
	}

	protected initDataStore() {
		return new DataStore({
			autoload: true,
			corruptAlertThreshold: 0,
			filename: this.store,
			storage: {
				async getItem(key: string, cb): Promise<string | null> {
					const item = await AsyncStorage.getItem(key);
					if (cb)
						cb(undefined, item ?? undefined);
					return null;
				},
				async removeItem(key: string, cb): Promise<void> {
					await AsyncStorage.removeItem(key);

					if (cb)
						cb(undefined);
				},
				async setItem(key: string, value: string, cb?): Promise<void> {
					await AsyncStorage.setItem(key, value);
					if (cb)
						cb(undefined);
				}
			},
			timestampData: true
		});
	}
}