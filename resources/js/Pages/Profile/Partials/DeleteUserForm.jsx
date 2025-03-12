import { useRef, useState } from 'react'
import DangerButton from '@/Components/DangerButton'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import SecondaryButton from '@/Components/SecondaryButton'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'

export default function DeleteUserForm ({ className = '' }) {
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className='text-lg font-medium text-gray-900'>Delete Account</h2>

        <p className='mt-1 text-sm text-gray-600'>
          Once your account is deleted, all of its resources and data will be permanently deleted. Before
          deleting your account, please download any data or information that you wish to retain.
        </p>
      </header>
    </section>
  )
}
