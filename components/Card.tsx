import Link from "next/link";

interface Props {
  data: string;
}

const Card: React.FC<Props> = (props) => {
  return (
    <Link href="/">
      <div className="flex px-4 py-1 text-lg text-blue-500 items-center rounded-full border-2 border-blue-500 bg-blue-50 hover:brightness-90">
        #{props.data}
      </div>
    </Link>
  );
};

export default Card;
