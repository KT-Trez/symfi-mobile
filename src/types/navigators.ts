import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type CollectionNavigatorProps = NativeStackNavigationProp<CollectionNavigatorParams>;

export type CollectionNavigatorParams = {
  CollectionDetails: { id: string };
  CollectionEdit: { id: string };
  CollectionForm: undefined;
  CollectionPage: undefined;
  SongsSearch: undefined;
  SongPicker: { collectionId: string };
};

export type MainNavigatorParams = {
  CollectionNavigator: undefined;
  SettingsNavigator: undefined;
};

export type SettingsNavigatorParams = {
  SettingsPage: undefined;
};
