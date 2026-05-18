'use client'

import React, { useState } from 'react'
import { useField, useTranslation } from '@payloadcms/ui'
import Editor, { DefaultEditorOptions } from 'react-simple-wysiwyg'

type Props = {
  path: string
  label?: string | Record<string, string>
  required?: boolean
  field?: any
}

export const RichHTMLEditor: React.FC<Props> = ({ path, label, required, field }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const { i18n } = useTranslation()
  const [mode, setMode] = useState<'editor' | 'code'>('editor')

  const translatedLabel = field?.label && typeof field.label === 'object'
    ? (field.label[i18n.language] || field.label['en'] || field.label['es'])
    : label || field?.label

  return (
    <div className="field-type custom-rich-editor" style={{ marginBottom: '1.5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-rich-editor .rsw-editor {
          background: var(--theme-bg) !important;
          color: var(--theme-elevation-800) !important;
          border: none !important;
          border-radius: 4px;
        }
        .custom-rich-editor .rsw-toolbar {
          background: var(--theme-elevation-50) !important;
          border-bottom: 1px solid var(--theme-elevation-150) !important;
          color: var(--theme-elevation-800) !important;
          border-radius: 4px 4px 0 0;
          padding: 8px !important;
        }
        .custom-rich-editor .rsw-btn {
          color: var(--theme-elevation-800) !important;
        }
        .custom-rich-editor .rsw-btn:hover {
          background: var(--theme-elevation-150) !important;
        }
        .custom-rich-editor .rsw-btn[data-active="true"] {
          background: var(--theme-elevation-200) !important;
        }
        .custom-rich-editor .rsw-dd {
          background: var(--theme-elevation-50) !important;
          color: var(--theme-elevation-800) !important;
          border: 1px solid var(--theme-elevation-150) !important;
        }
        .custom-rich-editor .rsw-dd ul {
          background: var(--theme-elevation-100) !important;
          border: 1px solid var(--theme-elevation-150) !important;
        }
        .custom-rich-editor .rsw-dd li:hover {
          background: var(--theme-elevation-200) !important;
        }
      `}} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <label className="field-label" style={{ margin: 0, display: 'block' }}>
          {translatedLabel as React.ReactNode}
          {required && <span className="required">*</span>}
        </label>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('editor')}
            style={{
              padding: '4px 8px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer',
              background: mode === 'editor' ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-100)',
              color: mode === 'editor' ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-600)',
              border: 'none', fontWeight: 500, transition: 'all 0.2s'
            }}
          >
            {i18n.language === 'es' ? 'Editor Visual' : 'Visual Editor'}
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            style={{
              padding: '4px 8px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer',
              background: mode === 'code' ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-100)',
              color: mode === 'code' ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-600)',
              border: 'none', fontWeight: 500, transition: 'all 0.2s'
            }}
          >
            {i18n.language === 'es' ? 'Código HTML' : 'HTML Code'}
          </button>
        </div>
      </div>

      <div style={{ 
        border: showError ? '1px solid var(--theme-error-400)' : '1px solid var(--theme-elevation-150)', 
        borderRadius: '4px',
        overflow: 'hidden',
        background: 'var(--theme-bg)'
      }}>
        {mode === 'editor' ? (
          <Editor
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            containerProps={{ 
              style: { 
                minHeight: '250px', 
                border: 'none', 
                resize: 'vertical', 
                padding: '0',
                color: 'inherit',
                background: 'transparent',
                fontFamily: 'inherit'
              } 
            }}
          />
        ) : (
          <textarea
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: '100%',
              minHeight: '250px',
              padding: '16px',
              border: 'none',
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: '14px',
              background: 'var(--theme-bg)',
              color: 'var(--theme-elevation-800)',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
        )}
      </div>

      {showError && errorMessage && (
        <div style={{ color: 'var(--theme-error-400)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>
          {errorMessage}
        </div>
      )}
      
      {field?.admin?.description && (
        <div style={{ fontSize: '13px', color: 'var(--theme-elevation-400)', marginTop: '8px' }}>
          {typeof field.admin.description === 'object' ? field.admin.description[i18n.language] : field.admin.description}
        </div>
      )}
    </div>
  )
}

export default RichHTMLEditor
