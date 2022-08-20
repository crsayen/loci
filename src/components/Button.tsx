import React from 'react'

const Button = (props: { onClick: () => void; text: string }) => {
  return (
    <div
      className="cursor-pointer hover:bg-neutral-900 m-2 py-1 px-3 rounded-lg border-neutral-700 border text-white"
      onClick={props.onClick}
    >
      {props.text}
    </div>
  )
}

export default Button
