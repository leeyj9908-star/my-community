import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/use-auth';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signIn(username.trim(), password);
    if (error) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
      return;
    }
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth='xs'>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          {/* 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant='h4' sx={{ mb: 1 }}>🐾</Typography>
            <Typography variant='h5' fontWeight={700}>로그인</Typography>
            <Typography variant='body2' color='text.secondary'>
              귀여운 동물 콘테스트에 오신 걸 환영해요!
            </Typography>
          </Box>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          {/* 아이디 */}
          <TextField
            fullWidth
            label='아이디'
            placeholder='아이디를 입력하세요'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            sx={{ mb: 2 }}
          />

          {/* 비밀번호 */}
          <TextField
            fullWidth
            label='비밀번호'
            type='password'
            placeholder='비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            sx={{ mb: 3 }}
          />

          {/* 로그인 버튼 */}
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={handleLogin}
            disabled={loading}
            sx={{ mb: 1.5 }}
          >
            로그인
          </Button>

          {/* 회원가입 버튼 */}
          <Button
            fullWidth
            variant='outlined'
            size='large'
            onClick={() => navigate('/signup')}
            sx={{ mb: 1.5 }}
          >
            회원가입
          </Button>

          {/* 뒤로가기 */}
          <Button
            fullWidth
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            color='inherit'
          >
            뒤로가기
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
