import { popUpPosition } from "../Types";

interface Props {
    position: popUpPosition
}

const PopUpOverNode: React.FC<Props> = (props) => {
    return (
        <div className='absolute w-[100px] h-[240px]' style={{ top: props.position.y, left: props.position.x }}>
            pop up!
        </div>
    )
};

export default PopUpOverNode;