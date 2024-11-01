import Modal from '@/Components/Modal'
import { RoleForm } from './RoleForm'
import { PermissionForm } from './PermissionForm'

export const ModalRols = ({ modal, closeModal, title, showPermissions, operation = 1 }) => {
  return (
    <Modal show={modal} onClose={closeModal}>
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-600 text-center'>{title}</h2>
        {operation !== 4
          ? (
            <RoleForm closeModal={closeModal} showPermissions={showPermissions} operation={operation} />
            )
          : (
            <PermissionForm />
            )}

      </div>
    </Modal>
  )
}
