export type RoadmapNodeType = {
    id: number;
    content: string;
}

export type RoadmapNodeTreeType = Array<{
    depths: number;
    nodes: RoadmapNodeType[];
}>

export interface NodeDataTypes {
    id: number,
    text: string,
    url: string,
    title: string,
    image: string,
    description: string,
    onButtonClick: (data: NodeDataTypes) => void
}

export interface popUpPosition {
    x: number,
    y: number
}

export interface RekiteiCardTypes{
    title: string;
    author: string;
    id: number;
    like_amount: number;
    islike: boolean;
    bookmark: boolean;

}