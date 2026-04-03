import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * PageHeader 컴포넌트
 *
 * Props:
 * @param {string} title - 페이지 제목 [Required]
 * @param {boolean} hasBack - 뒤로가기 버튼 표시 여부 [Optional, 기본값: true]
 * @param {ReactNode} rightAction - 우측 액션 버튼 [Optional]
 *
 * Example usage:
 * <PageHeader title="숙소 상세" />
 */
function PageHeader({ title, hasBack = true, rightAction }) {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FDFFFB',
        color: '#013D49',
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        {hasBack && (
          <IconButton
            edge="start"
            onClick={() => navigate(-1)}
            sx={{ color: '#013D49', mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography
          variant="h3"
          sx={{
            flexGrow: 1,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        {rightAction}
      </Toolbar>
    </AppBar>
  );
}

export default PageHeader;
