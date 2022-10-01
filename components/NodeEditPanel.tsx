import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    onFetchClick: (post: { url: string, title: string, image: string, description: string }) => void,
    onDeleteClick: () => void
}

const NodeEditPanel: React.FC<Props> = (props) => {
    const [ogp, setOgp] = useState({ title: "", image: "", description: "" });
    const [url, setUrl] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios('http://localhost:3000/ogp', { params: { url: url } });
            setOgp(res.data);
        };
        fetchData();
    }, [url])
    return (
        <div className='w-[200px]'>
            <div onClick={props.onDeleteClick}>x</div>
            <form>
                <label>
                    URL:
                    <input type="text" className="border" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <button type="button" onClick={() => props.onFetchClick({ url: url, ...ogp })}>Fetch</button>
                </label>
            </form>

            <div>Title: {ogp.title}</div>
            <div>Image: <img src={ogp.image} /></div>
            <div>{ogp.description}</div>

        </div>
    )
};

export default NodeEditPanel;