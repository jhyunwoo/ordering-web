export default function orderStatusConverter(
  status: "WAITING" | "PENDING" | "COMPLETE" | null,
) {
  if (status == "COMPLETE") {
    return "처리 완료";
  } else if (status == "WAITING") {
    return "입금 대기";
  } else if (status == "PENDING") {
    return "입금 완료";
  } else {
    return "오류!!!";
  }
}
