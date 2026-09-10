export default function RatingStars({
  rating = 0,
  size = "text-xl",
}) {
  return (
    <div className={`flex ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}