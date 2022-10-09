import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  EdgeChange,
  NodeChange,
  useViewport,
  useReactFlow,
} from "react-flow-renderer";
import { useRecoilState } from "recoil";
import { nodeState, edgeState } from "../atom";
import { NodeDataTypes } from "../Types";
import NodeDescription from "./NodeDescription";
import NodeEditPanel from "./NodeEditPanel";
import RoadmapNode from "./RoadmapNode";
import domtoimage from "dom-to-image"

const nodeTypes = {
  customNode: RoadmapNode,
};

const WINDOW_WIDTH = process.browser === true ? window.innerWidth : 0;

const NODEWIDTH = 192;
const EDITPANELWIDTH = 200;
const NODEURL = "http://localhost:3002/node/";
const EDGEURL = "http://localhost:3002/edge/";

const RoadmapNodeTree: React.FC = () => {
  const [nodes, setNodes] = useRecoilState<Node[]>(nodeState);
  const [edges, setEdges] = useRecoilState<Edge[]>(edgeState);
  const { x, y, zoom } = useViewport();
  const [selectedNode, setSelectedNode] = useState<NodeDataTypes | null>(null);
  const reactFlowInstance = useReactFlow();
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "default" }, eds));
      const res = axios.post(EDGEURL, { ...connection, type: "default" });
    },
    [setEdges]
  );
  const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
    const deleteSelectedNode = node;
    deleteSelectedNode.selected = false;
    const res = axios.put(
      NODEURL + node.id,
      deleteSelectedNode
    );
  };
  const capturePages = async () => {
    const getElement = () => new Promise((resolve, reject) => {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
      setTimeout(() => resolve(1), 1)
    })
    const a = await getElement();
    const element = document.querySelector('#capture');
    console.log(element)
    if (!element) return;
    domtoimage.toSvg(element).then((canvas) => {
      console.log(canvas)
      const link = document.createElement('a')
      link.href = canvas;
      link.download = `export_image.svg`
      link.click()
    })
  }

  const bottomNodePosition = String(nodes.map((node) => node.position.y + (node.height ?? 0))
    .reduce((prev, current) => { return (current > prev ? current : prev) }, 0) * zoom + 100) + "px";

  useEffect(() => {
    const fetchNodes = async () => {
      const res = await axios(NODEURL);
      res.data.map((nodeData: any) => {
        const data = nodeData.data;
        data.onButtonClick = (data: NodeDataTypes) => setSelectedNode(data);
        console.log(data);
      });
      setNodes(res.data);
      console.log(res.data);
      const edgeRes = await axios(EDGEURL);
      setEdges(edgeRes.data);
    };
    fetchNodes();
  }, []);

  useEffect(() => {
    if (!selectedNode) return;
    const nodeData = nodes.map((node) => node.data);
    if (!nodeData.includes(selectedNode)) setSelectedNode(null);
  });
  return (
    <div className={"flex w-full h-full"}>
      <div className={"w-full"} style={{ height: bottomNodePosition }} id="capture">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
        />
      </div>
      <button className="" onClick={capturePages}>capture</button>
      <NodeDescription
        data={nodes.filter((node) => node.selected === true)[0]}
      />
    </div>
  );
};

export default RoadmapNodeTree;
