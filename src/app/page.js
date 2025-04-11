"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // اطلاعات کاربر
  const [user, setUser] = useState(null);

  // فرم‌ها
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // دریافت محصولات از بک‌اند
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://sazkala.liara.run/api");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
      }
    };
    fetchProducts();
  }, []);

  // افزودن محصول به سبد انتخابی
  const handleProductClick = (product) => {
    setSelectedProducts((prev) => [...prev, product]);
    setTotalPrice((prev) => prev + product.price);
  };

  // نمایش فرم ورود/ثبت‌نام
  const handleCheckout = () => {
    setShowAuthForm(true);
  };

  // **توابع ورود و ثبت‌نام**

  // پس از ورود موفقیت‌آمیز، مستقیماً کاربر را به درگاه پرداخت هدایت می‌کنیم
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://sazkala.liara.run/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // بستن فرم
        setShowAuthForm(false);
        // بلافاصله فراخوانی فرآیند پرداخت:
        handlePay(data.user);
      } else {
        alert("کاربر یافت نشد");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ورود کاربر");
    }
  };

  // ثبت‌نام کاربر
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://sazkala.liara.run/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          address,
          postalCode,
          phoneNumber,
        }),
      });

      if (res.ok) {
        alert("ثبت‌نام با موفقیت انجام شد");
        setShowAuthForm(false);
        const data = await res.json();
        // در صورت تمایل اینجا می‌توانید کاربر را همزمان لاگین کنید
        // یا از او بخواهید مجدد لاگین کند
      } else {
        alert(" نام کاربری تکراری است یا فرم به طور کامل پر نشده است ");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت‌نام کاربر");
    }
  };

  // **تابع پرداخت** (دریافت لینک پرداخت و ری‌دایرکت کاربر)
  const handlePay = async (loginUser) => {
    // کاربر فعلی (اگر از handleLogin فراخوانی شد)
    const activeUser = loginUser || user;

    if (!activeUser) {
      alert("ابتدا باید وارد شوید یا ثبت‌نام کنید");
      return;
    }

    // ساخت آرایه محصولات انتخاب‌شده
    const items = selectedProducts.map((p) => ({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: 1,
    }));

    // درخواست به سرور برای دریافت لینک پرداخت
    try {
      const res = await fetch(
        "https://sazkala.liara.run/api/payment/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: activeUser._id,
            items,
            totalPrice,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        // هدایت کاربر به صفحه پرداخت
        window.location.href = data.paymentLink;
      } else {
        alert("خطا در ایجاد درخواست پرداخت");
      }
    } catch (error) {
      console.error(error);
      alert("مشکلی در اتصال به سرور رخ داد");
    }
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right", padding: "20px" }}>
      <h1>فروشگاه آنلاین</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              borderRadius: "5px",
            }}
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "auto", borderRadius: "5px" }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>قیمت: {product.price} تومان</p>
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>مجموع خرید: {totalPrice} تومان</h3>
          <button onClick={handleCheckout}>اتمام خرید</button>
        </div>
      )}

      {showAuthForm && (
        <div style={{ marginTop: "20px" }}>
          <h2>ورود یا ثبت‌نام</h2>

          {/* فرم ورود */}
          <form onSubmit={handleLogin} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">ورود</button>
          </form>

          <hr />

          {/* فرم ثبت‌نام */}
          <h2>ثبت‌نام</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="کد پستی"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="شماره تماس"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button type="submit">ثبت‌نام</button>
          </form>
        </div>
      )}
    </div>
  );
}
