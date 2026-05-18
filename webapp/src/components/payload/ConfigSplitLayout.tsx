import React, { useState } from 'react'

export interface SidebarTab {
  id: string
  label: string
  content: React.ReactNode
}

interface ConfigSplitLayoutProps {
  previewContent: React.ReactNode
  sidebarContent?: React.ReactNode
  sidebarTabs?: SidebarTab[]
  sidebarFooter?: React.ReactNode
  onTabChange?: (tabId: string) => void
}

export const ConfigSplitLayout: React.FC<ConfigSplitLayoutProps> = ({
  previewContent,
  sidebarContent,
  sidebarTabs,
  sidebarFooter,
  onTabChange,
}) => {
  const [activeTabId, setActiveTabId] = useState(sidebarTabs?.[0]?.id || '')

  const handleTabClick = (id: string) => {
    setActiveTabId(id)
    if (onTabChange) onTabChange(id)
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 120px)',
        display: 'flex',
        gap: '24px',
        boxSizing: 'border-box',
        marginTop: '24px',
      }}
    >
      {/* Variable width content area (Preview) */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: 'var(--theme-elevation-100)',
          borderRadius: '12px',
          border: '1px solid var(--theme-elevation-200)',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {previewContent}
      </div>

      {/* Fixed width sidebar (Controls) */}
      {(sidebarTabs?.length || sidebarContent || sidebarFooter) && (
      <div
        style={{
          width: '380px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {sidebarTabs && sidebarTabs.length > 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div 
              className="split-layout-tabs"
              style={{ 
                display: 'flex', 
                gap: '24px', 
                marginBottom: '24px', 
                flexShrink: 0,
                borderBottom: '1px solid var(--theme-elevation-200)',
                overflowX: 'auto',
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .split-layout-tabs::-webkit-scrollbar {
                  display: none;
                }
                .split-layout-tabs {
                  scrollbar-width: none;
                }
              `}} />
              {sidebarTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTabId === tab.id ? '2px solid var(--theme-text)' : '2px solid transparent',
                    color: activeTabId === tab.id ? 'var(--theme-text)' : 'var(--theme-elevation-500)',
                    padding: '8px 2px',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeTabId === tab.id ? 600 : 500,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px 8px 4px 4px' }}>
              {sidebarTabs.map(t => (
                <div key={t.id} style={{ display: t.id === activeTabId ? 'flex' : 'none', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  {t.content}
                </div>
              ))}
            </div>
            {sidebarFooter && (
              <div style={{ flexShrink: 0, marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--theme-elevation-200)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sidebarFooter}
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {sidebarContent}
            </div>
            {sidebarFooter && (
              <div style={{ flexShrink: 0, marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--theme-elevation-200)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sidebarFooter}
              </div>
            )}
          </>
        )}
      </div>
      )}
    </div>
  )
}
