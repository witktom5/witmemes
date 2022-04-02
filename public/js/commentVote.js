const commentVoteForms = document.querySelectorAll('.comment-form-vote');
let isCommentVotePending = false;

const patchCommentUpvotes = async (e) => {
  e.preventDefault();
  if (!isCommentVotePending) {
    const options = {
      method: 'PATCH',
      body: JSON.stringify({
        vote: e.target.dataset.vote,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    };
    try {
      isCommentVotePending = true;
      const res = await fetch(
        `/meme/${e.target.dataset.memeid}/comments/${e.target.dataset.id}`,
        options
      );
      const data = await res.json();
      const upvoteCounter = document.querySelector(
        `#commentUpvoteCounter-${e.target.dataset.id}`
      );
      const downvoteCounter = document.querySelector(
        `#commentDownvoteCounter-${e.target.dataset.id}`
      );
      const commentPreviousDownvotes = parseInt(downvoteCounter.textContent);
      const commentPreviousUpvotes = parseInt(upvoteCounter.textContent);

      upvoteCounter.textContent = data.totalUpvotes;
      downvoteCounter.textContent = data.totalDownvotes;

      const upvoteBtn = document.querySelector(
        `#btn-comment-upvote-${e.target.dataset.id}`
      );
      const downvoteBtn = document.querySelector(
        `#btn-comment-downvote-${e.target.dataset.id}`
      );

      if (commentPreviousUpvotes != upvoteCounter.textContent) {
        upvoteBtn.classList.toggle('btn-success');
        upvoteBtn.classList.toggle('btn-secondary');
      }

      if (commentPreviousDownvotes != downvoteCounter.textContent) {
        downvoteBtn.classList.toggle('btn-danger');
        downvoteBtn.classList.toggle('btn-secondary');
      }
    } catch (err) {
      console.dir(err);
    }
    isCommentVotePending = false;
  }
};

for (let form of commentVoteForms) {
  form.addEventListener('submit', patchCommentUpvotes);
}
