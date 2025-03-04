import AuthorizedRoute from '@/components/AuthorizedRoute'
import React from 'react'

export default function Advances() {
  return (
    <AuthorizedRoute>
      <div>Página de avances</div>
    </AuthorizedRoute>
  )
}
