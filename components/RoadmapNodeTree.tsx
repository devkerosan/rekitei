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
} from "react-flow-renderer";
import { useRecoilState } from "recoil";
import { nodeState, edgeState } from "../atom";
import { NodeDataTypes } from "../Types";
import NodeDescription from "./NodeDescription";
import NodeEditPanel from "./NodeEditPanel";
import RoadmapNode from "./RoadmapNode";

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
  const [nodePost, setNodePost] = useState<any>(null);
  const [edgePost, setEdgePost] = useState<any>(null);
  const [nodeDescription, setNodeDescription] = useState<Node>();
  const { x, y, zoom } = useViewport();
  const urlRef = useRef({ url: "", title: "", image: "", description: "" });
  const [selectedNode, setSelectedNode] = useState<NodeDataTypes | null>(null);
  const edgeSourceTarget = useRef({ source: "", target: "" });
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
  const getNodePosition = (node: NodeDataTypes | null): Node => {
    console.log(nodes.filter((val) => val.data === node)[0])
    return nodes.filter((val) => val.data === node)[0];
  };

  const addNode = (data: NodeDataTypes) => {
    setNodes((nds) => {
      const clickedNode = nds.filter((val) => val.data === data);
      const id = String(new Date().getTime());
      const newNode = {
        id: id,
        data: {
          id: id,
          text: "bb",
          url: urlRef.current.url,
          title: urlRef.current.title,
          image: urlRef.current.image,
          description: urlRef.current.description,
          onButtonClick: (data2: NodeDataTypes) => setSelectedNode(data2),
        },
        type: "customNode",
        position: {
          x: clickedNode[0].position.x,
          y: clickedNode[0].position.y + 200,
        },
        dragHandle: ".draggable",
      };
      console.log(newNode);
      setNodePost(newNode);

      edgeSourceTarget.current = {
        source: clickedNode[0].id,
        target: newNode.id,
      };
      return nds.concat(newNode);
    });
    setEdges((eds) => {
      const newEdge = {
        id:
          "e" +
          edgeSourceTarget.current.source +
          "-" +
          edgeSourceTarget.current.target,
        source: edgeSourceTarget.current.source,
        target: edgeSourceTarget.current.target,
        type: "default",
      };
      setEdgePost(newEdge);
      return eds.concat(newEdge);
    });
  };
  const handleFetchClick = (post: {
    url: string;
    title: string;
    image: string;
    description: string;
  }) => {
    urlRef.current = post;
    if (!selectedNode) return;
    addNode(selectedNode);
    setSelectedNode(null);
  };

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
    if (!nodePost) return;
    const postNodes = async () => {
      const res = await axios.post(NODEURL, nodePost);
      setNodePost(null);
    };
    postNodes();
  }, [nodePost]);

  useEffect(() => {
    if (!edgePost) return;
    const postEdges = async () => {
      const res = await axios.post(EDGEURL, edgePost);
      setEdgePost(null);
    };
    postEdges();
  }, [edgePost]);
  useEffect(() => {
    if (!selectedNode) return;
    const nodeData = nodes.map((node) => node.data);
    if (!nodeData.includes(selectedNode)) setSelectedNode(null);
  });
  return (
    <div className="flex w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
      />
      <div
        style={{
          display: selectedNode === null ? "none" : "block",
          position: "absolute",
          top: getNodePosition(selectedNode)?.position.y * zoom + y,
          left:
            WINDOW_WIDTH * 0.2 + getNodePosition(selectedNode)?.position.x * zoom +
            x +
            (NODEWIDTH - EDITPANELWIDTH) * 0.5 * zoom,
          zIndex: "100",
          backgroundColor: "white",
        }}
      >
        <NodeEditPanel
          onFetchClick={(data) => handleFetchClick(data)}
          onDeleteClick={() => setSelectedNode(null)}
        />
      </div>
      <NodeDescription
        data={nodes.filter((node) => node.selected === true)[0]}
      />
    </div>
  );
};

export default RoadmapNodeTree;
