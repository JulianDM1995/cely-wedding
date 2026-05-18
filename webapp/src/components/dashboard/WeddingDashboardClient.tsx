'use client'

import React, { useState } from 'react'
import { Gutter } from '@payloadcms/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type TimeFrame = 'todos' | 'diario' | 'mensual' | 'anual'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const WeddingDashboardClient: React.FC<{ guests: any[] }> = ({ guests }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('todos')

  // Filter data based on timeframe
  const now = new Date()
  let filteredGuests = guests

  if (timeframe !== 'todos') {
    const cutoffDate = new Date()
    if (timeframe === 'diario') cutoffDate.setDate(now.getDate() - 1)
    if (timeframe === 'mensual') cutoffDate.setMonth(now.getMonth() - 1)
    if (timeframe === 'anual') cutoffDate.setFullYear(now.getFullYear() - 1)

    filteredGuests = guests.filter(g => new Date(g.createdAt) >= cutoffDate)
  }

  // 1. KPI Stats
  const totalInvitations = filteredGuests.length
  const totalGuestsCount = filteredGuests.reduce((sum, g) => sum + (g.guestsCount || 1), 0)
  
  const confirmedInvitations = filteredGuests.filter(g => g.status === 'confirmed')
  const totalConfirmedGuestsCount = confirmedInvitations.reduce((sum, g) => sum + (g.guestsCount || 1), 0)

  // 2. Chart Data: Status Overview (Invitations)
  const statusCounts = {
    not_sent: 0,
    sent: 0,
    confirmed: 0,
    declined: 0
  }
  
  filteredGuests.forEach(g => {
    const status = g.status || 'not_sent'
    if (status in statusCounts) {
      statusCounts[status as keyof typeof statusCounts] += 1
    }
  })

  const statusChartData = [
    { name: 'No Enviado', value: statusCounts.not_sent },
    { name: 'Enviado', value: statusCounts.sent },
    { name: 'Confirmado', value: statusCounts.confirmed },
    { name: 'Declinado', value: statusCounts.declined }
  ]

  // 3. Chart Data: Confirmed vs Declined (Pie)
  const confirmedVsDeclinedData = [
    { name: 'Confirmado', value: statusCounts.confirmed },
    { name: 'Declinado', value: statusCounts.declined },
    { name: 'Pendiente', value: statusCounts.not_sent + statusCounts.sent }
  ].filter(item => item.value > 0)

  // 4. Chart Data: Guests Count Grouping
  const guestsCountGroups: Record<string, number> = {
    '1 Persona': 0,
    '2 Personas': 0,
    '3 Personas': 0,
    '4+ Personas': 0
  }

  filteredGuests.forEach(g => {
    const count = g.guestsCount || 1
    if (count === 1) guestsCountGroups['1 Persona'] += 1
    else if (count === 2) guestsCountGroups['2 Personas'] += 1
    else if (count === 3) guestsCountGroups['3 Personas'] += 1
    else guestsCountGroups['4+ Personas'] += 1
  })

  const groupChartData = Object.keys(guestsCountGroups).map(key => ({
    name: key,
    Cantidad: guestsCountGroups[key]
  }))

  return (
    <Gutter>
      <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Vista General de Invitados</h2>
          
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid var(--theme-elevation-200)',
                backgroundColor: 'var(--theme-elevation-50)',
                color: 'var(--theme-elevation-800)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500
              }}
            >
              <option value="todos">Todos los Tiempos</option>
              <option value="diario">Últimas 24h</option>
              <option value="mensual">Último Mes</option>
              <option value="anual">Último Año</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--theme-elevation-50)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--theme-elevation-500)' }}>Total Invitaciones</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{totalInvitations}</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--theme-elevation-50)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--theme-elevation-500)' }}>Total Personas (Cupos)</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{totalGuestsCount}</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#e6f4ea', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#137333' }}>Asistentes Confirmados</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#137333' }}>{totalConfirmedGuestsCount}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* Chart 1: Status Overview */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--theme-elevation-50)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Estado de Invitaciones</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-elevation-150)" />
                <XAxis dataKey="name" stroke="var(--theme-elevation-500)" />
                <YAxis stroke="var(--theme-elevation-500)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--theme-elevation-100)', border: 'none', borderRadius: '4px', color: 'var(--theme-elevation-800)' }}
                  itemStyle={{ color: 'var(--theme-elevation-800)' }}
                />
                <Legend />
                <Bar dataKey="value" name="Cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Confirmed vs Declined Pie */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--theme-elevation-50)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Confirmados vs Resto</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={confirmedVsDeclinedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {confirmedVsDeclinedData.map((entry, index) => {
                    let fill = COLORS[index % COLORS.length]
                    if (entry.name === 'Confirmado') fill = '#10b981'
                    else if (entry.name === 'Declinado') fill = '#ef4444'
                    else fill = '#f59e0b'
                    return <Cell key={`cell-${index}`} fill={fill} />
                  })}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--theme-elevation-100)', border: 'none', borderRadius: '4px', color: 'var(--theme-elevation-800)' }}
                  itemStyle={{ color: 'var(--theme-elevation-800)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Guest Groups Breakdown */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--theme-elevation-50)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Distribución de Grupos</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={groupChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-elevation-150)" />
                <XAxis type="number" stroke="var(--theme-elevation-500)" />
                <YAxis dataKey="name" type="category" stroke="var(--theme-elevation-500)" width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--theme-elevation-100)', border: 'none', borderRadius: '4px', color: 'var(--theme-elevation-800)' }}
                  itemStyle={{ color: 'var(--theme-elevation-800)' }}
                />
                <Legend />
                <Bar dataKey="Cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </Gutter>
  )
}
