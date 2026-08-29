import { Navigate, useParams } from 'react-router-dom';

export const LegacyClinicalRedirect = () => {
  const { id } = useParams();
  return <Navigate to={id ? `/prontuario/${id}` : '/'} replace />;
};
