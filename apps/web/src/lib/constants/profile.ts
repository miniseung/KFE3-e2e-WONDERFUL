import { AuctionListItem } from '@/lib/types/auction-prisma';

interface MenuItem {
  title: string;
  route: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}
export const PROFILE_PAGE_SIZE = 6;

export interface ProfilePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ProfileAuctionResponse {
  data: AuctionListItem[];
  pagination: ProfilePagination;
}

export const qnaList = [
  {
    question: '리빙옥션은 어떤 서비스인가요?',
    answer:
      '리빙옥션은 우리 동네에서 쉽고 안전하게 경매 거래를 할 수 있는 플랫폼입니다. 누구나 간편하게 경매를 등록하거나 입찰에 참여할 수 있고, 직거래와 즉시구매 기능으로 빠르고 안심할 수 있는 거래 경험을 제공합니다.',
  },
  {
    question: '등록할 수 없는 상품이 있나요?',
    answer:
      '네, 현행법 위반 물품(주류, 담배, 의약품 등), 가품/불법복제물, 반려동물, 위생·안전 우려 식품/의료기기, 음란·선정성 물품 등은 등록하실 수 없습니다. 자세한 금지 품목은 운영 정책을 참고하세요.',
  },
  {
    question: '거래 분쟁이 발생하면 어떻게 하나요?',
    answer:
      '입찰/구매 내역, 채팅 내용 등 서비스 내 기록을 기반으로 운영팀이 중립적으로 분쟁을 조정합니다. 신고 접수 후 사실 관계 확인을 통해 단계별 조치가 이루어집니다.',
  },
  {
    question: '내 계좌나 주소 정보는 어떻게 관리되나요?',
    answer:
      '본인 인증 후, 본인 명의의 계좌와 원하는 거래 주소를 최대 3개까지 등록하고 관리할 수 있습니다. 타인 명의 계좌나 허위 주소 등록 시 서비스 이용이 제한될 수 있습니다.',
  },
  {
    question: '경매 등록/수정/삭제는 어떻게 하나요?',
    answer:
      '경매 등록은 상품 정보, 사진, 시작가, 즉시구매가, 거래 위치를 입력하면 됩니다. 경매 시작 전에는 자유롭게 수정/삭제가 가능하고, 입찰 시작 후에는 제한될 수 있습니다.',
  },
  {
    question: '신고/제재는 어떤 기준으로 이뤄지나요?',
    answer:
      '운영 정책에 따라 부정행위, 불법상품 등록, 비매너 행위 등 발견 시 일시 정지 또는 영구 정지 등 제재가 적용됩니다. 신고가 접수되면 운영팀이 빠르게 확인 후, 필요한 조치를 합니다.',
  },
  {
    question: '정책이 변경될 수도 있나요?',
    answer:
      '네, 서비스 상황에 따라 정책이 변경될 수 있으며, 변경 시 서비스 내 공지사항 또는 이메일로 안내됩니다.',
  },
];

export const menuSections: MenuSection[] = [
  {
    id: 'setting',
    title: '설정',
    items: [
      { title: '내 동네 설정', route: '/profile/location' },
      { title: '거래 주소 관리', route: '/address' },
      { title: '거래 계좌 관리', route: '/account' },
    ],
  },
  {
    id: 'support',
    title: '고객 지원',
    items: [
      { title: '공지사항', route: '/profile/support' },
      {
        title: '문의하기',
        route:
          'https://docs.google.com/forms/d/e/1FAIpQLScMWkhRBarGwD0Tu7hedNc8XIRYvdJ0BYyNqKBBRyf31XIAtg/viewform?usp=header',
      },
    ],
  },
];
