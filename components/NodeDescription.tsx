import React, { ReactNode } from "react";
import { Node } from "react-flow-renderer";
import { NodeDataTypes } from "../Types";

interface Props {
    data: Node<any>
}

const NodeDescription: React.FC<Props> = (props) => {
    const pattern = /(\w+):\/\/([\w._-]+)\/(\S*)/;
    const RegExpURLArray = pattern.exec(props.data?.data.url);
    const RegExpURL = RegExpURLArray === null ? '' : RegExpURLArray[2];
    return (
        <div className='absolute right-0 w-[400px] z-20 bg-white rounded-lg p-2'>
            <img className="mb-1" src={props.data?.data.image} />
            <p className="font-bold mb-1">{props.data?.data.title}</p>
            <p className="text-xs text-gray-500 mb-1">{props.data?.data.description}</p>
            <a className="flex items-center text-xs text-gray-500 cursor-pointer hover:underline">{RegExpURL}</a>
        </div>
    )
};

export default NodeDescription;