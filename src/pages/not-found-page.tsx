import "./not-found-page.css";

export default function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <h1>Page Not Found</h1>
      <p>
        The page you're looking for doesn't exist, either it was deleted or it
        never existed.
      </p>
      <a className="button" href="/">
        Back to Home
      </a>
    </div>
  );
}
