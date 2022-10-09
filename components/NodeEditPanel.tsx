import axios from "axios";
import { useEffect, useState } from "react";
import { NewPostData } from "../Types";

interface Props {
    onFetchClick: (post: NewPostData) => void,
    display: boolean
}

const NodeEditPanel: React.FC<Props> = (props) => {
    const [ogp, setOgp] = useState({ title: "", image: "", description: "" });
    const [url, setUrl] = useState("");
    const displayStyle = props.display ? { display: 'block' } : { display: 'none' };
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios('http://localhost:3000/ogp', { params: { url: url } });
            setOgp(res.data);
        };
        fetchData();
    }, [url])
    return (
        <div style={displayStyle} className='absolute p-2 w-[200px] bg-white bg-opacity-50 border-[1px] border-white border-opacity-60 rounded-md filter backdrop-blur-sm shadow-lg'>
            <form>
                <div>
                    <div className="mb-1">{ogp.image ? <img src={ogp.image} /> : <div className="flex justify-center items-center w-full h-24 bg-white border text-gray-500">No image</div>}</div>
                    <div className="text-xs font-bold">{ogp.title || 'No Title'}</div>
                </div>
                <label className="text-sm font-bold">
                    URL
                    <input type="text" className="border w-full mb-1" value={url} onChange={(e) => setUrl(e.target.value)} />
                </label>
                <div className="flex justify-end">
                    <button type="button" className="border-2 border-black rounded-full px-2 text-sm font-bold" onClick={() => props.onFetchClick({ url: url, ...ogp })}>Add</button>
                </div>
            </form>



        </div>
    )
};

export default NodeEditPanel;