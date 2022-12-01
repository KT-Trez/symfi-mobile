import {useState} from 'react';


const useVisibility = (hideHandlers?: ((...args: any) => void)[], showHandlers?: ((...args: any) => void)[]): [() => void, boolean, () => void] => {
	const [isVisible, setIsVisible] = useState(false);

	const hide = () => {
		setIsVisible(false);
		if (hideHandlers)
			hideHandlers.forEach(handler => handler());
	};

	const show = () => {
		setIsVisible(true);
		if (showHandlers)
			showHandlers.forEach(handler => handler());
	};

	return [hide, isVisible, show];
};

export default useVisibility;