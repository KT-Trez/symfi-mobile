import {useToast} from 'native-base';
import {useState} from 'react';
import {SongId} from '../../../../types/interfaces';
import SongService from '../../../services/song.service';


export default function useSongUpdate(field: 'author' | 'published on' | 'title' | 'views', id: SongId | undefined, value: string): [boolean, () => void] {
    const toast = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const titleize = (str: string) =>
        str
            .split(' ')
            .map(word => word[0].toUpperCase() + word.slice(1, word.length))
            .join(' ');

    const update = async () => {
        if (!value || !id)
            return;

        setIsUpdating(true);

        switch (field) {
            case 'author':
                await SongService.updateAuthor(value, id);
                break;
            case 'published on':
                await SongService.updatePublished(id, value);
                break;
            case 'title':
                await SongService.updateTitle(id, value);
                break;
            case 'views':
                await SongService.updateViews(id, value);
                break;
        }

        setIsUpdating(false);

        toast.show({
            description: `<${titleize(field)}> has been updated`,
            title: 'Success'
        });
    };

    return [isUpdating, update];
}
