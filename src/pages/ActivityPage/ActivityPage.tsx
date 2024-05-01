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
    const years = getUniqueYears()
    const datas = []
    const res = {}
    Object.values(activities).forEach(act => {
      act.forEach(el => {
        el.data.forEach(data => {
          datas.push(data)
        })
      })
    })
    datas.forEach(el => {
      if (res[el.year]) {
        res[el.year] += el.value
      } else {
        res[el.year] = el.value
      }
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

  return (
    <Container sx={{ py: 3 }}>
      <Button sx={{ mb: 3, mr: 3 }} color='primary' variant='contained' onClick={() => setShowForm(true)}>
        Додати захід
      </Button>
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
            <th>Оперативні цілі, завдання та заходи Стратегії</th>
            <th>Нормативний документ</th>
            <th colSpan={2}>Обсяги фінансування, тис.грн</th>
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
                      <tr key={index} onClick={() => openEditing(act)}>
                        <td rowSpan={2}>{act.name}</td>
                        <td rowSpan={2}>{act.document}</td>
                        {act.data.map(({ year }) => {
                          return (
                            <td>
                              <i>{year} рік</i>
                            </td>
                          )
                        })}
                      </tr>
                      <tr>
                        {act.data.map(({ value }) => {
                          return (
                            <td>
                              <u>{value}</u>
                            </td>
                          )
                        })}
                      </tr>
                    </>
                  )
                })}
              </>
            )
          })}
          <tr>
            <td rowSpan={2} colSpan={2} align={'right'}>
              Всього
            </td>
            {getUniqueYears().map(year => {
              return (
                <td>
                  <i>{year} рік</i>
                </td>
              )
            })}
          </tr>
          <tr>
            {Object.values(getSum()).map(val => {
              return (
                <td>
                  <u>{val}</u>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </Container>
  )
}
