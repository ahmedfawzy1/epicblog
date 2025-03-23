"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface reviewProps {
  userId: number;
  userName: string;
  productId: number;
  allReview: {
    id: number;
    userId: number;
    productId: number;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
    User: {
      username: string | null;
      name?: string;
    };
  }[];
}

export default function Review({ userId, userName, productId, allReview }: reviewProps) {
  const defaultReview = {
    star: 0,
    comment: "",
    productId: productId,
    userId: userId,
  };

  const [review, setReview] = useState(defaultReview);
  const [hasReview, setHasReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Fetch user review
  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/review?userId=${userId}&productId=${productId}`);
        setHasPurchased(response.data.hasPurchased);
        if (response.data.review) {
          setHasReview(true);
          setReview(response.data.review);
        } else {
          setHasReview(false);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };
    fetchReview();
  }, [userId, productId]);

  //   const onChange = (value: number) => {
  //     setReview((prevState) => ({ ...prevState, star: value }));
  //   };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReview((prevState) => ({ ...prevState, [name]: value }));
  };

  //   const postComment = async () => {
  //     try {
  //       const response = await axios.post("/api/review", review);
  //       setReview(defaultReview);
  //       setHasReview(true);
  //       setShowReviewForm(false);
  //     } catch (error) {
  //       console.error("Error posting review:", error);
  //     }
  //   };

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-7">
      <hr className="bg-black/10 mb-8" />
      <h3 className="text-3xl md:text-[40px] font-semibold font-integralCF text-center">What Users Say</h3>
      <div className="flex justify-between items-center mt-7 md:mt-0">
        <div className="flex items-center gap-1">
          <p className="text-lg font-bold">All Reviews</p>
          <span className="text-sm text-black/60 mt-1">({allReview.length})</span>
        </div>
        <div>
          <button
            onClick={() => setShowReviewForm(true)}
            disabled={hasReview || !userId || !hasPurchased}
            className={`px-4 py-2 text-sm font-light bg-black text-white rounded-full transition duration-300 ${
              hasReview || !userId || !hasPurchased ? "opacity-80 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
            title={
              !hasPurchased
                ? "You must purchase the product to review it"
                : hasReview
                ? "You have already reviewed this product"
                : "You must be logged in to review"
            }
          >
            Write a Review
          </button>
        </div>
      </div>

      <div className="w-full mt-5 flex flex-col md:flex-row justify-between gap-3 overflow-x-auto scrollbar-hide">
        {showReviewForm && (
          <div className="w-[360px] md:w-1/2 px-5 md:px-7 py-6 md:py-6 border border-black/10 rounded-2xl">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button onClick={() => setShowReviewForm(false)}>{/* <X size={18} color="#000000" /> */}</button>
                {/* <button onClick={postComment} disabled={review.star === 0 || !userId} className={review.star === 0 ? "cursor-not-allowed" : ""}>
                  <Check size={18} color="#000000" />
                </button> */}
              </div>
            </div>

            <div className="flex gap-1 pt-3 pb-1.5">
              <p className="text-lg font-bold">{userName}.</p>
            </div>
            <input
              className="border border-black/20 rounded-lg w-full outline-none px-2 mb-2.5"
              type="text"
              name="comment"
              onChange={handleChange}
              value={review.comment}
            />
            <span className="block text-[15px] text-black/60">posted on {formattedDate}</span>
          </div>
        )}

        {allReview?.length > 0 &&
          allReview?.map((review, index) => (
            <div key={index} className="w-[360px] md:w-1/2 px-5 md:px-7 py-6 md:py-6 border border-black/10 rounded-2xl">
              <div className="flex gap-1 pt-3 pb-1.5">
                <p className="text-lg font-bold">{review.User.username || review.User.name}.</p>
                <img src={"/images/icons/badgecheck.svg"} alt="badgecheck" width={24} height={28} />
              </div>
              <span className="text-black/60 font-normal mb-1.5">"{review.comment}"</span>
              <span className="block text-[15px] text-black/60">
                posted on{" "}
                {review.updatedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
