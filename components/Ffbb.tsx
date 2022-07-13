import { Button } from "react-bootstrap";

export default function Ffbb() {
    return (
        <div className="divFfbb">
        <Button id="badge">Actu FFBB</Button>
        <iframe src="https://feed.mikle.com/widget/v2/155831/?preloader-text=Loading" height="558px" width="100%" className="fw-iframe" scrolling="no" frameBorder="0"></iframe>
        </div>
    );
}
