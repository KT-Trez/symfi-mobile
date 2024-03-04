import { useCallback, useState } from 'react';

const useOpen = (
  closeHandlers?: ((...args: any) => void)[],
  openHandlers?: ((...args: any) => void)[],
): [close: () => void, isOpen: boolean, open: () => void] => {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    if (closeHandlers) closeHandlers.forEach(handler => handler());
  }, [closeHandlers]);

  const open = useCallback(() => {
    setIsOpen(true);
    if (openHandlers) openHandlers.forEach(handler => handler());
  }, [openHandlers]);

  return [close, isOpen, open];
};

export default useOpen;
