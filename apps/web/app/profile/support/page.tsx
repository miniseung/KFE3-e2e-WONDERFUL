import { Container } from '@/components/layout';

import { qnaList } from '@/constants/profile';

const Page = () => {
  return (
    <Container noNav>
      <div className="mx-auto max-w-2xl bg-white px-4 py-4">
        <h1 className="mb-4 px-4 text-2xl font-bold">자주 묻는 질문</h1>
        <div className="flex flex-col gap-3">
          {qnaList.map(({ question, answer }, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="mb-1 font-semibold text-indigo-700">{question}</div>
              <div className="text-sm text-gray-800">{answer}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-xs text-gray-400">
          추가 문의사항은{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScMWkhRBarGwD0Tu7hedNc8XIRYvdJ0BYyNqKBBRyf31XIAtg/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 underline"
          >
            고객센터
          </a>
          로 문의해주세요.
        </div>
      </div>
    </Container>
  );
};

export default Page;
