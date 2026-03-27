import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../utils/supabase-client';
import { useAuth } from '../hooks/use-auth';
import Navbar from '../components/common/navbar';
import PostCard from '../components/community/post-card';

const POSTS_PER_PAGE = 10;

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from('posts')
      .select('*, comments(count), likes(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error) {
      setPosts(data ?? []);
      setTotalCount(count ?? 0);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const handleWrite = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/posts/create');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
        <Container maxWidth='md'>
          {/* 게시판 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant='h5' fontWeight={700}>
                🐶 동물 자랑 게시판
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                우리 귀여운 반려동물을 자랑해요!
              </Typography>
            </Box>
            <Button
              variant='contained'
              startIcon={<EditIcon />}
              onClick={handleWrite}
            >
              글쓰기
            </Button>
          </Box>

          {/* 게시물 목록 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color='primary' />
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
              <Typography variant='h6'>아직 게시물이 없어요 🐾</Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>첫 번째 게시물을 작성해보세요!</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </Stack>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, value) => { setPage(value); window.scrollTo(0, 0); }}
                color='primary'
                shape='rounded'
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

export default HomePage;
