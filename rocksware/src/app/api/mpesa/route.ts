import { NextRequest, NextResponse } from "next/server";

const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  const data = await res.json();
  return data.access_token;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, orderId } = await req.json();

    // Format phone — ensure it starts with 254
    const formattedPhone = phone.startsWith("0")
      ? `254${phone.slice(1)}`
      : phone.startsWith("+")
      ? phone.slice(1)
      : phone;

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const body = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `ROCKS-${orderId}`,
      TransactionDesc: "Rocksware shoe purchase",
    };

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === "0") {
      return NextResponse.json({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        message: "STK push sent. Please check your phone.",
      });
    } else {
      return NextResponse.json(
        { success: false, message: stkData.errorMessage || "M-Pesa request failed" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("M-Pesa error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}