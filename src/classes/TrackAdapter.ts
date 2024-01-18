// import {PitchAlgorithm, ResourceObject, Track} from 'react-native-track-player';
import SongData from './SongData';

export default class TrackAdapter /* implements Track */ {
  // public album: string;
  public artist: string;
  // public artwork: string | ResourceObject;
  // public contentType: string;
  // public date: string;
  public description: string;
  public duration: number;
  // public genre: string;
  // public headers: { [p: string]: any };
  // public isLiveStream: boolean;
  // public pitchAlgorithm: PitchAlgorithm;
  // public rating: RatingType;
  public title: string;
  // public type: TrackType;
  // public url: string | ResourceObject;
  // public userAgent: string;

  constructor(song: SongData) {
    if (!song.musicly.file.path) throw Error('SongCard saved in DB should have a corresponding audio file');

    this.artist = song.channel.name;
    // this.artwork = song.musicly.cover.uri ?? require('../../assets/song_placeholder.png');
    this.description = song.description;
    this.duration = song.metadata.duration.seconds;
    // this.pitchAlgorithm = PitchAlgorithm.Music;
    // this.rating = song.musicly.playList?.flags.isFavourite ?? song.musicly.flags.isFavourite;
    this.title = song.title;
    // this.url = song.musicly.file.path;
  }
}
