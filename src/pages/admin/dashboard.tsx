import dynamic from 'next/dynamic';

const AdminDashboard = () => {
  const DashboardNoSSR = dynamic(
    () => import('../../components/Admin/PagesNoSSR/Dashboard'),
    {
      ssr: false,
    }
  );

  return <DashboardNoSSR />;
};
export default AdminDashboard;
