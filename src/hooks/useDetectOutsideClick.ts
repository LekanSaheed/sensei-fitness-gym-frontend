import { useEffect } from "react";
type Event = keyof GlobalEventHandlersEventMap;

export function useDetectOutsideClick(
  ref?: any,
  setAction?: (bool: boolean) => void,
  events?: Event[],
  preventClose?: boolean
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!preventClose)
        if (ref.current && !ref?.current.contains(event.target)) {
          if (setAction && !preventClose) {
            setAction(false);
          }
        }
    }

    events &&
      events?.forEach((e) => {
        document.addEventListener(e, handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener(e, handleClickOutside);
        };
      });
  }, [ref, preventClose, events]);
}
