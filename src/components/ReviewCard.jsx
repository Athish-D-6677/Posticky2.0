export default function ReviewCard({ review }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {review.userName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{review.userName}</p>
          <p className="text-xs text-gray-400">
            {review.createdAt?.toDate?.()?.toLocaleDateString() || ''}
          </p>
        </div>
        <div className="ml-auto text-yellow-400 text-sm">
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}
