import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app.store';
import { logoutApi } from '../services/auth.api';

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutState = useAppStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      logoutState();
      navigate('/signin', { replace: true });
    }
  };

  return handleLogout;
};
