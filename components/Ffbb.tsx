import { Badge } from "@mui/material";

export default function Ffbb() {
    return (
        <div className="divActualite">
        <Badge badgeContent={"Actu FFBB"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px",marginLeft:"20px"}} />
        <iframe src="https://feed.mikle.com/widget/v2/155831/?preloader-text=Loading" height="558px" width="100%" className="fw-iframe" scrolling="no" frameBorder="0"></iframe>
        </div>
    );
}
