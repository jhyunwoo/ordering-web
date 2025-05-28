import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const depositData = await fetch(
    "https://wts-api.tossinvest.com/api/v3/my-assets/transactions/markets/kr?size=50&filters=0&range.from=2024-11-01&range.to=2025-05-29",
    {
      headers: {
        cookie:
          "x-toss-distribution-id=66; deviceId=WTS-dafcbc38b3314b18bceb181b27d30e29; _browserId=01fb9ff97230461db4d09de06215f55f; BTK=+mA7zkjwr7qYbM6rrUBJlRnaKyFwK1GUm4tjnu8Piuk=; browserSessionId=6b4a98b14fa04fb193969f8200b040fe; XSRF-TOKEN=8af0bf26-7263-4185-91d1-d7e1985de20c; UTK=62e54NOunAl9uFo4gyKfZ/cjUtkDAhohmlXqCCq/MAfppeuWaAvQGTFbFEFOch2TZDTLM2w7DPV+JPIvRUUVlGBEbAIhtNBKDpqvOOzfZvE52Ee2WfgC7Uxl8YYhpRwslNlRnEUadHEZlGzMh88vMQM5DEepaku7/tdF1TmrV/BYSfcHjhhGpjrRZbpr6QYP; SESSION=MjE4YzRiMjYtN2ZlOC00ZGM5LWFiMGItZGRlOWEwYjMxNGQ4; FTK=wuTktu24SaG+u8I1oFwIne0n6Ry8s4MExl1bhaTndRcMv2a2sMQNgXEwA8uGjiA72+5AdW305+jneeaAvzMkUjtCDZL6edWEk7HH01BPJQnwEzo/jngqhf8sb3xCO/PJG3ZZ6C48RjF/ZTkXZJ75sKg/k8RDZJ3xHi09V++sr8CfKE21r7GKpzopqKgajuz/p9jLmWS3Go5a0LBgT1+i1TsojW+ON7cbbVFNo26cU0toDMowZcWJsBQwRd5vkRok93laO9+PIcFJsBGOzjCU1w==",
      },
    },
  );
  if (!depositData.ok) {
    return new Response("Failed to fetch deposit data", { status: 500 });
  }
  const data = await depositData.json();
  return NextResponse.json(JSON.stringify(data));
}
