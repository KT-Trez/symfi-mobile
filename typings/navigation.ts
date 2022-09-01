export type RootStackParamList = {
	PlaylistContent: { id: string, };
	PlaylistEdit: { id: string, refreshList: () => void };
	PlaylistMenu: undefined;
};