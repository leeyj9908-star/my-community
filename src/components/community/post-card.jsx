import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * PostCard 컴포넌트
 * 게시물 목록에서 각 게시물을 표시하는 카드
 *
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {number} post.id
 * @param {string} post.title
 * @param {string} post.content
 * @param {string} post.author_name
 * @param {string} post.created_at
 * @param {Array}  post.comments - [{ count: N }]
 * @param {Array}  post.likes    - [{ count: N }]
 */
function PostCard({ post }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const commentCount = post.comments?.[0]?.count ?? 0;
  const likeCount = post.likes?.[0]?.count ?? 0;
  const preview = post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content;

  return (
    <Card
      elevation={1}
      sx={{
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
        transition: 'all 0.2s',
      }}
    >
      <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* 제목 */}
          <Typography variant='h6' fontWeight={600} gutterBottom>
            {post.title}
          </Typography>

          {/* 내용 미리보기 */}
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {preview}
          </Typography>

          {/* 메타데이터 */}
          <Stack direction='row' spacing={2} sx={{ color: 'text.secondary' }}>
            <Box sx={{ fontSize: '0.8rem' }}>✍️ {post.author_name}</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
              {commentCount}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <FavoriteBorderIcon sx={{ fontSize: 14 }} />
              {likeCount}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem', ml: 'auto !important' }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              {formatDate(post.created_at)}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
