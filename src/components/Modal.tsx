import React, { FunctionComponent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose } from "react-icons/md";

import { ArrowLeft2 } from "iconsax-react";
import { useEffect } from "react";

interface ModalProps {
  title: ReactNode;
  titleClassName: string;
  wrapperClass: string;
  leftTitlePosition: boolean;
  open: boolean;
  setOpen: (bool: boolean) => void;
  closeBtnClass: string;
  onCloseBtnClick: () => void;
  isBack: boolean;
  onBack: () => void;
  children: ReactNode;
  className: string;
  hideCloseBtn: boolean;
  onClose: () => void;

  backDisabled: boolean;
  bottomSheet: boolean;

  slotBefore: ReactNode;
}

const Modal: FunctionComponent<Partial<ModalProps>> = ({
  title = "",
  titleClassName,
  wrapperClass = "",
  leftTitlePosition = false,
  slotBefore,
  open,
  setOpen,
  closeBtnClass = "",
  onCloseBtnClick,
  isBack,
  onBack,
  children,
  className,
  backDisabled,
  hideCloseBtn = false,
  bottomSheet = true,
  onClose,
}) => {
  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  };
  useEffect(() => {
    if (!open) {
      closeModal();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  const Header = ({}) => {
    return (
      <motion.div layout className="mb-[20px] ">
        <div>
          {isBack && (
            <motion.button
              disabled={backDisabled}
              whileTap={{ opacity: 0.6 }}
              onClick={() => {
                if (!backDisabled && onBack) onBack();
              }}
              className={`cursor-pointer top-[20px] left-[10px] absolute z-[5]  inline-flex items-center text-black disabled:!text-gray-300`}
            >
              <ArrowLeft2 size={18} color="#222" />{" "}
              <span className="text-[12px] ml-[5px]">Back</span>
            </motion.button>
          )}
          {title && (
            <h3
              className={`${titleClassName} font-bold text-black tracking-[-0.4px] text-[18px]  ${
                leftTitlePosition ? "text-left" : "text-center"
              }`}
            >
              {title}
            </h3>
          )}
        </div>

        {!hideCloseBtn && (
          <motion.div
            onClick={() => {
              setOpen && setOpen(false);
              closeModal();
              onCloseBtnClick && onCloseBtnClick();
            }}
            className={`h-[23px] bg-gray-200 active:scale-[0.9] active:opacity-50 transition
             flex items-center justify-center cursor-pointer text-[14px] w-[23px]
                 rounded-full z-[1000]  right-[20px] top-[20px] absolute ${closeBtnClass}`}
          >
            <MdClose />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // onClick={() => {
          //   setOpen(false);

          //   closeModal();
          // }}
          layoutRoot
          className={`fixed inset-0 ${
            bottomSheet ? "sm:p-4" : "p-4"
          } z-[11000] flex items-center  justify-center overflow-y-auto ${wrapperClass}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" bg-black/55 fixed inset-0"
          />
          {open && (
            <motion.div
              // layout={useStack || !!currentStack}
              transition={{ type: "tween" }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "170%" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                boxShadow: "0px 32px 20px -22px rgba(62, 62, 62, 0.10)",
              }}
              className={`max-w-[412px] p-[18px]  rounded-[20px] border border-gray-border-stroke h-auto w-full bg-white   ${
                bottomSheet
                  ? "max-sm:!rounded-br-none max-sm:!rounded-bl-none max-sm:!max-w-[unset] max-sm:!bottom-0 absolute sm:relative"
                  : "relative"
              }  ${className}`}
            >
              {slotBefore}
              <Header />

              <motion.div className={``}>{children}</motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
