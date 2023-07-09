import {useEffect} from 'react';
import useTimeout from './useTimeout';


export default function useDebounce(cb: () => void, delay: number, dependencies: any[]) {
    const {clear, reset} = useTimeout(cb, delay);

    useEffect(clear, []);
    
    useEffect(reset, [...dependencies, reset]);
}
