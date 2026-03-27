import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../utils/supabase-client';
import { useAuth } from '../hooks/use-auth';
import Navbar from '../components/common/navbar';

function PostCreatePage() {
  const navigate = useNavigate();
  const { user, username, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError('');

    const { data, error } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user.id,
      author_name: username,
    }).select().single();

    if (error) {
      setError('게시물 등록에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }
    navigate(`/posts/${data.id}`);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth='md'>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
            <Typography variant='h5' fontWeight={700} sx={{ mb: 4 }}>
              ✏️ 게시물 작성
            </Typography>

            {/* 제목 */}
            <TextField
              fullWidth
              label='제목'
              placeholder='제목을 입력해주세요'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* 본문 */}
            <TextField
              fullWidth
              label='내용'
              placeholder='내용을 입력해주세요'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={12}
              sx={{ mb: 3 }}
            />

            {error && (
              <Typography color='error' variant='body2' sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* 버튼 영역 */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                variant='outlined'
              >
                뒤로가기
              </Button>
              <Button
                variant='contained'
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                등록
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default PostCreatePage;
