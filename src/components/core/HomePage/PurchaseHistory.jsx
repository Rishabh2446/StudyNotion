import React, { useEffect, useState } from "react";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  async function fetchPurchaseHistory() {
    const response = await fetch(
      "http://localhost:4000/api/v1/profile/purchase-history",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    console.log(result);

    // Ensure purchases is always an array
    const purchasesArray = result?.purchases || [];

    const uniqueCourses = [
      ...new Map(
        purchasesArray.map((course) => [course?._id?.toString(), course])
      ).values(),
    ];

    setPurchases(uniqueCourses);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Purchase History</h1>

      {purchases.length === 0 ? (
        <p>No courses purchased yet.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {purchases.map((course) => (
            <div
              key={course._id}
              style={{
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "12px",
                border: "1px solid #333",
                background: "#111",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0 }}>{course.courseName}</h2>
                <span
                  style={{
                    background: "#1dbf73",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  PAID
                </span>
              </div>

              <p style={{ opacity: 0.7, margin: "5px 0" }}>
                {course.courseDescription.substring(0, 80)}...
              </p>

              <hr style={{ borderColor: "#222", margin: "10px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                <div>
                  <strong>Price:</strong> ₹{course.price}
                </div>
                <div>
                  <strong>Order ID:</strong> {course._id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
