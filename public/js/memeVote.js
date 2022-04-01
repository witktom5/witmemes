const voteForms = document.querySelectorAll('.form-vote');

const patchUpvotes = async (e) => {
  e.preventDefault();
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
    const res = await fetch(`/meme/${e.target.dataset.id}`, options);
    const data = await res.json();
    const upvoteCounter = document.querySelector(
      `#upvoteCounter-${e.target.dataset.id}`
    );
    const downvoteCounter = document.querySelector(
      `#downvoteCounter-${e.target.dataset.id}`
    );
    const previousDownvotes = parseInt(downvoteCounter.textContent);
    const previousUpvotes = parseInt(upvoteCounter.textContent);

    upvoteCounter.textContent = data.totalUpvotes;
    downvoteCounter.textContent = data.totalDownvotes;

    const upvoteBtn = document.querySelector(
      `#btn-upvote-${e.target.dataset.id}`
    );
    const downvoteBtn = document.querySelector(
      `#btn-downvote-${e.target.dataset.id}`
    );

    if (previousUpvotes != upvoteCounter.textContent) {
      upvoteBtn.classList.toggle('btn-success');
      upvoteBtn.classList.toggle('btn-secondary');
    }

    if (previousDownvotes != downvoteCounter.textContent) {
      downvoteBtn.classList.toggle('btn-danger');
      downvoteBtn.classList.toggle('btn-secondary');
    }
  } catch (err) {
    console.dir(err);
  }
};

for (let form of voteForms) {
  form.addEventListener('submit', patchUpvotes);
}
