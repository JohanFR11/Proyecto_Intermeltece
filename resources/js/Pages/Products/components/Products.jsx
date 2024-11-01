import SapLoader from '@/Components/SapLoader'
import { Card, CardHeader, CardBody } from '@nextui-org/react'

export default function ProductsSap ({ products, loading }) {
  if (loading) {
    return <SapLoader />
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 m-5 gap-5'>
      {products &&
              products.map(({ ObjectID, InternalID, Text: [{ Text }] }) => (

                <Card className='py-4' key={ObjectID}>
                  <CardHeader className='"pb-0 pt-2 px-4 flex-col items-start'>
                    <p>{Text}</p>
                    <small>{InternalID}</small>
                  </CardHeader>
                  <CardBody className='overflow-visible py-2'>
                    <p>Otro texto</p>
                  </CardBody>
                </Card>

              ))}
    </div>
  )
}
