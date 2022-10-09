import axios from "axios";
import { useEffect, useState } from "react";
import { Node } from "react-flow-renderer";
import { useRecoilState } from "recoil";
import { edgeState, nodeState } from "../atom";
import { NewPostData, NodeDataTypes } from "../Types";

const NODEURL = "http://localhost:3002/node/";
const EDGEURL = "http://localhost:3002/edge/";

const useNewNode = (newNodeData: NewPostData, parentNode: Node) => {
    const [nodes, setNodes] = useRecoilState(nodeState);
    const [edges, setEdges] = useRecoilState(edgeState);
    const [isNodesChanged, setIsNodesChnaged] = useState(false);
    const id = String(new Date().getTime());
    //新しいNodeを作る
    const newNode = {
        id: id,
        data: {
            id: id,
            text: "bb",
            ...newNodeData,
        },
        type: "customNode",
        position: {
            x: parentNode.position.x,
            y: parentNode.position.y + 200,
        },
        dragHandle: ".draggable",
    };
    //新しいEdgeを作る
    const newEdge = {
        id: id,
        source: parentNode.id,
        target: id,
        type: 'default'
    };
    //NodeとEdgeを更新
    const refreshNodes = () => {
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
        setIsNodesChnaged(true);
    };

    //NodeとEdgeをサーバへ送信
    useEffect(() => {
        if (!isNodesChanged) return;
        const postNode = async () => {
            const nodeRes = await axios.post(NODEURL, newNode);
            const EdgeRes = await axios.post(EDGEURL, newEdge);
        };
        postNode();
        setIsNodesChnaged(false);
    }, [isNodesChanged]);
    return { refreshNodes };
};

export default useNewNode;