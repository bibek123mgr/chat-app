import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest, responseRequest } from '../../../store/requestSlice';

const RequestList = () => {
    const dispatch = useDispatch();
    const { data: requests } = useSelector((store) => store.request);

    useEffect(() => {
        dispatch(getRequest());
    }, [dispatch]);


    const handleChangeRequestStatus = (status, id) => {
        const data = {
            requestId: id,
            status: status
        }
        dispatch(responseRequest(data))
    }
    return (
        <div className='w-96 fixed bg-white left-1/2 transform -translate-x-1/2 p-4 mt-11 shadow-md rounded-lg h-auto'>
            <h1 className='font-bold'>Request List</h1>
            <div className='mt-4 overflow-y-auto max-h-[calc(100vh-30vh)] no-scrollbar'>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md border-b-2" key={request._id}>
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img src={request?.sender?.imageurl} alt="User Avatar" className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-1 sm:block hidden">
                                <h2 className="text-lg font-semibold">{request?.sender?.name}</h2>
                            </div>
                            <div className='flex gap-4'>
                                <button className='text-red-600' onClick={() => handleChangeRequestStatus('rejected', request._id)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                <button className='text-blue-700' onClick={() => handleChangeRequestStatus('accepted', request._id)}>
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No requests available.</p>
                )}
            </div>
        </div>

    );
};

export default RequestList;
