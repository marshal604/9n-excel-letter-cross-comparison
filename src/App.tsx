import { useState, useCallback } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import * as XLSX from 'xlsx'
import './App.css'

interface ComparisonResult {
  onlyA: string[]
  onlyB: string[]
  common: string[]
}

function App() {
  const [fileA, setFileA] = useState<File | null>(null)
  const [fileB, setFileB] = useState<File | null>(null)
  const [dragOverA, setDragOverA] = useState(false)
  const [dragOverB, setDragOverB] = useState(false)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isComparing, setIsComparing] = useState(false)

  const extractValuesFromExcel = async (file: File): Promise<Set<string>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const values = new Set<string>()

          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

            jsonData.forEach((row) => {
              if (Array.isArray(row)) {
                row.forEach((cell) => {
                  if (cell !== null && cell !== undefined && cell !== '') {
                    const cellValue = String(cell).trim()
                    if (cellValue) {
                      values.add(cellValue)
                    }
                  }
                })
              }
            })
          })

          resolve(values)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsBinaryString(file)
    })
  }

  const handleCompare = async () => {
    if (!fileA || !fileB) return

    setIsComparing(true)
    try {
      const [valuesA, valuesB] = await Promise.all([
        extractValuesFromExcel(fileA),
        extractValuesFromExcel(fileB),
      ])

      const onlyA: string[] = []
      const onlyB: string[] = []
      const common: string[] = []

      valuesA.forEach((value) => {
        if (valuesB.has(value)) {
          common.push(value)
        } else {
          onlyA.push(value)
        }
      })

      valuesB.forEach((value) => {
        if (!valuesA.has(value)) {
          onlyB.push(value)
        }
      })

      // Sort results
      onlyA.sort((a, b) => a.localeCompare(b, 'zh-Hant'))
      onlyB.sort((a, b) => a.localeCompare(b, 'zh-Hant'))
      common.sort((a, b) => a.localeCompare(b, 'zh-Hant'))

      setResult({ onlyA, onlyB, common })
    } catch (error) {
      console.error('Error comparing files:', error)
      alert('Error processing Excel files. Please check the file format.')
    } finally {
      setIsComparing(false)
    }
  }

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnterA = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverA(true)
  }, [])

  const handleDragLeaveA = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverA(false)
  }, [])

  const handleDropA = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverA(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setFileA(files[0])
    }
  }, [])

  const handleDragEnterB = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverB(true)
  }, [])

  const handleDragLeaveB = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverB(false)
  }, [])

  const handleDropB = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverB(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setFileB(files[0])
    }
  }, [])

  const handleFileChangeA = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileA(e.target.files[0])
    }
  }

  const handleFileChangeB = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileB(e.target.files[0])
    }
  }

  const downloadAsTxt = (data: string[], filename: string) => {
    const content = data.join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__icon">
          <span role="img" aria-label="compare">
            &#x2194;
          </span>
        </div>
        <h1 className="header__title">Excel Cross Comparison</h1>
        <p className="header__subtitle">
          Upload two Excel files to find unique and common cell values
        </p>
      </header>

      <section className="upload-section">
        <div
          className={`upload-card upload-card--a ${fileA ? 'upload-card--active' : ''} ${dragOverA ? 'upload-card--dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnterA}
          onDragLeave={handleDragLeaveA}
          onDrop={handleDropA}
        >
          <span className="upload-card__badge">File A</span>
          <div className="upload-card__icon">&#128196;</div>
          <div className="upload-card__title">
            {fileA ? 'File Selected' : 'Drop Excel File Here'}
          </div>
          <div className="upload-card__desc">
            {fileA ? '' : 'or click to browse'}
          </div>
          {fileA && (
            <div className="upload-card__file">
              <span className="upload-card__file-icon">&#128206;</span>
              {fileA.name}
            </div>
          )}
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChangeA}
          />
        </div>

        <div className="upload-divider">
          <div className="upload-divider__icon">VS</div>
        </div>

        <div
          className={`upload-card upload-card--b ${fileB ? 'upload-card--active' : ''} ${dragOverB ? 'upload-card--dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnterB}
          onDragLeave={handleDragLeaveB}
          onDrop={handleDropB}
        >
          <span className="upload-card__badge">File B</span>
          <div className="upload-card__icon">&#128196;</div>
          <div className="upload-card__title">
            {fileB ? 'File Selected' : 'Drop Excel File Here'}
          </div>
          <div className="upload-card__desc">
            {fileB ? '' : 'or click to browse'}
          </div>
          {fileB && (
            <div className="upload-card__file">
              <span className="upload-card__file-icon">&#128206;</span>
              {fileB.name}
            </div>
          )}
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChangeB}
          />
        </div>
      </section>

      <section className="compare-section">
        <button
          className="compare-btn"
          onClick={handleCompare}
          disabled={!fileA || !fileB || isComparing}
        >
          {isComparing ? 'Comparing...' : 'Compare Files'}
        </button>
      </section>

      {result && (
        <section className="results">
          <div className="result-card result-card--a">
            <div className="result-card__header">
              <div className="result-card__title">
                <span className="result-card__dot"></span>
                Only in A
              </div>
              <div className="result-card__actions">
                <span className="result-card__count">{result.onlyA.length}</span>
                {result.onlyA.length > 0 && (
                  <button
                    className="download-btn"
                    onClick={() => downloadAsTxt(result.onlyA, 'only-in-A')}
                    title="Download as TXT"
                  >
                    &#8595;
                  </button>
                )}
              </div>
            </div>
            <div className="result-card__content">
              {result.onlyA.length > 0 ? (
                <div className="char-grid">
                  {result.onlyA.map((item, index) => (
                    <span key={`a-${index}`} className="char-item">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="result-card__empty">No unique values in A</div>
              )}
            </div>
          </div>

          <div className="result-card result-card--common">
            <div className="result-card__header">
              <div className="result-card__title">
                <span className="result-card__dot"></span>
                Common (A ∩ B)
              </div>
              <div className="result-card__actions">
                <span className="result-card__count">{result.common.length}</span>
                {result.common.length > 0 && (
                  <button
                    className="download-btn"
                    onClick={() => downloadAsTxt(result.common, 'common')}
                    title="Download as TXT"
                  >
                    &#8595;
                  </button>
                )}
              </div>
            </div>
            <div className="result-card__content">
              {result.common.length > 0 ? (
                <div className="char-grid">
                  {result.common.map((item, index) => (
                    <span key={`common-${index}`} className="char-item">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="result-card__empty">No common values</div>
              )}
            </div>
          </div>

          <div className="result-card result-card--b">
            <div className="result-card__header">
              <div className="result-card__title">
                <span className="result-card__dot"></span>
                Only in B
              </div>
              <div className="result-card__actions">
                <span className="result-card__count">{result.onlyB.length}</span>
                {result.onlyB.length > 0 && (
                  <button
                    className="download-btn"
                    onClick={() => downloadAsTxt(result.onlyB, 'only-in-B')}
                    title="Download as TXT"
                  >
                    &#8595;
                  </button>
                )}
              </div>
            </div>
            <div className="result-card__content">
              {result.onlyB.length > 0 ? (
                <div className="char-grid">
                  {result.onlyB.map((item, index) => (
                    <span key={`b-${index}`} className="char-item">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="result-card__empty">No unique values in B</div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>
          Built with React + Vite | Powered by{' '}
          <a
            href="https://sheetjs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SheetJS
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
