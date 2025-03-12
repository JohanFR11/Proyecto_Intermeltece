// Layout
import Header from '@/Components/Header'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import SapLoader from '@/Components/SapLoader'

export default function Products ({ auth, unreadNotifications }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const asyncData = async () => {
      setLoading(true)
      setError(null)
      setData([])

      try {
        const url = 'https://my345513.sapbydesign.com/sap/byd/odata/cust/v1/vmumaterial/MaterialCollection?$format=json&$select=ObjectID,InternalID,Description,CreationDateTime,LastChangeDateTime,Text&$expand=Text&$top=12000'
        const request = await axios(url, {
          auth: {
            username: 'MSRODRIGUEZ',
            password: '*0caUt1J4ufkzE*'
          }
        })

        setLoading(false)
        setError(null)
        setData(request.data.d.results)

        if (request.status !== 200) {
          throw new Error('Error al obtener los datos: ')
        }
      } catch (error) {
        setError(error)
      }
    }

    asyncData()
  }, [])

  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={<Header title='Productos desde SAP' />}
    >

      <Head title='Productos desde SAP' />

      <section className='py-12'>
        <div className='max-w-8xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>

            {loading && <SapLoader />}

            {error && <Error message={error} />}

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 m-5 gap-5'>
              {data &&
              data.map(({ ObjectID, InternalID, Text: [{ Text }] }) => (

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

          </div>
        </div>
      </section>

    </AuthenticatedLayout>
  )
}
