import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../hooks/use-auth';

/**
 * Navbar 컴포넌트
 * 상단 네비게이션 바: 로고(좌측) + 프로필/로그인 영역(우측)
 */
function Navbar() {
  const navigate = useNavigate();
  const { user, username, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar position='sticky' color='primary' elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 좌측 로고 */}
        <Typography
          variant='h6'
          fontWeight={700}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/')}
        >
          🐾 귀여운 동물 콘테스트
        </Typography>

        {/* 우측 프로필 영역 */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon />
            <Typography variant='body2' fontWeight={500}>
              {username} 님 환영합니다
            </Typography>
            <Button
              color='inherit'
              size='small'
              variant='outlined'
              onClick={handleSignOut}
              sx={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', ml: 1 }}
            >
              로그아웃
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color='inherit'
              variant='outlined'
              size='small'
              onClick={() => navigate('/login')}
              sx={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }}
            >
              로그인
            </Button>
            <Button
              color='inherit'
              variant='contained'
              size='small'
              onClick={() => navigate('/signup')}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
