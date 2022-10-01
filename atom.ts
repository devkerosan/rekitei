import { Edge, Node } from "react-flow-renderer";
import { atom } from "recoil";

export const nodeState = atom({
    key: 'nodeState',
    default: [] as Node[]
})

export const edgeState = atom({
    key: 'edgeState',
    default: [] as Edge[]
})
