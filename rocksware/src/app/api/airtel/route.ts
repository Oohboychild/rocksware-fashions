import { NextRequest, NextResponse } from "next/server";

const getAirtelToken = async (): Promise<string> => {
  const res = await fetch(
    "https://openapi.airtel.africa/auth/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AIRTEL_CLIENT_ID,
        client_secret: process.env.AIRTEL_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    }
  );
  const data = await res.json();
  return data.access_token;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, orderId } = await req.json();

    const token = await getAirtelToken();

    const res = await fetch(
      "https://openapi.airtel.africa/merchant/v1/payments/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Country": "KE",
          "X-Currency": "KES",
        },
        body: JSON.stringify({
          reference: `ROCKS-${orderId}`,
          subscriber: {
            country: "KE",
            currency: "KES",
            msisdn: phone,
          },
          transaction: {
            amount: Math.ceil(amount),
            country: "KE",
            currency: "KES",
            id: orderId,
          },
        }),
      }
    );

    const data = await res.json();

    if (data.status?.success) {
      return NextResponse.json({
        success: true,
        transactionId: data.data?.transaction?.id,
        message: "Airtel Money request sent. Approve on your phone.",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Airtel Money request failed" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Airtel error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}