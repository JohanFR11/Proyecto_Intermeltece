import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
const UserHappyBirthday = React.lazy(() => import('../Components/userHappyBirthday'));


const Cumpleanos = ({ auth, unreadNotifications}) => {

    return (
        <AuthenticatedLayout
              auth={auth}
              unreadNotifications={unreadNotifications}
              header={
                <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
                  Happy Birthday
                </h2>
              }
            >
            <div className="my-5 bg-white overflow-hidden shadow-lg sm:rounded-lg p-8 flex items-center flex-col text-center">
              <img className="w-full h-60 rounded-lg shadow-lg shadow-gray-300" src ="https://t4.ftcdn.net/jpg/05/00/69/25/360_F_500692587_7l5w7tOKjUGIv1rLEnpWdmYiRpksmjzW.jpg"/>
              <h2 className="mt-7 text-3xl md:text-4xl font-bold text-center text-gray-800 bg-gradient-to-r from-[#395181] via-[#446099] to-[#5072b6] text-transparent bg-clip-text drop-shadow-lg">Cumpleaños Meltec S.A </h2>
                <UserHappyBirthday/>
            </div>
        </AuthenticatedLayout>
    )
}

export default Cumpleanos;