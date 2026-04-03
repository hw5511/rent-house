import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * SpaceCard 컴포넌트
 *
 * Props:
 * @param {object} space - 숙소 데이터 객체 [Required]
 * @param {boolean} isFavorite - 찜 여부 [Optional, 기본값: false]
 * @param {function} onToggleFavorite - 찜 토글 핸들러 [Optional]
 * @param {function} onClick - 카드 클릭 핸들러 [Optional]
 *
 * Example usage:
 * <SpaceCard space={spaceData} isFavorite={true} onClick={handleClick} />
 */
function SpaceCard({ space, isFavorite = false, onToggleFavorite, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:active': { transform: 'scale(0.98)' },
        transition: 'transform 0.1s',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={space.image || 'https://placehold.co/400x220/EDAAC6/013D49?text=Space'}
          alt={space.title}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(space.id);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
          }}
        >
          {isFavorite
            ? <FavoriteIcon sx={{ color: '#A25987' }} />
            : <FavoriteBorderIcon sx={{ color: '#666' }} />}
        </IconButton>
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: '#EDAAC6',
            color: '#013D49',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {space.space_type}
        </Box>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5, color: '#013D49' }}
        >
          {space.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#999' }} />
          <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
            {space.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#013D49' }}>
            ₩{space.price_per_night?.toLocaleString()}
            <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 400, color: '#999' }}>
              /박
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <StarIcon sx={{ fontSize: 16, color: '#FFB800' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {space.rating_avg}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
              ({space.review_count})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SpaceCard;
