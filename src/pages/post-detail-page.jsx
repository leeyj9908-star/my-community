import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { supabase } from '../utils/supabase-client';
import { useAuth } from '../hooks/use-auth';
import Navbar from '../components/common/navbar';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, username } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (user) checkIfLiked();
  }, [user, id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, likes(count)')
      .eq('id', id)
      .single();

    if (error) {
      setError('게시물을 불러올 수 없습니다.');
      setLoading(false);
      return;
    }
    setPost(data);
    setLikesCount(data.likes?.[0]?.count ?? 0);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
  };

  const checkIfLiked = async () => {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsLiked(!!data);
  };

  const toggleLike = async () => {
    if (!user) { navigate('/login'); return; }
    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      await supabase.from('likes').insert({ post_id: parseInt(id), user_id: user.id });
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      post_id: parseInt(id),
      user_id: user.id,
      author_name: username,
      content: newComment.trim(),
    });
    if (!error) {
      setNewComment('');
      fetchComments();
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress color='primary' />
      </Box>
    </>
  );

  if (error || !post) return (
    <>
      <Navbar />
      <Container maxWidth='md' sx={{ mt: 4 }}>
        <Alert severity='error'>{error || '게시물을 찾을 수 없습니다.'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>목록으로</Button>
      </Container>
    </>
  );

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth='md'>
          {/* 제목 + 목록으로 버튼 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Typography variant='h5' fontWeight={700} sx={{ flex: 1 }}>
              {post.title}
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              variant='outlined'
              size='small'
              sx={{ flexShrink: 0 }}
            >
              목록으로
            </Button>
          </Box>

          {/* 메타데이터 */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 0.5, sm: 2 }}
            sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 3 }}
          >
            <Box>✍️ {post.author_name}</Box>
            <Box>🕐 {formatDate(post.created_at)}</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
              댓글 {comments.length}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              좋아요 {likesCount}
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* 본문 */}
          <Typography variant='body1' sx={{ lineHeight: 2, whiteSpace: 'pre-wrap', mb: 5 }}>
            {post.content}
          </Typography>

          {/* 좋아요 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Button
              variant={isLiked ? 'contained' : 'outlined'}
              color='primary'
              startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleLike}
              sx={{ px: 5, py: 1.5, borderRadius: 10, fontSize: '1rem' }}
            >
              좋아요 {likesCount}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 댓글 영역 */}
          <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
            💬 댓글 {comments.length}개
          </Typography>

          {/* 댓글 목록 */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {comments.length === 0 ? (
              <Typography color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
                아직 댓글이 없어요. 첫 댓글을 남겨보세요! 🐾
              </Typography>
            ) : (
              comments.map(comment => (
                <Paper key={comment.id} elevation={0} sx={{ p: 2, bgcolor: '#FFFDE7', border: '1px solid #FFE082' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography fontWeight={600} variant='body2'>
                      🐾 {comment.author_name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatDate(comment.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant='body2'>{comment.content}</Typography>
                </Paper>
              ))
            )}
          </Stack>

          {/* 댓글 입력 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size='small'
              placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 남길 수 있어요'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
            />
            <Button
              variant='contained'
              onClick={submitComment}
              disabled={!user || submitting}
              sx={{ minWidth: 80 }}
            >
              등록
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default PostDetailPage;
