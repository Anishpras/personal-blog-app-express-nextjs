"use client";

export default function ErrorFallback() {
  return (
    <div role="alert">
      <p>Something went wrong!</p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
}
