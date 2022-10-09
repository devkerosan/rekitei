import axios from "axios";
import { useEffect, useState } from "react";
import { Handle, Node, Position } from "react-flow-renderer";
import { useRecoilState } from "recoil";
import { nodeState, edgeState } from "../atom";
import useNewNode from "../hooks/useNewNode";
import { NewPostData, NodeDataTypes } from "../Types";
import NodeEditPanel from "./NodeEditPanel";
import NodeMenu from "./NodeMenu";
import PopUpOverNode from "./PopUpOverNode";

interface Props {
  data: NodeDataTypes;
}

const NODEURL = "http://localhost:3002/node/";
const EDGEURL = "http://localhost:3002/edge/";

const RoadmapNode = ({ data }: Props) => {
  const [nodes, setNodes] = useRecoilState(nodeState);
  const [edges, setEdges] = useRecoilState(edgeState);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNodesChanged, setIsNodesChanged] = useState(false);
  const selfNode = nodes.filter((val) => val.data.id === data.id)[0];
  const addButtonStyle = selfNode?.selected ? { display: 'flex' } : { display: 'none' };
  //↓サーバ側のデータを更新→ノードがupdateされるべき
  const handleDeleteClick = () => {
    const filteredNodes = nodes.filter((val) => val.data.id !== data.id);
    setNodes(filteredNodes);
    const filteredEdges = edges.filter(
      (val) =>
        val.source !== data.id.toString() && val.target !== data.id.toString()
    );
    console.log(filteredEdges);
    const connectedEdges = edges.filter(
      (val) =>
        val.source === data.id.toString() || val.target === data.id.toString()
    );
    setEdges(filteredEdges);
    const deleteData = async () => {
      const url = `http://localhost:3002/node/${data.id}`;
      const res = await axios.delete(url);
      connectedEdges.forEach(async (edge) => {
        const edgeUrl = `http://localhost:3002/edge/${edge.id}`;
        const edgeRes = await axios.delete(edgeUrl);
      });
    };
    deleteData();
  };
  const handleFetchClick = (newNodeData: NewPostData, parentNode: Node) => {
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
    //Nodeを更新
    setNodes((nds) => nds.concat(newNode));
    //Edgeを更新
    setEdges((eds) => eds.concat(newEdge));
    //Editorを閉じる
    setIsEditorOpen(false);
    setIsNodesChanged(true);
  };
  useEffect(() => {
    if (selfNode?.selected === true) return;
    setIsEditorOpen(false);
  }, [selfNode?.selected])
  //NodeとEdgeをサーバへ送信
  useEffect(() => {
    if (!isNodesChanged) return;
    const post = async () => {
      const nodeRes = await axios.post(NODEURL, nodes[nodes.length - 1]);
      const edgeRes = await axios.post(EDGEURL, edges[edges.length - 1]);
    };
    post();
    setIsNodesChanged(false);
  }, [isNodesChanged]);
  return (
    <>
      <div className="flex justify-center" style={addButtonStyle}>
        <NodeMenu onClick={handleDeleteClick} />
      </div>
      <div>
        <div className="relative flex flex-col -top-3 w-48 h-auto rounded-md bg-white draggable shadow-lg">
          <Handle
            style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              top: "-8px",
              zIndex: "10",
            }}
            type="target"
            position={Position.Top}
          />
          <img className="rounded-t-md" src={"/_next/image?url=" + encodeURIComponent(data.image) + "&w=3840&q=75"} />
          <div className="h-auto p-2">
            <h1 className="font-bold text-xs">{data.title}</h1>
          </div>
          <Handle
            style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              bottom: "-8px",
              zIndex: "10",
            }}
            type="source"
            position={Position.Bottom}
          />
        </div>

      </div>
      <div className="flex justify-center cursor-default">
        <i onClick={() => setIsEditorOpen(!isEditorOpen)} style={addButtonStyle} className="material-icons cursor-pointer">add_circle</i>
      </div>
      <div className="flex justify-center">
        <NodeEditPanel
          display={isEditorOpen}
          onFetchClick={(data) => handleFetchClick(data, selfNode)}
        />
      </div>

    </>
  );
};

export default RoadmapNode;
