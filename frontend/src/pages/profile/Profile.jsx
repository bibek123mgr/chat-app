import React, { useState } from 'react';
import DeleteMe from '../../global/components/dialogbox/DeleteMe';
import UpdatePassword from '../../global/components/dialogbox/UpdatePassword';
import EditProfile from '../../global/components/dialogbox/EditProfile';

const Profile = ({ user }) => {
    const [deleteP, setDeleteP] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updateProfile, setUpdateProfile] = useState(false);


    const handleTogglerDelete = () => {
        setDeleteP(!deleteP);
    };

    const handleToggleUpdatePassword = () => {
        setUpdate(!update);


    };

    const handleTogglerUpdate = () => {
        setUpdateProfile(!updateProfile);
    };


    return (
        <>
            <section className="relative pt-36 pb-24 z-auto">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center relative z-10 mb-2.5 h-40 w-40">
                        <img src={user.imageurl} alt="user-avatar" className="border-4 border-solid border-white rounded-full" />
                    </div>
                    <h3 className="text-center font-manrope font-bold text-3xl leading-10 text-gray-900">{user.name}</h3>
                    <p className="text-gray-500 text-center">{user.email}</p>
                    <p className="flex gap-3">
                        <span>Friends: {user.friends}</span>
                        <span>Groups: {user.groups}</span>
                    </p>
                    <p className="text-center mb-6">A social media influencer and singer.</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button className="rounded-md bg-blue-500 p-3 text-gray-200" onClick={handleTogglerUpdate}>Edit <i className="fa-solid fa-user-pen text-white ml-2"></i></button>
                    <button className="rounded-md bg-blue-500 p-3 text-gray-200" onClick={handleToggleUpdatePassword}>Password <i className="fa-solid fa-user-pen text-white ml-2"></i></button>
                    <button className="rounded-md bg-blue-500 p-3 text-gray-200" onClick={handleTogglerDelete}>Delete Profile <i className="fa-solid fa-trash text-white ml-2"></i></button>
                </div>
            </section>
            {update && <UpdatePassword togglepp={handleToggleUpdatePassword} />}
            {deleteP && <DeleteMe toggle={handleTogglerDelete} />}
            {updateProfile && <EditProfile togglepp={handleTogglerUpdate} />}

        </>
    );
};

export default Profile;
