import { Router } from "express";

const router = Router();

// POST: Process simulated Worldpay payment
router.post("/process", async (req, res) => {
  try {
    const {
      cardHolderName,
      cardNumber,
      expiry,
      cvv,
      amount,
      currency = "GBP",
      simulationMode = "SUCCESS",
      threeDSecureOTP
    } = req.body;

    if (!cardHolderName || !cardNumber || !expiry || !cvv || !amount) {
      return res.status(400).json({
        error: "Missing required payment parameters for tokenization/authorization.",
        details: { cardHolderName: !!cardHolderName, cardNumber: !!cardNumber, expiry: !!expiry, cvv: !!cvv, amount: !!amount }
      });
    }

    // Simulate Network/Processing latency (e.g., 800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Support GATEWAY_ERROR simulation
    if (simulationMode === "GATEWAY_ERROR") {
      return res.status(504).json({
        error: "Gateway Connection Timeout",
        message: "Failed to establish a secure link with Worldpay acquirer (mock timeout error).",
        statusCode: 504
      });
    }

    // Support DECLINED simulation
    if (simulationMode === "DECLINED") {
      return res.status(402).json({
        paymentStatus: "DECLINED",
        error: "Card Declined",
        message: "The card issuer declined the transaction (e.g. Insufficient funds or card restriction).",
        declineCode: "51", // Insufficient funds
        transactionId: `wp-tx-${Math.floor(Math.random() * 9000000 + 1000000)}`
      });
    }

    // Support 3DS_REQUIRED simulation (unless already verified with standard OTP)
    if (simulationMode === "3DS_REQUIRED" && !threeDSecureOTP) {
      return res.json({
        paymentStatus: "3DS_REQUIRED",
        message: "Cardholder authentication required (3D Secure).",
        transactionId: `wp-tx-3ds-${Math.floor(Math.random() * 9000000 + 1000000)}`,
        acsUrl: "https://sandbox.worldpay.com/3ds/acs",
        paRequest: "eJxVUstuwjAQvPsrke8...",
        amount,
        currency
      });
    }

    // Handle completed 3DS verification
    if (threeDSecureOTP && threeDSecureOTP !== "1234") {
      return res.status(401).json({
        paymentStatus: "FAILED",
        error: "3DS Authentication Failed",
        message: "The one-time passcode entered was invalid or expired."
      });
    }

    // Default: SUCCESS
    const txId = `wp-tx-${Math.floor(Math.random() * 9000000 + 1000000)}`;
    const authCode = `WPY${Math.floor(Math.random() * 900000 + 100000)}`;
    const riskScore = Math.floor(Math.random() * 15); // standard fraud checks

    // Determine card brand from card number
    let cardBrand = "Visa";
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (cleanNum.startsWith("5")) cardBrand = "Mastercard";
    else if (cleanNum.startsWith("3")) cardBrand = "American Express";
    else if (cleanNum.startsWith("6")) cardBrand = "Maestro/Discover";

    res.json({
      paymentStatus: "AUTHORISED",
      transactionId: txId,
      authCode,
      amount: parseFloat(amount),
      currency,
      cardBrand,
      riskScore,
      environment: "Sandbox/Test",
      settlementDate: new Date(Date.now() + 86400000).toLocaleDateString(),
      merchantCode: "POUCHSUPPLY_GBP_TEST",
      message: "Payment authorized successfully by Worldpay."
    });

  } catch (err: any) {
    console.error("[Worldpay Sim Route] Error:", err);
    res.status(500).json({ error: err.message || "Failed to process payment in gateway" });
  }
});

export default router;
