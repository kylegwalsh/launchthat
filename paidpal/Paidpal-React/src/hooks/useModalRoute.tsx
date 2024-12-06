import { useState } from 'react';

/**
 * Hook that manages open status of modal while using modal routes (like verticals/id)
 */
export const useModalRoute = (navigateBack?: () => void) => {
  const [open, setOpen] = useState(true);

  /**
   * Start modal closing process (fade out and navigate back)
   */
  const closeModal = () => {
    if (open) {
      setOpen(false);
      if (navigateBack) setTimeout(navigateBack, 175);
    }
  };

  return [open as any, closeModal as any];
};