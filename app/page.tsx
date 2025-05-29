export default function HomePage() {
  return (
    <div
      className={
        "w-full h-screen flex flex-col gap-2 items-center justify-center p-4"
      }
    >
      <h1 className={"text-4xl font-bold text-center"}>
        연세대학교 컴퓨터과학과 홈런포차
      </h1>
      <p>테이블 QR 코드를 스캔해 주문해주세요.</p>
    </div>
  );
}
