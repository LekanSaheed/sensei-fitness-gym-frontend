import { RefObject, useEffect } from "react";
type Event = keyof GlobalEventHandlersEventMap;

export function useDetectOutsideClick(
  ref?: RefObject<HTMLElement | null>,
  setAction?: (bool: boolean) => void,
  events: Event[] = ["mousedown", "touchstart"],
  preventClose?: boolean
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!preventClose)
        if (ref?.current && !ref?.current.contains(event.target as Node)) {
          if (setAction && !preventClose) {
            setAction(false);
          }
        }
    }

    events &&
      events?.forEach((e) => {
        document.addEventListener(e, handleClickOutside as EventListener);
      });

    return () => {
      // Unbind the event listener on clean up
      events?.forEach((e) => {
        document.removeEventListener(e, handleClickOutside as EventListener);
      });
    };
  }, [ref, preventClose, events]);
}
