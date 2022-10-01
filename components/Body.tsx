import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Body: React.FC<Props> = (props) => {
  return <div className="flex w-[60%] h-full">{props.children}</div>;
};

export default Body;
