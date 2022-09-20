import {Button, Table} from "react-bootstrap";

export default function Equipes() {
    return (
        <div className="divEquipe">
        <Button id="badge">Nos Equipes</Button>
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Ecole de basket</th>
                </tr>
                </thead>
                <tbody>
                <tr><td>U7</td></tr>
                <tr><td>U9</td></tr>
                <tr><td>U11 (2 équipes)</td></tr>
                </tbody>
                <thead>
                <tr>
                    <th>Académie de basket</th>
                </tr>
                </thead>
                <tbody>
                <tr><td>U11</td></tr>
                <tr><td>U15</td></tr>
                </tbody>
                <thead>
                <tr>
                    <th>Secteur seniors</th>
                </tr>
                </thead>
                <tbody>
                <tr><td>U17</td></tr>
                <tr><td>D2</td></tr>
                <tr><td>PR1</td></tr>
                </tbody>
            </Table>
        </div>
    );
}
