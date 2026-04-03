import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';

const FAQ_DATA = [
  {
    question: '예약은 어떻게 하나요?',
    answer: '원하시는 숙소를 선택하고 날짜와 인원을 지정한 후 예약하기 버튼을 눌러주세요.',
  },
  {
    question: '예약 취소는 가능한가요?',
    answer: '예정된 예약은 체크인 24시간 전까지 무료 취소가 가능합니다.',
  },
  {
    question: '결제는 어떻게 하나요?',
    answer: '현재 앱 내 결제 기능은 준비 중입니다. 호스트와 직접 연락하여 결제해주세요.',
  },
  {
    question: '호스트에게 어떻게 연락하나요?',
    answer: '숙소 예약 후 채팅 기능을 통해 호스트와 대화할 수 있습니다.',
  },
  {
    question: '문제가 발생했어요',
    answer: '고객센터 이메일 support@renthouse.com으로 문의해주세요.',
  },
];

/**
 * FaqPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <FaqPage />
 */
function FaqPage() {
  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="고객센터" />

      <Box sx={{ px: 2, py: 3 }}>
        <Typography
          sx={{
            fontSize: '0.85rem',
            color: '#999',
            mb: 2,
            px: 1,
          }}
        >
          자주 묻는 질문
        </Typography>

        {FAQ_DATA.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            sx={{
              border: 'none',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 },
              bgcolor: 'transparent',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#A25987' }} />}
              sx={{
                px: 1,
                '& .MuiAccordionSummary-content': { my: 1.5 },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#013D49',
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 1, pt: 0, pb: 2 }}>
              <Typography
                sx={{
                  fontSize: '0.88rem',
                  color: '#666',
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </MobileLayout>
  );
}

export default FaqPage;
