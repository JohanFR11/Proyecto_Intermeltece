/* eslint-disable no-undef */
import { ViewIcon } from '@/Components/icons/Icons'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import axios from 'axios'
import { useState } from 'react'

export default function ModalEdit ({ roleEdit }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [permissions, setPermissions] = useState([])

  const handleRoleClick = async (id) => {
    setPermissions([])
    const request = await axios(route('admin.rols.getPermissions', id))
    if (request.status !== 200) {
      setPermissions([])
    }
    setPermissions(request.data)
  }

  return (
    <>
      <Button type='button' className='bg-gray-100 text-slate-600 font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white' onPress={onOpen} onClick={() => handleRoleClick(roleEdit.id)}>
        <ViewIcon className='h-4 w-4' />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader className='flex flex-col gap-1'>{roleEdit.name}</ModalHeader>
            <ModalBody>
              <ul
                className='list-disc list-inside px-5'
              >
                {
                    permissions.length !== 0
                      ? (permissions.map((permission) => (
                        <li className='p-1' key={permission.permission_id}>{permission.supername}</li>
                        )))
                      : ''
                  }
              </ul>
            </ModalBody>
            <ModalFooter />

          </>
        </ModalContent>
      </Modal>
    </>
  )
}
