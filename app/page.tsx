export default function HomePage() {
  return (
    <div
      className={
        "w-full h-screen flex flex-col gap-2 items-center justify-center"
      }
    >
      <h1 className={"text-4xl font-bold"}>오더링</h1>
      <p>테이블 QR 코드를 스캔해 주문해주세요.</p>
    </div>
  );
}
