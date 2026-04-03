import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';

/**
 * TermsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <TermsPage />
 */
function TermsPage() {
  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="이용약관" />

      <Box
        sx={{
          px: 3,
          py: 3,
          overflowY: 'auto',
        }}
      >
        {/* 서비스 이용약관 */}
        <Typography
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#013D49',
            mb: 2,
          }}
        >
          서비스 이용약관
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제1조 (목적)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          본 약관은 공간대여(이하 &quot;회사&quot;)가 제공하는 숙소 예약 서비스(이하 &quot;서비스&quot;)의
          이용 조건 및 절차, 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제2조 (정의)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          1. &quot;서비스&quot;란 회사가 제공하는 숙소 검색, 예약, 결제 및 관련 부가 서비스를 의미합니다.
          2. &quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
          3. &quot;호스트&quot;란 서비스를 통해 숙소를 등록하고 제공하는 자를 의미합니다.
          4. &quot;게스트&quot;란 서비스를 통해 숙소를 예약하고 이용하는 자를 의미합니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제3조 (약관의 효력)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
          회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및
          개정사유를 명시하여 현행 약관과 함께 서비스 내 공지합니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제4조 (서비스의 제공)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          회사는 다음과 같은 서비스를 제공합니다: 숙소 검색 및 정보 제공, 숙소 예약 중개,
          호스트와 게스트 간 채팅 서비스, 예약 관리 서비스, 기타 회사가 정하는 서비스.
          서비스는 연중무휴 24시간 제공함을 원칙으로 하며, 시스템 점검 등의 사유로 일시 중단될 수 있습니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제5조 (이용자의 의무)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          이용자는 서비스 이용 시 관계 법령, 본 약관의 규정, 이용 안내 및 주의사항 등을 준수하여야 하며,
          기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다. 이용자는 타인의 개인정보를 도용하거나
          허위 정보를 등록해서는 안 됩니다.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* 개인정보 처리방침 */}
        <Typography
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#013D49',
            mb: 2,
          }}
        >
          개인정보 처리방침
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제1조 (수집하는 개인정보)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다: 이메일 주소, 닉네임,
          프로필 이미지, 서비스 이용 기록, 접속 로그. 수집된 개인정보는 서비스 제공 및 개선,
          고객 문의 대응 목적으로만 사용됩니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제2조 (개인정보의 보유 및 이용 기간)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          이용자의 개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다.
          단, 관계 법령에 의해 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보존합니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#013D49',
            mb: 1,
          }}
        >
          제3조 (개인정보의 제3자 제공)
        </Typography>
        <Typography
          sx={{
            fontSize: '0.83rem',
            color: '#666',
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의해
          요구되는 경우 또는 서비스 제공을 위해 필수적인 경우에 한하여 최소한의 정보만을 제공할 수 있습니다.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: '#bbb',
            textAlign: 'center',
            pb: 2,
          }}
        >
          최종 업데이트: 2026년 4월 1일
        </Typography>
      </Box>
    </MobileLayout>
  );
}

export default TermsPage;
