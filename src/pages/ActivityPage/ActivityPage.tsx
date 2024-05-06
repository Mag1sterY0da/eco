import { Button, Container } from '@mui/material'
import axios from 'axios'
import CreateActivityForm from 'components/CreateActivityForm/CreateActivityForm.tsx'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import { saveAs } from 'file-saver'
import { useEffect, useRef, useState } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import { useParams } from 'react-router-dom'
import { API_URL } from 'utils/const/apiUrl.ts'

export const ActivityPage = () => {
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false)
  const [activities, setActivities] = useState([])
  const [showDeleteBtn, setShowDeleteBtn] = useState(false)
  const [act, setAct] = useState({})
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/activities?sensorId=${id}`).then(res => {
      setActivities(res.data)
      console.log(res.data)
    })
  }, [])

  const openEditing = act => {
    setShowDeleteBtn(true)
    setShowForm(true)
    setAct(act)
  }

  const getUniqueYears = () => {
    const years = []
    Object.values(activities).forEach(act => {
      act.forEach(el => {
        el.data.forEach(({ year }) => {
          if (!years.includes(year)) {
            years.push(year)
          }
        })
      })
    })
    return years
  }

  const getSum = () => {
    let res = 0
    Object.values(activities).forEach(arr => {
      res += arr.reduce((acc, el) => el.value + acc, 0);
    })
    return res
  }

  const tableRef = useRef(null)

  const createCell = (
    text: string,
    isBold: boolean = false,
    isItalic: boolean = false,
    isUnderline: boolean = false,
    colSpan?: number,
    rowSpan?: number
  ) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline
            })
          ]
        })
      ],
      columnSpan: colSpan,
      rowSpan: rowSpan
    })
  }

  const parseHtmlTable = (htmlString: string) => {
    const rows = htmlString.split(/<\/tr>/gi)
    const tableRows = rows.slice(0, -1).map(row => {
      // Remove the first and last elements, which are table tags
      const cells = row.split(/<\/t[dh]>/gi)
      const tableCells = cells.slice(0, -1).map(cell => {
        // Remove the last element, which is a closing tag
        console.log(cell)
        const content = cell.replace(/<[^>]*>?/gm, '') // Get the cell content, remove HTML tags
        const isBold = /<b>/i.test(cell)
        const isItalic = /<i>/i.test(cell)
        const isUnderline = /<u>/i.test(cell)
        // Extract colspan and rowspan attributes
        const colspanMatch = cell.match(/colspan="(\d+)"/i)
        const rowspanMatch = cell.match(/rowspan="(\d+)"/i)
        const colSpan = colspanMatch ? parseInt(colspanMatch[1], 10) : undefined
        const rowSpan = rowspanMatch ? parseInt(rowspanMatch[1], 10) : undefined
        return createCell(content, isBold, isItalic, isUnderline, colSpan, rowSpan)
      })
      return new TableRow({ children: tableCells })
    })
    return tableRows
  }

  const exportToDocx = async () => {
    const tableHtml = tableRef?.current?.outerHTML
    console.log(tableHtml)
    const doc = new Document({ sections: [] })
    const docxTableRows = parseHtmlTable(tableHtml)

    const docxTable = new Table({
      rows: docxTableRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    })

    doc.addSection({ children: [docxTable] })

    const buffer = await Packer.toBlob(doc)
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    saveAs(blob, 'table.docx')
  }

  const handleChange = (key, row, e) => {
    if (e.target.checked) {
      if (selectedRows[key]) {
        const tmp = {...selectedRows};
        tmp[key].push(row);
        console.log('+', tmp);
        setSelectedRows(tmp);
      } else {
        const tmp = {...selectedRows};
        tmp[key] = [row];
        console.log(tmp);
        setSelectedRows(tmp);
      }
    } else {
      const tmp = {...selectedRows};
      tmp[key] = tmp[key].filter((el => el.name !== row.name));
      if (!tmp[key].length) {
        delete tmp[key];
      }
      console.log(tmp);
      setSelectedRows(tmp);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      {/*<Button sx={{ mb: 3, mr: 3 }} color='primary' variant='contained' onClick={() => setShowForm(true)}>*/}
      {/*  Додати захід*/}
      {/*</Button>*/}
      <DownloadTableExcel filename='users table' sheet='users' currentTableRef={tableRef.current}>
        <Button sx={{ mb: 3, mr: 3 }} color='primary' variant='contained'>
          Експортувати в Excel
        </Button>
      </DownloadTableExcel>
      <Button sx={{ mb: 3, mr: 3 }} color='primary' variant='contained' onClick={exportToDocx}>
        Експортувати в Word
      </Button>
      {showForm ? <CreateActivityForm id={id} showDeleteBtn={showDeleteBtn} act={act} /> : null}
      <table border={1} cellSpacing={0} ref={tableRef}>
        <tbody>
          <tr>
            <th></th>
            <th>Оперативні цілі, завдання та заходи Стратегії</th>
            <th>Нормативний документ</th>
            <th>Обсяги фінансування, тис.грн</th>
          </tr>
          {Object.keys(activities).map((el, idx) => {
            return (
              <>
                <tr key={idx}>
                  <td colSpan={4} align={'center'}>
                    <b>{el}</b>
                  </td>
                </tr>
                {activities[el].map((act, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>
                          <input type="checkbox" onChange={(e) => handleChange(el, act, e)}/>
                        </td>
                        <td>{act.name}</td>
                        <td>{act.document}</td>
                        <td><u>{act.value}</u></td>
                      </tr>
                    </>
                  )
                })}
              </>
            )
          })}
          <tr>
            <td colSpan={3} align={'right'}>
              Всього
            </td>
            <td>
              <u>{getSum()}</u>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  )
}
