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

function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (username.trim().length < 2) {
      setError('아이디는 2자 이상이어야 합니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    setError('');

    const { data, error } = await signUp(username.trim(), password);

    if (error) {
      setError('회원가입에 실패했습니다. 이미 사용 중인 아이디일 수 있습니다.');
      setLoading(false);
      return;
    }

    // 이메일 인증이 비활성화된 경우 바로 로그인됨
    if (data?.user?.identities?.length === 0) {
      setError('이미 사용 중인 아이디입니다.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => navigate('/'), 1500);
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
            <Typography variant='h5' fontWeight={700}>회원가입</Typography>
            <Typography variant='body2' color='text.secondary'>
              함께 동물 이야기를 나눠요!
            </Typography>
          </Box>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity='success' sx={{ mb: 2 }}>가입 완료! 환영합니다 🎉</Alert>}

          {/* 아이디 */}
          <TextField
            fullWidth
            label='아이디'
            placeholder='사용할 아이디를 입력하세요'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            helperText='2자 이상 영문/숫자 권장'
          />

          {/* 비밀번호 */}
          <TextField
            fullWidth
            label='비밀번호'
            type='password'
            placeholder='비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
            sx={{ mb: 3 }}
            helperText='6자 이상'
          />

          {/* 회원가입 버튼 */}
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={handleSignup}
            disabled={loading || success}
            sx={{ mb: 1.5 }}
          >
            회원가입
          </Button>

          {/* 로그인 버튼 */}
          <Button
            fullWidth
            variant='outlined'
            size='large'
            onClick={() => navigate('/login')}
            sx={{ mb: 1.5 }}
          >
            로그인
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

export default SignupPage;
