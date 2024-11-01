import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Textarea } from '@nextui-org/react'

export const CommentForm = () => {
  const [comments, setComments] = useLocalStorage('comments', '')

  const handleCommentsTextarea = (e) => {
    const comment = e.target.value
    setComments(comment)
  }

  return (
    <Textarea placeholder='Comentarios...' label='Comentarios' labelPlacement='outside' onChange={handleCommentsTextarea} />
  )
}
