import Link from "next/link";

// Implementing comments from this: https://www.material-tailwind.com/docs/html/card

function Comment({ comment }) {
  return (
    <div className="flex w-full p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 my-6">
      <div className="flex items-center gap-4 text-slate-800">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between">
            <h5 className="text-xl font-semibold text-slate-800">
              {comment.user.firstName} {comment.user.lastName}
            </h5>
          </div>
          <p className="text-xs uppercase font-bold text-slate-500 mt-0.5">
            {comment.user.email}
          </p>
          <br />
          <p className="text-xs uppercase font-bold text-slate-500 mt-0.5">
            <Link href={`/users/${comment.user.firebaseUID}`}>
              View Profile
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-base text-slate-600 font-light leading-normal">
          "{comment.comment}"
        </p>
      </div>
    </div>
  );
}

export default Comment;
