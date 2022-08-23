import { ReactNode, useEffect, useState } from 'react'

interface Props {
  registerEffect: <T>() => [() => Promise<T>, (arg0: T) => void]
  children: ReactNode
}

export default function WhileAwaiting(props: Props) {
  const [awaiting, setAwaiting] = useState<boolean>(true)
  const [effect, callback] = props.registerEffect()

  useEffect(() => {
    effect().then((v) => {
      callback(v)
      setAwaiting(false)
    })
  }, [])

  return awaiting && props.children
}
