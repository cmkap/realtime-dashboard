import { useContext } from 'react'
import { DataContext } from '../context/DataContext'
import { DataContextType } from '@realtime/shared'

export const useData = (): DataContextType => {
  return useContext(DataContext)
}
