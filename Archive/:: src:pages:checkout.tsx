// src/pages/checkout.tsx

export default function CheckoutPage() {
  return (
    <section id="contact" className="w-full h-screen flex flex-col md:flex-row">
      {/* ✅ Right Side - Buy Now Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#0B0016] text-white p-10 h-full">
        <h2 className="text-3xl font-semibold text-[#AD72F9] mb-6 text-center">Buy Now</h2>
        {/* Your Buy Now content, buttons, or embed Stripe checkout links here */}
      </div>

      {/* ✅ Left Side - Add more content if needed */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 text-black p-10 h-full">
        {/* Placeholder for extra info or images */}
        <p>Thank you for supporting Tailor Made Analytics!</p>
      </div>
    </section>
  );
}