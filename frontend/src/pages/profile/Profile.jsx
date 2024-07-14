import React from 'react'

const Profile = ({ user }) => {
    return (
        <section class="relative pt-36 pb-24">
            {/* <img src="https://pagedone.io/asset/uploads/1705471739.png" alt="cover-image" class="w-full absolute top-0 left-0 z-0 h-60" /> */}
            <div class="w-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col justify-center items-center">
                <div class="flex items-center justify-center relative z-10 mb-2.5 h-40 w-40">
                    <img src={user.imageurl} alt="user-avatar-image" class="border-4 border-solid border-white rounded-full" />
                </div>
                <h3 class="text-center font-manrope font-bold text-3xl leading-10 text-gray-900">{user.name}</h3>
                <p class="text-gray-500 text-center">{user.email}</p>
                <p className='flex gap-3'>
                    <span>friends: {user.friends}</span>
                    <span>groups: {user.groups}</span>
                </p>
                <p class="text-center mb-6">A social media influencers and singer. A social media influencers and singer</p>
            </div>
            <div className='flex gap-4 justify-center'>
                <button className='rounded-md bg-blue-500 p-3 text-gray-200'>Edit <i className="fa-solid fa-user-pen text-white ml-2"></i></button>
                <button className='rounded-md bg-blue-500 p-3 text-gray-200'>Password <i class="fa-solid fa-user-pen text-white ml-2"></i></button>
                <button className='rounded-md bg-blue-500 p-3 text-gray-200'>Delete Profile <i class="fa-solid fa-trash  text-white ml-2"></i></button>

            </div>
        </section>

    )
}

export default Profile
