import db from "@/db";
import { userRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import CopyButton from "@/app/[tableId]/[userRequestId]/copy-button";

export default async function UserRequestPage({
  params,
}: {
  params: Promise<{ tableId: string; userRequestId: string }>;
}) {
  const { tableId, userRequestId } = await params;

  const userRequestData = await db.query.userRequests.findFirst({
    where: eq(userRequests.id, Number(userRequestId)),
  });

  return (
    <div className={"w-full h-screen flex flex-col gap-2 p-4"}>
      <div className={"text-2xl font-bold"}>결제하기</div>
      <div className={"bg-white p-8 rounded-xl text-lg my-24 shadow-2xl"}>
        <div className={"flex items-center gap-4"}>
          <div>계좌번호: 12101060137</div>
          <CopyButton data={"12101060137"}>계좌번호 복사</CopyButton>
        </div>
        <div className={"flex items-center gap-4"}>
          <div>금액: {userRequestData?.amount}</div>
          <CopyButton data={String(userRequestData?.amount)}>
            금액 복사
          </CopyButton>
        </div>
        <div className={"flex items-center gap-4"}>
          <div>은행: 토스증권</div>
        </div>
        <div className={"flex items-center gap-4"}>
          <div>예금주: 전현우</div>
        </div>
      </div>

      <div
        className={
          "bottom-0 fixed left-0 w-full p-4 bg-white shadow-lg flex gap-2"
        }
      >
        <Link
          className={
            "p-4 rounded-full bg-neutral-500 text-white w-full text-center font-semibold text-lg"
          }
          href={`/${tableId}`}
        >
          테이블로 돌아가기
        </Link>
        <Link
          className={
            "p-4 rounded-full bg-blue-500 text-white w-full text-center font-semibold text-lg"
          }
          href={`supertoss://send?amount=${userRequestData?.amount}&bank=${encodeURIComponent("토스증권")}&accountNo=12101060137&origin=qr`}
        >
          토스로 입금하기
        </Link>
      </div>
    </div>
  );
}
