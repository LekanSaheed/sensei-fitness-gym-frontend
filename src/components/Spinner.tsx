import React, { CSSProperties, FunctionComponent } from "react";

import { CgSpinner } from "react-icons/cg";

interface SpinnerProps {
  style: CSSProperties;
  className: string;
}
const Spinner: FunctionComponent<Partial<SpinnerProps>> = ({
  style,
  className,
}) => {
  return <CgSpinner style={style} className={`animate-spin ${className}`} />;
};

export default Spinner;
