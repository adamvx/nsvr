import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEventListener, ScreenRect } from 'react-native'


export function useKeyboard() {
  const [shown, setShown] = useState(false)

  const handleKeyboardDidShow: KeyboardEventListener = (e) => {
    setShown(true)
  }

  const handleKeyboardDidHide: KeyboardEventListener = (e) => {
    setShown(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDidHide)
    }
  }, [])

  return shown
}