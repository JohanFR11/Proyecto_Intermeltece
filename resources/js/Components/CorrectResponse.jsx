export default function CorrectResponse ({ message, children, ...props }) {
  return (
    <div {...props}>
      <h2>{message}</h2>
      {children}
    </div>
  )
}
