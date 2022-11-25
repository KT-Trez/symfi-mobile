import {PlaylistMetadata, SongMetadata} from '../../typings/interfaces';


const useNumberCompare = (a: PlaylistMetadata | SongMetadata, b: PlaylistMetadata | SongMetadata, destructorFun: (item: PlaylistMetadata | SongMetadata) => number) => {
	return destructorFun(a) > destructorFun(b) ? 1 : -1;
};

export default useNumberCompare;