interface Props {
    onClick: () => void;
}

const NodeMenu: React.FC<Props> = (props) => {
    return (
        <div className='absolute -top-16 flex p-1 bg-white rounded-lg shadow-lg border border-gray-100 text-gray-500'>
            <span className="material-icons">edit</span>
            <span className="material-icons" onClick={props.onClick}>delete</span>
        </div>
    )
};

export default NodeMenu;