import React from 'react'

export default function Duration ({ className, seconds }: {className?: any, seconds: any}) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  )
}

function format (seconds: number) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad((date.getUTCSeconds() as any))
  if (hh) {
    return `${hh}:${pad((mm as any))}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad (string: string) {
  return ('0' + string).slice(-2)
}