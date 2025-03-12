import { useState } from 'react'

export function useLocalStorage (key, initialValue) {
  const [storeValue, setStoreValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
    }
  })

  const setValue = (value) => {
    try {
      setStoreValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storeValue, setValue]
}
