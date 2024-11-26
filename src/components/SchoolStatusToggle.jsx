"use client";
import { Switch } from '@headlessui/react';
import { useState } from 'react';
import api from './axios';
import { toast } from 'react-toastify';
const SchoolStatusToggle = ({ initialStatus, schoolId }) => {
  const [isActive, setIsActive] = useState(initialStatus);

  const handleStatusChange = async (checked) => {
    try {
      setIsActive(checked);
      console.log(checked, "Status");
      console.log('Updating school status:', {
        schoolId,
        isActive: checked ? 'true' : 'false'
      });
      const response = await api.patch(`/school/${schoolId}/status`, {
        isActive: checked ? 'true' : 'false'
      });
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error updating school status:', error);
      setIsActive(!checked);
    }
  };

  return (
    <Switch
      checked={isActive}
      onChange={handleStatusChange}
      className={`${
        isActive ? 'bg-green-500' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
    >
      <span className="sr-only">
        {isActive ? 'Deactivate school' : 'Activate school'}
      </span>
      <span
        className={`${
          isActive ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
};

export default SchoolStatusToggle;