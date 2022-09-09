import axios, {AxiosInstance} from 'axios';


export default class HTTPModule {
	// static
	static clients = new Map<string, HTTPModule>();

	// instance
	private axios: AxiosInstance;
	private id: string;

	constructor(baseURL: string, id: string) {
		this.axios = axios.create({
			baseURL,
			timeout: 20000
		});
		this.id = id;
	}
}