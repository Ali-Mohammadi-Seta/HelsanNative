import { Outlet } from 'react-router';

const EmptyLayout = () => {
  return <div className='custom-div flex flex-col w-full min-h-[100vh] bg-[#f4f4fa]'>{<Outlet />}</div>;
};

export default EmptyLayout;
