import Link from "next/link";

const RekiteiCard: React.FC = () => {
  return (
    <div className="w-64 rounded-xl bg-gray-200 overflow-hidden">
      <Link href="/">
        <a>
          <img src="/img/bubble-react.png" className="bg-white" />
        </a>
      </Link>
      <div className="p-2">
        <div className="flex items-center text-xs">
          <i className="material-icons pr-1">account_circle</i>でぶけろ
        </div>
        <Link href="/">
          <a className="font-bold hover:underline">
            React初心者向けロードマップ
          </a>
        </Link>
        <span className="block text-xs">#React</span>
        <div className="flex justify-end">
          <i className="material-icons text-gray-300 cursor-pointer hover:text-rose-600">
            favorite
          </i>
          <i className="material-icons text-gray-300 cursor-pointer hover:text-green-600">
            bookmark
          </i>
        </div>
      </div>
    </div>
  );
};

export default RekiteiCard;
