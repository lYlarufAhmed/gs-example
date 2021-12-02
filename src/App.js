import './App.css';
import {GoogleSpreadsheet} from "google-spreadsheet";
import React from "react";
import {Container, Row, Table} from "react-bootstrap";


function App() {
    const [rows, setRows] = React.useState([])
    const [headers, setHeaders] = React.useState([])

    async function getRows() {
        const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);
        // console.log('Hellow')
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY
        })
        await doc.loadInfo()
        const sheet = doc.sheetsByIndex[0]
        // console.log(sheet)
        const rows = await sheet.getRows()
        // console.log(rows)
        setHeaders(sheet.headerValues)
        setRows(rows)
    }

    React.useEffect(() => {
        getRows()
    }, [])
    return (
        <Container className="App">
            <Row><h3>Keyword Research sheet</h3></Row>
            <Row>
                <Table striped bordered hover responsive size={'sm'}>

                    <thead>
                    <th>#</th>
                    {headers.map(h => <th>{h}</th>)}
                    </thead>
                    <tbody>
                    {rows.map(({Keyword, Volume}, i) => <tr>
                        <td>{i + 1}</td>
                        <td>{Keyword}</td>
                        <td>{Volume}</td>
                    </tr>)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={2}/>
                        <td>Total Volume: {rows.reduce((acc, {Volume}) => acc + parseInt(Volume, 10), 0)}</td>
                    </tr>
                    </tfoot>
                </Table>
            </Row>
        </Container>
    );
}

export default App;
