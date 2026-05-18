'use client'

import { DefaultCellComponentProps } from 'payload'
import { getContrastColor } from './utils'

const Cell = ({ cellData }: DefaultCellComponentProps) => {
  const contrastColor = getContrastColor(cellData)

  const handleClick = () => {
    navigator.clipboard.writeText(cellData)
    alert(`Copied color: ${cellData}`)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '20px',
        width: '100%',
        borderRadius: '2px',
        backgroundColor: cellData,
        color: contrastColor,
        cursor: 'pointer',
      }}
    >
      {cellData}
    </div>
  )
}

export default Cell
